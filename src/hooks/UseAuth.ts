import { BASE_URL } from "@/src/lib/constant";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const auth = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/auth/`,
    prepareHeaders: (headers, { endpoint }) => {
      // Only skip token for login, allow for signup
      if (endpoint !== "login") {
        const token = localStorage.getItem("token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (loginData) => ({
        url: "login",
        method: "POST",
         headers: {
          "Content-Type": "application/json",
        },
        body: loginData,
      }),
    }),
    signup: builder.mutation({
      query: (signupData) => ({
        url: "register",
        method: "POST",
         headers: {
          "Content-Type": "application/json",
        },
        body: signupData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
} = auth;