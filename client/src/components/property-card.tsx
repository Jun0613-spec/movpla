"use client";

import {
  BathIcon,
  BedIcon,
  BookmarkIcon,
  EditIcon,
  MapPinHouseIcon,
  TrashIcon
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";

import { Property } from "@/types";

import { useSaveProperty } from "@/hooks/properties/use-save-property";
import { useDeleteProperty } from "@/hooks/properties/use-delete-property";
import { useConfirm } from "@/hooks/use-confirm";

import { useAuthStore } from "@/stores/use-auth-store";
import { useSavePropertyStore } from "@/stores/use-save-property-store";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const { user } = useAuthStore();

  const { mutate: saveProperty } = useSaveProperty();
  const { mutate: deleteProperty } = useDeleteProperty();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Property",
    "This will permanently delete the property. Are you sure you want to proceed?"
  );

  const { savedProperties, toggleSavedProperty } = useSavePropertyStore();

  const isSaved = savedProperties[property.id] || false;

  const handleSaveProperty = () => {
    toggleSavedProperty(property.id);

    saveProperty({ propertyId: property.id });
  };

  const handleDeleteProperty = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteProperty({ propertyId: property.id });
  };

  const isOwner = user && user.id === property.userId;

  const isProfilePage = pathname.includes("/profile");

  return (
    <>
      <DeleteDialog />
      <div className="flex flex-col md:flex-row gap-6 p-5 bg-white dark:bg-neutral-800 shadow-lg rounded-xl overflow-hidden">
        <Link
          href={`/property/${property.id}`}
          className="relative w-full h-48 md:w-64 md:h-auto rounded-lg overflow-hidden flex-shrink-0"
        >
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover rounded-lg transition-all hover:scale-105"
          />
        </Link>

        {/* Property Details */}
        <div className="flex-1 flex flex-col justify-between">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors mb-3">
            <Link href={`/property/${property.id}`}>{property.title}</Link>
          </h2>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2 mb-2">
            <MapPinHouseIcon className="size-4 text-neutral-600 dark:text-neutral-400" />
            <span>
              {property.address}, {property.postcode}
            </span>
          </p>

          <p className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
            £{property.price.toLocaleString()}
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4 sm:gap-8">
            <div className="flex flex-wrap gap-4 text-xs text-neutral-700 dark:text-neutral-200">
              <div className="flex items-center gap-2">
                <BedIcon className="size-4" />
                <span>
                  {property.bedroom} bedroom{property.bedroom > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BathIcon className="size-4" />
                <span>
                  {property.bathroom} bathroom{property.bathroom > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              {!isProfilePage && (
                <div className="space-x-4">
                  <Button
                    variant="muted"
                    size="icon"
                    onClick={handleSaveProperty}
                  >
                    {!isSaved ? (
                      <BookmarkIcon className="!size-4 fill-neutral-800 dark:fill-neutral-200" />
                    ) : (
                      <BookmarkIcon className="!size-4 text-neutral-800 dark:text-neutral-200" />
                    )}
                  </Button>
                </div>
              )}

              {isOwner && (
                <>
                  <Button
                    variant="muted"
                    size="icon"
                    onClick={() => router.push(`/property/edit/${property.id}`)}
                  >
                    <EditIcon className="!size-4 text-neutral-800 dark:text-neutral-200" />
                  </Button>
                  <Button
                    onClick={handleDeleteProperty}
                    variant="destructive"
                    size="icon"
                  >
                    <TrashIcon className="!size-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyCard;
