import { createContext, useContext, useState, useEffect } from 'react';
import { AUTH_URL } from '../api/config';

const AuthContext = createContext();

const AUTH_API = AUTH_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Decode JWT to extract nameid if it exists
  const getUserIdFromToken = (token) => {
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
      return decoded.nameid || decoded.sub;
    } catch (e) {
      console.error("Token decode failed", e);
      return null;
    }
  };

  // Load user from localStorage on init
  useEffect(() => {
    const savedUser = localStorage.getItem('wishify_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Add ID if missing but token is present
        if (!parsedUser.id && parsedUser.token) {
          const extractedId = getUserIdFromToken(parsedUser.token);
          if (extractedId) {
            parsedUser.id = extractedId;
            // Update localStorage to keep it sync'd
            localStorage.setItem('wishify_user', JSON.stringify(parsedUser));
          }
        }
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to init auth", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${AUTH_API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Login failed');
      }

      const userData = await response.json();
      // Inject ID from token
      userData.id = getUserIdFromToken(userData.token);
      
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
      const response = await fetch(`${AUTH_API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
      }

      const userData = await response.json();
      // Inject ID from token
      userData.id = getUserIdFromToken(userData.token);

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
