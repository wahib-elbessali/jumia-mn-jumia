import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './pages/UserProfile';
import Navbar from './components/Navbar';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import AdminRoute from './components/AdminRoute';
import CategoryPage from './pages/CategoryPage';
import SubcategoryPage from './pages/SubcategoryPage';
import ProductPage from './pages/ProductPage'
import Orders from './pages/Orders';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><AdminRoute><Dashboard /></AdminRoute></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute> <Orders /> </ProtectedRoute>} />

        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/subcategory/:id" element={<SubcategoryPage />} />
        <Route path="product/:id" element={<ProductPage />} />
      </Routes>
    </>
  );
}

export default App;
