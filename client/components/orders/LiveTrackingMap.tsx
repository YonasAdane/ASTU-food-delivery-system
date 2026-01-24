"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";

import L from "leaflet";
import axios from "axios";

// --- CUSTOM ICONS ---
const createIcon = (color: string, iconHtml: string) => L.divIcon({
  className: "bg-transparent",
  html: `<div class="w-10 h-10 ${color} rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white transform hover:scale-110 transition-transform">${iconHtml}</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// 🏠 Customer Icon
const userIcon = createIcon("bg-blue-600", `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`);

// 🏪 Restaurant Icon
const restaurantIcon = createIcon("bg-orange-600", `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`);

// 🚗 Driver Icon
const driverIcon = createIcon("bg-green-600", `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="8" x="2" y="8" rx="4"/><path d="M10 10V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v5"/><path d="M6 19v2"/><path d="M17 19v2"/></svg>`);


function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13);
  }, [center, map]);
  return null;
}

interface TrackingProps {
  customerLocation: [number, number]; // [lat, lng]
  restaurantLocation: [number, number]; // [lat, lng]
  driverId?: string;
}

export default function LiveTrackingMap({ customerLocation, restaurantLocation, driverId }: TrackingProps) {
  const [driverLocation, setDriverLocation] = useState<[number, number] | null>(null);

  // Poll for driver location every 10 seconds
  useEffect(() => {
    if (!driverId) return;

    const fetchDriverLoc = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/drivers/${driverId}/location`);
        const coords = res.data.data.currentLocation.coordinates; // [lng, lat]
        // Leaflet needs [lat, lng], Mongo gives [lng, lat]
        setDriverLocation([coords[1], coords[0]]);
      } catch (err) {
        console.error("Failed to track driver", err);
      }
    };

    fetchDriverLoc(); // Initial call
    const interval = setInterval(fetchDriverLoc, 10000); // Poll every 10s

    return () => clearInterval(interval);
  }, [driverId]);

  return (
    <div className="h-100 w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 z-0 relative">
      <MapContainer center={customerLocation} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* Customer Marker */}
        <Marker position={customerLocation} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>

        {/* Restaurant Marker */}
        <Marker position={restaurantLocation} icon={restaurantIcon}>
          <Popup>Restaurant</Popup>
        </Marker>

        {/* Driver Marker (If available) */}
        {driverLocation && (
          <Marker position={driverLocation} icon={driverIcon}>
            <Popup>Driver</Popup>
          </Marker>
        )}

        {/* Line from Restaurant to Customer */}
        <Polyline positions={[restaurantLocation, customerLocation]} color="orange" dashArray="10, 10" />
        
        {/* Line from Driver to Customer (if driver exists) */}
        {driverLocation && (
          <Polyline positions={[driverLocation, customerLocation]} color="green" />
        )}

      </MapContainer>
    </div>
  );
}