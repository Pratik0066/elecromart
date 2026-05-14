import { useGetProductsQuery, useDeleteProductMutation, useCreateProductMutation } from '../../slices/productsApiSlice';
import { Link, useNavigate} from 'react-router-dom';
import { Edit, Trash2, Plus, Package } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductListPage = () => {

  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetProductsQuery({});
  const products = data?.products || [];
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        refetch();
        toast.success('Product deleted');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };



const createProductHandler = async () => {
  if (window.confirm('Are you sure you want to create a new product?'))
     {
    try {
      const res = await createProduct().unwrap();
      // res contains the sample product. 
      // We need to navigate to the Edit page immediately!
      navigate(`/admin/product/${res._id}/edit`); 
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }
};

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg"><Package className="text-white" size={24} /></div>
          <h1 className="text-3xl font-black text-gray-900">Products</h1>
        </div>
        <button 
          onClick={createProductHandler}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition"
        >
          <Plus size={20} /> Create Product
        </button>

        
      </div>

      {isLoading ? (
        <div className="text-center py-20">Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-black">ID</th>
                <th className="px-6 py-4 font-black">Name</th>
                <th className="px-6 py-4 font-black">Price</th>
                <th className="px-6 py-4 font-black">Category</th>
                <th className="px-6 py-4 font-black">Brand</th>
                <th className="px-6 py-4">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Array.isArray(products) && products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-xs text-gray-400">{product._id}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 font-black text-blue-600">₹{product.price}</td>
                  <td className="px-6 py-4 text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-gray-600">{product.brand}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link to={`/admin/product/${product._id}/edit`} className="p-2 bg-gray-100 rounded-lg hover:bg-blue-100 text-blue-600 transition">
                      <Edit size={18} />
                    </Link>
                    <button 
                      onClick={() => deleteHandler(product._id)}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-red-100 text-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;