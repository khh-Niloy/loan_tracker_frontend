'use client';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = () => {
  const { isAuthenticated, user, accessToken } = useAppSelector((state) => state.auth);
  return { isAuthenticated, user, accessToken };
};