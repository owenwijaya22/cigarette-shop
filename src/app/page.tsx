import React from 'react';
import Link from "next/link";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

async function getProducts() {
  try {
    // Get all products with inventory information
    const products = await prisma.product.findMany({
      include: {
        inventory: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Cigarettes</h1>
        <p className="text-gray-600">
          Browse our collection of premium cigarettes with real-time inventory
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">No products available yet.</p>
          <Link
            href="/admin"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
          >
            Add Products
          </Link>
        </div>
      )}
    </div>
  );
}
