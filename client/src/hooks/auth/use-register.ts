import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosInstance } from "@/lib/axios";

import { ErrorResponse, User } from "@/types";

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface RegisterResponse {
  message: string;
  user: User;
}

export const useRegister = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<RegisterResponse, Error, RegisterData>({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/api/auth/register", data);

      return response.data;
    },
    onSuccess: () => {
      toast.success("Thank you, Your account has been created");

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
