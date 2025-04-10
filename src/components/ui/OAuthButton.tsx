'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';

type OAuthProvider = 'google' | 'github' | 'facebook';

interface OAuthButtonProps {
  provider: OAuthProvider;
  callbackUrl?: string;
}

// Define fixed class names to avoid hydration mismatches
const PROVIDER_STYLES = {
  google: {
    name: 'Google',
    className: 'bg-white hover:bg-gray-100 text-gray-800',
  },
  github: {
    name: 'GitHub',
    className: 'bg-gray-900 hover:bg-gray-800 text-white',
  },
  facebook: {
    name: 'Facebook',
    className: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
};

export default function OAuthButton({ provider, callbackUrl = '/' }: OAuthButtonProps) {
  const config = PROVIDER_STYLES[provider];
  
  const handleSignIn = () => {
    signIn(provider, { callbackUrl });
  };
  
  return (
    <button
      onClick={handleSignIn}
      // Use a fixed string for className to prevent hydration mismatches
      className={`w-full py-2 px-4 rounded font-medium transition duration-200 flex items-center justify-center ${config.className}`}
    >
      <div className="w-6 h-6 relative mr-2">
        <Image
          src={`https://authjs.dev/img/providers/${provider}.svg`}
          alt={`${config.name} logo`}
          width={24}
          height={24}
        />
      </div>
      Continue with {config.name}
    </button>
  );
} 