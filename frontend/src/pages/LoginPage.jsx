import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice.js'; // Added .js
import { setCredentials } from '../slices/authSlice.js';     // Added .js
import { LogIn } from 'lucide-react';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Call the login mutation from our slice
  const [login, { isLoading }] = useLoginMutation();

  // Get user info from state to check if already logged in
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  // If already logged in, send them to the redirect path
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // .unwrap() allows us to catch the error in the 'catch' block
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-blue-600 p-3 rounded-full mb-4">
          <LogIn className="text-white" size={28} />
        </div>
        <h1 className="text-3xl font-black text-gray-900">Sign In</h1>
        <p className="text-gray-500 mt-2">Welcome back, Developer!</p>
      </div>

      <form onSubmit={submitHandler} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="enter@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-blue-600 transition shadow-lg disabled:bg-gray-400"
        >
          {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
        </button>
      </form>

      <div className="mt-8 text-center text-gray-600">
        New Customer?{' '}
        <Link to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'} className="text-blue-600 font-bold hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;