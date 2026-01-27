import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api/auth";


// Signup API
export const signupAPI = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

// Login API
export const loginAPI = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

// Optional: get all users (protected)
export const getUsersAPI = async (token) => {
  const response = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Create error object with response data for proper handling
      const error = new Error(data.message || "Failed to verify email");
      error.response = { data };
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reset password");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
