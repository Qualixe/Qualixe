'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Hero scene: a "commerce network" globe.
 * - Fibonacci-distributed data points form the sphere
 * - Arcs connect points across the globe, with pulses travelling along them (orders / API calls)
 * - Glass "tech chips" (</>, Liquid, API, $, cart…) orbit the globe
 */

const ATMOS_VERT = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const ATMOS_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uPower;
uniform float uIntensity;
varying vec3 vNormal;
varying vec3 vView;
void main(){
  float f = pow(1.0 - abs(dot(vNormal, vView)), uPower);
  gl_FragColor = vec4(uColor, f * uIntensity);
}`;

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.3, 'rgba(255,255,255,0.85)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Rounded glass chip with a label, drawn to a canvas for use as a sprite */
function chipTexture(label: string, accent: string) {
  const scale = 4;
  const font = `600 ${15 * scale}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  const c = document.createElement('canvas');
  const g = c.getContext('2d')!;
  g.font = font;
  const textW = g.measureText(label).width;
  const padX = 16 * scale;
  const dot = 10 * scale;
  const w = Math.ceil(textW + padX * 2 + dot + 8 * scale);
  const h = 44 * scale;
  c.width = w;
  c.height = h;
  const r = 14 * scale;

  g.font = font;
  // body
  g.beginPath();
  if (typeof g.roundRect === 'function') {
    g.roundRect(2, 2, w - 4, h - 4, r);
  } else {
    g.rect(2, 2, w - 4, h - 4); // older browsers without roundRect
  }
  g.fillStyle = 'rgba(12, 20, 54, 0.82)';
  g.fill();
  g.lineWidth = 2 * scale * 0.5;
  g.strokeStyle = 'rgba(255,255,255,0.22)';
  g.stroke();
  // accent dot
  g.beginPath();
  g.arc(padX + dot / 2, h / 2, dot / 2, 0, Math.PI * 2);
  g.fillStyle = accent;
  g.shadowColor = accent;
  g.shadowBlur = 12 * scale;
  g.fill();
  g.shadowBlur = 0;
  // label
  g.fillStyle = '#ffffff';
  g.textBaseline = 'middle';
  g.fillText(label, padX + dot + 8 * scale, h / 2 + scale);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { tex, aspect: w / h };
}

function fibonacciSphere(n: number, r: number) {
  const pts: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push(new THREE.Vector3(Math.cos(theta) * rad * r, y * r, Math.sin(theta) * rad * r));
  }
  return pts;
}

export default function HeroScene({ onReady }: { onReady?: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmall = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return; // no WebGL → CSS fallback stays
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 8);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T) => { disposables.push(o); return o; };

    const root = new THREE.Group();      // position / parallax
    const tilt = new THREE.Group();      // axial tilt
    const globe = new THREE.Group();     // spins
    root.add(tilt);
    tilt.add(globe);
    tilt.rotation.z = 0.32;
    tilt.rotation.x = 0.18;
    scene.add(root);

    const R = 1.45;
    const dotTex = track(dotTexture());

    /* Core: dark sphere that hides the back half of the dots */
    const core = new THREE.Mesh(
      track(new THREE.SphereGeometry(R * 0.985, 64, 64)),
      track(new THREE.MeshBasicMaterial({ color: 0x070d2b, transparent: true, opacity: 0.92 }))
    );
    globe.add(core);

    /* Atmosphere glow (outer fresnel shell) */
    const atmos = new THREE.Mesh(
      track(new THREE.SphereGeometry(R * 1.18, 64, 64)),
      track(new THREE.ShaderMaterial({
        vertexShader: ATMOS_VERT,
        fragmentShader: ATMOS_FRAG,
        uniforms: { uColor: { value: new THREE.Color('#4f7bff') }, uPower: { value: 4.2 }, uIntensity: { value: 0.75 } },
        side: THREE.BackSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }))
    );
    tilt.add(atmos);

    /* Inner rim light */
    const rim = new THREE.Mesh(
      track(new THREE.SphereGeometry(R, 64, 64)),
      track(new THREE.ShaderMaterial({
        vertexShader: ATMOS_VERT,
        fragmentShader: ATMOS_FRAG,
        uniforms: { uColor: { value: new THREE.Color('#7dd3fc') }, uPower: { value: 2.6 }, uIntensity: { value: 0.55 } },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }))
    );
    globe.add(rim);

    /* Data-point shell */
    const N = isSmall ? 1100 : 2200;
    const pts = fibonacciSphere(N, R);
    const pPos = new Float32Array(N * 3);
    const pCol = new Float32Array(N * 3);
    const cA = new THREE.Color('#3b6bff');
    const cB = new THREE.Color('#7dd3fc');
    const cC = new THREE.Color('#a78bfa');
    pts.forEach((p, i) => {
      pPos[i * 3] = p.x; pPos[i * 3 + 1] = p.y; pPos[i * 3 + 2] = p.z;
      const t = (p.y / R + 1) / 2;
      const c = cA.clone().lerp(t > 0.5 ? cB : cC, Math.abs(t - 0.5) * 2);
      pCol[i * 3] = c.r; pCol[i * 3 + 1] = c.g; pCol[i * 3 + 2] = c.b;
    });
    const shellGeo = track(new THREE.BufferGeometry());
    shellGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    shellGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
    const shell = new THREE.Points(shellGeo, track(new THREE.PointsMaterial({
      size: isSmall ? 0.045 : 0.035,
      map: dotTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })));
    globe.add(shell);

    /* Latitude rings for a subtle "tech grid" */
    const gridMat = track(new THREE.LineBasicMaterial({ color: 0x5b7cff, transparent: true, opacity: 0.12 }));
    for (let i = -2; i <= 2; i++) {
      const y = (i / 3) * R;
      const rr = Math.sqrt(R * R - y * y) * 1.002;
      const curve = new THREE.EllipseCurve(0, 0, rr, rr, 0, Math.PI * 2, false, 0);
      const g = track(new THREE.BufferGeometry().setFromPoints(curve.getPoints(128).map((p) => new THREE.Vector3(p.x, y, p.y))));
      globe.add(new THREE.Line(g, gridMat));
    }

    /* Arcs + travelling pulses */
    const ARCS = isSmall ? 9 : 16;
    const arcColors = ['#7dd3fc', '#a78bfa', '#34d399', '#60a5fa'];
    const pulses: { curve: THREE.QuadraticBezierCurve3; mesh: THREE.Mesh; speed: number; offset: number }[] = [];
    const pulseGeo = track(new THREE.SphereGeometry(0.03, 12, 12));
    const endGeo = track(new THREE.RingGeometry(0.035, 0.055, 24));
    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    for (let i = 0; i < ARCS; i++) {
      const a = pts[(Math.random() * N) | 0];
      let b = pts[(Math.random() * N) | 0];
      let guard = 0;
      while (a.distanceTo(b) < R * 0.7 && guard++ < 20) b = pts[(Math.random() * N) | 0];
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const lift = R + a.distanceTo(b) * 0.42;
      const ctrl = mid.normalize().multiplyScalar(lift);
      const curve = new THREE.QuadraticBezierCurve3(a.clone(), ctrl, b.clone());
      const color = new THREE.Color(arcColors[i % arcColors.length]);

      const arcGeo = track(new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)));
      const arcMat = track(new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.38, blending: THREE.AdditiveBlending, depthWrite: false }));
      globe.add(new THREE.Line(arcGeo, arcMat));

      const pMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff }));
      const pulse = new THREE.Mesh(pulseGeo, pMat);
      globe.add(pulse);
      pulses.push({ curve, mesh: pulse, speed: rand(0.12, 0.28), offset: Math.random() });

      // endpoint markers
      [a, b].forEach((p) => {
        const ring = new THREE.Mesh(endGeo, track(new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, side: THREE.DoubleSide })));
        ring.position.copy(p).multiplyScalar(1.004);
        ring.lookAt(p.clone().multiplyScalar(2));
        globe.add(ring);
      });
    }

    /* Orbit rings + satellites */
    const ring1 = new THREE.Mesh(track(new THREE.TorusGeometry(2.15, 0.005, 8, 240)), track(new THREE.MeshBasicMaterial({ color: 0xa5b4fc, transparent: true, opacity: 0.25 })));
    ring1.rotation.set(1.2, 0.25, 0.3);
    const ring2 = new THREE.Mesh(track(new THREE.TorusGeometry(2.55, 0.004, 8, 240)), track(new THREE.MeshBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.14 })));
    ring2.rotation.set(1.45, -0.5, -0.2);
    root.add(ring1, ring2);
    const sat1 = new THREE.Mesh(track(new THREE.SphereGeometry(0.045, 16, 16)), track(new THREE.MeshBasicMaterial({ color: 0xffffff })));
    const sat2 = new THREE.Mesh(track(new THREE.SphereGeometry(0.035, 16, 16)), track(new THREE.MeshBasicMaterial({ color: 0x5eead4 })));
    ring1.add(sat1);
    ring2.add(sat2);

    /* Orbiting tech chips */
    const CHIPS: [string, string][] = isSmall
      ? [['</>', '#7dd3fc'], ['Liquid', '#34d399'], ['API', '#a78bfa'], ['$ checkout', '#60a5fa']]
      : [
          ['</>', '#7dd3fc'],
          ['Liquid', '#34d399'],
          ['API', '#a78bfa'],
          ['$ checkout', '#60a5fa'],
          ['Shopify 2.0', '#34d399'],
          ['{ json }', '#f0abfc'],
          ['🛒 +1 order', '#fbbf24'],
        ];
    const chips = CHIPS.map(([label, accent], i) => {
      const { tex, aspect } = chipTexture(label, accent);
      track(tex);
      const mat = track(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
      const sprite = new THREE.Sprite(mat);
      // chips are children of the scaled root, so this is relative to the globe size
      const h = isSmall ? 0.3 : 0.24;
      sprite.scale.set(h * aspect, h, 1);
      root.add(sprite);
      return {
        sprite,
        mat,
        angle: (i / CHIPS.length) * Math.PI * 2,
        radius: rand(2.0, 2.3),
        y: rand(-1.0, 1.0),
        speed: rand(0.08, 0.14) * (i % 2 ? 1 : -1) * -1,
        bob: Math.random() * Math.PI * 2,
      };
    });

    /* Background starfield */
    const SC = isSmall ? 500 : 1100;
    const sPos = new Float32Array(SC * 3);
    for (let i = 0; i < SC; i++) {
      const r = 3.2 + Math.random() * 5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      sPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      sPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
      sPos[i * 3 + 2] = r * Math.cos(ph) - 2;
    }
    const starGeo = track(new THREE.BufferGeometry());
    starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const stars = new THREE.Points(starGeo, track(new THREE.PointsMaterial({
      size: 0.03, map: dotTex, color: 0xbcd3ff, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending,
    })));
    scene.add(stars);

    /* Layout */
    let baseX = 0;
    let baseY = 0;
    let baseScale = 1;
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (w < 992) {
        baseX = 0;
        baseY = 1.35;
        baseScale = w < 576 ? 0.52 : 0.6;
      } else {
        baseX = 1.85 * Math.min(camera.aspect / 1.6, 1.25);
        baseY = 0.05;
        baseScale = 0.68;
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    /* Interaction */
    const pointer = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0, scroll: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(mount);

    const clock = new THREE.Clock();
    const tmp = new THREE.Vector3();
    let raf = 0;
    let readyFired = false;

    const renderFrame = (t: number) => {
      const scrollP = Math.min(window.scrollY / (mount.clientHeight || 1), 1);
      smooth.x += (pointer.x - smooth.x) * 0.05;
      smooth.y += (pointer.y - smooth.y) * 0.05;
      smooth.scroll += (scrollP - smooth.scroll) * 0.08;

      // gentle parallax only — no zoom on scroll
      root.position.set(baseX + smooth.x * 0.15, baseY - smooth.y * 0.1 + smooth.scroll * 0.6, 0);
      root.scale.setScalar(baseScale);
      root.rotation.y = smooth.x * 0.25;
      root.rotation.x = smooth.y * 0.15;

      globe.rotation.y = t * 0.12;

      pulses.forEach((p) => {
        const k = (t * p.speed + p.offset) % 1;
        p.curve.getPoint(k, tmp);
        p.mesh.position.copy(tmp);
        const s = 0.6 + Math.sin(k * Math.PI) * 0.9;
        p.mesh.scale.setScalar(s);
      });

      ring1.rotation.z = t * 0.2;
      ring2.rotation.z = -t * 0.14;
      sat1.position.set(Math.cos(t * 0.8) * 2.15, Math.sin(t * 0.8) * 2.15, 0);
      sat2.position.set(Math.cos(-t * 0.55 + 2) * 2.55, Math.sin(-t * 0.55 + 2) * 2.55, 0);

      chips.forEach((c) => {
        const a = c.angle + t * c.speed;
        c.sprite.position.set(Math.cos(a) * c.radius, c.y + Math.sin(t * 0.8 + c.bob) * 0.08, Math.sin(a) * c.radius);
        // fade chips that pass behind the globe
        const depth = (c.sprite.position.z / c.radius + 1) / 2;
        c.mat.opacity = 0.25 + depth * 0.75;
      });

      stars.rotation.y = t * 0.01;

      renderer.render(scene, camera);
      if (!readyFired) { readyFired = true; onReady?.(); }
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      renderFrame(clock.getElapsedTime());
    };

    if (reduceMotion) renderFrame(3); else loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointer);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReady]);

  return <div ref={mountRef} className="hx-scene" aria-hidden="true" />;
}
