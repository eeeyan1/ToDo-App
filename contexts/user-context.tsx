"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "@/types/user";

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  updateProfile: (updates: Partial<Pick<User, "username" | "avatarUrl">>) => void;
}

const STORAGE_KEY = "todo-app:user";

const defaultUser: User = {
  id: "demo-user-1",
  username: "Demo User",
  email: "demo@example.com",
  avatarUrl: null,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

function loadUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultUser; // Auto-login with demo user
    return JSON.parse(raw) as User;
  } catch {
    return defaultUser;
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedUser = loadUser();
    setUser(loadedUser);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulated login - in production, this would call an API
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (email && password) {
      setUser({
        id: crypto.randomUUID(),
        username: email.split("@")[0],
        email,
        avatarUrl: null,
      });
      return true;
    }
    return false;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const updateProfile = useCallback((updates: Partial<Pick<User, "username" | "avatarUrl">>) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
