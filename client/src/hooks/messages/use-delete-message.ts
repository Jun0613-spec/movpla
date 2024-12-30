import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { axiosInstance } from "@/lib/axios";

import { ErrorResponse, Message } from "@/types";

interface DeleteMessageRequest {
  messageId: string;
}

interface DeleteMessageResponse {
  message: string;
  deletedMessage: Message;
}

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    DeleteMessageResponse,
    Error,
    DeleteMessageRequest
  >({
    mutationFn: async ({ messageId }) => {
      const response = await axiosInstance.delete(`/api/messages/${messageId}`);

      return response.data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ErrorResponse>;

        if (axiosError.response) {
          const message =
            axiosError.response.data?.error ||
            axiosError.response.data?.message ||
            "Failed to delete message";
          toast.error(message);
        }
      } else {
        toast.error("Failed to delete message");
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({ queryKey: ["messages"] });

      queryClient.invalidateQueries({
        queryKey: ["message", data.deletedMessage.id]
      });

      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onSettled: (data) => {
      queryClient.refetchQueries({
        queryKey: ["messages", data?.deletedMessage?.chatId]
      });

      queryClient.invalidateQueries({
        queryKey: ["message", data?.deletedMessage.id]
      });

      queryClient.invalidateQueries({ queryKey: ["chats"] });
    }
  });

  return mutation;
};
