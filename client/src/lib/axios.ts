import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const getAccessToken = () => localStorage.getItem("access_token");

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: {
  resolve: (value: AxiosResponse) => void;
  reject: (reason: AxiosError) => void;
}[] = [];

const processQueue = async (error: AxiosError | null, token: string | null) => {
  for (const prom of failedQueue) {
    if (token) {
      try {
        const response = await axiosInstance(
          error?.config as AxiosRequestConfig
        );
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

    if (error.response?.status === 401 && originalRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }

      isRefreshing = true;

      try {
        const { data } = await axiosInstance.post("/api/auth/refresh-token");
        const accessToken = data.accessToken;

        localStorage.setItem("access_token", accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        processQueue(refreshError as AxiosError, null);

        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// base version handler
// let isRefreshing = false;
// let failedQueue: {
//   resolve: (value: AxiosResponse) => void;
//   reject: (reason: AxiosError) => void;
// }[] = [];

// const processQueue = async (
//   error: AxiosError | null,
//   accessToken: string | null = null,
//   originalRequest: AxiosRequestConfig
// ) => {
//   for (const prom of failedQueue) {
//     if (accessToken) {
//       try {
//         const response = await axiosInstance(originalRequest);

//         prom.resolve(response);
//       } catch (err) {
//         prom.reject(err as AxiosError);
//       }
//     } else {
//       prom.reject(error ?? new AxiosError("Unknown error occurred"));
//     }
//   }
//   failedQueue = [];
// };

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config;

//     if (error.response && error.response.status === 401 && originalRequest) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         });
//       }

//       isRefreshing = true;

//       try {
//         const refreshResponse = await axiosInstance.post(
//           "/api/auth/refresh-token"
//         );
//         const { accessToken } = refreshResponse.data;

//         localStorage.setItem("access_token", accessToken);

//         originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

//         processQueue(null, accessToken, originalRequest);
//         return axiosInstance(originalRequest);
//       } catch (refreshError: unknown) {
//         const error = refreshError as AxiosError;
//         console.error("Refresh token failed", error);

//         localStorage.removeItem("access_token");

//         window.location.href = "/login";

//         processQueue(error as AxiosError, null, originalRequest);
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response && error.response.status === 401) {
//       try {
//         const refreshResponse = await axiosInstance.post(
//           "/api/auth/refresh-token"
//         );
//         const { accessToken } = refreshResponse.data;

//         localStorage.setItem("access_token", accessToken);

//         const originalRequest = error.config;
//         originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         console.error("Refresh token failed", refreshError);
//         localStorage.removeItem("access_token");
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     localStorage.removeItem("access_token");

//     return Promise.reject(error);
//   }
// );
