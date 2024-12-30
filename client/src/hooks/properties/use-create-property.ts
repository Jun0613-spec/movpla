import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { axiosInstance } from "@/lib/axios";

import { ErrorResponse, Property } from "@/types";

interface CreatePropertyResponse {
  message: string;
  property: Property;
}

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreatePropertyResponse, Error, FormData>({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/api/properties", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
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
      } else {
        toast.error("An unexpected error occurred");
      }
    },

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["property", data.property.id]
      });
    },
    onSettled: (data) => {
      queryClient.refetchQueries({ queryKey: ["property", data?.property.id] });
      queryClient.refetchQueries({ queryKey: ["propeties"] });
    }
  });

  return mutation;
};
