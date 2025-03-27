import React, { useState, useEffect, useRef } from 'react';
import { fetchSubcategories, addSubcategory, deleteSubcategory, fetchCategories } from '../utils/api';
import { uploadImage } from '../utils/imageUpload';

export default function SubcategoriesManagement() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState({ name: '', image: null, categoryId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [cats, subs] = await Promise.all([fetchCategories(), fetchSubcategories()]);
        setCategories(cats);
        setSubcategories(subs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddSubcategory = async () => {
    if (!newSubcategory.name || !newSubcategory.image || !newSubcategory.categoryId) {
      setError('Please fill all fields');
      return;
    }
    try {
      setLoading(true);
      const imageUrl = await uploadImage(newSubcategory.image);
      const subcategory = await addSubcategory(newSubcategory.name, imageUrl, newSubcategory.categoryId);
      setSubcategories([...subcategories, subcategory]);
      setNewSubcategory({ name: '', image: null, categoryId: '' });
      fileInputRef.current.value = '';
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    try {
      setLoading(true);
      await deleteSubcategory(subcategoryId);
      setSubcategories(subcategories.filter(s => s._id !== subcategoryId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter subcategories based on search query
  const filteredSubcategories = subcategories.filter(sub =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Subcategories</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search subcategories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={newSubcategory.name}
            onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
            placeholder="Subcategory name"
            className="p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setNewSubcategory({ ...newSubcategory, image: e.target.files[0] })}
            className="p-2 border rounded-md file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <select
            value={newSubcategory.categoryId}
            onChange={(e) => setNewSubcategory({ ...newSubcategory, categoryId: e.target.value })}
            className="p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Parent Category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAddSubcategory}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center disabled:bg-gray-400"
          disabled={loading}
        >
          Add Subcategory
        </button>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubcategories.map(sub => {
          const parentCategory = categories.find(c => c._id === (sub.category._id || sub.category));
          return (
            <div key={sub._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={sub.image}
                  alt={sub.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleDeleteSubcategory(sub._id)}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-red-50 text-red-500"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{sub.name}</h3>
                <p className="text-sm text-gray-500">
                  Parent: {parentCategory?.name || 'Unknown'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
