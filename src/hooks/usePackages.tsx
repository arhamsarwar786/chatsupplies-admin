import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/src/lib/constant";

interface Package {
  id: number;
  name: string;
  description: string | string[];
  price: number;
  currency: string;
  duration_days: number;
  is_recurring: boolean;
  billing_cycle?: string;
  is_active?: boolean;
  isPopular?: boolean;
  created_at?: string;
}

// ✅ Update interface to match actual API response
interface PackagesResponse {
  monthly: Package[];
  yearly: Package[];
}

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
    getPackages: builder.query<Package[], void>({
      query: () => "",
      // ✅ Fix transformResponse to handle actual API structure
      transformResponse: (response: PackagesResponse): Package[] => {
        console.log("Raw API response:", response);
        
        // Combine monthly and yearly packages into a single array
        const allPackages = [
          ...(response.monthly || []),
          ...(response.yearly || [])
        ];
        
        console.log("Combined packages:", allPackages);
        
        // Transform description and add defaults
        const transformedPackages = allPackages.map((pkg) => ({
          ...pkg,
          description: typeof pkg.description === 'string' 
            ? pkg.description 
            : Array.isArray(pkg.description)
            ? pkg.description
            : [],
          billing_cycle: pkg.billing_cycle || 'monthly',
          isPopular: pkg.isPopular || false
        }));
        
        console.log("Final transformed packages:", transformedPackages);
        return transformedPackages;
      },
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

// ✅ Fix: Match export names with endpoint names
export const {
  useGetPackagesQuery,
  useCreatePackagesMutation,
  useDeletePackagesByIdMutation,
  useUpdatePackagesByIdMutation, // ← Changed from useUpdatePackagesMutation
  usePurchasePackageMutation,
} = packages;