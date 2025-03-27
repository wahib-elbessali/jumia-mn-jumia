import React, { useState, useEffect, useRef } from 'react';
import { fetchCategories, fetchSubcategories, addProduct, fetchProducts, updateProduct } from '../utils/api';
import { uploadImage } from '../utils/imageUpload';

export default function ProductsManagement() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    images: [],
    stock: '',
    brand: '',
    specifications: {},
  });
  const [specInput, setSpecInput] = useState({ key: '', value: '' });
  const fileInputRef = useRef();

  const [editingProduct, setEditingProduct] = useState(null);
  const [originalEditingProduct, setOriginalEditingProduct] = useState(null);
  const editFileInputRef = useRef();

  // Load categories, subcategories, and products
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [cats, subs, prods] = await Promise.all([
          fetchCategories(),
          fetchSubcategories(),
          fetchProducts()
        ]);
        setCategories(cats);
        setSubcategories(subs);
        setProducts(prods);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter subcategories when category changes
  useEffect(() => {
    if (subcategories.length > 0) {
      const filtered = subcategories.filter(sub => 
        (sub.category._id || sub.category) === newProduct.category
      );
      setFilteredSubcategories(filtered);
      if (!filtered.some(sub => sub._id === newProduct.subcategory)) {
        setNewProduct(prev => ({ ...prev, subcategory: '' }));
      }
    }
  }, [newProduct.category, subcategories]);

  // Filter subcategories for editing product when category changes
  useEffect(() => {
    if (editingProduct && subcategories.length > 0) {
      const filtered = subcategories.filter(sub => 
        (sub.category._id || sub.category) === editingProduct.category
      );
      if (!filtered.some(sub => sub._id === editingProduct.subcategory)) {
        setEditingProduct(prev => ({ ...prev, subcategory: '' }));
      }
    }
  }, [editingProduct?.category, subcategories]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const prods = await fetchProducts();
      setProducts(prods);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSpecification = () => {
    if (specInput.key && specInput.value) {
      setNewProduct(prev => ({
        ...prev,
        specifications: { ...prev.specifications, [specInput.key]: specInput.value }
      }));
      setSpecInput({ key: '', value: '' });
    }
  };

  const handleRemoveSpecification = (key) => {
    const updatedSpecs = { ...newProduct.specifications };
    delete updatedSpecs[key];
    setNewProduct(prev => ({ ...prev, specifications: updatedSpecs }));
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !fileInputRef.current.files.length) {
      setError('Please fill required fields for new product');
      return;
    }
    try {
      setLoading(true);
      const images = await Promise.all(
        Array.from(fileInputRef.current.files).map(uploadImage)
      );
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        images,
      };
      await addProduct(productData);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        subcategory: '',
        images: [],
        stock: '',
        brand: '',
        specifications: {},
      });
      fileInputRef.current.value = '';
      setError('');
      loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // When starting to edit a product, store both its current values and a copy of the original values.
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setOriginalEditingProduct(product);
  };

  const handleUpdateSpecification = (specKey, value) => {
    if (editingProduct) {
      setEditingProduct(prev => ({
        ...prev,
        specifications: { ...prev.specifications, [specKey]: value }
      }));
    }
  };

  const handleRemoveEditSpecification = (specKey) => {
    if (editingProduct) {
      const updatedSpecs = { ...editingProduct.specifications };
      delete updatedSpecs[specKey];
      setEditingProduct(prev => ({ ...prev, specifications: updatedSpecs }));
    }
  };

  // Compute a diff of only the changed fields between editingProduct and originalEditingProduct.
  const getDiff = () => {
    const diff = {};
    for (const key in editingProduct) {
      if (key === 'specifications') {
        if (JSON.stringify(editingProduct[key]) !== JSON.stringify(originalEditingProduct[key])) {
          diff[key] = editingProduct[key];
        }
      } else {
        if (editingProduct[key] !== originalEditingProduct[key]) {
          diff[key] = editingProduct[key];
        }
      }
    }
    return diff;
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct.name || !editingProduct.category) {
      setError('Please fill required fields for editing product');
      return;
    }
    try {
      setLoading(true);
      let images = editingProduct.images;
      if (editFileInputRef.current && editFileInputRef.current.files.length > 0) {
        images = await Promise.all(
          Array.from(editFileInputRef.current.files).map(uploadImage)
        );
      }
      const diff = getDiff();
      // If new images are provided, include them in the diff.
      if (editFileInputRef.current && editFileInputRef.current.files.length > 0) {
        diff.images = images;
      }
      if (diff.price) diff.price = parseFloat(editingProduct.price);
      if (diff.stock) diff.stock = parseInt(editingProduct.stock);
      
      // Only update if there is something changed.
      if (Object.keys(diff).length === 0) {
        setEditingProduct(null);
        setOriginalEditingProduct(null);
        return;
      }
      
      await updateProduct(editingProduct._id, diff);
      setEditingProduct(null);
      setOriginalEditingProduct(null);
      if (editFileInputRef.current) {
        editFileInputRef.current.value = '';
      }
      setError('');
      loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter(prod =>
    prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (prod.brand && prod.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Products</h2>

      {/* New Product Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Add New Product</h3>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            placeholder="Product Name"
            className="p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          
          <textarea
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            placeholder="Description"
            className="p-2 border rounded-md h-24 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              placeholder="Price"
              className="p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              placeholder="Stock"
              className="p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
            <select
              value={newProduct.subcategory}
              onChange={(e) => setNewProduct({ ...newProduct, subcategory: e.target.value })}
              className="p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              disabled={!newProduct.category}
            >
              <option value="">Select Subcategory</option>
              {filteredSubcategories.map(sub => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          </div>

          <div className="border p-4 rounded-md">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={specInput.key}
                onChange={(e) => setSpecInput({ ...specInput, key: e.target.value })}
                placeholder="Spec Key"
                className="p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                value={specInput.value}
                onChange={(e) => setSpecInput({ ...specInput, value: e.target.value })}
                placeholder="Spec Value"
                className="p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleAddSpecification}
              className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200"
            >
              Add Specification
            </button>
            <div className="mt-4 space-y-2">
              {Object.entries(newProduct.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                  <span className="font-medium">{key}</span>
                  <span>{value}</span>
                  <button
                    onClick={() => handleRemoveSpecification(key)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            multiple
            className="p-2 border rounded-md file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />

          <input
            type="text"
            value={newProduct.brand}
            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
            placeholder="Brand"
            className="p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />

          <button
            onClick={handleAddProduct}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            disabled={loading}
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Edit Product Form */}
      {editingProduct && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Edit Product</h3>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              placeholder="Product Name"
              className="p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            
            <textarea
              value={editingProduct.description}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              placeholder="Description"
              className="p-2 border rounded-md h-24 focus:ring-indigo-500 focus:border-indigo-500"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                placeholder="Price"
                className="p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="number"
                value={editingProduct.stock}
                onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                placeholder="Stock"
                className="p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={editingProduct.category}
                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                className="p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
              <select
                value={editingProduct.subcategory}
                onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                className="p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                disabled={!editingProduct.category}
              >
                <option value="">Select Subcategory</option>
                {subcategories
                  .filter(sub => (sub.category._id || sub.category) === editingProduct.category)
                  .map(sub => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                ))}
              </select>
            </div>

            <div className="border p-4 rounded-md">
              <div className="mt-4 space-y-2">
                {editingProduct.specifications && Object.entries(editingProduct.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                    <div className="flex-1">
                      <span className="font-medium">{key}: </span>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleUpdateSpecification(key, e.target.value)}
                        className="p-1 border rounded-md ml-2"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveEditSpecification(key)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <input
              type="file"
              ref={editFileInputRef}
              multiple
              className="p-2 border rounded-md file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />

            <input
              type="text"
              value={editingProduct.brand}
              onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
              placeholder="Brand"
              className="p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />

            <div className="flex space-x-4">
              <button
                onClick={handleUpdateProduct}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                disabled={loading}
              >
                Update Product
              </button>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setOriginalEditingProduct(null);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-center text-red-800">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Search and Product List */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-xl font-medium text-gray-900">No products found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map(prod => (
            <div key={prod._id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-gray-900">{prod.name}</h4>
                <p className="text-sm text-gray-600">Brand: {prod.brand}</p>
                <p className="text-sm text-gray-600">Price: ${prod.price.toFixed(2)}</p>
              </div>
              <div>
                <button
                  onClick={() => handleEditProduct(prod)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 mr-2"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
