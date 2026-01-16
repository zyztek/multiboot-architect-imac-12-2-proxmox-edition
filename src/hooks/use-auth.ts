import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthUser, ApiResponse } from '@shared/types';
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const login = async (username: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      const json = await res.json() as ApiResponse<AuthUser>;
      if (json.success && json.data) {
        localStorage.setItem('auth_user', JSON.stringify(json.data));
        setUser(json.data);
      }
    } catch (e) {
      console.error("Auth Fortress Failure", e);
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
    window.location.reload();
  };
  return { user, login, logout, isLoading, isAuthenticated: !!user };
}