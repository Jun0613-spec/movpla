import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/lib/axios";

import { Property } from "@/types";

interface UsersPropertiesResponse {
  userProperties: Property[];
  savedProperties: Property[];
}

export const useGetUsersProperties = () => {
  const query = useQuery<UsersPropertiesResponse>({
    queryKey: ["users_properties"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/users/profile/properties");

      if (!response.data) throw new Error("Failed to get users properties");

      return response.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  });

  return query;
};
