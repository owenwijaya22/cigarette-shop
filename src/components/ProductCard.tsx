"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { ShoppingCart, Check } from "lucide-react";

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

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { id, name, brand, description, price, imageUrl, inventory } =
        product;
    const isInStock = inventory && inventory.quantity > 0;
    const { addItem } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation to product page
        if (!isInStock) return;

        addItem({
            id,
            name,
            brand,
            price,
            imageUrl,
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    };

    return (
        <div className="relative group">
            {/* Purple border that appears on hover */}
            <div className="absolute -inset-0.5 bg-indigo-600 rounded-lg opacity-0 group-hover:opacity-100 blur-sm group-hover:blur-md transition duration-300"></div>
            
            {/* Subtle purple border that's always visible */}
            <div className="absolute -inset-0.5 bg-indigo-600/20 rounded-lg"></div>

            <Link
                href={`/products/${id}`}
                prefetch={true}
                className="relative block border-0 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white cursor-pointer z-10"
            >
                <div className="relative h-52 w-full bg-neutral-100">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={name}
                            fill
                            style={{ objectFit: "cover" }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-neutral-400">
                            No Image
                        </div>
                    )}
                </div>
                <div className="p-4 flex flex-col h-[180px]">
                    <div>
                        <h3 className="text-lg font-semibold text-neutral-800">
                            {name}
                        </h3>
                        <p className="text-sm text-neutral-500">{brand}</p>
                        <div className="h-[48px] overflow-hidden mt-2">
                            <p className="text-neutral-600 text-sm line-clamp-2">
                                {description || "No description available."}
                            </p>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-neutral-800">
                            ${price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2">
                            {isInStock && (
                                <button
                                    onClick={handleAddToCart}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
                                        isAdded
                                            ? "bg-green-500 text-white"
                                            : "bg-neutral-100 text-neutral-700 hover:bg-indigo-500 hover:text-white"
                                    } transition-colors`}
                                    title="Add to cart"
                                >
                                    {isAdded ? (
                                        <Check size={16} />
                                    ) : (
                                        <ShoppingCart size={16} />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
