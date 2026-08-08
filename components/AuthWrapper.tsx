'use client';

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginScreen } from "./auth/LoginScreen";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}
