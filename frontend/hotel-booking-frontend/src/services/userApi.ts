import axios from 'axios';
import { USER_BASE_URL } from '../constants/constants';
import { LoginData, RegisterData, User } from '../types/User';

// Base URL for the API
const API_BASE_URL = `${USER_BASE_URL}/users`;

/**
 * Initiate registration by sending a verification email.
 * Returns the token and a message.
 */
export const initiateRegistration = async (email: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/initiate-registration`, { email });
    return response.data; // { message: string, data?: token }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to initiate registration.');
    }
    throw new Error('An unknown error occurred while initiating registration.');
  }
};

/**
 * Verify user via token (two-step verification).
 */
export const verifyUser = async (token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify`, { token });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Verification failed.');
    }
    throw new Error('An unknown error occurred during verification.');
  }
};

/**
 * Register a new user.
 * Returns user info, a verificationRequired flag, and a message.
 */
export const registerUser = async (userData: RegisterData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    const data = response.data;

    return {
      user: data?.user || null,
      verificationRequired: data?.verificationRequired ?? true,
      message: data?.message || 'Registration successful. Please verify your email.',
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed.');
    }
    throw new Error('An unknown error occurred during registration.');
  }
};

/**
 * Login a user and return user info and JWT token.
 */
export const loginUser = async (loginData: LoginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, loginData);
    const data = response.data;

    if (data?.data?.user) {
      return { user: data.data.user, token: data.data.token };
    } else {
      throw new Error(data?.message || 'Invalid credentials or account not found.');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login failed.');
    }
    throw new Error('An unknown error occurred during login.');
  }
};

/**
 * Fetch user info by ID.
 */
export const getUserInfo = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}`);
    const data = response.data;

    if (data?.data) {
      return { user: data.data };
    } else {
      throw new Error(data?.message || 'User not found.');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user.');
    }
    throw new Error('An unknown error occurred while fetching user information.');
  }
};

/**
 * Fetch all users.
 */
export const getAllUsers = async (): Promise<{ users: User[] }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    const data = response.data;

    if (data?.data) {
      return { users: data.data };
    } else {
      throw new Error(data?.message || 'No users found.');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users.');
    }
    throw new Error('An unknown error occurred while fetching users.');
  }
};

/**
 * Fetch user info by email.
 */
export const getUserByEmail = async (email: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/by-email/${email}`);
    const data = response.data;

    if (data?.data) {
      return { user: data.data };
    } else {
      throw new Error(data?.message || 'User not found.');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user by email.');
    }
    throw new Error('An unknown error occurred while fetching user information.');
  }
};

/**
 * Update user by ID.
 */
export const updateUser = async (id: string, userData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, userData);
    const data = response.data;

    if (data?.data) {
      return { user: data.data };
    } else {
      throw new Error(data?.message || 'Failed to update user.');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update user.');
    }
    throw new Error('An unknown error occurred while updating user information.');
  }
};

/**
 * Delete user by ID.
 */
export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);

    if (response.status === 204) {
      return { message: 'User deleted successfully.' };
    } else {
      throw new Error(response.data?.message || 'Failed to delete user.');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete user.');
    }
    throw new Error('An unknown error occurred while deleting the user.');
  }
};