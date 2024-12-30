import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { axiosInstance } from "@/lib/axios";

import { Chat, ErrorResponse } from "@/types";
import { useRouter } from "next/navigation";

interface DeleteChatRequest {
  chatId: string;
}

interface DeleteChatResponse {
  message: string;
  chat: Chat;
}

export const useDeleteChat = () => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const mutation = useMutation<DeleteChatResponse, Error, DeleteChatRequest>({
    mutationFn: async ({ chatId }) => {
      const response = await axiosInstance.delete(`/api/chats/${chatId}`);

      return response.data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ErrorResponse>;

        if (axiosError.response) {
          const message =
            axiosError.response.data?.error ||
            axiosError.response.data?.message ||
            "Failed to delete chat";
          toast.error(message);
        }
      } else {
        toast.error("Failed to delete chat");
      }
    },
    onSuccess: () => {
      toast.success("Chat deleted successfully");

      router.refresh();
    },
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["chats"] });
      queryClient.refetchQueries({ queryKey: ["messages"] });
    }
  });

  return mutation;
};
