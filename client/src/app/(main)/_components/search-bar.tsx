import { useState } from "react";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

import { ListingType } from "@/types";

const listingTypes: ListingType[] = [ListingType.ForSale, ListingType.ToRent];

interface Query {
  listingType: ListingType;
  city: string;
  minPrice: number;
  maxPrice: number;
}

const SearchBar = () => {
  const [query, setQuery] = useState<Query>({
    listingType: ListingType.ForSale,
    city: "",
    minPrice: 0,
    maxPrice: 10000000
  });

  const handleSwitchType = (val: ListingType) => {
    setQuery((prev) => ({ ...prev, listingType: val }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuery((prev) => ({
      ...prev,
      [name]: name === "minPrice" || name === "maxPrice" ? Number(value) : value
    }));
  };

  const resetForm = () => {
    setQuery({
      listingType: ListingType.ForSale,
      city: "",
      minPrice: 0,
      maxPrice: 10000000
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { listingType, city, minPrice, maxPrice } = query;
    const queryString = new URLSearchParams({
      listingType,
      city,
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString()
    }).toString();

    window.location.href = `/list?${queryString}`;
  };

  const isValidPriceRange = query.minPrice <= query.maxPrice;

  return (
    // <div className="p-4">
    //   <div className="flex gap-2 flex-wrap mb-4">
    //     {listingTypes.map((listingType) => (
    //       <Button
    //         key={listingType}
    //         variant="outline"
    //         onClick={() => handleSwitchType(listingType)}
    //         className={cn(
    //           "px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 shadow-sm",
    //           query.listingType === listingType
    //             ? "bg-black text-white hover:bg-black/70 hover:text-white/70 dark:bg-white dark:text-black dark:hover:bg-white/70 dark:hover:black-white/70 dark:border-neutral-600"
    //             : " dark:border-neutral-600 dark:hover:bg-black/70 dark:hover:text-white/70"
    //         )}
    //       >
    //         {listingType === "ForSale" ? "For Sale" : "To Rent"}
    //       </Button>
    //     ))}
    //   </div>

    //   <form
    //     onSubmit={handleSubmit}
    //     className="w-full p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg flex flex-wrap gap-4 md:gap-6 justify-between items-center border border-neutral-200 dark:border-neutral-600"
    //   >
    //     <div className="w-full sm:w-72 md:w-80 lg:w-96">
    //       <Label
    //         htmlFor="city"
    //         className="text-sm font-semibold text-neutral-700 dark:text-neutral-300"
    //       >
    //         City
    //       </Label>
    //       <Input
    //         id="city"
    //         type="text"
    //         name="city"
    //         placeholder="Enter city"
    //         className="w-full mt-2 p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-500 text-neutral-700 dark:bg-neutral-700 dark:text-white dark:border-neutral-600"
    //         value={query.city}
    //         onChange={handleChange}
    //       />
    //     </div>

    //     <div className="w-full sm:w-40 md:w-48 lg:w-52">
    //       <Label
    //         htmlFor="minPrice"
    //         className="text-sm font-semibold text-neutral-700 dark:text-neutral-300"
    //       >
    //         Min Price
    //       </Label>
    //       <Input
    //         id="minPrice"
    //         type="number"
    //         name="minPrice"
    //         min={0}
    //         placeholder="Min Price"
    //         className="w-full mt-2 p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-500 text-neutral-700 dark:bg-neutral-700 dark:text-white dark:border-neutral-600"
    //         value={query.minPrice}
    //         onChange={handleChange}
    //       />
    //     </div>

    //     <div className="w-full sm:w-40 md:w-48 lg:w-52">
    //       <Label
    //         htmlFor="maxPrice"
    //         className="text-sm font-semibold text-neutral-700 dark:text-neutral-300"
    //       >
    //         Max Price
    //       </Label>
    //       <Input
    //         id="maxPrice"
    //         type="number"
    //         name="maxPrice"
    //         min={0}
    //         placeholder="Max Price"
    //         className="w-full mt-2 p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-500 text-neutral-700 dark:bg-neutral-700 dark:text-white dark:border-neutral-600"
    //         value={query.maxPrice}
    //         onChange={handleChange}
    //       />
    //     </div>

    //     <div className="flex flex-wrap gap-2 w-full sm:w-auto ">
    //       <Button
    //         type="submit"
    //         className="w-full sm:w-auto hover:opacity-85"
    //         disabled={!isValidPriceRange}
    //       >
    //         <Search className="size-5" />
    //       </Button>

    //       <Button
    //         type="button"
    //         variant="outline"
    //         onClick={resetForm}
    //         className="w-full sm:w-auto hover:opacity-85"
    //       >
    //         Reset
    //       </Button>
    //     </div>

    //     {/* Error Message */}
    //     {!isValidPriceRange && (
    //       <p className="text-red-500 text-sm w-full mt-2">
    //         Min price cannot be greater than max price.
    //       </p>
    //     )}
    //   </form>
    // </div>
    <div className="p-6 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700">
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 sm:grid-cols-3 items-start"
      >
        <div className="col-span-full flex flex-wrap gap-4">
          {listingTypes.map((listingType) => (
            <Button
              key={listingType}
              variant="outline"
              onClick={() => handleSwitchType(listingType)}
              type="button"
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-semibold transition-all",
                query.listingType === listingType
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "border border-neutral-300 dark:border-neutral-600"
              )}
            >
              {listingType === "ForSale" ? "For Sale" : "To Rent"}
            </Button>
          ))}
        </div>
        <div>
          <Label
            htmlFor="city"
            className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
          >
            City
          </Label>
          <Input
            id="city"
            type="text"
            name="city"
            placeholder="Enter city"
            className="mt-2 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-neutral-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
            value={query.city}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label
            htmlFor="minPrice"
            className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
          >
            Min Price
          </Label>
          <Input
            id="minPrice"
            type="number"
            name="minPrice"
            min={0}
            placeholder="Min Price"
            className="mt-2 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-neutral-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
            value={query.minPrice}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label
            htmlFor="maxPrice"
            className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
          >
            Max Price
          </Label>
          <Input
            id="maxPrice"
            type="number"
            name="maxPrice"
            min={0}
            placeholder="Max Price"
            className="mt-2 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-neutral-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
            value={query.maxPrice}
            onChange={handleChange}
          />
        </div>

        <div className="col-span-full flex justify-end gap-4">
          <Button type="submit" disabled={!isValidPriceRange}>
            <Search className="mr-2" />
            Search
          </Button>
          <Button type="button" variant="outline" onClick={resetForm}>
            Reset
          </Button>
        </div>

        {!isValidPriceRange && (
          <p className="col-span-full text-center text-sm text-red-500">
            Min price cannot be greater than max price.
          </p>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
