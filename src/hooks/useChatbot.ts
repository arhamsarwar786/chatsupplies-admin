import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/src/lib/constant";

export const chatbot = createApi({
  reducerPath: "chatbot",
 baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/chatbots/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      const apikey = localStorage.getItem("apikey");
      if (apikey) headers.set("api-key", apikey);
      if (token) headers.set("Authorization", `Bearer ${token}`);
      // Remove Content-Type header - let fetchBaseQuery set it automatically
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getChatbot: builder.query<any, { page: number }>({
      query: ({ page}) => `?page=${page}`,
    }),
   createChatbot: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "",
        method: "POST",
        body: formData,
        // No Content-Type header - let the browser set it with the proper boundary
      }),
    }),
    getChatbotById: builder.query<any, number>({
  query: (chatbotId) => `${chatbotId}`,
}),
    updateChatbot: builder.mutation<any, { chatbotId: number; body: any }>({
      query: ({ chatbotId, body }) => {
        return {
          url: `${chatbotId}`,
          method: "PUT",
          body,
        };
      },
    }),
  }),
});

export const { 
  useGetChatbotQuery, 
  useCreateChatbotMutation,
  useGetChatbotByIdQuery,
  useUpdateChatbotMutation
} = chatbot;
