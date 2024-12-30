"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { Property } from "@/types";

interface PinProps {
  property: Property;
}

const Pin = ({ property }: PinProps) => {
  const customIcon = new L.Icon({
    iconUrl: "/images/map-pin.png",
    iconSize: [32, 32],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  const imageUrl = property.images?.[0] || "/images/no-image.png";

  const latitude = Number(property.latitude);
  const longitude = Number(property.longitude);

  return (
    <Marker position={[latitude, longitude]} icon={customIcon}>
      <Popup>
        <div className="flex gap-4 w-80  rounded-md">
          <Image
            src={imageUrl}
            alt={property.title}
            height={100}
            width={100}
            className="object-cover rounded-md"
          />
          <div className="flex flex-col justify-between">
            <Link
              href={`/property/${property.id}`}
              className="text-blue-600 font-semibold hover:underline text-base"
            >
              {property.title}
            </Link>
            <div className="flex items-center space-x-1 text-sm text-neutral-600 ">
              <span>
                {property.bedroom} bedroom{property.bedroom > 1 ? "s" : ""}
              </span>
            </div>
            <p className="text-neutral-900  text-lg font-semibold">
              £{property.price}
            </p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default Pin;
