import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { Link } from 'react-router-dom';
import { XCircle, CheckCircle, Eye, ClipboardList } from 'lucide-react';

const OrderListPage = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 p-2 rounded-lg">
          <ClipboardList className="text-white" size={24} />
        </div>
        <h1 className="text-3xl font-black text-gray-900">All Orders (Admin)</h1>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl w-full"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold">
          {error?.data?.message || error.error}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-black">ID</th>
                <th className="px-6 py-4 font-black">User</th>
                <th className="px-6 py-4 font-black">Date</th>
                <th className="px-6 py-4 font-black">Total</th>
                <th className="px-6 py-4 font-black text-center">Paid</th>
                <th className="px-6 py-4 font-black text-center">Delivered</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-xs font-medium text-gray-400">{order._id}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{order.user && order.user.name}</td>
                  <td className="px-6 py-4 text-sm">{order.createdAt.substring(0, 10)}</td>
                  <td className="px-6 py-4 font-black text-blue-600">₹{order.totalPrice}</td>
                  <td className="px-6 py-4">
                    {order.isPaid ? (
                      <CheckCircle className="text-green-500 mx-auto" size={18} />
                    ) : (
                      <XCircle className="text-red-400 mx-auto" size={18} />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {order.isDelivered ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        {order.deliveredAt.substring(0, 10)}
                      </span>
                    ) : (
                      <XCircle className="text-red-400 mx-auto" size={18} />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/order/${order._id}`} className="flex items-center gap-1 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-600 transition">
                      <Eye size={14} /> Details
                    </Link>
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

export default OrderListPage;