import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public & Auth Pages
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

// Checkout Pages
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import OrderListPage from './pages/admin/OrderListPage';
import ProductListPage from './pages/admin/ProductListPage';
import ProductEditPage from "./pages/admin/ProductEditPage";
import UserListPage from './pages/admin/UserListPage';
import WishlistPage from './pages/WishlistPage';
import AIChatBot from './components/AIChatBot';

function App() {
  return (
    <Router>
      <Header />
      <ToastContainer autoClose={2000} />
      <main className="container mx-auto px-6 py-8 min-h-[80vh]">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Registered User Routes */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/placeorder" element={<PlaceOrderPage />} />
          <Route path="/order/:id" element={<OrderPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Admin Management Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/orderlist" element={<OrderListPage />} />
          <Route path="/admin/productlist" element={<ProductListPage />} />
          <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />
          <Route path="/admin/userlist" element={<UserListPage />} />
          <Route path="/search/:keyword" element={<HomePage />} />
          <Route path="/page/:pageNumber" element={<HomePage />} />
          <Route path="/search/:keyword/page/:pageNumber" element={<HomePage />} />
        </Routes>
      </main>
      
      <footer className="bg-white border-t py-12 text-center">
        <div className="container mx-auto px-6">
          <p className="text-2xl font-black text-gray-900 mb-2 uppercase">
            My<span className="text-blue-600">Store</span>
          </p>
          <p className="text-gray-500 text-sm font-medium">
            &copy; 2026 Premium MERN Store. All rights reserved.
          </p>
        </div>
      </footer>
      <AIChatBot />
    </Router>
  );
}

export default App;