'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: 'Pakistan',
    pickupDetails: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use useEffect to handle empty cart redirect only on initial load
  useEffect(() => {
    const isInitialLoad = true; // This will only run once on mount
    if (items.length === 0 && isInitialLoad) {
      router.push('/cart');
    }
  }, []); // Empty dependency array means this only runs once on mount

  // If cart is empty, return a loading state until the redirect happens
  if (items.length === 0) {
    return <div className="text-center py-12 text-white">Redirecting to cart...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create the order with customer details
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          customerCountry: formData.country,
          pickupDetails: formData.pickupDetails,
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          total: subtotal
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }
      
      // Clear the cart after successful order
      clearCart();
      
      // Use replace instead of push to prevent back navigation to checkout
      router.replace('/checkout/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during checkout');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">Checkout</h1>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-neutral-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-white">Contact Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-neutral-600 bg-neutral-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-300 mb-1">
                    Phone Number <span className="text-neutral-500">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number (optional)"
                    className="w-full px-4 py-3 border border-neutral-600 bg-neutral-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="mt-1 text-sm text-neutral-500">
                    Optional, but helpful if we need to contact you about your order
                  </p>
                </div>

                <div>
                  <label htmlFor="pickupDetails" className="block text-sm font-medium text-neutral-300 mb-1">
                    Pickup Details
                  </label>
                  <textarea
                    id="pickupDetails"
                    name="pickupDetails"
                    value={formData.pickupDetails}
                    onChange={handleChange}
                    required
                    placeholder="Specify where and when you want to pick up your cigarettes"
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-600 bg-neutral-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="mt-1 text-sm text-neutral-500">
                    Examples: "Behind the Golovkin statue, 10pm tonight" or "Panfilov Park bench, tomorrow at 9am"
                  </p>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-neutral-300 mb-1">
                    Where are you from?
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-600 bg-neutral-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Kazakhstan">Kazakhstan</option>
                    <option value="Kyrgyzstan">Kyrgyzstan</option>
                    <option value="Serbia">Serbia</option>
                    <option value="Mainland China">Mainland China</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="India">India</option>
                    <option value="Other">Other</option>
                  </select>
                  <p className="mt-1 text-sm text-neutral-500">
                    Just data collection purposes to track cigarette preferences by region
                  </p>
                </div>

                <div className="mt-8 flex justify-between">
                  <Link
                    href="/cart"
                    className="px-4 py-2 border border-neutral-600 rounded-md text-neutral-300 hover:bg-neutral-700"
                  >
                    Back to Cart
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Processing...' : 'Complete Order'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-neutral-800 p-6 rounded-lg shadow sticky top-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <ul className="divide-y divide-neutral-700 mb-4">
                {items.map((item) => (
                  <li key={item.id} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-sm text-neutral-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-white">${(item.price * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between text-neutral-300">
                <p>Subtotal</p>
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
          </div>
        </div>
      </div>
    </div>
  );
} 
