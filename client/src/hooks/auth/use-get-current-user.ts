import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/lib/axios";

import { useAuthStore } from "@/stores/use-auth-store";

export const useGetCurrentUser = () => {
  const { setUser } = useAuthStore();

  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/auth/current-user");

      if (!response.data) throw new Error("Failed to get user");

      setUser(response.data);

      return response.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  });

  return query;
};
