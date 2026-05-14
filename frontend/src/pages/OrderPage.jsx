import { useParams } from 'react-router-dom';
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetRazorpayKeyQuery } from '../slices/ordersApiSlice';
import { useSelector } from 'react-redux';
import { CheckCircle2, Clock, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const OrderPage = () => {
  const { id: orderId } = useParams();
  
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const { data: razorpayKey } = useGetRazorpayKeyQuery();
  const { userInfo } = useSelector((state) => state.auth);

  const paymentHandler = async () => {
    if (!razorpayKey || !order) {
      toast.error('Payment system initialization failed. Please refresh.');
      return;
    }

    const options = {
      key: razorpayKey.key, 
      amount: Math.round(order.totalPrice * 100), 
      currency: "INR",
      name: "ElectroMart",
      description: `Payment for Order ${orderId}`,
      order_id: order.razorpayOrderId, 
      handler: async function (response) {
        try {
          await payOrder({ 
            orderId, 
            details: {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            } 
          }).unwrap();
          refetch(); 
          toast.success('Payment Successful! Order status updated.');
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      },
      prefill: { name: userInfo.name, email: userInfo.email },
      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (isLoading) return <div className="flex justify-center mt-20"><div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>;
  
  if (error) return (
    <div className="container mx-auto px-6 py-8 text-center">
      <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
      <p className="text-xl font-bold text-gray-800">{error?.data?.message || error.error}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-black mb-6 uppercase tracking-tight">Order <span className="text-blue-600">{order._id}</span></h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Shipping Details</h2>
            <p className="text-gray-600"><strong>Name:</strong> {order.user?.name}</p>
            <p className="text-gray-600"><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}</p>
            <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${order.isDelivered ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
              {order.isDelivered ? <CheckCircle2 size={18}/> : <Clock size={18}/>}
              <span className="text-sm font-bold">{order.isDelivered ? `Delivered on ${order.deliveredAt}` : 'Not Delivered'}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Payment Method</h2>
            <p className="text-gray-600"><strong>Method:</strong> {order.paymentMethod}</p>
            <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${order.isPaid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {order.isPaid ? <CheckCircle2 size={18}/> : <CreditCard size={18}/>}
              <span className="text-sm font-bold">{order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleString()}` : 'Pending Payment'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg h-fit">
          <h2 className="text-xl font-black mb-4">Order Summary</h2>
          <div className="space-y-3 text-gray-600 border-b pb-4">
            <div className="flex justify-between"><span>Items</span><span>₹{order.itemsPrice}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>₹{order.shippingPrice}</span></div>
            <div className="flex justify-between text-xl font-black text-gray-900 pt-3">
              <span>Total</span><span>₹{order.totalPrice}</span>
            </div>
          </div>
          {!order.isPaid && (
            <button onClick={paymentHandler} disabled={loadingPay} className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-black hover:bg-blue-700 transition">
              {loadingPay ? 'INITIALIZING...' : 'PAY NOW (RAZORPAY)'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;