import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/lib/axios";

interface useGetPropertyProps {
  propertyId: string;
}

export const useGetProperty = ({ propertyId }: useGetPropertyProps) => {
  const query = useQuery({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/properties/${propertyId}`);

      if (!response.data) throw new Error("Failed to get a property");

      return response.data.existProperty;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  });

  return query;
};
