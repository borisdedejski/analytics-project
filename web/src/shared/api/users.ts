import { apiClient } from "./client";

export interface User {
  id: string;
  email: string;
  tenantId: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  message: string;
}

export const usersApi = {
  getUsers: async (tenantId?: string): Promise<User[]> => {
    const params = tenantId ? { tenantId } : {};
    return await apiClient.get<User[]>("/users", params);
  },

  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return await apiClient.post<LoginResponse>("/users/login", credentials);
  },
};

