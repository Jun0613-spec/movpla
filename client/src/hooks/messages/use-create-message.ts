import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { axiosInstance } from "@/lib/axios";

import { ErrorResponse, Message } from "@/types";
import { useSocketStore } from "@/stores/use-socket-store";

interface CreateMessageRequest {
  text: string;
  chatId: string;
}

interface CreateMessageResponse {
  message: string;
  newMessage: Message;
}

export const useCreateMessage = () => {
  const queryClient = useQueryClient();

  const { socket } = useSocketStore();

  const mutation = useMutation<
    CreateMessageResponse,
    Error,
    CreateMessageRequest
  >({
    mutationFn: async ({ chatId, text }) => {
      const response = await axiosInstance.post(`/api/messages/${chatId}`, {
        text
      });

      return response.data;
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

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({
        queryKey: ["message", data.newMessage.id]
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] });

      if (socket) {
        socket.emit("sendMessage", {
          chatId: data.newMessage.chatId,
          senderId: data.newMessage.senderId,
          text: data.newMessage.text
        });
      }
    },
    onSettled: (data) => {
      queryClient.refetchQueries({ queryKey: ["chats"] });

      queryClient.refetchQueries({
        queryKey: ["messages", data?.newMessage?.chatId]
      });

      queryClient.refetchQueries({
        queryKey: ["message", data?.newMessage?.id]
      });
    }
  });

  return mutation;
};
