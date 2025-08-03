import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { decodeJWT } from '@/lib/jwt';

interface AuthState {
  accessToken: string | null;
  user: {
    name: string;
    phoneNumber: string;
  } | null;
  isAuthenticated: boolean;
}

const getInitialState = (): AuthState => {
  let accessToken = null;
  let user = null;
  let isAuthenticated = false;

  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('token');
    
    if (!accessToken) {
      // Try to load from cookie if not in localStorage
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'token') {
          accessToken = value;
          break;
        }
      }
    }

    if (accessToken) {
      const decodedUser = decodeJWT(accessToken);
      if (decodedUser) {
        user = decodedUser;
        isAuthenticated = true;
      }
    }
  }

  return {
    accessToken,
    user,
    isAuthenticated,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: { name: string; phoneNumber: string }; token: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.token;
      state.isAuthenticated = true;
      
      // Store token in cookie and localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        document.cookie = `token=${action.payload.token}; path=/; max-age=2592000`; // 30 days
      }
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      
      // Clear cookies and localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        document.cookie = `token=; path=/; max-age=0`;
      }
    },
    loadAuthFromStorage: (state) => {
      // Check both localStorage and cookies for token
      let token = null;
      
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
        if (!token) {
          // Try to load from cookie if not in localStorage
          const cookies = document.cookie.split(';');
          for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'token') {
              token = value;
              break;
            }
          }
        }
      }

      if (token) {
        const decodedUser = decodeJWT(token);
        if (decodedUser) {
          state.accessToken = token;
          state.user = decodedUser;
          state.isAuthenticated = true;
        } else {
          state.accessToken = null;
          state.user = null;
          state.isAuthenticated = false;
        }
      } else {
        state.accessToken = null;
        state.user = null;
        state.isAuthenticated = false;
      }
    },
  },
});

export const { setAuth, clearAuth, loadAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;