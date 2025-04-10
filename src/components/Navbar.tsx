'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';
import { ShoppingCart, LogOut, LogIn, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { SignOutButton } from '@/components/auth/Buttons';

interface NavLinkProps {
  href: string;
  current: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, current, children }) => (
  <Link
    href={href}
    className={`px-3 py-2 rounded-md text-sm font-medium ${
      current
        ? 'bg-gray-800 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {children}
  </Link>
);

const Navbar = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { data: session, status } = useSession();
  
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 font-bold text-xl">
              Cigarette Shop
            </Link>
            <div className="ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink href="/" current={pathname === '/'}>
                  Home
                </NavLink>
                {isAdmin && (
                  <NavLink
                    href="/admin"
                    current={pathname.startsWith('/admin')}
                  >
                    Admin
                  </NavLink>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-4">
              <Link
                href="/cart"
                className="relative inline-flex items-center px-4 py-2 rounded-md text-white bg-gray-800 hover:bg-gray-700"
              >
                <ShoppingCart className="w-5 h-5 mr-1" />
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-neutral-800 shadow-sm">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              {isAdmin && (
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 inline-flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              )}
              
              {!session && status !== 'loading' && (
                <Link
                  href="/api/auth/signin"
                  className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 inline-flex items-center"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;