"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/**
 * Protects pages by ensuring the user is authenticated and has an admin role.
 * If not, redirects to the login page. While loading the auth state, nothing
 * is rendered. When not authenticated, a redirect will be performed.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.role !== 'admin') {
        router.push('/login');
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return null;
  }
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }
  return <>{children}</>;
}