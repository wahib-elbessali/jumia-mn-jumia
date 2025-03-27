import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Fetch user data from the protected route
export const fetchUserData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/protected`, {
      withCredentials: true,
    });
    return response.data.user;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to fetch user data');
  }
};

// Register a new user
export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to register user');
  }
};

// Login user
export const login = async (username, password) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      { username, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to login');
  }
};

// Logout user
export const logout = async () => {
  try {
    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to logout');
  }
};

// Get products
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to fetch products');
  }
};

// Send OTP for email verification
export const sendOtp = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, { email });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to send OTP');
  }
};

// Verify OTP
export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, { email, otp });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to verify OTP');
  }
};

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/categories`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to fetch categories');
  }
};

// Add a new category
export const addCategory = async (name, imageUrl) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/categories`,
      { name, image: imageUrl },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to add category');
  }
};

// Fetch all subcategories
export const fetchSubcategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/subcategories`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to fetch subcategories');
  }
};

// Add a new subcategory
export const addSubcategory = async (name, imageUrl, categoryId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/subcategories`,
      { name, image: imageUrl, categoryId },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to add subcategory');
  }
};

// Add product
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/products`,
      productData,
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to add product');
  }
};

// Delete category
export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/admin/categories/${categoryId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to delete category');
  }
};

// Delete subcategory
export const deleteSubcategory = async (subcategoryId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/admin/subcategories/${subcategoryId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to delete subcategory');
  }
};

// Fetch all categories (public)
export const fetchCategoriesPublic = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/categories`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to fetch categories');
  }
};

// Fetch all subcategories (public)
export const fetchSubcategoriesPublic = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/subcategories`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to fetch subcategories');
  }
};

// Fetch a single product by ID
export const fetchProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to fetch product');
  }
};

// Fetch all orders (Admin only)
export const fetchAllOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to fetch orders');
  }
};

// Fetch orders for logged-in user
export const fetchUserOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/user`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to fetch user orders');
  }
};

// Fetch a single order by ID
export const fetchOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to fetch order');
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/orders/${orderId}/status`,
      { status },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to update order status');
  }
};

// Delete an order (Admin only)
export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/orders/${orderId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to delete order');
  }
};

// Add product to cart
export const addToCart = async (productId, quantity) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/cart/add`,
      { productId, quantity },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to add product to cart');
  }
};

// Fetch cart
export const fetchCart = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cart`, { withCredentials: true });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to fetch cart');
  }
};

// Remove item from cart
export const removeFromCart = async (productId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/cart/remove/${productId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to remove item from cart');
  }
};

// Place order (creates order from cart checkout)
export const placeOrder = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/cart/checkout`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to place order');
  }
};

export const fetchProductsBySubcategory = async (subId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/subcategory/${subId}`,
      { withCredentials: true }
    );
    console.log("api: ", response )
    return response.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message 
      || `Failed to fetch products (Status: ${err.response?.status || 'No response'})`;
    throw new Error(errorMessage);
  }
};

export const rateProduct = async (productId, rating) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/products/${productId}/rate`,
      { rating },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to rate product');
  }
};

export const commentProduct = async (productId, text) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/products/${productId}/comment`,
      { text },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to add comment');
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/products/${productId}`,
      productData,
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to update product');
  }
};