import axios from "axios";

import { useAuthStore } from "@/stores/use-auth-store";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL!,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

const getAccessToken = () => {
  const { accessToken } = useAuthStore.getState();

  return accessToken;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axiosInstance.post<{
          accessToken: string;
        }>("/api/auth/refresh-token");

        const { accessToken } = refreshResponse.data;

        const authStore = useAuthStore.getState();
        authStore.setAccessToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
