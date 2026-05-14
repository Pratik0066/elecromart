import { useGetAdminStatsQuery } from '../../slices/ordersApiSlice';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, IndianRupee, AlertTriangle, Loader2 } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={28} className="text-white" />
    </div>
    <div>
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const { data: stats, isLoading, error } = useGetAdminStatsQuery();

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
  if (error) return <div className="text-center py-20 text-red-500 font-bold">Failed to load dashboard stats</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tight">Admin <span className="text-blue-600">Dashboard</span></h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={IndianRupee} label="Total Sales (Paid)" value={`₹${Number(stats.totalPaidSales).toLocaleString()}`} color="bg-green-600" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} color="bg-blue-600" />
        <StatCard icon={Package} label="Total Products" value={stats.totalProducts} color="bg-purple-600" />
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-black mb-4 uppercase tracking-tight">Recent <span className="text-blue-600">Orders</span></h2>
          <div className="space-y-3">
            {stats.recentOrders?.map((order) => (
              <Link key={order._id} to={`/order/${order._id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition">
                <div>
                  <p className="font-bold text-sm text-gray-900">{order.user?.name || 'Unknown'}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-blue-600">₹{order.totalPrice}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${order.isPaid ? 'text-green-600' : 'text-red-500'}`}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </p>
                </div>
              </Link>
            ))}
            {(!stats.recentOrders || stats.recentOrders.length === 0) && (
              <p className="text-gray-400 text-sm">No orders yet</p>
            )}
          </div>
          <Link to="/admin/orderlist" className="mt-4 inline-block text-blue-600 font-bold text-sm hover:underline">View all orders →</Link>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-black mb-4 flex items-center gap-2 uppercase tracking-tight">
            <AlertTriangle size={20} className="text-orange-500" /> Low <span className="text-orange-500">Stock</span>
          </h2>
          <div className="space-y-3">
            {stats.lowStockProducts?.map((product) => (
              <Link key={product._id} to={`/admin/product/${product._id}/edit`} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition">
                <p className="font-bold text-sm text-gray-900">{product.name}</p>
                <div className="text-right">
                  <p className="font-black text-gray-900">{product.countInStock} left</p>
                  <p className="text-[10px] font-black text-gray-400">₹{product.price}</p>
                </div>
              </Link>
            ))}
            {(!stats.lowStockProducts || stats.lowStockProducts.length === 0) && (
              <p className="text-gray-400 text-sm">All products well stocked</p>
            )}
          </div>
          <Link to="/admin/productlist" className="mt-4 inline-block text-blue-600 font-bold text-sm hover:underline">Manage inventory →</Link>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/admin/productlist" className="bg-gray-900 text-white p-6 rounded-2xl font-black hover:bg-blue-600 transition flex items-center gap-3">
          <Package size={24} /> Manage Products
        </Link>
        <Link to="/admin/orderlist" className="bg-gray-900 text-white p-6 rounded-2xl font-black hover:bg-blue-600 transition flex items-center gap-3">
          <ShoppingCart size={24} /> Manage Orders
        </Link>
        <Link to="/admin/userlist" className="bg-gray-900 text-white p-6 rounded-2xl font-black hover:bg-blue-600 transition flex items-center gap-3">
          <Users size={24} /> Manage Users
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;