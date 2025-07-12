import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/src/lib/constant";

export const chatbot = createApi({
  reducerPath: "chatbot",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getChatbot: builder.query({
      query: () => `chatbots`,
    }),
  }),
});

export const { 
  useGetChatbotQuery
} = chatbot;
