import { decodeToken } from '@/src/lib/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define User and UserProfile interfaces
interface User {
  id: string;
  email: string;
  role?: string; 
  username?: string; // Optional username field
}

interface UserProfile {
  // Define properties for user profile as needed
  name?: string;
  imageUrl?: string;
  email?: string;
  // Add other relevant fields
}

// Define the structure of the Auth state
interface AuthState {
  token: string | null;
  user: User | null;
  role?: string; // Optional role field
  username?: string; // Optional username field
  isLoggedIn: boolean;
  userProfile: UserProfile | null; // Initialize user profile state
  api_key: string | null; // Initialize API key state
}

// Function to get token from local storage
const getTokenFromLocalStorage = (): AuthState => {
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    const apiKey = localStorage.getItem('api_key');
    if (token) {
      const decoded = decodeToken(token, apiKey || '');
      if (decoded) {
        return {
          token,
          api_key: apiKey || null, // Initialize API key state
          user: { id: decoded.id, email: decoded.email, role: decoded.role, username: decoded.username },
             role: decoded.role ?? savedRole ?? undefined,
          isLoggedIn: true,
          userProfile: null, // Initialize user profile state
        };
      }
    }
  }
  return { token: null, user: null,  role: undefined, isLoggedIn: false, userProfile: null, api_key: null }; // Initialize state with null values
};

// Initial state based on local storage
const initialState: AuthState = getTokenFromLocalStorage();

// Create the auth slice
export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<{ token: string, api_key: string, role?: string, username?: string }>) => {
      state.token = action.payload.token;
      state.username = action.payload.username; // <-- This must match your dispatch
      state.api_key = action.payload.api_key; // <-- This must match your dispatch  
      state.role = action.payload.role; // <-- This must match your dispatch
      localStorage.setItem('api_key', action.payload.api_key); // ✅ persist API key
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('username', action.payload.username || ''); // ✅ Persist username separately
        if (action.payload.role) {
    localStorage.setItem('role', action.payload.role); // ✅ Persist role separately
  }
      const decoded = decodeToken(action.payload.token, action.payload.api_key);

      if (decoded) {
        state.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role, // Store the role from the decoded token
          username: decoded.username, // Store the username from the decoded token
        };
        state.isLoggedIn = true;
      } else {
        state.isLoggedIn = false;
        state.user = null;
      }
    },
    logOut: (state) => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
      state.userProfile = null; // Reset profile data on logout
      localStorage.removeItem('token');
      localStorage.removeItem('api_key');
      localStorage.removeItem('username');
    },
    setUserProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.userProfile = action.payload; // Store the user profile data in state
    },
  },
});

// Export actions and reducer
export const { setLogin, logOut, setUserProfile } = authSlice.actions;
export default authSlice.reducer;
