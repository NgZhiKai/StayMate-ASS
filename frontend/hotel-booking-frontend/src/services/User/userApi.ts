import { LoginData, RegisterData, ResetPasswordRequest, User } from "../../types/User";
import { handleApiError } from "../../utils/handleApiError";
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
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  getUserInfo: async (userId: string): Promise<{ user: User }> => {
    const response = await userApiClient.get(`${USER_BASE}/${userId}`);
    const data = response.data?.data;
    if (!data) throw new Error(response.data?.message || "User not found.");
    return { user: data };
  },

  getAllUsers: async (): Promise<{ users: User[] }> => {
    const response = await userApiClient.get(USER_BASE);
    const data = response.data?.data;
    if (!data) throw new Error(response.data?.message || "No users found.");
    return { users: data };
  },

  getUserByEmail: async (email: string): Promise<{ user: User }> => {
    const response = await userApiClient.get(`${USER_BASE}/by-email/${email}`);
    const data = response.data?.data;
    if (!data) throw new Error(response.data?.message || "User not found.");
    return { user: data };
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<{ user: User }> => {
    const response = await userApiClient.put(`${USER_BASE}/${id}`, userData);
    const data = response.data?.data;
    if (!data) throw new Error(response.data?.message || "Failed to update user.");
    return { user: data };
  },

  deleteUser: async (id: string): Promise<{ message: string }> => {
    const response = await userApiClient.delete(`${USER_BASE}/${id}`);
    if (response.status === 200 || response.status === 204) return { message: "User deleted successfully." };
    throw new Error(response.data?.message || "Failed to delete user.");
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await userApiClient.post(`${USER_BASE}/forgot-password?email=${email}`);
      return response.data.message;
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      const payload: ResetPasswordRequest = { token, newPassword };
      const response = await userApiClient.post(`${USER_BASE}/reset-password`, payload);
      return response.data.message;
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },
};

export default userApi;