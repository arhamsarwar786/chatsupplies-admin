import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/src/lib/constant";

export const packages = createApi({
  reducerPath: "packages",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/packages/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPackages: builder.query<any, void>({
      query: () => '',
    }),
    createPackages: builder.mutation<any, any>({
      query: (body) => ({
        url: "create",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { 
  useGetPackagesQuery,
  useCreatePackagesMutation
} = packages;
