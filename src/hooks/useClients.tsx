import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/src/lib/constant";

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
  }),
});

export const { 
  useGetClientsQuery,
  useGetDashboardSummaryQuery
} = client;
