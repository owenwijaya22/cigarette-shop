'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4 text-white">Your Cart</h1>
        <p className="text-neutral-400 mb-8">Your cart is empty</p>
        <Link
          href="/"
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-neutral-800 rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-neutral-700">
              {items.map((item) => (
                <li key={item.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:flex-shrink-0 mb-4 sm:mb-0">
                      <div className="w-full sm:w-24 h-24 bg-neutral-700 rounded relative">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-neutral-400">
                            No Image
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 sm:ml-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm text-neutral-400">
                            {item.brand}
                          </p>
                        </div>
                        <p className="text-lg font-medium text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center border border-neutral-600 rounded max-w-[120px]">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-white"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 min-w-[40px] text-center text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-white"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-neutral-800 p-6 rounded-lg shadow sticky top-6">
            <h2 className="text-lg font-medium mb-6 text-white">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-neutral-300">
                <p>Items ({totalItems})</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-neutral-300">
                <p>Shipping</p>
                <p>Free</p>
              </div>
              <div className="border-t border-neutral-700 pt-4 flex justify-between font-bold text-white">
                <p>Total</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
            </div>
            <Link
              href="/checkout"
              className="w-full block text-center py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/"
              className="w-full block text-center py-3 mt-3 border border-neutral-600 text-neutral-300 rounded-md hover:bg-neutral-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 