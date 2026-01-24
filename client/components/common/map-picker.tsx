"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/* FIX Leaflet icons */
// if (typeof window !== "undefined") {
//   delete (L.Icon.Default.prototype as any)._getIconUrl;
//   L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x.src,
//     iconUrl: markerIcon.src,
//     shadowUrl: markerShadow.src,
//   });
// }

export default function MapPicker({
  lat,
  lng,
  onChange,
  zoom = 8,
}: {
  lat: number;
  lng: number;
  onChange?: (lat: number, lng: number) => void;
  zoom?: number;
}) {
  const [position, setPosition] = useState<[number, number]>([lat, lng]);

  useEffect(() => {
    setPosition([lat, lng]);
  }, [lat, lng]);

  const markerIconDiv = useMemo(() => {
    const svg = `
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" stroke-width="1.5">
        <path d="M12 2C8.1 2 5 5.1 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.9-3.1-7-7-7z"></path>
        <circle cx="12" cy="9" r="3" fill="white" />
      </svg>
    `;
    return L.divIcon({
      html: svg,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
    });
  }, []);
  

  return (
    <div className="h-[360px] w-full rounded-md overflow-hidden border">
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker
          position={position}
          draggable
          icon={markerIconDiv}
          eventHandlers={{
            // dragend(e) {
            //   const m = e.target as L.Marker;
            //   const p = m.getLatLng();
            //   setPosition([p.lat, p.lng]);
            //   onChange?.(p.lat, p.lng);
            // },
          }}
        />
      </MapContainer>
    </div>
  );
}
