import { Link } from 'react-router-dom';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../slices/usersApiSlice';
import { Heart, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const WishlistPage = () => {
  const { data: wishlist, isLoading, error } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const removeHandler = async (productId) => {
    try {
      await removeFromWishlist(productId).unwrap();
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
  if (error) return <div className="text-center py-20 text-red-500 font-bold">Failed to load wishlist</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-red-500 p-2 rounded-lg"><Heart className="text-white" size={24} /></div>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">My <span className="text-red-500">Wishlist</span></h1>
      </div>

      {!wishlist || wishlist.length === 0 ? (
        <div className="bg-gray-50 p-12 rounded-2xl text-center">
          <Heart className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-xl text-gray-600 mb-6 font-bold">Your wishlist is empty</p>
          <Link to="/" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition inline-block">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
              <Link to={`/product/${product._id}`}>
                <img src={product.image} alt={product.name} className="w-full h-48 object-contain p-4 group-hover:scale-105 transition-transform" />
              </Link>
              <div className="p-4">
                <Link to={`/product/${product._id}`} className="font-bold text-gray-900 hover:text-blue-600 transition block truncate">
                  {product.name}
                </Link>
                <p className="text-blue-600 font-black mt-1">₹{product.price}</p>
                <button
                  onClick={() => removeHandler(product._id)}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-xl font-bold text-xs hover:bg-red-100 transition"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;