import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('ai_interviewer_token');
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch {
          localStorage.removeItem('ai_interviewer_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    setAuthError(null);
    try {
      const data = await authApi.login(credentials);
      setUser(data.user);
      return data;
    } catch (err) {
      const message = err.message || 'Login failed. Please check credentials.';
      setAuthError(message);
      throw err;
    }
  };

  const register = async (userData) => {
    setAuthError(null);
    try {
      const data = await authApi.register(userData);
      setUser(data.user);
      return data;
    } catch (err) {
      const message = err.message || 'Registration failed.';
      setAuthError(message);
      throw err;
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const updateUserProfileState = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUserProfileState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
