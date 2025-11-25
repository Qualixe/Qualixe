import { Image } from 'react-bootstrap'

function HeaderLogo() {
  return (
    <div className='header-logo'>
          <Image src={'/assets/img/logo.png'} alt='img' className='header__logo'  />
    </div>
  )
}

export default HeaderLogo
