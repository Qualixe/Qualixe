import React from 'react'
import Image from 'next/image'
import logo from '@/assets/logo.png'

function HeaderLogo() {
  return (
    <div className='header-logo'>
          <Image src={logo} alt='img' className='header__logo' width={100} height={50} />
    </div>
  )
}

export default HeaderLogo
