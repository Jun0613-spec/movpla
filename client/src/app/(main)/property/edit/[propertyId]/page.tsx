"use client";

import React, { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { ImageIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { editPropertySchema } from "@/lib/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import Spinner from "@/components/spinner";

import { useEditProperty } from "@/hooks/properties/use-edit-property";
import { useGetProperty } from "@/hooks/properties/use-get-property.ts";
import { usePropertyId } from "@/hooks/properties/use-property-id";

const PropertyEditPage = () => {
  const propertyId = usePropertyId();
  const { mutate: editProperty, isPending } = useEditProperty();
  const { data: property } = useGetProperty({ propertyId });

  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const [imagePreviews, setImagePreviews] = useState<string[]>(
    property?.images || []
  );

  const form = useForm<z.infer<typeof editPropertySchema>>({
    resolver: zodResolver(editPropertySchema),

    defaultValues: {
      ...property,
      bedroom: property.bedroom.toString(),
      bathroom: property.bathroom.toString(),
      price: property.price.toString(),
      size: property.size.toString(),
      images: property?.images || []
    }
  });

  const onSubmit = (values: z.infer<typeof editPropertySchema>) => {
    const formData = new FormData();

    formData.append("title", values.title || "");
    formData.append("desc", values.desc || "");
    formData.append("address", values.address || "");
    formData.append("postcode", values.postcode || "");
    formData.append("city", values.city || "");
    formData.append("price", values.price?.toString() || "");
    formData.append("bedroom", values.bedroom?.toString() || "");
    formData.append("bathroom", values.bathroom?.toString() || "");
    formData.append("size", values.size ? values.size.toString() : "");
    formData.append("latitude", values.latitude || "");
    formData.append("longitude", values.longitude || "");
    formData.append("listingType", values.listingType || "");
    formData.append("propertyType", values.propertyType || "");
    formData.append("furnishedType", values.furnishedType || "");
    formData.append("pet", values.pet?.toString() || "");
    formData.append("garden", values.garden?.toString() || "");
    formData.append("balcony", values.balcony?.toString() || "");
    formData.append("parking", values.parking?.toString() || "");

    if (values.images && Array.isArray(values.images)) {
      values.images.forEach((file) => {
        if (file) {
          formData.append("images", file);
        }
      });
    }

    editProperty(
      { propertyId, propertyData: formData },
      {
        onSuccess: () => {
          router.push(`/property/${property.id}`);
        }
      }
    );
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const newPreviews = fileArray.map((file) => URL.createObjectURL(file));

      const updatedImages = [
        ...(form.getValues("images") || []),
        ...fileArray
      ] as [string | File | undefined, ...(string | File | undefined)[]];

      form.setValue("images", updatedImages);
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    const updatedPreviews = imagePreviews.filter((url) => url !== imageUrl);
    setImagePreviews(updatedPreviews);

    const images = form.getValues("images") || [];

    const updatedFiles = images.filter(
      (_, index) => imagePreviews[index] !== imageUrl
    ) as [string | File | undefined, ...(string | File | undefined)[]];

    form.setValue("images", updatedFiles);
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row items-stretch overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-[3] p-8 overflow-y-auto no-scrollbar  ">
        <h1 className="text-3xl font-semibold mb-8">Edit Property</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your property title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your property description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your property address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                      Postcode
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter the postcode" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                      City
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter the city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              <FormField
                control={form.control}
                name="bedroom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                      Bedrooms
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Number of bedrooms" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathroom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                      Bathrooms
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Number of bathrooms" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                      Price £
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter the price" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                      Size
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter the size in sqft" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                      Latitude
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter the latitude" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                      Longitude
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter the longitude" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="listingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                      Listing Type
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ForSale">For Sale</SelectItem>
                          <SelectItem value="ToRent">To Rent</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                      Property Type
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="House">House</SelectItem>
                          <SelectItem value="Flat">Flat</SelectItem>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="Studio">Studio</SelectItem>
                          <SelectItem value="Bungalow">Bungalow</SelectItem>
                          <SelectItem value="Land">Land</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="furnishedType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                      Furnished Type
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select furnishing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Furnished">Furnished</SelectItem>
                          <SelectItem value="PartFurnished">
                            Part Furnished
                          </SelectItem>
                          <SelectItem value="Unfurnished">
                            Unfurnished
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="pet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                      Pet Policy
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ? "true" : "false"}
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select pet policy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="garden"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                      Garden
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ? "true" : "false"}
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Has garden?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="balcony"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                      Balcony
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ? "true" : "false"}
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Has balcony??" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                      Parking
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ? "true" : "false"}
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Has parking space??" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full bg-neutral-100 dark:bg-neutral-800 p-6 rounded-md shadow-sm border border-neutral-300 dark:border-neutral-600">
              <h2 className="text-lg font-semibold text-neutral-700 mb-4">
                Property Images
              </h2>
              <div className="w-full flex flex-wrap gap-4 justify-start items-center">
                {imagePreviews.length > 0 ? (
                  imagePreviews.map((url, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={url}
                        alt={`Preview ${index}`}
                        width={96}
                        height={96}
                        className="object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="muted"
                        size="icon"
                        onClick={() => handleRemoveImage(url)}
                        className="size-6 absolute top-0 right-0 text-neutral-100 p-0.5 bg-red-500 rounded-full"
                      >
                        <XIcon />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="size-32 border border-dashed border-neutral-400 rounded-md flex items-center justify-center text-neutral-500">
                    <ImageIcon className="size-20" />
                  </div>
                )}
              </div>
              <Input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*"
                className="mt-4 file:cursor-pointer file:rounded file:border-0 file:bg-neutral-600 dark:file:bg-neutral-950 file:text-white hover:file:bg-neutral-700 dark:hover:file:bg-neutral-900"
                onChange={handleImageChange}
              />
            </div>
            <div className="flex justify-end ">
              <Button type="submit" disabled={isPending}>
                {isPending ? <Spinner /> : "Edit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PropertyEditPage;
