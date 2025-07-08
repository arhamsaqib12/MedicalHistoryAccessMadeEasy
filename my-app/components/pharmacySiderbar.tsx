'use client';

import { useState } from 'react';
import {
  UserIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const menuItems = [
  { name: 'Search Patient', icon: MagnifyingGlassIcon, href: '/pharmacy/search-patient' },
  { name: 'My Patients', icon: UsersIcon, href: '/pharmacy/my-patient' },
  { name: 'My Profile', icon: UserIcon, href: '/pharmacy/profile' },
];

export default function PharmacySidebar() {
  const [active, setActive] = useState(menuItems[0].name);

  return (
    <nav className="fixed left-0 top-0 h-full bg-red-600 text-white z-50 w-12 sm:w-48 flex flex-col justify-between py-6 overflow-hidden">
      {/* Top Menu Items */}
      <ul className="space-y-4 w-full px-0 sm:px-4">
        {menuItems.map(({ name, icon: Icon, href }) => (
          <li key={name} className="w-full">
            <Link
              href={href}
              className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-all text-sm sm:text-base font-medium
                ${active === name ? 'bg-red-800' : 'hover:bg-red-700'}
              `}
              onClick={() => setActive(name)}
            >
              <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
              <span className="hidden sm:inline truncate">{name}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout Button at the Bottom */}
      <button
        onClick={() => signOut()}
        className="mt-auto flex items-center gap-3 w-full px-4 py-2 hover:bg-red-700 transition rounded-lg text-sm sm:text-base font-medium"
      >
        <ArrowLeftOnRectangleIcon className="h-6 w-6 sm:h-7 sm:w-7" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </nav>
  );
}
