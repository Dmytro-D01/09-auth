"use client";

import { useEffect } from "react";
import useAuthStore from "@/lib/store/authStore";
import {
  checkSession,
  getMe,
} from "@/lib/api/clientApi";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  const {
    setUser,
    clearIsAuthenticated,
  } = useAuthStore();

  useEffect(() => {
    async function initAuth() {
      try {
        const session =
          await checkSession();
        if (session) {
          const user = await getMe();
          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      }
    }

    initAuth();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}
