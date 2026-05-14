import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'Razorpay' }; // Default to Razorpay

const updateCart = (state) => {
  // Calculate Items Price
  const itemsPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  state.itemsPrice = itemsPrice.toFixed(2);

  // Free shipping over ₹5000
  state.shippingPrice = (itemsPrice > 5000 ? 0 : 100).toFixed(2);

  // Total calculation
  state.totalPrice = (Number(state.itemsPrice) + Number(state.shippingPrice)).toFixed(2);

  localStorage.setItem('cart', JSON.stringify(state));
  return state;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);
      if (existItem) {
        state.cartItems = state.cartItems.map((x) => (x._id === existItem._id ? item : x));
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      return updateCart(state);
    }
  },
});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems } = cartSlice.actions;
export default cartSlice.reducer;