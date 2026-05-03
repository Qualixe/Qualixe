"use client"

import { useState, useEffect } from 'react'
import './Header.css'
import HeaderLogo from './HeaderLogo'
import Menu from './Menu'
import HeaderButton from './HeaderButton'
import CartIcon from './CartIcon'
import CartDrawer from './CartDrawer'
import SearchIcon from './SearchIcon'
import { useCart } from '@/context/CartContext'
import { X } from 'lucide-react'

function Header() {
  const [btnState, setBtnState] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { drawerEnabled } = useCart()

  const showMobileNav = () => setBtnState((prev) => !prev)
  const toggleClass = btnState ? 'active' : ''

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className={`header-section ${scrolled ? 'header-section--scrolled' : ''}`}>
      <div className='container'>
        {/* Desktop layout */}
        <div className='header-wrap'>
          <HeaderLogo />
          <div className='desk-nav'>
            <Menu />
          </div>
          <div className='header-right'>
            <SearchIcon />
            <CartIcon />
            <HeaderButton shownav={showMobileNav} />
          </div>
        </div>

        {/* Mobile layout */}
        <div className='mobile-header-wrap'>
          <div className='mobile-header-left'>
            <HeaderButton shownav={showMobileNav} />
          </div>
          <div className='mobile-header-center'>
            <HeaderLogo />
          </div>
          <div className='mobile-header-right'>
            <SearchIcon />
            <CartIcon />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-nav ${toggleClass}`}>
        <div className='mobile-nav-header'>
          <HeaderLogo />
          <span className='mobile-nav-close' onClick={showMobileNav}><X size={18} /></span>
        </div>
        <div className='mobile-nav-items'>
          <Menu onLinkClick={showMobileNav} />
        </div>
      </div>

      <div className={`mobile-nav-overly ${toggleClass}`} onClick={showMobileNav} />

      {drawerEnabled && <CartDrawer />}
    </div>
  )
}

export default Header
