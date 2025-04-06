'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  imageUrl: string;
};

type Inventory = {
  id: string;
  productId: string;
  quantity: number;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<(Product & { inventory?: Inventory })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    description: '',
    price: 0,
    imageUrl: '',
    initialStock: 100
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch all products on page load
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products?includeInventory=true');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch products');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'initialStock' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(prev => [...prev, data]);
        
        // Reset form
        setNewProduct({
          name: '',
          brand: '',
          description: '',
          price: 0,
          imageUrl: '',
          initialStock: 100
        });
        
        setMessage({ text: 'Product added successfully!', type: 'success' });
      } else {
        const error = await response.json();
        setMessage({ text: error.message || 'Failed to add product', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred', type: 'error' });
    }
  };

  const updateInventory = async (productId: string, quantity: number) => {
    try {
      const response = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      });

      if (response.ok) {
        const updatedInventory = await response.json();
        setProducts(prev => 
          prev.map(product => 
            product.id === productId 
              ? { ...product, inventory: updatedInventory } 
              : product
          )
        );
        setMessage({ text: 'Inventory updated successfully!', type: 'success' });
      } else {
        const error = await response.json();
        setMessage({ text: error.message || 'Failed to update inventory', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred', type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Cigarette Products</h1>
        <Link 
          href="/admin" 
          className="px-4 py-2 bg-neutral-800 text-white rounded-md hover:bg-neutral-700"
        >
          Back to Admin
        </Link>
      </div>

      {message && (
        <div 
          className={`p-4 mb-6 rounded-md ${
            message.type === 'success' ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-neutral-800 p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Current Products</h2>
            
            {isLoading ? (
              <p className="text-neutral-300">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-neutral-300">No products found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-neutral-300">
                  <thead className="text-neutral-200 border-b border-neutral-700">
                    <tr>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Brand</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Stock</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b border-neutral-700">
                        <td className="py-3">{product.name}</td>
                        <td>{product.brand}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            className="w-20 px-2 py-1 bg-neutral-700 border border-neutral-600 rounded"
                            value={product.inventory?.quantity || 0}
                            onChange={(e) => {
                              // Update the value locally for immediate feedback
                              const newValue = parseInt(e.target.value) || 0;
                              setProducts(prev => 
                                prev.map(p => 
                                  p.id === product.id 
                                    ? { ...p, inventory: { ...p.inventory, quantity: newValue } as Inventory } 
                                    : p
                                )
                              );
                            }}
                            onBlur={(e) => {
                              const newValue = parseInt(e.target.value) || 0;
                              updateInventory(product.id, newValue);
                            }}
                          />
                        </td>
                        <td>
                          <Link 
                            href={`/products/${product.id}`}
                            className="text-indigo-400 hover:text-indigo-300"
                            target="_blank"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-neutral-800 p-6 rounded-lg shadow sticky top-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Add New Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-neutral-600 bg-neutral-700 text-white rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-neutral-300 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={newProduct.brand}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-neutral-600 bg-neutral-700 text-white rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-neutral-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-600 bg-neutral-700 text-white rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-neutral-300 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newProduct.price || ''}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-neutral-600 bg-neutral-700 text-white rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-neutral-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={newProduct.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-600 bg-neutral-700 text-white rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="initialStock" className="block text-sm font-medium text-neutral-300 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    id="initialStock"
                    name="initialStock"
                    value={newProduct.initialStock || ''}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-neutral-600 bg-neutral-700 text-white rounded-md"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add Product
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 