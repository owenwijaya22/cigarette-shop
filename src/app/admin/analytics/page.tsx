'use client';

import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { BarChart, LineChart, PieChart } from 'lucide-react';

// Types for our analytics data
type Order = {
  id: string;
  customerName: string;
  customerCountry: string;
  total: number;
  createdAt: string;
  orderItems: any[];
};

type CountryData = {
  country: string;
  orders: number;
  revenue: number;
};

type ProductData = {
  id: string;
  name: string;
  brand: string;
  sales: number;
};

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [countryStats, setCountryStats] = useState<CountryData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all orders
        const response = await fetch('/api/orders');
        if (response.ok) {
          const orders = await response.json();
          
          // Process recent orders
          setRecentOrders(orders.slice(0, 10));
          
          // Calculate total revenue and orders
          const revenue = orders.reduce((sum: number, order: Order) => sum + order.total, 0);
          setTotalRevenue(revenue);
          setTotalOrders(orders.length);
          setAverageOrderValue(orders.length > 0 ? revenue / orders.length : 0);
          
          // Process country data
          const countriesMap = new Map<string, CountryData>();
          
          orders.forEach((order: Order) => {
            const country = order.customerCountry;
            if (!countriesMap.has(country)) {
              countriesMap.set(country, { country, orders: 0, revenue: 0 });
            }
            
            const data = countriesMap.get(country)!;
            data.orders += 1;
            data.revenue += order.total;
          });
          
          setCountryStats(Array.from(countriesMap.values())
            .sort((a, b) => b.orders - a.orders));
          
          // Process product data
          const productsMap = new Map<string, ProductData>();
          
          orders.forEach((order: Order) => {
            order.orderItems.forEach((item) => {
              const product = item.product;
              if (!productsMap.has(product.id)) {
                productsMap.set(product.id, {
                  id: product.id,
                  name: product.name,
                  brand: product.brand,
                  sales: 0
                });
              }
              
              const data = productsMap.get(product.id)!;
              data.sales += item.quantity;
            });
          });
          
          setTopProducts(Array.from(productsMap.values())
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Analytics Dashboard</h1>
        <div className="bg-neutral-800 p-6 rounded-lg shadow">
          <div className="text-center py-8">
            <div className="inline-block animate-pulse bg-neutral-700 h-8 w-48 rounded"></div>
            <div className="mt-4 inline-block animate-pulse bg-neutral-700 h-4 w-64 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-white">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-neutral-800 p-6 rounded-lg shadow">
          <div className="flex items-start">
            <div className="bg-indigo-900/30 p-3 rounded-lg mr-4">
              <LineChart className="h-8 w-8 text-indigo-400" />
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-800 p-6 rounded-lg shadow">
          <div className="flex items-start">
            <div className="bg-indigo-900/30 p-3 rounded-lg mr-4">
              <BarChart className="h-8 w-8 text-indigo-400" />
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Total Orders</p>
              <h3 className="text-2xl font-bold text-white">{totalOrders}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-800 p-6 rounded-lg shadow">
          <div className="flex items-start">
            <div className="bg-indigo-900/30 p-3 rounded-lg mr-4">
              <PieChart className="h-8 w-8 text-indigo-400" />
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Avg. Order Value</p>
              <h3 className="text-2xl font-bold text-white">${averageOrderValue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-neutral-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-white">Top Countries by Orders</h2>
          <div className="space-y-4">
            {countryStats.length > 0 ? (
              countryStats.map((country) => (
                <div key={country.country} className="flex justify-between items-center">
                  <div>
                    <span className="text-neutral-300">{country.country}</span>
                    <div className="mt-1 text-xs text-neutral-500">${country.revenue.toFixed(2)} total revenue</div>
                  </div>
                  <span className="bg-indigo-900 text-white px-3 py-1 rounded-full text-sm">
                    {country.orders} orders
                  </span>
                </div>
              ))
            ) : (
              <p className="text-neutral-400">No country data available yet</p>
            )}
          </div>
        </div>

        <div className="bg-neutral-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-white">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="border-b border-neutral-700 pb-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-white">{order.customerName}</p>
                      <p className="text-sm text-neutral-400">{order.customerCountry}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-neutral-400">
                        {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-neutral-400">No recent orders</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-neutral-800 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-6 text-white">Top Selling Products</h2>
        
        {topProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topProducts.map((product) => (
              <div key={product.id} className="bg-neutral-700 p-4 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="text-sm text-neutral-400">{product.brand}</p>
                  </div>
                  <span className="bg-indigo-600 text-white px-2 py-1 rounded text-sm">
                    {product.sales} sold
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-400">No product data available yet</p>
        )}
      </div>
    </div>
  );
} 