'use client';

import {
  UserIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  DocumentTextIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function PatientSidebar() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 h-full bg-red-600 text-white z-50 w-12 sm:w-48 flex flex-col justify-between py-6 overflow-hidden">
      <ul className="space-y-4 w-full px-0 sm:px-4">
        {/* Search Doctor */}
        <li className="w-full">
          <Link
            href="/patient/search-doctors"
            className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-all text-sm sm:text-base font-medium
              ${pathname === '/patient/search-doctors' ? 'bg-red-800' : 'hover:bg-red-700'}
            `}
          >
            <MagnifyingGlassIcon className="h-6 w-6 sm:h-7 sm:w-7" />
            <span className="hidden sm:inline truncate">Search Doctor</span>
          </Link>
        </li>

        {/* Search Pharmacy */}
        <li className="w-full">
          <Link
            href="/patient/search-pharmacy"
            className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-all text-sm sm:text-base font-medium
              ${pathname === '/patient/search-pharmacy' ? 'bg-red-800' : 'hover:bg-red-700'}
            `}
          >
            <BuildingStorefrontIcon className="h-6 w-6 sm:h-7 sm:w-7" />
            <span className="hidden sm:inline truncate">Search Pharmacy</span>
          </Link>
        </li>

        {/* My Report */}
        <li className="w-full">
          <Link
            href="/patient/my-report"
            className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-all text-sm sm:text-base font-medium
              ${pathname === '/patient/my-report' ? 'bg-red-800' : 'hover:bg-red-700'}
            `}
          >
            <DocumentTextIcon className="h-6 w-6 sm:h-7 sm:w-7" />
            <span className="hidden sm:inline truncate">My Report</span>
          </Link>
        </li>

        {/* My Profile */}
        <li className="w-full">
          <Link
            href="/patient/profile"
            className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-all text-sm sm:text-base font-medium
              ${pathname === '/patient/profile' ? 'bg-red-800' : 'hover:bg-red-700'}
            `}
          >
            <UserIcon className="h-6 w-6 sm:h-7 sm:w-7" />
            <span className="hidden sm:inline truncate">My Profile</span>
          </Link>
        </li>
      </ul>

      {/* Logout Button */}
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="mt-auto flex items-center gap-3 w-full px-4 py-2 hover:bg-red-700 transition rounded-lg text-sm sm:text-base font-medium"
      >
        <ArrowLeftOnRectangleIcon className="h-6 w-6 sm:h-7 sm:w-7" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </nav>
  );
}
