import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  useUpdateProductMutation, 
  useGetProductDetailsQuery, 
  useUploadProductImageMutation 
} from '../../slices/productsApiSlice';
import { ArrowLeft, Save, Package, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      setImage(res.image);
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      }).unwrap();
      toast.success('Product updated successfully!');
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <Link to="/admin/productlist" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold mb-6 transition">
        <ArrowLeft size={18} /> Back to Products
      </Link>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-900 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-lg text-white"><Package size={24} /></div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">Edit Product</h1>
          </div>
          <span className="text-gray-400 text-xs font-mono">{productId}</span>
        </div>

        {isLoading ? (
          <div className="p-20 text-center font-bold animate-pulse text-gray-400">Loading Product Data...</div>
        ) : (
          <form onSubmit={submitHandler} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Side: General Info */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Product Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Price (₹)</label>
                    <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition font-bold" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Stock</label>
                    <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition font-bold" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Image Source</label>
                  <div className="flex flex-col gap-3">
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm outline-none" 
                      placeholder="Image URL" 
                      value={image} 
                      onChange={(e) => setImage(e.target.value)} 
                    />
                    <div className="relative group">
                      <input 
                        type="file" 
                        onChange={uploadFileHandler}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-200 rounded-xl group-hover:border-blue-400 group-hover:bg-blue-50 transition-all text-gray-500">
                        {loadingUpload ? <span className="animate-spin">🌀</span> : <Upload size={18} />}
                        <span className="text-sm font-bold uppercase tracking-tighter">Upload New Image</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Categorization & Preview */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Brand</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium" value={brand} onChange={(e) => setBrand(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Category</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium" value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
                
                {/* Visual Preview Box */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-lg border flex items-center justify-center overflow-hidden">
                    {image ? (
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={24} className="text-gray-300" />
                    )}
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Preview</span>
                    <p className="text-xs text-gray-500 max-w-[150px] truncate">{image || 'No image selected'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Description</label>
              <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>

            <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-blue-600 transition shadow-lg flex items-center justify-center gap-2">
              <Save size={20} /> {loadingUpdate ? 'SAVING CHANGES...' : 'UPDATE PRODUCT'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductEditPage;