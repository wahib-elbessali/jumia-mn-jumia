import React, { useState } from 'react';
import OrdersManagement from '../components/OrdersManagement';
import CategoriesManagement from '../components/CategoriesManagement';
import SubcategoriesManagement from '../components/SubcategoriesManagement';
import ProductsManagement from '../components/ProductsManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <nav className="mb-8 border-b border-gray-200">
          <div className="flex space-x-8">
            {['orders', 'categories', 'subcategories', 'products'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </nav>

        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'orders' && <OrdersManagement />}
          {activeTab === 'categories' && <CategoriesManagement />}
          {activeTab === 'subcategories' && <SubcategoriesManagement />}
          {activeTab === 'products' && <ProductsManagement />}
        </div>
      </div>
    </div>
  );
}
