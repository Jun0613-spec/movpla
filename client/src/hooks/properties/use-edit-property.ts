import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosInstance } from "@/lib/axios";

import { ErrorResponse, Property } from "@/types";

interface EditPropertyRequest {
  propertyId: string;
  propertyData: FormData;
}

interface EditPropertyResponse {
  message: string;
  property: Property;
}

export const useEditProperty = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    EditPropertyResponse,
    Error,
    EditPropertyRequest
  >({
    mutationFn: async ({ propertyId, propertyData }) => {
      const response = await axiosInstance.put(
        `/api/properties/${propertyId}`,
        propertyData,
        {
          withCredentials: true
        }
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Property has been updated");

      queryClient.invalidateQueries({
        queryKey: ["properties"]
      });
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
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["properties"] });
      queryClient.refetchQueries({
        queryKey: ["users_properties"]
      });
      queryClient.refetchQueries({
        queryKey: ["saved_properties"]
      });
    }
  });

  return mutation;
};
