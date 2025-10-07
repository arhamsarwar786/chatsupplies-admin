import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/src/lib/constant";

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
    getClients: builder.query<
      any,
      { 
        page: number; 
        sort_desc?: boolean; 
        only_active?: boolean;
        is_beta?: boolean; // ✅ ADDED is_beta parameter
      }
    >({
      query: ({ page, sort_desc = true, only_active = false, is_beta = false }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          sort_desc: sort_desc.toString(),
          only_active: only_active.toString(),
        });
        
        // ✅ ADD is_beta parameter to the query
        if (is_beta) {
          params.append('is_beta', 'true');
        }
        
        return `/?${params.toString()}`;
      },
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
    searchClients: builder.query<any, { query: string }>({
      query: ({ query }) => ({
        url: `search?query=${encodeURIComponent(query)}`,
        method: "GET",
      }),
    }),
    resendWelcomeEmail: builder.mutation<any, { id: number }>({
      query: ({ id }) => ({
        url: `${id}/resend-welcome-email`,
        method: "POST",
      }),
    }),
  }),
});

export const { 
  useGetClientsQuery,
  useGetDashboardSummaryQuery,
  useCreateClientMutation,
  useGetClientByIdQuery,
  useDeleteClientByIdMutation,
  useUpdateClientByIdMutation,
  useSearchClientsQuery,
  useResendWelcomeEmailMutation
} = client;