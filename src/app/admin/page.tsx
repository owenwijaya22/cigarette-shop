import React from 'react';
import Link from 'next/link';
import { ShoppingBag, BarChart, Package } from 'lucide-react';

const adminLinks = [
  {
    title: 'Orders',
    href: '/admin/orders',
    description: 'View and manage customer orders',
    icon: ShoppingBag,
  },
  {
    title: 'Products',
    href: '/admin/products',
    description: 'Add new cigarettes and manage inventory',
    icon: Package,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    description: 'View sales and customer analytics',
    icon: BarChart,
  },
];

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-white">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.title}
              href={link.href}
              className="bg-neutral-800 p-6 rounded-lg shadow hover:bg-neutral-700 transition duration-200"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Icon className="h-10 w-10 text-indigo-400" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-white">{link.title}</h2>
                  <p className="mt-1 text-neutral-400">{link.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 
