import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { axiosInstance } from "@/lib/axios";

import { useAuthStore } from "@/stores/use-auth-store";

export const useLogout = () => {
  const router = useRouter();
  const { logout } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/api/auth/logout");

      return response.data;
    },
    onSuccess: () => {
      logout();

      toast.success("You have been logged out");
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};
