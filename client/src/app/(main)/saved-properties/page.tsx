"use client";

import React, { useEffect, useState } from "react";

import Spinner from "@/components/spinner";
import Pagination from "@/components/pagination";

import PropertyList from "../_components/property-list";

import { useGetUsersProperties } from "@/hooks/users/use-get-users-properties";

const SavedPropertiesPage = () => {
  const { data: usersProperties, isLoading } = useGetUsersProperties();

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

  const currentSavedProperties = usersProperties?.savedProperties?.slice(
    startIndex,
    startIndex + propertiesPerPage
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex-1 p-6 lg:py-12 lg:px-16 space-y-8">
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-50">
          Saved Property List
        </h2>

        <div className="p-8 bg-white dark:bg-neutral-800 rounded-xl shadow-lg ">
          {currentSavedProperties && currentSavedProperties.length > 0 ? (
            <>
              <PropertyList properties={currentSavedProperties} />
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-center items-center py-12">
              <p className="text-lg text-neutral-500 dark:text-neutral-400">
                No saved properties yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedPropertiesPage;
