import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { axiosInstance } from "@/lib/axios";

import { ErrorResponse, User } from "@/types";

import { useAuthStore } from "@/stores/use-auth-store";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { login } = useAuthStore();

  const mutation = useMutation<LoginResponse, Error, LoginData>({
    mutationFn: async (data: LoginData) => {
      const response = await axiosInstance.post("/api/auth/login", data);

      return response.data;
    },
    onSuccess: (data) => {
      login(data.accessToken, data.user);

      toast.success(`Welcome ${data.user.username}`);

      router.push("/");

      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ErrorResponse>;

        if (axiosError.response) {
          const message =
            axiosError.response.data?.error ||
            axiosError.response.data?.message ||
            "An unexpected error occurred";
          toast.error(message);
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  });

  return mutation;
};
