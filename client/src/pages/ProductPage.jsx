import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StarIcon } from '@heroicons/react/24/solid';
import { fetchProductById, addToCart, rateProduct, commentProduct } from "../utils/api";
import { useAuth } from '../context/AuthContext';

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
        
        // Set initial rating if user has already rated
        if (user) {
          const userRating = data.ratings.find(r => r.user?._id === user._id);
          if (userRating) setRating(userRating.value);
        }
      } catch (err) {
        setError("Failed to fetch product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, user]);

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(id, quantity);
      setMessage("Added to cart!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to add to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > product.stock) newQuantity = product.stock;
    setQuantity(newQuantity);
  };

  const handleRating = async (value) => {
    try {
      const updatedProduct = await rateProduct(id, value);
      setProduct(updatedProduct);
      setRating(value);
      setMessage('Rating submitted!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const updatedProduct = await commentProduct(id, commentText);
      setProduct(updatedProduct);
      setCommentText('');
      setMessage('Comment added!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse space-y-6 w-full max-w-4xl">
          <div className="bg-gray-200 rounded-lg h-96 w-full"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-12 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {product ? (
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-2xl shadow-lg overflow-hidden">
              <img
                src={product.images[selectedImage] || "https://via.placeholder.com/800"}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800";
                }}
              />
            </div>

            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedImage
                      ? "border-indigo-600 ring-2 ring-indigo-100"
                      : "border-transparent hover:border-indigo-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-lg text-gray-500 mt-2">{product.brand}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-indigo-600">
                  ${product.price.toFixed(2)}
                </span>
                <span className={`text-sm px-2 py-1 rounded ${
                  product.stock > 0 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </span>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-sm text-gray-500 capitalize">{key}</div>
                      <div className="font-medium">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ratings Section */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Product Ratings</h3>
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold mr-2">
                  {product.averageRating?.toFixed(1) || '0.0'}
                </span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.round(product.averageRating || 0) 
                          ? 'text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  ({product.ratings?.length || 0} ratings)
                </span>
              </div>
              
              {user && (
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">Rate this product:</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleRating(value)}
                        className={`p-2 rounded-md ${
                          value <= rating 
                            ? 'bg-yellow-100' 
                            : 'bg-gray-100'
                        } hover:bg-yellow-100 transition-colors`}
                      >
                        <StarIcon
                          className={`w-6 h-6 ${
                            value <= rating 
                              ? 'text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add to Cart Section */}
            <div className="pt-4 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || product.stock === 0}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min="1"
                    max={product.stock}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    className="w-16 text-center border-0 focus:ring-0"
                    disabled={product.stock === 0}
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock || product.stock === 0}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.stock === 0}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {product.stock === 0 ? (
                    "Out of Stock"
                  ) : isAddingToCart ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding to Cart...</span>
                    </div>
                  ) : (
                    "Add to Cart"
                  )}
                </button>
              </div>

              {message && (
                <div
                  className={`p-3 rounded-lg text-center ${
                    message.includes("Failed")
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">
                Customer Reviews ({product.comments?.length || 0})
              </h3>
              
              {user && (
                <div className="mb-6">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write your review..."
                    className="w-full p-3 border rounded-lg mb-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="3"
                  />
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!commentText.trim()}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {product.comments?.map((comment) => (
                  <div key={comment._id} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium">
                        {comment.user?.username || 'Anonymous'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No product found</p>
        </div>
      )}
    </div>
  );
}
