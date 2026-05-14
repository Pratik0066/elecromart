import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { useCreateOrderMutation } from '../slices/ordersApiSlice'; // Fixed import path
import { Package, Truck, CreditCard, ChevronRight, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { clearCartItems } from '../slices/cartSlice'; // Added to clear cart after success

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice || 0, // Ensure taxPrice is sent
        totalPrice: cart.totalPrice,
      }).unwrap();

      dispatch(clearCartItems()); // Clear the cart from Redux and LocalStorage
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <CheckoutSteps step1 step2 step3 step4 />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10">
        {/* Left Side: Summary Details */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2">
              <Truck size={20} className="text-blue-600" /> SHIPPING ADDRESS
            </h2>
            <p className="text-gray-600 text-sm">
              <strong className="text-gray-900">Deliver to: </strong>
              {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-blue-600" /> PAYMENT METHOD
            </h2>
            <p className="text-gray-600 text-sm uppercase font-bold">
              {cart.paymentMethod}
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2">
              <Package size={20} className="text-blue-600" /> ORDER ITEMS
            </h2>
            {cart.cartItems.length === 0 ? (
              <p className="text-gray-500 italic">Your cart is empty</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {cart.cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                    <Link to={`/product/${item._id}`} className="flex-1 font-bold text-gray-800 hover:text-blue-600 transition truncate">
                      {item.name}
                    </Link>
                    <div className="text-gray-900 font-bold text-sm">
                      {item.qty} x ₹{item.price} = ₹{(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Side: Price Summary */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-fit sticky top-24">
          <h2 className="text-xl font-black mb-6 uppercase tracking-tight">Price Details</h2>
          <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Items Total</span>
              <span>₹{cart.itemsPrice}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Shipping Charges</span>
              <span className={cart.shippingPrice === "0.00" ? "text-green-600" : ""}>
                {cart.shippingPrice === "0.00" ? 'FREE' : `₹${cart.shippingPrice}`}
              </span>
            </div>
            <div className="flex justify-between text-2xl font-black text-gray-900 pt-2">
              <span>Grand Total</span>
              <span>₹{cart.totalPrice}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={14} />
              {error?.data?.message || error.error}
            </div>
          )}

          <button
            type="button"
            disabled={cart.cartItems.length === 0 || isLoading}
            onClick={placeOrderHandler}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-blue-600 transition shadow-lg disabled:bg-gray-300 flex items-center justify-center gap-2"
          >
            {isLoading ? 'CREATING ORDER...' : (
              <>CONFIRM ORDER <ChevronRight size={18} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;