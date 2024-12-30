"use client";

import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

import { QueryParams, ListingType, PropertyType, FurnishedType } from "@/types";

const Filter = () => {
  const searchParams = useSearchParams();

  const parseBooleanParam = (param: string | null) => {
    if (param === "true") return true;
    if (param === "false") return false;

    return undefined;
  };

  const [query, setQuery] = useState<QueryParams>({
    listingType: (searchParams.get("listingType") as ListingType) || "",
    city: searchParams.get("city") || "",
    propertyType: (searchParams.get("propertyType") as PropertyType) || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
    furnishedType: (searchParams.get("furnishedType") as FurnishedType) || "",
    garden: parseBooleanParam(searchParams.get("garden")) || undefined,
    balcony: parseBooleanParam(searchParams.get("balcony")) || undefined,
    parking: parseBooleanParam(searchParams.get("parking")) || undefined
  });

  const handleChange = (key: keyof QueryParams, value: string) => {
    setQuery((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFilter = () => {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    window.location.search = params.toString();
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="filters">
        <AccordionTrigger>
          <h1 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
            Search results for{" "}
            <span className="font-bold">
              {searchParams.get("city") || "All locations"}
            </span>
          </h1>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-4">
            {/* Location Input */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="city"
                className="text-sm font-medium text-neutral-600 dark:text-neutral-300"
              >
                Location
              </Label>
              <Input
                type="text"
                id="city"
                name="city"
                placeholder="City Location"
                onChange={(e) => handleChange("city", e.target.value)}
                value={query.city}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
              {/* Listing Type */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="listingType"
                  className="text-sm font-medium text-neutral-600 dark:text-neutral-300"
                >
                  Type
                </Label>
                <Select
                  value={query.listingType}
                  onValueChange={(value) => handleChange("listingType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">Any</SelectItem>
                    <SelectItem value="ForSale">Buy</SelectItem>
                    <SelectItem value="ToRent">Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Property Type */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="propertyType"
                  className="text-sm font-medium text-neutral-600 dark:text-neutral-300"
                >
                  Property
                </Label>
                <Select
                  value={query.propertyType}
                  onValueChange={(value) => handleChange("propertyType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">Any</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Flat">Flat</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="Bungalow">Bungalow</SelectItem>
                    <SelectItem value="Land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Min Price */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="minPrice"
                  className="text-sm font-medium text-neutral-600 dark:text-neutral-300"
                >
                  Min Price
                </Label>
                <Input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  placeholder="Any"
                  onChange={(e) => handleChange("minPrice", e.target.value)}
                  value={query.minPrice}
                />
              </div>

              {/* Max Price */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="maxPrice"
                  className="text-sm font-medium text-neutral-600 dark:text-neutral-300"
                >
                  Max Price
                </Label>
                <Input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  placeholder="Any"
                  onChange={(e) => handleChange("maxPrice", e.target.value)}
                  value={query.maxPrice}
                />
              </div>

              {/* Bedroom Count */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="bedroom"
                  className="text-sm font-medium text-neutral-600 dark:text-neutral-300"
                >
                  Bedrooms
                </Label>
                <Input
                  type="number"
                  id="bedroom"
                  name="bedroom"
                  placeholder="1"
                  onChange={(e) => handleChange("bedroom", e.target.value)}
                  value={query.bedroom}
                />
              </div>

              {/* Furnishing */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="furnishedType"
                  className="text-sm font-medium text-neutral-600 dark:text-neutral-300"
                >
                  Furnishing
                </Label>
                <Select
                  value={query.furnishedType}
                  onValueChange={(value) =>
                    handleChange("furnishedType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select furnishing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">Any</SelectItem>
                    <SelectItem value="Furnished">Furnished</SelectItem>
                    <SelectItem value="PartFurnished">
                      Part Furnished
                    </SelectItem>
                    <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Garden */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="garden"
                  className="text-sm font-medium text-neutral-600 dark:text-neutral-300"
                >
                  Garden
                </Label>
                <Select
                  value={
                    query.garden === true
                      ? "true"
                      : query.garden === false
                      ? "false"
                      : undefined
                  }
                  onValueChange={(value) =>
                    setQuery({
                      ...query,
                      garden:
                        value === "true"
                          ? true
                          : value === "false"
                          ? false
                          : undefined
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select garden option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">Any</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Balcony */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="balcony"
                  className="text-sm font-medium text-neutral-600 dark:text-neutral-300"
                >
                  Balcony
                </Label>
                <Select
                  value={
                    query.balcony === true
                      ? "true"
                      : query.balcony === false
                      ? "false"
                      : undefined
                  }
                  onValueChange={(value) =>
                    setQuery({
                      ...query,
                      balcony:
                        value === "true"
                          ? true
                          : value === "false"
                          ? false
                          : undefined
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select balcony option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">Any</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Parking */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="parking"
                  className="text-sm font-medium text-neutral-600 dark:text-neutral-300"
                >
                  Parking
                </Label>
                <Select
                  value={
                    query.parking === true
                      ? "true"
                      : query.parking === false
                      ? "false"
                      : undefined
                  }
                  onValueChange={(value) =>
                    setQuery({
                      ...query,
                      parking:
                        value === "true"
                          ? true
                          : value === "false"
                          ? false
                          : undefined
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parking option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">Any</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleFilter} className="hover:opacity-80">
              Search properties
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Filter;
