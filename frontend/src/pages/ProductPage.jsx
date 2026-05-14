import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import { 
  ShoppingCart, 
  ArrowLeft, 
  Star, 
  Send, 
  Bot, 
  ShieldCheck, 
  Zap, 
  Loader2, 
  MessageSquare // ⬅️ ADDED THIS MISSING IMPORT
} from 'lucide-react';
import Recommendations from '../components/Recommendations';
import { toast } from 'react-toastify';

const ProductPage = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingReview }] = useCreateReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    toast.success('Added to bag!');
    // ⬇️ USE NAVIGATE: Redirect to cart after adding item
    navigate('/cart'); 
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      setRating(0); 
      setComment('');
      toast.success('Review posted!');
    } catch (err) { 
      toast.error(err?.data?.message || err.error); 
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={48}/></div>;
  if (error) return <div className="p-10 text-center text-red-500 font-bold uppercase tracking-widest">Failed to load product details.</div>;

  return (
    <div className="container mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-10 font-black uppercase text-[10px] tracking-widest">
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Visuals */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-xl shadow-gray-200/20 group relative overflow-hidden">
             <div className="absolute top-10 left-10 bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest z-10">New Release</div>
            <img src={product.image} alt={product.name} className="w-full h-125 object-contain transform group-hover:scale-105 transition-transform duration-700" />
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full w-fit mb-6">
            <Zap size={14} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-widest">{product.brand} Premium</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center text-yellow-400">
                <Star fill="currentColor" size={20}/> 
                <span className="text-gray-900 font-black ml-2">{product.rating}</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">{product.numReviews} Certified Reviews</span>
          </div>
          
          <p className="text-gray-500 text-lg leading-relaxed mb-10">{product.description}</p>
          
          <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100">
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Current Price</p>
                <h2 className="text-4xl font-black text-blue-600">₹{product.price.toLocaleString()}</h2>
              </div>
              <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {product.countInStock > 0 ? 'Units Available' : 'Out of Stock'}
              </div>
            </div>

            {product.countInStock > 0 && (
              <div className="space-y-4">
                <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-full bg-white border border-gray-200 py-4 px-6 rounded-2xl font-bold outline-none ring-blue-600/10 focus:ring-4 transition-all cursor-pointer">
                  {[...Array(product.countInStock).keys()].map(x => <option key={x+1} value={x+1}>Quantity: {x+1}</option>)}
                </select>
                <button onClick={addToCartHandler} className="w-full bg-gray-900 hover:bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 active:scale-95">
                  <ShoppingCart size={20} /> Add to Bag
                </button>
              </div>
            )}
            
            <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={14} /> 2-Year Manufacturer Warranty
            </div>
          </div>
        </div>
      </div>

      {/* --- REVIEWS SECTION --- */}
      <div className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">Customer <span className="text-blue-600">Experience</span></h2>
          {product?.reviews?.length === 0 && <div className="bg-gray-50 p-6 rounded-2xl text-gray-400 font-bold uppercase text-xs tracking-widest">No feedback yet. Be the first!</div>}
          <div className="space-y-6">
            {product?.reviews?.map((review) => (
              <div key={review._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-hover hover:shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <strong className="text-gray-900 font-black uppercase text-xs tracking-widest">{review.name}</strong>
                  <div className="flex text-yellow-400"><Star size={14} fill="currentColor" /> <span className="ml-1 text-gray-900 font-black text-xs">{review.rating}</span></div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{review.comment}</p>
                <p className="text-[10px] text-gray-300 font-bold uppercase mt-4 tracking-widest">{review.createdAt?.substring(0, 10)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><MessageSquare size={120} /></div>
          <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">Post <span className="text-blue-400">Feedback</span></h2>

          {userInfo ? (
            <form onSubmit={submitHandler} className="space-y-6 relative z-10">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Performance Rating</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} 
                className="w-full  border border-white/10 p-4 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-600/20 transition-all cursor-pointer focus:bg-gray-900 focus:text-white ">
                  <option value="">Select...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Detailed Experience</label>
                <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-600/20 resize-none transition-all" placeholder="Tell us how it works in the real world..."></textarea>
              </div>
              <button type="submit" disabled={loadingReview} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-3xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-blue-900/20">
                {loadingReview ? 'Publishing...' : <><Send size={18} /> Send Review</>}
              </button>
            </form>
          ) : (
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center">
              <p className="text-gray-400 font-bold mb-4 uppercase text-[10px] tracking-widest">Access Restricted</p>
              <Link to="/login" className="inline-block bg-blue-600 px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-colors">Sign In to Review</Link>
            </div>
          )}
        </div>
      </div>

      {/* --- AI RECOMMENDATIONS --- */}
      <div className="mt-32 pt-20 border-t border-gray-100">
        <div className="flex items-center gap-4 mb-12">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200"><Bot size={24} /></div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">AI <span className="text-blue-600 underline decoration-4 underline-offset-8">Suggestions</span></h2>
        </div>
        <Recommendations productId={productId} />
      </div>
    </div>
  );
};

export default ProductPage;