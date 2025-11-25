import React from 'react'
import Link from 'next/link';
import { Menu } from 'lucide-react';

interface HeaderButtonProps {
    shownav: () => void;
}

function HeaderButton(props: HeaderButtonProps) {
    const {shownav} = props;
    return (
        <div className='header-button'>
        <Link href={'https://wa.me/8801521481618'} className='button header-btn'>Contact</Link>
        <span className='navbar-icon' onClick={shownav}>
            <Menu />
        </span>
        </div>
    )
}

export default HeaderButton
