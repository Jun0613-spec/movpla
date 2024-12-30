"use client";

import React, { Suspense } from "react";

import Spinner from "@/components/spinner";

import Filter from "../_components/lists/filter";
import Map from "../_components/lists/map";

import PropertyCard from "../../../components/property-card";

import { useGetProperties } from "@/hooks/properties/use-get-properties";

import { Property } from "@/types";

const ListPage = () => {
  const { data: properties, isLoading } = useGetProperties();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />;
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="flex-[3] h-full p-4 overflow-y-auto no-scrollbar space-y-4">
        <Filter />
        <Suspense fallback={<Spinner />}>
          <div className="flex flex-col gap-6">
            {properties && properties.length > 0 ? (
              properties.map((property: Property) => (
                <PropertyCard property={property} key={property.id} />
              ))
            ) : (
              <p>No properties yet</p>
            )}
          </div>
        </Suspense>
      </div>

      <div className="hidden md:flex flex-[2] h-full ">
        <Suspense fallback={<Spinner />}>
          <Map properties={properties} />
        </Suspense>
      </div>
    </div>
  );
};

export default ListPage;
