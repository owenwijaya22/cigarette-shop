'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ShoppingBag, CheckCircle, XCircle, Truck, Package, AlertTriangle } from 'lucide-react';

type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    brand: string;
  };
};

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerCountry: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
};

const statusIcons = {
  PENDING: AlertTriangle,
  PAID: CheckCircle,
  SHIPPED: Truck,
  DELIVERED: Package,
  CANCELLED: XCircle,
};

const statusColors = {
  PENDING: 'bg-yellow-900 text-yellow-100',
  PAID: 'bg-blue-900 text-blue-100',
  SHIPPED: 'bg-indigo-900 text-indigo-100',
  DELIVERED: 'bg-green-900 text-green-100',
  CANCELLED: 'bg-red-900 text-red-100',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [countries, setCountries] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        
        // Extract unique countries for filter
        const uniqueCountries = [...new Set(data.map((order: Order) => order.customerCountry))] as string[];
        setCountries(uniqueCountries);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setIsLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, status: OrderStatus) {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        
        // Update orders list
        setOrders(prev => prev.map(order => 
          order.id === orderId ? updatedOrder : order
        ));
        
        // Update selected order if it's the one being viewed
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updatedOrder);
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(false);
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesCountry = countryFilter === '' || order.customerCountry === countryFilter;
    return matchesStatus && matchesCountry;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Orders</h1>
        <Link 
          href="/admin" 
          className="px-4 py-2 bg-neutral-800 text-white rounded-md hover:bg-neutral-700"
        >
          Back to Admin
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-neutral-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-white">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Order Status
                </label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Country
                </label>
                <select
                  value={countryFilter}
                  onChange={e => setCountryFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white"
                >
                  <option value="">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={fetchOrders}
                className="w-full px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md"
              >
                Refresh Orders
              </button>
            </div>
          </div>
          
          <div className="bg-neutral-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-white">Orders List</h2>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin h-8 w-8 border-4 border-neutral-600 border-t-indigo-500 rounded-full"></div>
                <p className="mt-2 text-neutral-400">Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <p className="text-neutral-400 text-center py-4">No orders found</p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {filteredOrders.map(order => {
                  const StatusIcon = statusIcons[order.status];
                  return (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`w-full text-left p-3 rounded-md hover:bg-neutral-700 transition-colors ${
                        selectedOrder?.id === order.id ? 'bg-neutral-700 ring-1 ring-indigo-500' : 'bg-neutral-750'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`w-5 h-5 ${
                          order.status === 'PENDING' ? 'text-yellow-400' :
                          order.status === 'PAID' ? 'text-blue-400' :
                          order.status === 'SHIPPED' ? 'text-indigo-400' :
                          order.status === 'DELIVERED' ? 'text-green-400' :
                          'text-red-400'
                        }`} />
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-medium text-white truncate">{order.customerName}</p>
                          <p className="text-xs text-neutral-400">
                            {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-white">${order.total.toFixed(2)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <div className="bg-neutral-800 p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Order Details</h2>
                  <p className="text-sm text-neutral-400 mt-1">Order ID: {selectedOrder.id}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-md font-medium text-neutral-300 mb-2">Customer Information</h3>
                  <div className="bg-neutral-750 p-4 rounded-md">
                    <p className="text-white">{selectedOrder.customerName}</p>
                    <p className="text-neutral-400">{selectedOrder.customerPhone}</p>
                    <p className="text-neutral-400">{selectedOrder.customerCountry}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-neutral-300 mb-2">Order Information</h3>
                  <div className="bg-neutral-750 p-4 rounded-md">
                    <div className="flex justify-between mb-1">
                      <span className="text-neutral-400">Created:</span>
                      <span className="text-white">
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-neutral-400">Updated:</span>
                      <span className="text-white">
                        {new Date(selectedOrder.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Total:</span>
                      <span className="text-white font-semibold">
                        ${selectedOrder.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-md font-medium text-neutral-300 mb-2">Order Items</h3>
              <div className="bg-neutral-750 rounded-md mb-6 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-neutral-700">
                    <tr>
                      <th className="px-4 py-2 text-neutral-300">Product</th>
                      <th className="px-4 py-2 text-neutral-300">Quantity</th>
                      <th className="px-4 py-2 text-neutral-300">Price</th>
                      <th className="px-4 py-2 text-neutral-300">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-700">
                    {selectedOrder.orderItems.map(item => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-white">
                          <div>
                            <p>{item.product.name}</p>
                            <p className="text-xs text-neutral-400">{item.product.brand}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-white">{item.quantity}</td>
                        <td className="px-4 py-3 text-white">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-white">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <h3 className="text-md font-medium text-neutral-300 mb-2">Update Status</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as OrderStatus[]).map(status => {
                  const StatusIcon = statusIcons[status];
                  return (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      disabled={isUpdating || selectedOrder.status === status}
                      className={`p-2 rounded-md flex flex-col items-center justify-center ${
                        selectedOrder.status === status 
                          ? 'bg-neutral-600 text-white' 
                          : 'bg-neutral-700 hover:bg-neutral-600 text-neutral-300'
                      } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <StatusIcon className="h-5 w-5 mb-1" />
                      <span className="text-xs">{status}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-neutral-800 p-8 rounded-lg shadow h-full flex flex-col items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-neutral-600 mb-4" />
              <h3 className="text-xl text-neutral-400 text-center">Select an order to view details</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
