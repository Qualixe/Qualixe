"use client"

import  { useState } from 'react'
import './Header.css'
import HeaderLogo from './HeaderLogo'
import Menu from './Menu'
import HeaderButton from './HeaderButton'
import { X } from 'lucide-react';

function Header() {
  const [btnState, setBtnState] = useState(false)

  const showMobileNav = () => {
    setBtnState((prev) => !prev)
  }

  const toggleClass = btnState ? 'active' : ''

  return (
    <div className='header-section'>
      <div className='container'>
        <div className='header-wrap'>
          <HeaderLogo />
          <div className='desk-nav'>
            <Menu />
          </div>
          <HeaderButton shownav={showMobileNav} />
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-nav ${toggleClass}`}>
        <div className='mobile-nav-header'>
          <span className='mobile-nav-close' onClick={showMobileNav}>
            <X />
          </span>
        </div>
        <div className='mobile-nav-items'>
          {/* 👇 Pass the onLinkClick prop */}
          <Menu onLinkClick={showMobileNav} />
        </div>
      </div>

      {/* Overlay */}
      <div className={`mobile-nav-overly ${toggleClass}`} onClick={showMobileNav}></div>
    </div>
  )
}

export default Header
