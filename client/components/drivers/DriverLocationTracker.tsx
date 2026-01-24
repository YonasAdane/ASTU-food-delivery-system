"use client";

import { useEffect } from "react";
import axios from "axios";

export default function DriverLocationTracker({ driverId }: { driverId: string }) {
  
  useEffect(() => {
    if (!navigator.geolocation) return;

    const sendLocation = (pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords;
      
      // Hit your specific endpoint
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/drivers/${driverId}/location`, {
        latitude,
        longitude
      }, { withCredentials: true }).catch(err => console.log("Loc update failed", err));
    };

    // 1. Send immediately
    navigator.geolocation.getCurrentPosition(sendLocation);

    // 2. Watch for changes (throttle this in production to save battery/API calls)
    const watchId = navigator.geolocation.watchPosition(
      sendLocation, 
      (err) => console.log(err), 
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [driverId]);

  return null; 
}