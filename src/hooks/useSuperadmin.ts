import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/src/lib/constant";

export const superadmin = createApi({
  reducerPath: "superadmin",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/superadmin/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // getPackages: builder.query<any, void>({
    //   query: () => "",
    // }),
    // createPackages: builder.mutation<any, any>({
    //   query: (body) => ({
    //     url: "create",
    //     method: "POST",
    //     body,
    //   }),
    // }),
    deleteClientById: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
    }),
    // updatePackagesById: builder.mutation({
    //   query: ({ id, data }) => ({
    //     url: `${id}`,
    //     method: "PUT",
    //     body: data,
    //   }),
    // }),
  }),
});

export const {
//   useGetPackagesQuery,
//   useCreatePackagesMutation,
  useDeleteClientByIdMutation,
//   useUpdatePackagesByIdMutation
} = superadmin;
