import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/lib/axios";

interface useGetMessagesProps {
  chatId: string;
}

export const useGetMessages = ({ chatId }: useGetMessagesProps) => {
  const query = useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/messages/${chatId}`);

      if (!response.data) throw new Error("Failed to get messages");

      return response.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  });

  return query;
};
