"use client";

import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";

import Pin from "./pin";

import { Property } from "@/types";

interface MapProps {
  properties?: Property[];
}

const Map = ({ properties = [] }: MapProps) => {
  const { theme } = useTheme();

  const defaultCenter: [number, number] = [52.4797, -1.90269];

  const center =
    properties.length === 1
      ? [
          Number(properties[0]?.latitude) || defaultCenter[0],
          Number(properties[0]?.longitude) || defaultCenter[1]
        ]
      : defaultCenter;

  const safeProperties = Array.isArray(properties) ? properties : [];

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={7}
      scrollWheelZoom={false}
      className="h-full w-full rounded-xl relative z-0 "
    >
      {theme === "light" ? (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      ) : (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />
      )}

      {/* {properties.map((property) => (
        <Pin property={property} key={property.id} />
      ))} */}
      {safeProperties.map((property) => (
        <Pin property={property} key={property.id} />
      ))}
    </MapContainer>
  );
};

export default Map;
