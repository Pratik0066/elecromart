import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { useAddToWishlistMutation,  } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [addToWishlist] = useAddToWishlistMutation();


  const addToCartHandler = (e) => {
    e.preventDefault();
    dispatch(addToCart({ ...product, qty: 1 }));
    navigate('/cart');
  };

  const wishlistHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userInfo) {
      navigate('/login');
      return;
    }
    try {
      await addToWishlist(product._id).unwrap();
      toast.success('Added to wishlist!');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1" >
      <Link to={`/product/${product._id}`} className="block relative h-64 overflow-hidden bg-gray-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        {userInfo && (
          <button onClick={wishlistHandler} className="absolute top-2 left-2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition shadow-sm">
            <Heart size={18} className="text-red-500" />
          </button>
        )}
        {product.countInStock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Out of Stock</div>
        )}
      </Link>
      <div className="p-2">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{product.category}</p>
            <h3 className="text-lg font-bold text-gray-800 hover:text-blue-600 transition truncate w-48">{product.name}</h3>
          </div>
          <span className="text- font-black text-gray-900">₹{product.price}</span> {/* Updated Symbol */}
        </div>
        <div className="flex items-center gap-1 mb-4 text-yellow-400">
           <Star size={14} fill="currentColor" />
           <span className="text-sm font-medium text-gray-600">{product.rating}</span>
           <span className="text-xs text-gray-400">({product.numReviews})</span>
        </div>
        <button onClick={addToCartHandler} disabled={product.countInStock === 0} className={`w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${product.countInStock > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
          <ShoppingCart size={18} /> {product.countInStock > 0 ? 'Add to Cart' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;