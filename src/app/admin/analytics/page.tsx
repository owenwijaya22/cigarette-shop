import React from 'react';
import prisma from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';

async function getAnalyticsData() {
  // Get top countries by order count
  const topCountries = await prisma.orderAnalytics.groupBy({
    by: ['country'],
    _count: {
      orderId: true,
    },
    orderBy: {
      _count: {
        orderId: 'desc',
      },
    },
    take: 5,
  });

  // Get top products by country
  const topProductsByCountry = await prisma.productAnalytics.groupBy({
    by: ['country', 'productId'],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
  });

  // Get product details for the above analytics
  const productIds = [...new Set(topProductsByCountry.map(item => item.productId))];
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  // Format data for display
  const productMap = products.reduce((acc, product) => {
    acc[product.id] = product;
    return acc;
  }, {} as Record<string, any>);

  // Organize by country
  const countryData: Record<string, any[]> = {};
  
  for (const item of topProductsByCountry) {
    if (!countryData[item.country]) {
      countryData[item.country] = [];
    }
    
    if (productMap[item.productId]) {
      countryData[item.country].push({
        product: productMap[item.productId],
        quantity: item._sum.quantity,
      });
    }
  }

  // Get recent orders with country info
  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return {
    topCountries,
    countryData,
    recentOrders,
  };
}

export default async function AnalyticsPage() {
  const { topCountries, countryData, recentOrders } = await getAnalyticsData();

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-neutral-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-white">Top Countries by Orders</h2>
          <div className="space-y-4">
            {topCountries.map((country) => (
              <div key={country.country} className="flex justify-between items-center">
                <span className="text-neutral-300">{country.country}</span>
                <span className="bg-indigo-900 text-white px-3 py-1 rounded-full text-sm">
                  {country._count.orderId} orders
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-white">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.map((order) => (
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
            ))}
          </div>
        </div>
      </div>

      <div className="bg-neutral-800 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-6 text-white">Popular Products by Country</h2>
        
        <div className="space-y-8">
          {Object.entries(countryData).map(([country, products]) => (
            <div key={country} className="border-b border-neutral-700 pb-6 last:border-b-0 last:pb-0">
              <h3 className="text-lg font-medium text-white mb-4">{country}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.slice(0, 3).map((item) => (
                  <div key={item.product.id} className="bg-neutral-700 p-4 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">{item.product.name}</p>
                        <p className="text-sm text-neutral-400">{item.product.brand}</p>
                      </div>
                      <span className="bg-indigo-600 text-white px-2 py-1 rounded text-sm">
                        {item.quantity} sold
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 