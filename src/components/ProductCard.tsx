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
        tarContent?: number | null;
        nicotineContent?: number | null;
        inventory?: {
            quantity: number;
        } | null;
    };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { id, name, brand, description, price, imageUrl, tarContent, nicotineContent, inventory } = product;
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
                    <div className="mt-auto pt-2 flex flex-col gap-2">
                        {/* Cigarette details with badges - tar/nic together, price right */}
                        <div className="flex items-center">
                            {/* Group for tar and nicotine badges */}
                            <div className="flex gap-2">
                                {tarContent !== null && (
                                    <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                        </svg>
                                        Tar: {tarContent} mg
                                    </span>
                                )}
                                {nicotineContent !== null && (
                                    <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                                        </svg>
                                        Nic: {nicotineContent} mg
                                    </span>
                                )}
                            </div>
                            <span className="text-lg font-bold text-neutral-800 ml-auto">
                                ${price}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;