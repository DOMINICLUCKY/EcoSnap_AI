// Authentication API Service
const API_BASE = 'http://localhost:5000/api/auth';

export const authService = {
  // Register new user
  register: async ({ name, email, password, confirmPassword }) => {
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Login with email and password
  login: async ({ email, password }) => {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Google OAuth login
  googleLogin: async (tokenId) => {
    try {
      const response = await fetch(`${API_BASE}/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tokenId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Google login failed');
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  // Verify email with token
  verifyEmail: async (token) => {
    try {
      const response = await fetch(`${API_BASE}/verify-email/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Email verification failed');
      }

      return data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  },

  // Get current user (protected endpoint)
  getCurrentUser: async (token) => {
    try {
      const response = await fetch(`${API_BASE}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user');
      }

      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  // Logout (client-side)
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Get stored user
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};
