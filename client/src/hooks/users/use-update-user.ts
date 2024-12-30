import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosInstance } from "@/lib/axios";

import { ErrorResponse, User } from "@/types";

interface UserResponse {
  message: string;
  user: User;
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UserResponse, Error, FormData>({
    mutationFn: async (data) => {
      const response = await axiosInstance.put("/api/users", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success("User profile  has been updated");

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
    },
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["currentUser"] });
    }
  });

  return mutation;
};
