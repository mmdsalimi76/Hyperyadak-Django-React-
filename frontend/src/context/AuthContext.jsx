// src/context/AuthContext.jsx
import React, { createContext, useContext, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  // 1. Query: fetch profile (only runs if token exists)
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await authAPI.getProfile();
      return response.data;
    },
    // Only enable if we have a token
    enabled: !!localStorage.getItem("access_token"),
    staleTime: 5 * 60 * 1000, // 5 minutes – profile rarely changes
    retry: 1,
    // Don't refetch on window focus by default (optional)
    refetchOnWindowFocus: false,
  });

  // 2. Mutation: login
  const loginMutation = useMutation({
    mutationFn: async ({ phone_number, password }) => {
      const response = await authAPI.login(phone_number, password);
      const { access, refresh } = response.data;
      if (access) {
        localStorage.setItem("access_token", access);
        if (refresh) localStorage.setItem("refresh_token", refresh);
      }
      return response.data;
    },
    onSuccess: () => {
      // After successful login, refetch the profile
      refetchProfile();
    },
    onError: (err) => {
      console.error("Login error:", err);
    },
  });

  // 3. Mutation: logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      authAPI.logout(); // optional: call backend logout endpoint
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
    onSuccess: () => {
      // Clear all cached queries (especially profile)
      queryClient.clear();
    },
  });

  // Derived state
  const isAuthenticated = !!profile;

  // Public methods
  const login = useCallback(
    async (phone_number, password) => {
      try {
        await loginMutation.mutateAsync({ phone_number, password });
        return true;
      } catch {
        return false;
      }
    },
    [loginMutation],
  );

  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const refreshProfile = useCallback(() => {
    return refetchProfile();
  }, [refetchProfile]);

  const updateProfile = useCallback(
    (updatedProfile) => {
      // Optimistically update the cache
      queryClient.setQueryData(["profile"], updatedProfile);
    },
    [queryClient],
  );

  // Combine loading/error states
  const loading = profileLoading || loginMutation.isPending;
  const error = profileError?.message || loginMutation.error?.message || null;

  const value = useMemo(
    () => ({
      profile,
      loading,
      error,
      isAuthenticated,
      login,
      logout,
      updateProfile,
      refreshProfile,
    }),
    [
      profile,
      loading,
      error,
      isAuthenticated,
      login,
      logout,
      updateProfile,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
