import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/src/lib/constant";

export const chat = createApi({
  reducerPath: "chat",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/chat/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllChats: builder.query<any, { chatbot_id: number; limit?: number; offset?: number }>({
      query: ({ chatbot_id, limit = 50, offset = 0 }) =>
        `all_chats?chatbot_id=${chatbot_id}&limit=${limit}&offset=${offset}`,
    }),
  }),
});

export const { useGetAllChatsQuery } = chat;
