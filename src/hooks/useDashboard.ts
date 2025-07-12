import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/src/lib/constant";

export const dashboard = createApi({
  reducerPath: "dashboard",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/analytics/dashboard/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: () => "summary",
    }),

    platform: builder.query({
      query: () => "platform-usage",
    }),
  }),
});

export const { 
  useGetSummaryQuery, 
  usePlatformQuery
} = dashboard;
