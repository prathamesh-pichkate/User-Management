import axios from 'axios';

// Base API URL - update this with your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// User API functions
export const userAPI = {
  // Get all users with pagination and search
  getUsers: (page = 1, limit = 10, search = '') => {
    return api.get(`/users?page=${page}&limit=${limit}&search=${search}`);
  },

  // Get single user by ID
  getUserById: (id) => {
    return api.get(`/users/${id}`);
  },

  // Create new user
  createUser: (userData) => {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        formData.append(key, userData[key]);
      }
    });

    return api.post('/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Update user
  updateUser: (id, userData) => {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        formData.append(key, userData[key]);
      }
    });

    return api.put(`/users/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Delete user
  deleteUser: (id) => {
    return api.delete(`/users/${id}`);
  },

  // Export to CSV
  exportToCSV: () => {
    return api.get('/users/export/csv', {
      responseType: 'blob'
    });
  }
};

export default api;