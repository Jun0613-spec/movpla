import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { axiosInstance } from "@/lib/axios";

import { ErrorResponse, Message } from "@/types";

interface ReadMessageRequest {
  messageId: string;
}

interface ReadMessageResponse {
  message: string;
  readMessage: Message;
}

export const useReadMessage = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ReadMessageResponse, Error, ReadMessageRequest>({
    mutationFn: async ({ messageId }) => {
      const response = await axiosInstance.put(`/api/messages/${messageId}`);

      return response.data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ErrorResponse>;

        if (axiosError.response) {
          const message =
            axiosError.response.data?.error ||
            axiosError.response.data?.message ||
            "Failed to edit message";
          toast.error(message);
        }
      } else {
        toast.error("Failed to read message");
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({
        queryKey: ["message", data.readMessage.id]
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onSettled: (data) => {
      queryClient.refetchQueries({
        queryKey: ["messages", data?.readMessage?.chatId]
      });

      queryClient.invalidateQueries({
        queryKey: ["message", data?.readMessage.id]
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    }
  });

  return mutation;
};
