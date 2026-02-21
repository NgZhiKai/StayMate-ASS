import { LoginData, RegisterData, User } from "../../types/User";
import { userApiClient } from "./userApiClient";

const USER_BASE = "/users";

/**
 * Initiate registration (send verification email)
 */
export const initiateRegistration = async (email: string) => {
  const response = await userApiClient.post(
    `${USER_BASE}/initiate-registration`,
    { email }
  );

  return response.data; 
  // { message: string, data?: token }
};

/**
 * Verify user via token
 */
export const verifyUser = async (token: string) => {
  const response = await userApiClient.post(`${USER_BASE}/verify`, { token });

  return response.data.data;
};

/**
 * Register new user
 */
export const registerUser = async (userData: RegisterData) => {
  const response = await userApiClient.post(
    `${USER_BASE}/register`,
    userData
  );

  const data = response.data;

  return {
    user: data?.user ?? null,
    verificationRequired: data?.verificationRequired ?? true,
    message:
      data?.message ??
      "Registration successful. Please verify your email.",
  };
};

/**
 * Login user
 */
export const loginUser = async (
  loginData: LoginData
): Promise<{ user: User; token: string }> => {
  const response = await userApiClient.post(
    `${USER_BASE}/login`,
    loginData
  );

  const data = response.data?.data;

  if (!data?.user || !data?.token) {
    throw new Error(
      response.data?.message ||
        "Invalid credentials or account not found."
    );
  }

  return {
    user: data.user,
    token: data.token,
  };
};

/**
 * Get user by ID
 */
export const getUserInfo = async (
  userId: string
): Promise<{ user: User }> => {
  const response = await userApiClient.get(
    `${USER_BASE}/${userId}`
  );

  const data = response.data?.data;

  if (!data) {
    throw new Error(
      response.data?.message || "User not found."
    );
  }

  return { user: data };
};

/**
 * Get all users
 */
export const getAllUsers = async (): Promise<{ users: User[] }> => {
  const response = await userApiClient.get(USER_BASE);

  const data = response.data?.data;

  if (!data) {
    throw new Error(
      response.data?.message || "No users found."
    );
  }

  return { users: data };
};

/**
 * Get user by email
 */
export const getUserByEmail = async (
  email: string
): Promise<{ user: User }> => {
  const response = await userApiClient.get(
    `${USER_BASE}/by-email/${email}`
  );

  const data = response.data?.data;

  if (!data) {
    throw new Error(
      response.data?.message || "User not found."
    );
  }

  return { user: data };
};

/**
 * Update user
 */
export const updateUser = async (
  id: string,
  userData: Partial<User>
): Promise<{ user: User }> => {
  const response = await userApiClient.put(
    `${USER_BASE}/${id}`,
    userData
  );

  const data = response.data?.data;

  if (!data) {
    throw new Error(
      response.data?.message || "Failed to update user."
    );
  }

  return { user: data };
};

/**
 * Delete user
 */
export const deleteUser = async (
  id: string
): Promise<{ message: string }> => {
  const response = await userApiClient.delete(
    `${USER_BASE}/${id}`
  );

  if (response.status === 204) {
    return { message: "User deleted successfully." };
  }

  throw new Error(
    response.data?.message || "Failed to delete user."
  );
};