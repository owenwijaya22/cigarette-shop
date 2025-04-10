'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';
import { ShoppingCart, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { data: session, status } = useSession();
  
  const isLoggedIn = !!session;
  const isAdmin = session?.user?.isAdmin || false;


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
                
                {/* Admin link - only shows for admins */}
                {isAdmin && (
                  <NavLink
                    href="/admin"
                    current={pathname.startsWith('/admin')}
                  >
                    Admin
                  </NavLink>
                )}
                
                {/* Debug element to show session state */}
                <span className="text-xs text-gray-500">
                  {status === 'loading' ? 'Loading...' : 
                   status === 'authenticated' ? `Logged in (Admin: ${isAdmin ? 'Yes' : 'No'})` : 
                   'Not logged in'}
                </span>
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
              
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-300 flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {session.user.name || session.user.email}
                    {session.user.isAdmin && " (Admin)"}
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
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

interface NavLinkProps {
  href: string;
  current: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, current, children }) => {
  return (
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
};

export default Navbar;