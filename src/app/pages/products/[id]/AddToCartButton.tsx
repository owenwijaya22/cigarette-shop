'use client';

import React, { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    imageUrl?: string | null;
  };
  isInStock: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  isInStock,
}) => {
  const { addItem } = useCart();
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (!isInStock) return;

    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      imageUrl: product.imageUrl,
    });

    setIsAdded(true);

    // Reset the button after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const goToCart = () => {
    router.push('/cart');
  };

  return (
    <div className="flex flex-col space-y-2">
      <button
        onClick={handleAddToCart}
        className={`w-full py-3 px-4 rounded font-medium text-white ${
          isInStock
            ? isAdded
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
        disabled={!isInStock || isAdded}
      >
        {isAdded ? '✓ Added to Cart' : isInStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
      
      {isAdded && (
        <button
          onClick={goToCart}
          className="w-full py-3 px-4 rounded font-medium text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
        >
          View Cart
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
