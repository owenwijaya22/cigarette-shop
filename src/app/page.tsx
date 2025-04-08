import React from 'react';
import Link from "next/link";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: { inventory: true },
      orderBy: { name: 'asc' },
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
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Cigarettes</h1>
          <p className="text-gray-600">
            Good smokes. No jokes.
          </p>
        </div>
        <div className="max-w-sm bg-gray-100 border-l-4 border-gray-300 p-2 rounded-lg shadow-sm mt-4 md:mt-0">
          <p className="text-sm text-gray-700">
            <span className="text-xl mr-2">🚬</span>
            <strong>Fun Fact:</strong> I spelled my domain name wrong because I was too high enjoying my good cigs.
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