import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import ProductCard from '../components/ProductCard';
import Paginate from '../components/Paginate';
import { Loader2, AlertCircle, Zap, ShieldCheck, ArrowRight, SlidersHorizontal, X } from 'lucide-react';

const HomePage = () => {
  const { keyword: routeKeyword, pageNumber: routePageNumber } = useParams();
  const keyword = routeKeyword || '';
  const pageNumber = routePageNumber || 1;

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const shopNow = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const { data, isLoading, error } = useGetProductsQuery({
    keyword, pageNumber, category: selectedCategory, brand: selectedBrand,
    minPrice, maxPrice, sort,
  });

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSort('');
  };

  const hasActiveFilters = selectedCategory || selectedBrand || minPrice || maxPrice || sort;

  return (
    <div className="pb-20 container mx-auto px-6">
      {/* --- PREMIUM HERO SECTION --- */}
      <div className="relative mb-20 pt-10">
        <div className="absolute -top-24 -right-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-40 -left-20 w-72 h-72 bg-cyan-400/10 blur-[100px] rounded-full"></div>

        <div className="relative bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center p-8 md:p-16 gap-12">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-400 mx-auto lg:mx-0">
                <Zap size={14} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Next-Gen Electronics</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
                Future of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  Innovation.
                </span>
              </h1>

              <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto lg:mx-0 leading-relaxed">
                Explore 500+ premium gadgets, AI-driven recommendations, and secure payments in one seamless experience.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                <button onClick={shopNow} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all transform hover:scale-105 hover:shadow-[0_20px_40px_rgba(37,99,235,0.3)] flex items-center gap-2">
                  Shop Now <ArrowRight size={16} />
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-8 pt-6 border-t border-white/5">
                <div>
                  <p className="text-2xl font-black text-white">500+</p>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Products</p>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div>
                  <p className="text-2xl font-black text-white">24/7</p>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">AI Support</p>
                </div>
              </div>
            </div>

              <div className="hidden lg:block relative">
              <div className="relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem]  transform rotate-3 hover:rotate-0 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600" 
                  alt="Featured Product" 
                  className="w-full h-full  border-white/10 rounded-[2.5rem] object-fit drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-2xl text-green-600"><ShieldCheck size={24} /></div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Verified Payments</p>
                    <p className="text-sm font-black text-gray-900 tracking-tight">Razorpay & Crypto</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/30 blur-[80px] rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PRODUCTS SECTION --- */}
      <div id="products-section"></div>

      {/* --- FILTERS BAR --- */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
              {keyword ? `Results for "${keyword}"` : <>Latest <span className="text-blue-600 underline decoration-4 underline-offset-8">Products</span></>}
            </h2>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs font-black text-red-500 hover:text-red-600 uppercase tracking-widest">
                <X size={14} /> Clear
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition ${
              showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
              >
                <option value="">All Categories</option>
                {data?.categories?.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
              >
                <option value="">All Brands</option>
                {data?.brands?.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
              />

              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
              />

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
              >
                <option value="">Sort: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Scanning Catalog...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="font-bold">{error?.data?.message || error.error}</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {data?.products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {data?.products?.length === 0 && (
            <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest">
              No products found matching your criteria
            </div>
          )}
        </>
      )}

      {data?.pages > 1 && (
        <div className="mt-20 flex justify-center">
          <Paginate pages={data.pages} page={data.page} keyword={keyword} />
        </div>
      )}
    </div>
  );
};

export default HomePage;