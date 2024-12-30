import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosInstance } from "@/lib/axios";

import { ErrorResponse, User } from "@/types";

import useEditUserProfileModal from "./use-edit-user-profile-modal";

import { useAuthStore } from "@/stores/use-auth-store";

interface UserResponse {
  message: string;
  user: User;
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { onClose } = useEditUserProfileModal();
  const { logout } = useAuthStore();

  const mutation = useMutation<UserResponse, Error>({
    mutationFn: async () => {
      const response = await axiosInstance.delete("/api/users", {
        withCredentials: true
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success("User has been deleted");
      logout();
      onClose();

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
