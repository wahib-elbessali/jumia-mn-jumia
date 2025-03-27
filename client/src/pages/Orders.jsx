import React, { useState, useEffect } from 'react';
import { fetchUserOrders } from '../utils/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchUserOrders();
      setOrders(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-blue-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Order History</h2>
        
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-center text-red-800">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-gray-500">Your order history will appear here</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">
                        #{order._id.toUpperCase()}
                      </span>
                      <span className="text-gray-400">·</span>
                      <time className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                    <h3 className="mt-1 text-xl font-medium text-gray-900">
                      ${(order.total || order.totalPrice).toFixed(2)}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`${getStatusColor(order.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4">
                  <h4 className="sr-only">Items</h4>
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div key={item.product._id} className="flex items-center">
                        <img
                          src={item.product.images?.[0]}
                          alt={item.product.name}
                          className="h-16 w-16 rounded-md object-cover border border-gray-200"
                        />
                        <div className="ml-4 flex-1">
                          <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                          <p className="text-gray-500 text-sm">
                            Qty: {item.quantity} · ${item.product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}