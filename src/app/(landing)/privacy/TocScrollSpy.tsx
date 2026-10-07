'use client';

import { useEffect } from 'react';

// Marks the sidebar link of the section currently being read with
// aria-current, which landing.css styles as the active item. The list itself
// stays server-rendered; this only toggles an attribute on it.
export default function TocScrollSpy() {
  useEffect(() => {
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('.lp-legal__toc a[href^="#"]')
    );
    const sections = links
      .map((link) => document.getElementById(link.hash.slice(1)))
      .filter((section): section is HTMLElement => section !== null);
    if (sections.length === 0) return;

    let frame = 0;
    // The last few sections are too short to scroll up to the header, so a
    // clicked link stays active until the reader scrolls by hand again.
    let pinned: string | null = null;

    const update = () => {
      frame = 0;
      // A section becomes active once its heading passes just below the sticky header.
      const header = document.querySelector('.lp-header');
      const line = (header?.getBoundingClientRect().height ?? 0) + 48;

      let active = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) active = section;
      }
      // Short final sections can never reach the line, so pin the last one at page end.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) active = sections[sections.length - 1];

      const activeId = pinned ?? active.id;
      for (const link of links) {
        if (link.hash === `#${activeId}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onClick = (e: MouseEvent) => {
      pinned = (e.currentTarget as HTMLAnchorElement).hash.slice(1);
      onScroll();
    };
    const unpin = () => {
      pinned = null;
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('wheel', unpin, { passive: true });
    window.addEventListener('touchmove', unpin, { passive: true });
    window.addEventListener('keydown', unpin);
    links.forEach((link) => link.addEventListener('click', onClick));
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('wheel', unpin);
      window.removeEventListener('touchmove', unpin);
      window.removeEventListener('keydown', unpin);
      links.forEach((link) => link.removeEventListener('click', onClick));
    };
  }, []);

  return null;
}
