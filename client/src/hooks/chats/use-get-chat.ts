import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/lib/axios";

interface useGetChatProps {
  chatId: string;
}

export const useGetChat = ({ chatId }: useGetChatProps) => {
  const query = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/chat/${chatId}`);

      if (!response.data) throw new Error("Failed to get chats");

      return response.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  });

  return query;
};
