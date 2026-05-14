import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, XCircle, CheckCircle } from 'lucide-react';
import { useUpdateProfileMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useUpdateProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // 2. Call the mutation
      const res = await updateProfile({
        _id: userInfo._id,
        name,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Profile Updated Successfully!'); 
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Left Column: Update Profile */}
        <div className="md:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
              <User className="text-blue-600" /> My Profile
            </h2>
            <form onSubmit={submitHandler} className="space-y-4">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition">
                UPDATE PROFILE
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
            <ShoppingBag className="text-blue-600" /> My Orders
          </h2>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
               <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
               <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
            </div>
          ) : error ? (
            <p className="text-red-500">Failed to load orders</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4 font-black">ID</th>
                    <th className="px-6 py-4 font-black">Date</th>
                    <th className="px-6 py-4 font-black">Total</th>
                    <th className="px-6 py-4 font-black">Paid</th>
                    <th className="px-6 py-4 font-black">Delivered</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-xs text-gray-400">{order._id.substring(0, 10)}...</td>
                      <td className="px-6 py-4 text-sm">{order.createdAt.substring(0, 10)}</td>
                      <td className="px-6 py-4 font-bold">₹{order.totalPrice}</td>
                      <td className="px-6 py-4 text-center">
                        {order.isPaid ? (
                          <CheckCircle className="text-green-500 mx-auto" size={18} />
                        ) : (
                          <XCircle className="text-red-400 mx-auto" size={18} />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {order.isDelivered ? (
                          <CheckCircle className="text-green-500 mx-auto" size={18} />
                        ) : (
                          <XCircle className="text-red-400 mx-auto" size={18} />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/order/${order._id}`} className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-black hover:bg-blue-600 hover:text-white transition">
                          DETAILS
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;