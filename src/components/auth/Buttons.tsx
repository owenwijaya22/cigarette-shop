'use client';

import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

type Provider = 'google' | 'github' | 'facebook';

interface SignInButtonProps {
  provider: Provider;
  callbackUrl?: string;
  className?: string;
}

// Define provider-specific styling and text
const PROVIDER_CONFIG = {
  google: {
    name: 'Google',
    className: 'bg-white hover:bg-gray-100 text-gray-800',
    logo: 'https://authjs.dev/img/providers/google.svg',
  },
  github: {
    name: 'GitHub',
    className: 'bg-gray-900 hover:bg-gray-800 text-white',
    logo: 'https://authjs.dev/img/providers/github.svg',
  },
  facebook: {
    name: 'Facebook',
    className: 'bg-blue-600 hover:bg-blue-700 text-white',
    logo: 'https://authjs.dev/img/providers/facebook.svg',
  },
};

export function SignInButton({ provider, callbackUrl = '/', className = '' }: SignInButtonProps) {
  const config = PROVIDER_CONFIG[provider];
  
  return (
    <button
      onClick={() => signIn(provider, { callbackUrl })}
      className={`w-full py-2 px-4 rounded font-medium transition duration-200 flex items-center justify-center ${config.className} ${className}`}
    >
      <div className="w-6 h-6 relative mr-2">
        <Image
          src={config.logo}
          alt={`${config.name} logo`}
          width={24}
          height={24}
        />
      </div>
      Continue with {config.name}
    </button>
  );
}

interface SignOutButtonProps {
  callbackUrl?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SignOutButton({ callbackUrl = '/', className = '', children = 'Sign out' }: SignOutButtonProps) {
  return (
    <button
      onClick={() => signOut({ callbackUrl })}
      className={`px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700 ${className}`}
    >
      {children}
    </button>
  );
} 