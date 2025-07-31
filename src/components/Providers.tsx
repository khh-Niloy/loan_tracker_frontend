'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { loadAuthFromStorage } from '@/lib/redux/slices/authSlice';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Load auth state from localStorage on app start
    dispatch(loadAuthFromStorage());
  }, [dispatch]);

  return <>{children}</>;
}