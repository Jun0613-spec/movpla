"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import Spinner from "@/components/spinner";

import { useAuthStore } from "@/stores/use-auth-store";

import { useGetCurrentUser } from "@/hooks/auth/use-get-current-user";

// const GoogleCallbackPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const { login, isAuthenticated } = useAuthStore();

//   useEffect(() => {
//     if (isAuthenticated) return router.push("/");

//     const token = searchParams.get("token");
//     const user = searchParams.get("user");

//     if (token && user) {
//       login(token as string, JSON.parse(user as string));

//       axiosInstance
//         .get("/api/auth/current-user", {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//         .then((response) => {
//           toast.success(`Welcome ${response.data.username}`);
//         })
//         .catch((error) => {
//           toast.error("Failed to authenticate Google user");
//           console.error(error);
//         });

//       router.push("/");
//     } else {
//       toast.error("Failed to log in with Google");
//       router.push("/login");
//     }
//   }, [router, searchParams, login, isAuthenticated]);

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <Spinner />
//     </div>
//   );
// };

// export default GoogleCallbackPage;

const GoogleCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { login, isAuthenticated } = useAuthStore();

  const { data: currentUser } = useGetCurrentUser();

  useEffect(() => {
    if (isAuthenticated) return router.push("/");
    if (!currentUser) return;

    const token = searchParams.get("token");
    const user = searchParams.get("user");

    if (token && user) {
      login(token as string, JSON.parse(user as string));

      toast.success(`Welcome ${currentUser.username}`);

      router.push("/");
    } else {
      toast.error("Failed to log in with Google");

      router.push("/login");
    }
  }, [router, searchParams, login, isAuthenticated, currentUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default GoogleCallbackPage;
