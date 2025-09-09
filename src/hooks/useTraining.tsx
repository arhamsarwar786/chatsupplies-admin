import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/src/lib/constant";

export const training = createApi({
  reducerPath: "training",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/training/`,   // This already covers '/training'
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    uploadRequirement: builder.mutation({
      query: (formData) => ({
        url: 'upload',           // Just 'upload' - baseUrl already includes '/training/'
        method: 'POST',
        body: formData,          // FormData directly
        // No headers needed here – prepareHeaders handles Authorization
      }),
    }),
         uploadUrl: builder.mutation({
      query: ({ chatbot_id, url }) => {
        const body = new URLSearchParams();
        body.append("chatbot_id", chatbot_id.toString());
        body.append("url", url);

        return {
          url: "crawl_build_index",                            
          method: "POST",
          body,                                      
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
      },
    }),
getUploadedFiles: builder.query({
  query: (chatbot_id) => ({
    url: `chatbot_files`,  // Include the /training/ part
    params: { chatbot_id },         // ?chatbot_id=3
  }),
}),
  deleteUploadedFileById: builder.mutation({
      query: (id) => ({
        url: `chatbot_files/${id}`,
        method: "DELETE",
      }),
    }),

  }),
});

export const {
  useUploadRequirementMutation,
  useUploadUrlMutation,
  useGetUploadedFilesQuery,
    useDeleteUploadedFileByIdMutation,
} = training;
