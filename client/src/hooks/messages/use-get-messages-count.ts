import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/lib/axios";

interface useGetMessagesCountProps {
  chatId: string;
}

export const useGetMessagesCount = ({ chatId }: useGetMessagesCountProps) => {
  const query = useQuery({
    queryKey: ["unread_count"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/messages/${chatId}/count`);

      if (!response.data) throw new Error("Failed to get messages count");

      return response.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  });

  return query;
};
