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
  tagTypes: ["Chatbot"],
  endpoints: (builder) => ({
    getChatbot: builder.query<any, { page: number; sort_desc?: boolean }>({
      query: ({ page, sort_desc }) => {
        const params = new URLSearchParams();
        params.set("page", String(page));

        if (sort_desc !== undefined) {
          params.set("sort_desc", String(sort_desc));
        }

        return `?${params.toString()}`;
      },
      providesTags: ["Chatbot"],
    }),
    createChatbot: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Chatbot"],
    }),
    getChatbotById: builder.query<any, number>({
      query: (chatbotId) => `${chatbotId}`,
      providesTags: ["Chatbot"],
    }),
    updateChatbot: builder.mutation<any, { chatbotId: number; body: any }>({
      query: ({ chatbotId, body }) => ({
        url: `${chatbotId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Chatbot"],
    }),
    // FIX: Removing invalidatesTags prevents the immediate re-fetch that reverts the optimistic update.
    deleteChatbot: builder.mutation<any, number>({
      query: (chatbotId) => ({
        url: `${chatbotId}`,
        method: "DELETE",
      }),
      // REMOVED: invalidatesTags: ["Chatbot"], 
      
      async onQueryStarted(chatbotId, { dispatch, queryFulfilled, getState }) {
        // --- START OPTIMISTIC UPDATE ---
        
        // This is a complex way to get the current list's query args. 
        // A simpler approach is to always use the default (page: 1, sort_desc: true) if the list doesn't change pages often, but we'll stick to the existing logic for now.
        const listQueryArg = { 
            page: (getState() as any).chatbot.queries[`getChatbot({"page":1,"sort_desc":true})`]?.originalArgs?.page ?? 1,
            sort_desc: true 
        };

        // If the query key for the current page is known, use that. 
        // A more reliable way is to store the actual query arg in state or pass it to the mutation, but for this simple fix, we'll try to determine it.
        
        // A more defensive approach to find the query key:
        let foundQueryKey = { page: 1, sort_desc: true };
        const queries = (getState() as any).chatbot.queries || {};
        const queryKeys = Object.keys(queries).filter(key => key.startsWith('getChatbot({"page":'));
        
        // Find the key for the current page (assuming the component is on the correct page)
        const activeQueryKey = queryKeys.find(key => {
            try {
                const args = JSON.parse(key.substring(11, key.length - 1));
                return args.page === listQueryArg.page;
            } catch {
                return false;
            }
        }) || queryKeys[0]; // Fallback to the first available key
        
        if (activeQueryKey) {
             try {
                foundQueryKey = JSON.parse(activeQueryKey.substring(11, activeQueryKey.length - 1));
            } catch {}
        }


        const patchResult = dispatch(
          chatbot.util.updateQueryData("getChatbot", foundQueryKey, (draft) => {
            // Find and remove the deleted chatbot from the list
            if (draft?.chatbots) {
              draft.chatbots = draft.chatbots.filter(
                (bot: any) => bot.id !== chatbotId
              );
              // Decrement total count 
              if (draft.total_count) {
                draft.total_count = draft.total_count - 1;
              }
            }
          })
        );

        try {
          await queryFulfilled;
          // The item is now deleted and the optimistic update persists because we 
          // removed invalidatesTags. The manual cache update is the "success" state.
        } catch {
          // If the API call fails, revert the optimistic change
          patchResult.undo();
        }
        // --- END OPTIMISTIC UPDATE ---
      },
    }),
  }),
});

export const { 
  useGetChatbotQuery, 
  useCreateChatbotMutation,
  useGetChatbotByIdQuery,
  useUpdateChatbotMutation,
  useDeleteChatbotMutation,
} = chatbot;