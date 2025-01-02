import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import { useAuthStore } from "@/stores/use-auth-store";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
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

let isRefreshing = false;
let failedQueue: {
  resolve: (value: AxiosResponse) => void;
  reject: (reason: AxiosError) => void;
}[] = [];

const processQueue = async (
  error: AxiosError | null,
  accessToken: string | null,
  originalRequest: AxiosRequestConfig
) => {
  for (const prom of failedQueue) {
    if (accessToken) {
      try {
        const response = await axiosInstance(originalRequest);
        prom.resolve(response);
      } catch (err) {
        prom.reject(err as AxiosError);
      }
    } else {
      prom.reject(error ?? new AxiosError("Unknown error occurred"));
    }
  }
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const authStore = useAuthStore.getState();

    if (error.response && error.response.status === 401 && originalRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axiosInstance.post(
          "/api/auth/refresh-token"
        );
        const { accessToken } = refreshResponse.data;

        authStore.setAccessToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken, originalRequest);

        return axiosInstance(originalRequest);
      } catch (refreshError: unknown) {
        const error = refreshError as AxiosError;

        authStore.logout();
        window.location.href = "/login";

        processQueue(error, null, originalRequest);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
