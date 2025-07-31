'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useAppDispatch } from '@/lib/redux/hooks';
import { loadAuthFromStorage } from '@/lib/redux/slices/authSlice';
import HomePage from '@/components/HomePage';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Load auth state before checking
    dispatch(loadAuthFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated === false) {
      // Only redirect if explicitly not authenticated
      router.push('/auth/register');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <HomePage />;
}