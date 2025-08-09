import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/src/lib/constant";

export const chatbot = createApi({
  reducerPath: "chatbot",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/chatbots/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      const apikey = localStorage.getItem("apikey");
      console.log("API Key:", apikey);
      if (apikey) {
        headers.set("api-key", apikey);
      }
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
       headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getChatbot: builder.query<any, { page: number }>({
      query: ({ page}) => `?page=${page}`,
    }),
    createChatbot: builder.mutation<any, any>({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
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
