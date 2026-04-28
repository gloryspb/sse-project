import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import * as authApi from '@/api/auth';
import { ApiError } from '@/api/client';
import type { AuthFormValues, User } from '@/types/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) {
        toast.error(error instanceof Error ? error.message : 'Failed to load current user');
      }
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  const register = useCallback(async (values: AuthFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await authApi.register(values);
      setUser(response.user);
      toast.success(response.message);
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const login = useCallback(async (values: AuthFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await authApi.login(values);
      setUser(response.user);
      toast.success(response.message);
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const response = await authApi.logout();
      setUser(null);
      toast.success(response.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Logout failed');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    user,
    isLoadingUser,
    isSubmitting,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
    refreshUser: loadUser,
  };
}
