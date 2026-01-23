import { MapPin } from "lucide-react";

// Predefined coordinates for common campus areas to satisfy the backend Schema
const CAMPUS_ZONES = [
  { name: "Main Gate Area", coords: [39.2900, 8.5500] }, // Example coords
  { name: "Freshman Dorms (Block 1-20)", coords: [39.2910, 8.5510] },
  { name: "Senior Dorms (Block 21-50)", coords: [39.2920, 8.5520] },
  { name: "Library Complex", coords: [39.2930, 8.5530] },
  { name: "Engineering Building", coords: [39.2940, 8.5540] },
  { name: "Student Lounge / Cafe", coords: [39.2950, 8.5550] },
];

interface DeliveryInputProps {
  locationText: string;
  onLocationChange: (text: string) => void;
  onZoneSelect: (coords: number[]) => void;
}

export function DeliveryInput({ locationText, onLocationChange, onZoneSelect }: DeliveryInputProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600">
          <MapPin size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Delivery Location</h2>
      </div>

      <div className="space-y-4">
        {/* 1. Zone Selector (Hidden Coordinates) */}
        <div>
          <label className="text-sm font-semibold text-slate-500 mb-1 block">Select your general area</label>
          <select 
            onChange={(e) => {
              const zone = CAMPUS_ZONES.find(z => z.name === e.target.value);
              if (zone) onZoneSelect(zone.coords);
            }}
            className="w-full p-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">-- Select Campus Zone --</option>
            {CAMPUS_ZONES.map((zone) => (
              <option key={zone.name} value={zone.name}>{zone.name}</option>
            ))}
          </select>
        </div>

        {/* 2. Specific Details Input */}
        <div className="relative">
          <label className="text-sm font-semibold text-slate-500 mb-1 block">Specific details</label>
          <textarea
            value={locationText}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="e.g. Block 42, 3rd Floor, Room 305 (Call me when you arrive)"
            className="w-full p-4 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none h-24"
          />
        </div>
      </div>
    </div>
  );
}