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
      
        <span className='navbar-icon' onClick={shownav}>
            <Menu />
        </span>
        </div>
    )
}

export default HeaderButton
