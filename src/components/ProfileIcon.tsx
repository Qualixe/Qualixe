'use client';

import Link from 'next/link';
import { User } from 'lucide-react';
import './ProfileIcon.css';

export default function ProfileIcon() {
  return (
    <Link href="/profile" className="profile-icon-btn" aria-label="My profile">
      <User size={22} />
    </Link>
  );
}
