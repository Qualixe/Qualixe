import Image from 'next/image'

function HeaderLogo() {
  return (
    <div className='header-logo'>
      <Image
        src='/assets/img/logo.png'
        alt='Qualixe'
        width={180}
        height={60}
        className='header__logo'
        style={{ width: 'auto', height: 'auto' }}
        priority
      />
    </div>
  )
}

export default HeaderLogo
