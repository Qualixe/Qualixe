"use client"

import { useState } from 'react'
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
  const { drawerEnabled } = useCart()

  const showMobileNav = () => setBtnState((prev) => !prev)
  const toggleClass = btnState ? 'active' : ''

  return (
    <div className='header-section'>
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

        {/* Mobile layout: hamburger | logo | search + cart */}
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
          <span className='mobile-nav-close' onClick={showMobileNav}><X /></span>
        </div>
        <div className='mobile-nav-items'>
          <Menu onLinkClick={showMobileNav} />
        </div>
      </div>

      <div className={`mobile-nav-overly ${toggleClass}`} onClick={showMobileNav} />

      {/* Cart Drawer — only when enabled */}
      {drawerEnabled && <CartDrawer />}
    </div>
  )
}

export default Header
