import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = 'https://localhost:44328/api/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on init
  useEffect(() => {
    const savedUser = localStorage.getItem('wishify_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Login failed');
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('wishify_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login Error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (firstName, lastName, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('wishify_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error('Registration Error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wishify_user');
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    try {
      const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        let errorMsg = 'Password change failed';
        try {
          const data = await response.json();
          errorMsg = data.message || errorMsg;
        } catch (_) {}
        return { success: false, error: errorMsg };
      }

      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
