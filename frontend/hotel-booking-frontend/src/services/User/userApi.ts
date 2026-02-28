import { LoginData, RegisterData, ResetPasswordRequest, User } from "../../types/User";
import { toApiError } from "../_core/apiError";
import { getDataOrThrow, getMessageOrThrow } from "../_core/response";
import { userApiClient } from "./userApiClient";

const USER_BASE = "/users";

const userApi = {
  initiateRegistration: async (email: string) => {
    const response = await userApiClient.post(`${USER_BASE}/initiate-registration`, { email });
    return response.data;
  },

  verifyUser: async (token: string) => {
    const response = await userApiClient.post(`${USER_BASE}/verify`, { token });
    return response.data.data;
  },

  registerUser: async (userData: RegisterData) => {
    const response = await userApiClient.post(`${USER_BASE}/register`, userData);
    const data = response.data;
    return {
      user: data?.user ?? null,
      verificationRequired: data?.verificationRequired ?? true,
      message: data?.message ?? "Registration successful. Please verify your email.",
    };
  },

  loginUser: async (loginData: LoginData): Promise<{ user: User; token: string }> => {
    try {
      const response = await userApiClient.post(`${USER_BASE}/login`, loginData);
      const data = response.data?.data;
      if (!data?.user || !data?.token) {
        throw new Error(response.data?.message || "Invalid credentials or account not found.");
      }

      return { user: data.user, token: data.token };
    } catch (error) {
      throw toApiError(error);
    }
  },

  getUserInfo: async (userId: string): Promise<{ user: User }> => {
    try {
      const response = await userApiClient.get(`${USER_BASE}/${userId}`);
      const user = getDataOrThrow<User>(response.data, "User not found.");
      return { user };
    } catch (error) {
      throw toApiError(error);
    }
  },

  getAllUsers: async (): Promise<{ users: User[] }> => {
    try {
      const response = await userApiClient.get(USER_BASE);
      const users = getDataOrThrow<User[]>(response.data, "No users found.");
      return { users };
    } catch (error) {
      throw toApiError(error);
    }
  },

  getUserByEmail: async (email: string): Promise<{ user: User }> => {
    try {
      const response = await userApiClient.get(`${USER_BASE}/by-email/${email}`);
      const user = getDataOrThrow<User>(response.data, "User not found.");
      return { user };
    } catch (error) {
      throw toApiError(error);
    }
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<{ user: User }> => {
    try {
      const response = await userApiClient.put(`${USER_BASE}/${id}`, userData);
      const user = getDataOrThrow<User>(response.data, "Failed to update user.");
      return { user };
    } catch (error) {
      throw toApiError(error);
    }
  },

  deleteUser: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await userApiClient.delete(`${USER_BASE}/${id}`);
      if (response.status === 200 || response.status === 204) {
        return { message: "User deleted successfully." };
      }

      const message = getMessageOrThrow(response.data, "Failed to delete user.");
      return { message };
    } catch (error) {
      throw toApiError(error);
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await userApiClient.post(`${USER_BASE}/forgot-password?email=${email}`);
      return getMessageOrThrow(response.data, "Failed to send forgot password email.");
    } catch (error) {
      throw toApiError(error);
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      const payload: ResetPasswordRequest = { token, newPassword };
      const response = await userApiClient.post(`${USER_BASE}/reset-password`, payload);
      return getMessageOrThrow(response.data, "Failed to reset password.");
    } catch (error) {
      throw toApiError(error);
    }
  },
};

export default userApi;
