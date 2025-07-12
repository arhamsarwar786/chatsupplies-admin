import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/src/lib/constant";
import { use } from "react";

export const client = createApi({
  reducerPath: "client",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getClients: builder.query({
      query: () => `clients`,
    }),
 getDashboardSummary: builder.query({
      query: () => `clients/dashboard/summary`,
    }),
    createClient: builder.mutation({
      query: (product) => ({
        url: "clients",
        method: "POST",
        body: product,
      }),
    }),
  }),
});

export const { 
  useGetClientsQuery,
  useGetDashboardSummaryQuery,
  useCreateClientMutation,
} = client;
