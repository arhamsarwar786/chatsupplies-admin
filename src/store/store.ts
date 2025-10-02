import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { authSlice } from '@/src/slice/authSlice';
import { auth } from '@/src/hooks/UseAuth';
import { dashboard } from '../hooks/useDashboard';
import { client } from '../hooks/useClients';
import { chatbot } from '../hooks/useChatbot';
import { training } from '../hooks/useTraining';
import { chat } from '../hooks/useChat';
import { packages } from '../hooks/usePackages';
import { superadmin } from '../hooks/useSuperadmin';

export const makeStore = () => {
  return configureStore({
    reducer: {
      authSlice: authSlice.reducer,
      [auth.reducerPath]: auth.reducer,
      [dashboard.reducerPath]: dashboard.reducer,
      [client.reducerPath]: client.reducer,
      [chatbot.reducerPath]: chatbot.reducer,
      [training.reducerPath]: training.reducer,
      [chat.reducerPath]: chat.reducer,
      [superadmin.reducerPath]: superadmin.reducer,
      [packages.reducerPath]: packages.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        auth.middleware,
        dashboard.middleware,
        client.middleware,
        chatbot.middleware,
        chat.middleware,
        training.middleware,
        superadmin.middleware,
        packages.middleware,
      ),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

setupListeners(makeStore().dispatch);

export default makeStore;