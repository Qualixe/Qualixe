import { Menu } from 'lucide-react';

interface HeaderButtonProps {
  shownav: () => void;
  open?: boolean;
}

function HeaderButton({ shownav, open = false }: HeaderButtonProps) {
  return (
    <div className='header-button'>
      <button
        type='button'
        className='navbar-icon'
        onClick={shownav}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls='mobile-nav'
      >
        <Menu size={20} />
      </button>
    </div>
  )
}

export default HeaderButton
