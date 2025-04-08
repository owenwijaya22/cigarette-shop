import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default async function CheckoutSuccessPage() {

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Your Order is Pending Payment</h1>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Payment Instructions</h2>
        <p className="text-gray-600 mb-4">
          Please complete your payment by scanning the QR code below or by sending payment via FPS to the provided phone number.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 my-6">
          <div className="text-center">
            <div className="bg-white p-3 border rounded-lg shadow-sm mb-2">
              <Image 
                src="/images/payme.jpeg" 
                alt="Payment QR Code" 
                width={200} 
                height={200} 
                className="mx-auto"
              />
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white p-3 border rounded-lg shadow-sm mb-2">
              <p className="text-xl font-mono font-bold text-black">98260697</p>
            </div>
            <p className="text-sm text-gray-500">FPS Phone Number</p>
          </div>
        </div>
        
        <p className="text-gray-600">
          After making the payment, your order will be processed. Please keep your payment receipt for reference.
        </p>
      </div>

      <div className="text-gray-600 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">What to do next?</h2>
        <p>
          Just relax and chill, Owen will prepare your order for you depending on your pickup method.
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <Link 
          href="/"
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Continue Shopping
        </Link>
        <Link 
          href="/account/orders"
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
}
