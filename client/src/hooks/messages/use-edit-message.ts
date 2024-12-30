import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { axiosInstance } from "@/lib/axios";

import { ErrorResponse, Message } from "@/types";

interface EditMessageRequest {
  messageId: string;
  text: string;
}

interface EditMessageResponse {
  message: string;
  updatedMessage: Message;
}

export const useEditMessage = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<EditMessageResponse, Error, EditMessageRequest>({
    mutationFn: async ({ messageId, text }) => {
      const response = await axiosInstance.put(`/api/messages/${messageId}`, {
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
            "Failed to edit message";
          toast.error(message);
        }
      } else {
        toast.error("Failed to edit message");
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({
        queryKey: ["message", data.updatedMessage.id]
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onSettled: (data) => {
      queryClient.refetchQueries({
        queryKey: ["messages", data?.updatedMessage?.chatId]
      });

      queryClient.invalidateQueries({
        queryKey: ["message", data?.updatedMessage.id]
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    }
  });

  return mutation;
};
