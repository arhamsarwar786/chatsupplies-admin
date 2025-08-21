import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/src/lib/constant";
import { use } from "react";

export const client = createApi({
  reducerPath: "client",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/clients/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getClients: builder.query<any, { page: number }>({
      query: ({ page}) => `?page=${page}`,
    }),
 getDashboardSummary: builder.query({
      query: () => `dashboard/summary`,
    }),
    createClient: builder.mutation({
      query: (product) => ({
        url: "",
        method: "POST",
        body: product,
      }),
    }),
        deleteClientById: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
    }),
        getClientById: builder.query<any, number>({
  query: (id) => `${id}`,
}),
      updateClientById: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => {
        return {
          url: `${id}`,
          method: "PUT",
          body,
        };
      },
    }),
  }),
});

export const { 
  useGetClientsQuery,
  useGetDashboardSummaryQuery,
  useCreateClientMutation,
  useGetClientByIdQuery,
  useDeleteClientByIdMutation,
  useUpdateClientByIdMutation
} = client;
