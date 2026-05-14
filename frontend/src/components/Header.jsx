import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, LogOut, User, Heart, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) { console.error(err); }
  };

  return (
    <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-black text-gray-900 tracking-tighter shrink-0">
          ELECTRO<span className="text-blue-600">MART</span>
        </Link>
        
        <div className="hidden lg:block flex-1 max-w-xl"><SearchBox /></div>

        <div className="flex items-center gap-3 md:gap-5">
          {userInfo && (
            <Link to="/wishlist" className="relative group text-gray-600 hover:text-red-500 transition-colors" title="Wishlist">
              <Heart size={22} strokeWidth={2} />
            </Link>
          )}

          <Link to="/cart" className="relative group text-gray-600 hover:text-blue-600 transition-colors">
            <ShoppingCart size={22} strokeWidth={2} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white group-hover:scale-110 transition-transform">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>

          {userInfo ? (
            <div className="flex items-center gap-2">
              {userInfo.isAdmin && (
                <Link to="/admin/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors" title="Admin Dashboard">
                  <LayoutDashboard size={22} />
                </Link>
              )}
              <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 pl-4 pr-2 py-1.5 rounded-2xl border border-gray-100 transition-all group">
                <Link to="/profile" className="text-xs font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                  <User size={16} /> {userInfo.name.split(' ')[0]}
                </Link>
                <button onClick={logoutHandler} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-gray-200">
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;