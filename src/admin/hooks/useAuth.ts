import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../lib/api-client.js';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const checkSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiFetch<{ success: boolean; user: { id: string; email: string } }>(
        '/api/admin/session'
      );
      if (data.success && data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiFetch<{ success: boolean }>('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data.success) {
        setIsAuthenticated(true);
        await checkSession(); // Fetch user profile details
        navigate('/admin/leads');
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiFetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      navigate('/admin/login');
    }
  };

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    logout,
    checkSession,
  };
}
