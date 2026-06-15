'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import './preview.css';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTHS: Record<DeviceType, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '390px',
};

export default function ThemePreviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  // demo_url passed as ?url= so the iframe starts immediately — no API wait
  const urlParam = searchParams.get('url') ?? '';
  const nameParam = searchParams.get('name') ?? '';

  const [demoUrl, setDemoUrl] = useState(urlParam);
  const [productName, setProductName] = useState(nameParam);
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [iframeLoading, setIframeLoading] = useState(!!urlParam);
  const [invalid, setInvalid] = useState(false);

  // Fetch product details in the background to fill in missing name/url
  useEffect(() => {
    if (!id) return;
    if (demoUrl && productName) return; // already have everything from query params
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        if (!data?.demo_url) { setInvalid(true); return; }
        if (!demoUrl) { setDemoUrl(data.demo_url); setIframeLoading(true); }
        if (!productName) setProductName(data.name ?? '');
      })
      .catch(() => setInvalid(true));
  }, [id]);

  if (!demoUrl && invalid) {
    return (
      <div className="preview-error">
        <i className="bi bi-exclamation-triangle-fill"></i>
        <h2>Preview Unavailable</h2>
        <p>This product does not have a demo URL configured.</p>
        <button className="preview-back-btn" onClick={() => router.push('/shop')}>
          <i className="bi bi-arrow-left"></i> Back to Shop
        </button>
      </div>
    );
  }

  if (!demoUrl) {
    return (
      <div className="preview-loading">
        <div className="preview-spinner"></div>
        <p>Loading preview…</p>
      </div>
    );
  }

  return (
    <div className="preview-wrapper">
      {/* Top Bar */}
      <div className="preview-topbar">
        <div className="preview-topbar-left">
          <div className="preview-theme-label">
            <i className="bi bi-palette2 preview-palette-icon"></i>
            <span className="preview-theme-name">{productName || '…'}</span>
          </div>
        </div>

        <div className="preview-topbar-center">
          {(['desktop', 'tablet', 'mobile'] as DeviceType[]).map((d) => (
            <button
              key={d}
              className={`preview-device-btn ${device === d ? 'active' : ''}`}
              onClick={() => setDevice(d)}
              title={d.charAt(0).toUpperCase() + d.slice(1)}
            >
              <i className={`bi bi-${d === 'desktop' ? 'display' : d === 'tablet' ? 'tablet' : 'phone'}`}></i>
            </button>
          ))}
        </div>

        <div className="preview-topbar-right">
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="preview-open-btn"
          >
            <i className="bi bi-box-arrow-up-right"></i>
            Open Live
          </a>
          <button className="preview-back-btn-top" onClick={() => router.push('/shop')}>
            Back to Shop <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>

      {/* iframe Stage */}
      <div className="preview-stage">
        <div
          className={`preview-frame-wrapper ${device}`}
          style={{ width: DEVICE_WIDTHS[device] }}
        >
          {iframeLoading && (
            <div className="preview-iframe-loader">
              <div className="preview-spinner"></div>
            </div>
          )}
          <iframe
            src={demoUrl}
            title={productName || 'Preview'}
            className="preview-iframe"
            onLoad={() => setIframeLoading(false)}
          />
        </div>
      </div>
    </div>
  );
}
