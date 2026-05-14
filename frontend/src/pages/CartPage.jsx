import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Get the cart items from the Redux "Brain"
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Function to change quantity
  const updateCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  // Function to remove item (We will add the actual remove slice later, 
  // for now we just show the layout)
  const removeFromCartHandler = (id) => {
  dispatch(removeFromCart(id));
};

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-blue-50 p-8 rounded-2xl text-center">
          <ShoppingBag className="mx-auto text-blue-500 mb-4" size={48} />
          <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
          <Link to="/" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Side: Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                
                <div className="flex-1">
                  <Link to={`/product/${item._id}`} className="text-lg font-bold text-gray-800 hover:text-blue-600">
                    {item.name}
                  </Link>
                  <p className="text-blue-600 font-bold mt-1">₹{item.price}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                  <select
                    value={item.qty}
                    onChange={(e) => updateCartHandler(item, Number(e.target.value))}
                    className="bg-transparent font-bold text-gray-700 focus:outline-none"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={() => removeFromCartHandler(item._id)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Right Side: Order Summary */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-fit">
            <h2 className="text-xl font-black mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                <span>₹{cart.itemsPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>₹{cart.shippingPrice}</span>
              </div>
              <hr />
                           
              <div className="flex justify-between text-2xl font-black text-gray-900">
                <span>Total</span>
                <span>₹{cart.totalPrice}</span>
              </div>
            </div>
            <button
              onClick={checkoutHandler}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-blue-600 transition shadow-lg shadow-gray-200"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;