// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44328/api';

// Derived URLs if needed
export const AUTH_URL = `${API_BASE_URL}/auth`;
export const CARDS_URL = `${API_BASE_URL}/cards`;
export const ADMIN_URL = `${API_BASE_URL}/admin`;
export const TEMPLATES_URL = `${API_BASE_URL}/templates`;
export const UPLOAD_URL = `${API_BASE_URL}/upload`;
