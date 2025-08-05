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
      query: () => "",
    }),
    createPackages: builder.mutation<any, any>({
      query: (body) => ({
        url: "create",
        method: "POST",
        body,
      }),
    }),
    deletePackagesById: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
    }),
    updatePackagesById: builder.mutation({
      query: ({ id, data }) => ({
        url: `${id}`,
        method: "PUT",
        body: data,
      }),
    }),
   purchasePackage: builder.mutation<
  {
    clientSecret: string;
    payment: {
      id: number;
      user_id: number;
      package_id: number;
      amount: number;
      currency: string;
      stripe_payment_intent: string;
      status: string;
      created_at: string;
    };
  },
  { packageId: number }
>({
  query: ({ packageId }) => ({
    url: `purchase?package_id=${packageId}`,
    method: "POST",
  }),
}),

  }),
});

export const {
  useGetPackagesQuery,
  useCreatePackagesMutation,
  useDeletePackagesByIdMutation,
  useUpdatePackagesByIdMutation,
  usePurchasePackageMutation,
} = packages;
