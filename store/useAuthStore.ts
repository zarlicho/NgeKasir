import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  isAuthenticated: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  changePin: (newPin: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: async (pin: string) => {
        try {
          // Verify pin against the database settings
          const res = await fetch('/api/settings');
          if (!res.ok) return false;
          
          const data = await res.json();
          const correctPin = data.pin || process.env.NEXT_PUBLIC_LOGIN_PIN || "123456";
          
          if (pin === correctPin) {
            set({ isAuthenticated: true });
            return true;
          }
          return false;
        } catch (error) {
          console.error("Login verification failed", error);
          return false;
        }
      },
      logout: () => set({ isAuthenticated: false }),
      changePin: async (newPin: string) => {
        try {
          // Save new pin to database
          await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: newPin }),
          });
        } catch (error) {
          console.error("Failed to change PIN", error);
        }
      },
    }),
    {
      name: 'auth-storage', // persistance in local storage
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }), // Only persist auth status
    }
  )
);
