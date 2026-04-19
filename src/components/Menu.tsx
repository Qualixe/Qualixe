'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown,Code, Code2} from 'lucide-react';

interface NavItem {
  href?: string;
  label: string;
  children?: { href: string; label: string; icon?: string }[];
}

const links: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services'},
  { href: '/portfolio', label: 'Portfolio' },
  {
    label: 'Themes',
    children: [
      
      { href: '/themes', label: 'Shopify Themes', icon: 'bi-palette' },
      { href: '/shop', label: 'HTML Themes', icon: 'Code' },
      
    ],
  }
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

  const isChildActive = item.children?.some((c) => pathname === c.href);

  if (!item.children) {
    return (
      <li title={item.label}>
        <Link
          href={item.href!}
          onClick={onLinkClick}
          className={pathname === item.href ? 'active' : ''}
        >
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li ref={ref} className={`menu-dropdown-wrap ${open ? 'menu-dropdown-wrap--open' : ''}`}>
      <button
        className={`menu-dropdown-trigger ${isChildActive ? 'active' : ''}`}
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
      >
        {item.label}
        <ChevronDown size={14} className="menu-chevron" />
      </button>

      <ul className="menu-dropdown">
        {item.children.map((child) => (
          <li key={child.href}>
            <Link
              href={child.href}
              className={`menu-dropdown__item ${pathname === child.href ? 'menu-dropdown__item--active' : ''}`}
              onClick={() => { setOpen(false); onLinkClick?.(); }}
            >
              {child.icon && <i className={`bi ${child.icon}`} />}
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default function Menu({ onLinkClick }: { onLinkClick?: () => void }) {
  return (
    <nav className="header-nav">
      <ul className="header-menu">
        {links.map((item) => (
          <DropdownItem key={item.label} item={item} onLinkClick={onLinkClick} />
        ))}
      </ul>
    </nav>
  );
}
