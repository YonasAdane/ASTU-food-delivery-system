import { Button } from "@/components/ui/button";
import { Loader2, LocateFixed } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CaptureLocationButtonProps {
  disabled?: boolean;
  onCapture: (lat: number, lng: number) => void;
}

export function CaptureLocationButton({
  disabled,
  onCapture,
}: CaptureLocationButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCapture = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        onCapture(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      () => {
        setLoading(false);
        toast.error("Failed to get current location");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full md:w-fit"
      onClick={handleCapture}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Capturing location...
        </>
      ) : (
        <>
          <LocateFixed className=" h-4 w-4 text-primary" />
          {/* Use my current location */}
        </>
      )}
    </Button>
  );
}
