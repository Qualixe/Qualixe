'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { SERVICE_CATALOG, HEADLESS_SERVICE } from '@/lib/services';

interface NavChild {
  href: string;
  label: string;
  icon?: string;
  desc?: string;
}

interface NavItem {
  href?: string;
  label: string;
  children?: NavChild[];
}

const links: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  {
    label: 'Services',
    children: [...SERVICE_CATALOG, HEADLESS_SERVICE].map((s) => ({
      href: s.href,
      label: s.name,
      icon: s.icon,
      desc: s.short,
    })),
  },
  {
    label: 'Portfolio',
    children: [
      { href: '/portfolio', label: 'Shopify & E-commerce', icon: 'bi-bag-check', desc: 'Stores we\'ve designed & built' },
      { href: '/laravel-projects', label: 'Laravel Applications', icon: 'bi-code-square', desc: 'Custom web apps & platforms' },
    ],
  },
  // { href: '/team', label: 'Team' },
  {
    label: 'Themes',
    children: [
      { href: '/themes', label: 'Shopify Themes', icon: 'bi-palette', desc: 'Premium themes for Shopify' },
      { href: '/shop', label: 'HTML Themes', icon: 'bi-code-slash', desc: 'Ready-to-use HTML templates' },
    ],
  },
];

function DropdownItem({
  item,
  onLinkClick,
}: {
  item: NavItem;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on route change (state reset during render, per React docs)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // Hover-to-open on devices with a real pointer (desktop)
  const canHover = () =>
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (min-width: 768px)').matches;

  const handleEnter = () => {
    if (!canHover()) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleLeave = () => {
    if (!canHover()) return;
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  const isChildActive = item.children?.some((c) => pathname === c.href);

  if (!item.children) {
    const active = pathname === item.href;
    return (
      <li>
        <Link
          href={item.href!}
          onClick={onLinkClick}
          className={active ? 'active' : ''}
          aria-current={active ? 'page' : undefined}
        >
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li
      ref={ref}
      className={`menu-dropdown-wrap ${open ? 'menu-dropdown-wrap--open' : ''}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
    >
      <button
        type="button"
        className={`menu-dropdown-trigger ${isChildActive ? 'active' : ''}`}
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown size={14} className="menu-chevron" />
      </button>

      <ul className="menu-dropdown">
        {item.children.map((child) => {
          const active = pathname === child.href;
          return (
            <li key={child.href}>
              <Link
                href={child.href}
                className={`menu-dropdown__item ${active ? 'menu-dropdown__item--active' : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => { setOpen(false); onLinkClick?.(); }}
              >
                {child.icon && (
                  <span className="menu-dropdown__icon">
                    <i className={`bi ${child.icon}`} />
                  </span>
                )}
                <span className="menu-dropdown__text">
                  <span className="menu-dropdown__label">{child.label}</span>
                  {child.desc && <span className="menu-dropdown__desc">{child.desc}</span>}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

export default function Menu({ onLinkClick }: { onLinkClick?: () => void }) {
  return (
    <nav className="header-nav" aria-label="Main navigation">
      <ul className="header-menu">
        {links.map((item) => (
          <DropdownItem key={item.label} item={item} onLinkClick={onLinkClick} />
        ))}
      </ul>
    </nav>
  );
}
