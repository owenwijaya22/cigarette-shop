import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import AddToCartButton from './AddToCartButton';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { inventory: true },
    });
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const isInStock = product.inventory && product.inventory.quantity > 0;

  return (
    <div>
      <div className="mb-4">
        <Link href="/" className="text-red-600 hover:text-red-700 hover:underline">
          ← Back to Products
        </Link>
      </div>

      <div className="bg-neutral-800 shadow-md rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="relative h-64 md:h-full bg-neutral-700">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-400">
                  No Image Available
                </div>
              )}
            </div>
          </div>
          <div className="p-6 md:w-1/2">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-white">{product.name}</h1>
                <p className="text-neutral-400">{product.brand}</p>
              </div>
              <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2 text-white">Description</h2>
              <p className="text-neutral-300">
                {product.description || 'No description available.'}
              </p>
            </div>

            <div className="mt-6">
              <div className="mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isInStock
                      ? 'bg-green-900 text-green-100'
                      : 'bg-red-900 text-red-100'
                  }`}
                >
                  {isInStock
                    ? `In Stock (${product.inventory.quantity} available)`
                    : 'Out of Stock'}
                </span>
              </div>

              <AddToCartButton 
                product={product} 
                isInStock={isInStock} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 