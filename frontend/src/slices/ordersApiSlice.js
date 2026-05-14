import { ORDERS_URL, RAZORPAY_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({ url: ORDERS_URL, method: 'POST', body: { ...order } }),
    }),
    getOrderDetails: builder.query({
      query: (id) => ({ url: `${ORDERS_URL}/${id}` }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/verify`,
        method: 'POST',
        body: details,
      }),
    }),
    getRazorpayKey: builder.query({
      query: () => ({ url: RAZORPAY_URL }),
    }),
    getMyOrders: builder.query({
      query: () => ({ url: `${ORDERS_URL}/mine` }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({ url: ORDERS_URL }),
      keepUnusedDataFor: 5,
      providesTags: ['Orders'],
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({ url: `${ORDERS_URL}/${orderId}/deliver`, method: 'PUT' }),
      invalidatesTags: ['Orders'],
    }),
    getAdminStats: builder.query({
      query: () => ({ url: `${ORDERS_URL}/stats` }),
      keepUnusedDataFor: 5,
      providesTags: ['Orders'],
    }),
  }),
});

export const { 
  useCreateOrderMutation, 
  useGetOrderDetailsQuery, 
  usePayOrderMutation, 
  useGetRazorpayKeyQuery, 
  useGetMyOrdersQuery, 
  useGetOrdersQuery, 
  useDeliverOrderMutation,
  useGetAdminStatsQuery,
} = ordersApiSlice;