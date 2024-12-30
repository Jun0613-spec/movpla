"use client";

import { BookmarkIcon, LogOut, SettingsIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useLogout } from "@/hooks/auth/use-logout";

import { useAuthStore } from "@/stores/use-auth-store";

const UserButton = () => {
  const router = useRouter();

  const { mutate: logout } = useLogout();

  const { user } = useAuthStore();

  if (!user) {
    return (
      <>
        <p>User not found</p>
        <Button variant="destructive" onClick={() => logout()}>
          Logout
        </Button>
      </>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-8 transition hover:opacity-65 ">
          <AvatarImage
            alt={user?.username || ""}
            src={user?.avatarImage || undefined}
            className="hover:opacity-80 object-cover "
          />
          <AvatarFallback className="font-medium text-white bg-neutral-400 dark:bg-neutral-600 hover:bg-neutral-400/80 dark:hover:bg-neutral-600/80 flex items-center justify-center text-lg">
            {user?.username ? user?.username[0].toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-600"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-12  ">
            <AvatarImage
              alt={user?.username || "User Avatar"}
              src={user?.avatarImage || ""}
              className="object-cover"
            />
            <AvatarFallback className="font-medium text-white bg-neutral-400 dark:bg-neutral-600 flex items-center justify-center text-2xl cursor-default">
              {user?.username ? user?.username[0].toUpperCase() : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="flex items-center text-base font-semibold">
              {user?.username}
            </p>

            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {user?.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator className="mb-1 bg-neutral-300 dark:bg-neutral-600" />

        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="h-10 flex items-center justify-center font-medium cursor-pointer "
        >
          <UserIcon className="size-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuSeparator className="mb-1 bg-neutral-300 dark:bg-neutral-600" />

        <DropdownMenuItem
          onClick={() => router.push("/saved-properties")}
          className="h-10 flex items-center justify-center font-medium cursor-pointer "
        >
          <BookmarkIcon className="size-4 " />
          Saved Properties
        </DropdownMenuItem>

        <DropdownMenuSeparator className="mb-1 bg-neutral-300 dark:bg-neutral-600" />

        <DropdownMenuItem
          onClick={() => router.push("/settings")}
          className="h-10 flex items-center justify-center font-medium cursor-pointer "
        >
          <SettingsIcon className="size-4 " />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator className="mb-1 bg-neutral-300 dark:bg-neutral-600" />

        <DropdownMenuItem
          onClick={() => logout()}
          className="h-10 flex items-center justify-center text-red-600 dark:text-red-700 font-medium cursor-pointer focus:bg-red-600 focus:text-white dark:focus:bg-red-800 dark:focus:text-neutral-100"
        >
          <LogOut className="size-4 " />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
