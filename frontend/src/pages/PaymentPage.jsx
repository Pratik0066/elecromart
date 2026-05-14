import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { CreditCard } from 'lucide-react';

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // Redirect if no shipping address exists
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const [paymentMethod, setPaymentMethod] = useState('Razorpay');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <CheckoutSteps step1 step2 step3 />

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg">
            <CreditCard className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Payment Method</h1>
        </div>

        <form onSubmit={submitHandler}>
          <div className="space-y-4 mb-8">
            <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
              <input
                type="radio"
                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                name="paymentMethod"
                value="Razorpay"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <CreditCard className="text-blue-600" size={20} />
              <span className="font-bold text-gray-800">Razorpay (Credit Card / UPI / Net Banking)</span>
            </label>
            
            <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
              <input
                type="radio"
                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                name="paymentMethod"
                value="COD"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="font-bold text-gray-800">Cash on Delivery</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-blue-600 transition shadow-lg"
          >
            CONTINUE TO PLACE ORDER
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;