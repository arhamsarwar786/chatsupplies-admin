import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { authSlice } from '@/src/slice/authSlice';
import { auth } from '@/src/hooks/UseAuth';
import { dashboard } from '../hooks/useDashboard';


export const makeStore = () => {
  return configureStore({
   reducer: {
  authSlice: authSlice.reducer,
  [auth.reducerPath]: auth.reducer, // <-- required
[dashboard.reducerPath]: dashboard.reducer, 

},
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(
    auth.middleware,
     dashboard.middleware
    ),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

setupListeners(makeStore().dispatch);

export default makeStore;
