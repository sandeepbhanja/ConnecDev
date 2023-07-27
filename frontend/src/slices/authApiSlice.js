import {AUTH_URL} from '../constant.js';
import {apiSlice} from './apiSlice.js';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builders) => ({
    login: builders.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/sign-in`,
        method: "POST",
        body: data,
      }),
    }),
    register: builders.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builders.mutation({
      query:()=>({
        url:`${AUTH_URL}/logout`,
        method: "POST",
      })
    }),
  }),
});

export const {useLoginMutation,useRegisterMutation,useLogoutMutation} = authApiSlice;