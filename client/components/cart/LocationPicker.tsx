"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { Loader2, Crosshair, MapPinOff } from "lucide-react"; 
import { toast } from "sonner"; // Assuming you use sonner or standard alert

// ASTU Coordinates (Fallback)
const DEFAULT_ASTU_COORDS: [number, number] = [8.5561, 39.2903]; 

// Fix for default Leaflet marker icons
const icon = L.divIcon({
  className: "bg-transparent border-none",
  html: `<div class="w-10 h-10 bg-orange-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white transform -translate-x-1/2 -translate-y-1/2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20], // Perfectly centered anchor
});

// --- HELPER 1: Handle User Clicks ---
function LocationMarker({ position, setPosition }: { position: any, setPosition: (pos: any) => void }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={icon} />
  );
}

// --- HELPER 2: Auto-Recenter Map ---
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 16, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function LocationPicker({ onLocationSelect }: { onLocationSelect: (coords: number[]) => void }) {
  // Initialize with ASTU default
  const [center, setCenter] = useState<[number, number]>(DEFAULT_ASTU_COORDS); 
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(false);

  const handleLocateMe = () => {
    setLoadingLoc(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setLoadingLoc(false);
      return;
    }

    // OPTIONS are crucial for fixing "Position Unavailable"
    const options = {
      enableHighAccuracy: true, // Force GPS/High accuracy
      timeout: 10000,           // Wait up to 10s
      maximumAge: 0             // Do not use cached position
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos = [latitude, longitude] as [number, number];
        
        console.log("Location found:", newPos);
        setCenter(newPos);
        setPosition({ lat: latitude, lng: longitude });
        onLocationSelect([longitude, latitude]); 
        toast.success("Location found!");
        setLoadingLoc(false);
      },
      (err) => {
        console.log("Location Error:", err);
        setLoadingLoc(false);
        
        // Handle specific errors
        let msg = "Could not find your location.";
        if (err.code === 1) msg = "Please allow location permission in your browser.";
        if (err.code === 2) msg = "GPS unavailable. Please select manually on the map.";
        if (err.code === 3) msg = "Location request timed out.";
        
        toast.error(msg);
        
        // On failure, ensure we are at least centered on ASTU so they can scroll manually
        setCenter(DEFAULT_ASTU_COORDS);
      },
      options
    );
  };

  // Try to locate immediately on load
  useEffect(() => {
    handleLocateMe();
  }, []);

  const handleSetPosition = (latlng: any) => {
    setPosition(latlng);
    // Leaflet gives {lat, lng}, Mongo expects [lng, lat]
    onLocationSelect([latlng.lng, latlng.lat]);
  };

  return (
    <div className="h-87.5 w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 relative z-0 group">
      <MapContainer center={center} zoom={15} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <RecenterMap center={center} />
        <LocationMarker position={position} setPosition={handleSetPosition} />
      </MapContainer>
      
      {/* "Locate Me" Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleLocateMe();
        }}
        className="absolute bottom-5 right-5 z-1000 bg-white dark:bg-slate-800 p-3 rounded-full shadow-xl border border-gray-200 dark:border-slate-700 hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors active:scale-90"
        title="Find my location"
      >
        {loadingLoc ? <Loader2 className="animate-spin text-orange-600" size={24} /> : <Crosshair className="text-slate-700 dark:text-white" size={24} />}
      </button>

      {/* Manual Helper Text */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-900/95 px-4 py-2 rounded-full text-xs font-bold shadow-lg z-1000 pointer-events-none text-slate-700 dark:text-slate-200 backdrop-blur-sm flex items-center gap-2">
        <MapPinOff size={14} className="text-orange-500"/>
        Tap map to set location manually
      </div>
    </div>
  );
}