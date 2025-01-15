"use client";

import React from "react";
import {
  BathIcon,
  BedIcon,
  BookmarkIcon,
  EditIcon,
  FenceIcon,
  HouseIcon,
  MailIcon,
  MapPinHouseIcon,
  PawPrintIcon,
  ScalingIcon,
  SofaIcon,
  SquareParkingIcon,
  TrashIcon
} from "lucide-react";
import { MdBalcony } from "react-icons/md";
import { useRouter } from "next/navigation";

import Spinner from "@/components/spinner";

import Map from "../../_components/lists/map";
import Slider from "../../_components/slider";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

import { useGetProperty } from "@/hooks/properties/use-get-property.ts";
import { usePropertyId } from "@/hooks/properties/use-property-id";
import { useSaveProperty } from "@/hooks/properties/use-save-property";
import { useDeleteProperty } from "@/hooks/properties/use-delete-property";
import { useConfirm } from "@/hooks/use-confirm";

import { useAuthStore } from "@/stores/use-auth-store";

const PropertyIdPage = () => {
  const propertyId = usePropertyId();

  const { data: property, isLoading } = useGetProperty({ propertyId });
  const { mutate: saveProperty } = useSaveProperty();
  const { mutate: deleteProperty } = useDeleteProperty();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Property",
    "This will permanently delete the property. Are you sure you want to proceed?"
  );

  const handleSaveProperty = () => {
    saveProperty({ propertyId: propertyId });
  };

  const router = useRouter();

  const { isAuthenticated, user } = useAuthStore();

  const handleDeleteProperty = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteProperty(
      { propertyId: property.id },
      {
        onSuccess: () => {
          router.push("/");
        }
      }
    );
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />;
      </div>
    );

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <p className="text-3xl font-semibold mb-6">Property Not Found</p>

        <Button onClick={() => router.push("/")}>Go Back to Homepage</Button>
      </div>
    );
  }

  return (
    <>
      <DeleteDialog />
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/3 xl:w-3/5">
          <Slider images={property.images} />
          <div className="flex items-start justify-between mt-4">
            <div className="flex flex-col gap-4 w-3/5">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <MapPinHouseIcon className="size-5" />
                {property.address},
                <span className="uppercase">{property.postcode}</span>
              </div>
              <p className="text-xl font-medium text-neutral-800 dark:text-neutral-100">
                £{property.price.toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
                <Avatar className="ring-1 ring-neutral-200 dark:ring-neutral-800">
                  <AvatarImage
                    src={property.user?.avatarImage || ""}
                    alt="user-avatar"
                    className="object-cover"
                  />
                  <AvatarFallback className="font-medium text-white bg-neutral-400 dark:bg-neutral-600   flex items-center justify-center text-lg">
                    {property.user?.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <p className="flex items-center text-base font-semibold">
                  {property.user?.username}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {user && user.id === property.userId ? (
                <>
                  <Button
                    variant="muted"
                    size="icon"
                    onClick={() => router.push(`/property/edit/${property.id}`)}
                  >
                    <EditIcon className="!size-4 text-neutral-800 dark:text-neutral-200" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleDeleteProperty}
                  >
                    <TrashIcon className="!size-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="muted"
                    onClick={() => {
                      if (!isAuthenticated) {
                        router.push("/login");
                      } else {
                        window.location.href = `mailto:${property.user?.email}?subject=Interested in ${property.title}&body=Hello, I am interested in your property at ${property.address}, ${property.postcode}.`;
                      }
                    }}
                    className="w-full hover:opacity-80"
                  >
                    <MailIcon className="!size-5" />
                  </Button>
                  <Button
                    variant="muted"
                    onClick={() => {
                      if (!isAuthenticated) {
                        router.push("/login");
                      } else {
                        handleSaveProperty();
                      }
                    }}
                    className="w-full hover:opacity-80"
                  >
                    <BookmarkIcon className="!size-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Property Details */}
        <div className="w-full lg:w-2/3 xl:w-2/5 flex flex-col gap-8">
          {/* Property Details */}
          <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-lg shadow-md">
            <p className="text-2xl text-neutral-800 dark:text-neutral-100">
              <span className="font-semibold">
                {property.listingType === "ForSale" && "For Sale"}
                {property.listingType === "ToRent" && "To Rent"}
                {property.listingType === "Sold" && "Sold"}
                {property.listingType === "Rented" && "Rented"}
              </span>
            </p>
            <Separator className="my-6" />
            <p className="font-semibold text-xl text-neutral-800 dark:text-neutral-100">
              Property Details
            </p>

            {/* Property Description */}
            <div className="mt-6">
              <p className="text-base font-semibold text-neutral-600 dark:text-neutral-300 mb-2">
                Property Description
              </p>
              <p className="">{property.desc}</p>
            </div>

            <div className="mt-6">
              <p className="text-base font-semibold text-neutral-600 dark:text-neutral-300 mb-2">
                Property Type
              </p>
              <div className="flex items-center gap-2">
                <HouseIcon className="size-5" />
                <span>{property.propertyType}</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <p className="font-semibold text-neutral-600 dark:text-neutral-300 mb-2">
                Features
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {property?.furnishedType && (
                  <div className="flex items-center gap-2">
                    <SofaIcon className="size-5" />
                    <span>{property?.furnishedType}</span>
                  </div>
                )}
                {property?.pet && (
                  <div className="flex items-center gap-2">
                    <PawPrintIcon className="size-5" />
                    <span>{property.pet ? "Yes" : "No"}</span>
                  </div>
                )}
                {property?.garden !== undefined && (
                  <div className="flex items-center gap-2">
                    <FenceIcon className="size-5" />
                    <span>{property.garden ? "Yes" : "No"}</span>
                  </div>
                )}
                {property?.balcony !== undefined && (
                  <div className="flex items-center gap-2">
                    <MdBalcony className="size-5" />
                    <span>{property.balcony ? "Yes" : "No"}</span>
                  </div>
                )}
                {property?.parking !== undefined && (
                  <div className="flex items-center gap-2">
                    <SquareParkingIcon className="size-5" />
                    <span>{property.parking ? "Yes" : "No"}</span>
                  </div>
                )}
                {property?.size && (
                  <div className="flex items-center gap-2">
                    <ScalingIcon className="size-5" />
                    <span>{property.size} sqft</span>
                  </div>
                )}
                {property.bedroom && (
                  <div className="flex items-center gap-2">
                    <BedIcon className="size-5" />
                    <span>
                      {property.bedroom} bedroom
                      {property.bedroom > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                {property.bathroom && (
                  <div className="flex items-center gap-2">
                    <BathIcon className="size-5" />
                    <span>
                      {property.bathroom} bathroom
                      {property.bathroom > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Property Location Map */}
          <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-lg shadow-sm space-y-4">
            <p className="font-semibold text-xl text-neutral-800 dark:text-neutral-100">
              Location
            </p>
            <div className="h-80">
              <Map properties={[property]} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyIdPage;
