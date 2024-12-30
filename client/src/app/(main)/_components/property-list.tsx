import React from "react";

import { Property } from "@/types";
import PropertyCard from "@/components/property-card";

interface PropertyListProps {
  properties: Property[];
}

const PropertyList = ({ properties }: PropertyListProps) => {
  return (
    <div className="flex flex-col gap-12">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyList;
