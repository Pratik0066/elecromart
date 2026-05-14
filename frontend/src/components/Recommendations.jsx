import { useGetRecommendationsQuery } from '../slices/productsApiSlice';
import ProductCard from './ProductCard';
import { Bot, Loader } from 'lucide-react';

const Recommendations = ({ productId }) => {
  // 1. Fetch AI-based related products from the backend logic
  const { data: products, isLoading, error } = useGetRecommendationsQuery(productId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  // 2. Silently fail if there's an error or no recommendations to keep the UI clean
  if (error || !products || products.length === 0) return null;

  return (
    <div className="mt-20 border-t border-gray-100 pt-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Bot size={20} />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight">
          AI <span className="text-blue-600">Suggestions</span> for You
        </h2>
      </div>

      {/* 3. Responsive grid for the 4 recommended items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Recommendations;