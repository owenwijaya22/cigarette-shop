import React from 'react';
import Link from "next/link";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = 'force-dynamic';

async function getProducts() {
  try {
    const products = await prisma.product.findMany();
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
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Cigarettes</h1>
          <p className="text-gray-600">
            Good smokes. No jokes.
          </p>
        </div>
        <div className="flex flex-col bg-gray-100 border-l-4 border-gray-300 px-3 py-2 rounded-lg shadow-sm mt-4 md:mt-0">
          <p className="text-gray-700">
            <strong>Soon:</strong> Custom hand-rolled cigs & SF Express.
          </p>
          <p className="text-gray-700 mt-1">
            Will find partnerships for steady supply.
          </p>
        </div>
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