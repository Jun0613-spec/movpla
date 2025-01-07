"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useAuthStore } from "@/stores/use-auth-store";

import Spinner from "@/components/spinner";
import Pagination from "@/components/pagination";

import PropertyList from "../_components/property-list";

import { useGetUsersProperties } from "@/hooks/users/use-get-users-properties";

import { useEditUserProfileModalStore } from "@/stores/use-modal-store";

const PropfilePage = () => {
  const { user } = useAuthStore();

  const router = useRouter();

  const { onOpen } = useEditUserProfileModalStore();
  const { data: usersProperties, isLoading } = useGetUsersProperties();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [propertiesPerPage] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    if (usersProperties?.userProperties) {
      setTotalPages(
        Math.ceil(usersProperties.userProperties.length / propertiesPerPage)
      );
    }
  }, [usersProperties, propertiesPerPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * propertiesPerPage;
  const currentUserProperties = usersProperties?.userProperties?.slice(
    startIndex,
    startIndex + propertiesPerPage
  );

  return (
    <div className="flex-1 p-6 lg:py-12 lg:px-16 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold ">User Profile</h1>
        <Button onClick={onOpen}>Edit profile</Button>
      </div>

      <div className="flex items-center gap-6 bg-neutral-50 dark:bg-neutral-800 p-8 rounded-xl shadow-lg">
        <Avatar className="size-24 ">
          <AvatarImage
            alt={user?.username || "Avatar"}
            src={user?.avatarImage || undefined}
            className=" object-cover rounded-full"
          />
          <AvatarFallback className="font-medium text-white bg-neutral-400 dark:bg-neutral-600 flex items-center justify-center text-4xl">
            {user?.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <p className="text-xl font-semibold text-neutral-800 dark:text-white">
            {user?.username}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {user?.email}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">My Property List</h2>
          <Link href="/property/create">
            <Button>Create New Property</Button>
          </Link>
        </div>

        <div className="p-8 bg-white dark:bg-neutral-800 rounded-xl shadow-lg">
          {isLoading ? (
            <Spinner />
          ) : currentUserProperties && currentUserProperties.length > 0 ? (
            <>
              <PropertyList properties={currentUserProperties} />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <p className="text-neutral-500 dark:text-neutral-400">
              No properties listed yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropfilePage;
