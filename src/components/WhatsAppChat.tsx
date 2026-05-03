'use client';

import { useState } from 'react';
import './WhatsAppChat.css';

const WA_NUMBER  = '8801318552266';
const WA_MESSAGE = 'Hi! I am interested to know more about your services. Can you please assist?';
const FB_MESSENGER = 'https://m.me/qualixe'; // replace with your page username

export default function WhatsAppChat() {
  const [open, setOpen] = useState(false);

  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

  return (
    <div className={`social-float ${open ? 'social-float--open' : ''}`} aria-label="Contact us">

      {/* WhatsApp */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="social-float__btn social-float__btn--wa"
        aria-label="Chat on WhatsApp"
        tabIndex={open ? 0 : -1}
      >
        {/* WhatsApp SVG */}
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
          <circle cx="16" cy="16" r="16" fill="#25D366"/>
          <path d="M23.5 8.5A10.44 10.44 0 0 0 16 5.5C10.75 5.5 6.5 9.75 6.5 15a9.44 9.44 0 0 0 1.27 4.76L6.5 26.5l6.93-1.82A9.44 9.44 0 0 0 16 25.5c5.25 0 9.5-4.25 9.5-9.5a9.44 9.44 0 0 0-2-5.5Zm-7.5 14.6a7.84 7.84 0 0 1-4-.11l-.29-.09-2.99.78.8-2.92-.19-.3A7.84 7.84 0 0 1 8.14 15c0-4.33 3.53-7.86 7.86-7.86A7.86 7.86 0 0 1 23.86 15c0 4.33-3.53 7.1-7.86 7.1Zm4.31-5.88c-.24-.12-1.4-.69-1.61-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1-.37-1.91-1.18-.71-.63-1.18-1.41-1.32-1.65-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.57.18 1.09.15 1.5.09.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28Z" fill="#fff"/>
        </svg>
      </a>

      {/* Messenger */}
      <a
        href={FB_MESSENGER}
        target="_blank"
        rel="noopener noreferrer"
        className="social-float__btn social-float__btn--msg"
        aria-label="Chat on Messenger"
        tabIndex={open ? 0 : -1}
      >
        {/* Messenger SVG */}
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
          <circle cx="16" cy="16" r="16" fill="url(#msg-grad)"/>
          <defs>
            <linearGradient id="msg-grad" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A334FA"/>
              <stop offset="1" stopColor="#FF6968"/>
            </linearGradient>
          </defs>
          <path d="M16 6C10.48 6 6 10.26 6 15.5c0 2.9 1.37 5.49 3.52 7.24V26l3.13-1.72c.83.23 1.72.36 2.63.36 5.52 0 10-4.26 10-9.5S21.52 6 16 6Zm1.03 12.77-2.55-2.72-4.98 2.72 5.48-5.82 2.61 2.72 4.92-2.72-5.48 5.82Z" fill="#fff"/>
        </svg>
      </a>

      {/* Toggle / Close button */}
      <button
        className="social-float__toggle"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat options' : 'Open chat options'}
        aria-expanded={open}
      >
        {open
          ? <span className="social-float__close-icon">✕</span>
          : (
            <svg width="30" height="30" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M53.0437 27.0094C53.0437 37.0594 42.7312 45.2063 30 45.2063C28.85 45.209 27.7009 45.1401 26.5594 45C24.6094 44.775 19.1344 51.7406 17.3812 51.15C15.9656 50.6719 18.225 42.7125 16.9781 42.0281C10.9219 38.7469 6.95625 33.2437 6.95625 27.0281C6.95625 16.9781 17.2687 8.84062 30 8.84062C42.7312 8.84062 53.0437 16.9594 53.0437 27.0094Z" stroke="black" stroke-width="2.8125" stroke-linecap="round"/>
            <path d="M21.9187 26.7656H22.3875" stroke="black" stroke-width="2.8125" stroke-linecap="round"/>
            <path d="M30 26.7656H30.4688" stroke="black" stroke-width="2.8125" stroke-linecap="round"/>
            <path d="M37.8375 26.7656H38.3063" stroke="black" stroke-width="2.8125" stroke-linecap="round"/>
            </svg>


          )
        }
      </button>
    </div>
  );
}
