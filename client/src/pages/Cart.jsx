import React, { useEffect, useState } from 'react';
import { fetchCart, removeFromCart, placeOrder } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Cart() {
  const { user } = useAuth(); 
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await fetchCart();
      setCart(cartData);
    } catch (err) {
      setError(err.message || 'Error fetching cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      loadCart();
    } catch (err) {
      alert(err.message || 'Error removing item');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const result = await placeOrder();
      loadCart();
    } catch (err) {
      alert(err.message || 'Error placing order');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse space-y-4 w-full max-w-4xl">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
      {error}
    </div>
  );

  if (!cart || !cart.items || cart.items.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-600">Start adding items to your cart</p>
    </div>
  );

  // Calculate subtotal, taxes, and total
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const taxRate = 0.1; // 10% tax
  const taxes = subtotal * taxRate;
  const total = subtotal + taxes;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
              {cart.items.map((item) => (
                <div key={item.product._id} className="p-6 flex">
                  <img
                    src={item.product.images[0] || 'https://via.placeholder.com/150'}
                    alt={item.product.name}
                    className="h-24 w-24 rounded-md object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                  
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
                      <button
                        onClick={() => handleRemove(item.product._id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-lg font-medium text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes</span>
                <span className="font-medium text-gray-900">
                  ${taxes.toFixed(2)}
                </span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={!user?.isEmailVerified}
              className={`w-full mt-6 text-white py-3 px-4 rounded-md transition-colors font-medium ${
                user?.isEmailVerified 
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {user?.isEmailVerified ? 'Checkout' : 'Verify Email to Checkout'}
            </button>

            {!user?.isEmailVerified && (
              <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                <p>
                  You need to verify your email before checking out. 
                  <Link to="/profile" className="ml-1 text-yellow-700 hover:text-yellow-800 font-medium">
                    Verify Email →
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
