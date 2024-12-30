import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { axiosInstance } from "@/lib/axios";

import { SavedProperty, ErrorResponse } from "@/types";

interface SavePropertyRequest {
  propertyId: string;
}

interface SavePropertyResponse {
  message: string;
  saveProperty: SavedProperty;
}

export const useSaveProperty = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    SavePropertyResponse,
    Error,
    SavePropertyRequest
  >({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(`/api/properties/save`, data);

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
      } else {
        toast.error("An unexpected error occurred");
      }
    },

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["users_properties"]
      });
    },
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: ["users_properties"]
      });
      queryClient.refetchQueries({
        queryKey: ["properties"]
      });
      queryClient.refetchQueries({
        queryKey: ["saved_properties"]
      });
    }
  });

  return mutation;
};
