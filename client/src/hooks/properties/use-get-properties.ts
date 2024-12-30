import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/lib/axios";

export const useGetProperties = () => {
  const query = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/properties");

      if (!response.data) throw new Error("Failed to get properties");

      return response.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  });

  return query;
};
