import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/lib/axios";

export const useGetChats = () => {
  const query = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/chats");

      if (!response.data) throw new Error("Failed to get chats");

      return response.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  });

  return query;
};
