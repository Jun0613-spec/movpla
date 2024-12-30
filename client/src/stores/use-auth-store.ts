import { create } from "zustand";
import { persist } from "zustand/middleware";

import { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      login: (accessToken, user) => {
        set({
          accessToken,
          user,
          isAuthenticated: true
        });
      },
      logout: () => {
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false
        });
      },
      setUser: (user) => {
        set({
          user,

          isAuthenticated: !!user
        });
      },
      setAccessToken: (token) => {
        set({ accessToken: token });
      }
    }),
    {
      name: "auth-storage"
    }
  )
);
