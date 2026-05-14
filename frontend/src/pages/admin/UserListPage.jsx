import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice';
import { Trash2, CheckCircle, XCircle, Users, Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const UserListPage = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      try {
        await deleteUser(id);
        refetch();
        toast.success('User deleted successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Users size={24} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Manage Users</h1>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl w-full"></div>)}
        </div>
      ) : error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-xl font-bold">{error?.data?.message || error.error}</div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">ID</th>
                <th className="px-8 py-5">Name</th>
                <th className="px-8 py-5">Email</th>
                <th className="px-8 py-5 text-center">Admin</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-8 py-6 text-xs font-mono text-gray-400">{user._id}</td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-gray-900">{user.name}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-gray-500 text-sm italic">
                      <Mail size={14} /> {user.email}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      {user.isAdmin ? (
                        <div className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black">
                          <ShieldCheck size={12} /> ADMIN
                        </div>
                      ) : (
                        <XCircle className="text-gray-300" size={18} />
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {!user.isAdmin && (
                      <button
                        onClick={() => deleteHandler(user._id)}
                        className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm shadow-red-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
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

export default UserListPage;