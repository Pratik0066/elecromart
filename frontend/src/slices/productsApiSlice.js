import { PRODUCTS_URL, UPLOAD_URL } from '../constants.js';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, pageNumber, category, brand, minPrice, maxPrice, sort } = {}) => ({
        url: PRODUCTS_URL,
        params: { keyword, pageNumber, category, brand, minPrice, maxPrice, sort },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({ url: `${PRODUCTS_URL}/${productId}` }),
      keepUnusedDataFor: 5,
      providesTags: (result, error, productId) => [{ type: 'Products', id: productId }],
    }),
    // Advanced AI Recommendations (Cross-category)
    getRecommendations: builder.query({
      query: (productId) => ({ url: `${PRODUCTS_URL}/${productId}/recommendations` }),
      keepUnusedDataFor: 5,
    }),
    // Semantic Chatbot Logic
    getChatResponse: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/chat`,
        method: 'POST',
        body: data,
      }),
    }),
    createProduct: builder.mutation({
      query: () => ({ url: PRODUCTS_URL, method: 'POST' }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({ url: `${PRODUCTS_URL}/${data.productId}`, method: 'PUT', body: data }),
      invalidatesTags: ['Products'],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({ url: `${PRODUCTS_URL}/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Products'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({ url: UPLOAD_URL, method: 'POST', body: data }),
    }),
    createReview: builder.mutation({
      query: (data) => ({ url: `${PRODUCTS_URL}/${data.productId}/reviews`, method: 'POST', body: data }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const { 
  useGetProductsQuery, 
  useGetProductDetailsQuery,
  useGetRecommendationsQuery,
  useGetChatResponseMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useCreateReviewMutation
} = productsApiSlice;