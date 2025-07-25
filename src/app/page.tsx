"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user?.role === 'admin') {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [loading, isAuthenticated, user, router]);

  return null;
}