import axios from "axios";
import { ApiError } from "@/lib/api-error";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not defined in environment variables",
  );
}

export interface ApiRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

const axiosInstance = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30_000,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (axios.isCancel(error)) return Promise.reject(error);
      if (axios.isAxiosError<{ message?: string }>(error)) {
        const status = error.response?.status ?? 503;
        const message =
          error.response?.data?.message ??
          (error.code === "ECONNABORTED"
            ? "The request timed out. Please try again."
            : "Unable to reach Submitly. Please try again.");
        if (status === 401 && typeof window !== "undefined") {
          window.dispatchEvent(new Event("submitly:unauthorized"));
        }
        return Promise.reject(new ApiError(message, status));
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

const httpGet = async <T>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<T> => {
  const response = await axiosInstance().get<T>(endpoint, options);
  return response.data;
};

const httpPost = async <T>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<T> => {
  const response = await axiosInstance().post<T>(endpoint, data, options);
  return response.data;
};

const httpPut = async <T>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<T> => {
  const response = await axiosInstance().put<T>(endpoint, data, options);
  return response.data;
};

const httpPatch = async <T>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<T> => {
  const response = await axiosInstance().patch<T>(endpoint, data, options);
  return response.data;
};

const httpDelete = async <T>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<T> => {
  const response = await axiosInstance().delete<T>(endpoint, options);
  return response.data;
};

export const httpClient = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
};
