import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    inventory?: {
      quantity: number;
    } | null;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product}) => {
  const { id, name, brand, description, price, imageUrl, inventory } = product;
  const isInStock = inventory && inventory.quantity > 0;

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="relative h-52 w-full bg-neutral-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-400">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-800">{name}</h3>
        <p className="text-sm text-neutral-500">{brand}</p>
        <p className="mt-2 text-neutral-600 text-sm line-clamp-2">
          {description || 'No description available.'}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-neutral-800">${price.toFixed(2)}</span>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              isInStock
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isInStock
              ? `In Stock (${inventory.quantity})`
              : 'Out of Stock'}
          </span>
        </div>
        <div className="mt-4 flex space-x-2">
          <Link 
            href={`/products/${id}`} prefetch={true}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded text-center hover:bg-red-800 active:scale-95 transition ease-in-out duration-300 fancy"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 