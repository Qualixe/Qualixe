"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './Header.css'
import HeaderLogo from './HeaderLogo'
import Menu from './Menu'
import HeaderButton from './HeaderButton'
import CartIcon from './CartIcon'
import CartDrawer from './CartDrawer'
import SearchIcon from './SearchIcon'
import { useCart } from '@/context/CartContext'
import { X, ArrowUpRight } from 'lucide-react'

function Header() {
  const [navOpen, setNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { drawerEnabled } = useCart()
  const pathname = usePathname()

  const toggleNav = () => setNavOpen((prev) => !prev)
  const closeNav = () => setNavOpen(false)
  const toggleClass = navOpen ? 'active' : ''

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile nav on route change (state reset during render, per React docs)
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setNavOpen(false)
  }

  // Lock body scroll + close on Escape while mobile nav is open
  useEffect(() => {
    if (!navOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setNavOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [navOpen])

  return (
    <header className={`header-section ${scrolled ? 'header-section--scrolled' : ''}`}>
      <div className='container'>
        {/* Desktop layout */}
        <div className='header-wrap'>
          <Link href='/' className='header-logo-link' aria-label='Qualixe home'>
            <HeaderLogo />
          </Link>
          <div className='desk-nav'>
            <Menu />
          </div>
          <div className='header-right'>
            <div className='header-actions'>
              <SearchIcon />
              <CartIcon />
            </div>
            <span className='header-divider' aria-hidden='true' />
            <Link href='/contact' className='header-cta'>
              <span>Let&apos;s Talk</span>
              <span className='header-cta__icon'><ArrowUpRight size={16} /></span>
            </Link>
          </div>
        </div>

        {/* Mobile layout */}
        <div className='mobile-header-wrap'>
          <div className='mobile-header-left'>
            <HeaderButton shownav={toggleNav} open={navOpen} />
          </div>
          <div className='mobile-header-center'>
            <Link href='/' className='header-logo-link' aria-label='Qualixe home'>
              <HeaderLogo />
            </Link>
          </div>
          <div className='mobile-header-right'>
            <SearchIcon />
            <CartIcon />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <aside
        id='mobile-nav'
        className={`mobile-nav ${toggleClass}`}
        aria-hidden={!navOpen}
        aria-label='Mobile navigation'
      >
        <div className='mobile-nav-header'>
          <Link href='/' className='header-logo-link' onClick={closeNav} aria-label='Qualixe home'>
            <HeaderLogo />
          </Link>
          <button type='button' className='mobile-nav-close' onClick={closeNav} aria-label='Close menu'>
            <X size={18} />
          </button>
        </div>
        <div className='mobile-nav-items'>
          <Menu onLinkClick={closeNav} />
        </div>
        <div className='mobile-nav-footer'>
          <p className='mobile-nav-footer__text'>Have a project in mind?</p>
          <Link href='/contact' className='header-cta header-cta--block' onClick={closeNav}>
            <span>Let&apos;s Talk</span>
            <span className='header-cta__icon'><ArrowUpRight size={16} /></span>
          </Link>
        </div>
      </aside>

      <div className={`mobile-nav-overly ${toggleClass}`} onClick={closeNav} aria-hidden='true' />

      {drawerEnabled && <CartDrawer />}
    </header>
  )
}

export default Header
