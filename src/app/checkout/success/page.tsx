'use client';

import React from 'react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="mb-8 flex justify-center">
        <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-4">Order Successfully Placed!</h1>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Thank you for your purchase. We have received your order and will process it right away.
        You will receive an email confirmation shortly.
      </p>

      <div className="space-y-4">
        <Link
          href="/products"
          className="block w-full sm:w-auto sm:inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
} 
