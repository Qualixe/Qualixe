import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Menu({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="header-nav">
      <ul className="header-menu">
        {links.map(({ href, label }) => (
          <li key={href} title={label}>
            <Link
              href={href}
              onClick={onLinkClick}
              className={pathname === href ? 'active' : ''}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
