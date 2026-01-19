'use client';

import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const { isAuthenticated, setUser, clearIsAuthenticated } = useAuthStore();

  const privateRoutes = ['/profile'];

  useEffect(() => {
    const initAuth = async () => {
      try {
        const isSessionValid = await checkSession();

        if (isSessionValid) {
          const userData = await getMe();
          setUser({
            email: userData.email,
            username: userData.username,
            avatar: userData.avatar,
          });
        } else {
          clearIsAuthenticated();
          if (privateRoutes.some(route => pathname.startsWith(route))) {
            router.push('/sign-in');
          }
        }
      } catch (error) {
        clearIsAuthenticated();
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [pathname]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}
