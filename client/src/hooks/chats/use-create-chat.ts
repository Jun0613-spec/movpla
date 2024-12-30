import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { axiosInstance } from "@/lib/axios";

import { Chat, ErrorResponse } from "@/types";
import { useRouter } from "next/navigation";

interface CreateChatRequest {
  participantId: string;
}

interface CreateChatResponse {
  message: string;
  chat: Chat;
}

export const useCreateChat = () => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const mutation = useMutation<CreateChatResponse, Error, CreateChatRequest>({
    mutationFn: async ({ participantId }) => {
      const response = await axiosInstance.post(`/api/chats`, {
        participantId
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
      }
    },

    onSuccess: (data) => {
      toast.success(data.message);

      router.push("/messages");

      queryClient.invalidateQueries({ queryKey: ["chats"] });

      queryClient.invalidateQueries({ queryKey: ["chat", data.chat.id] });
    },
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["chats"] });
    }
  });

  return mutation;
};
