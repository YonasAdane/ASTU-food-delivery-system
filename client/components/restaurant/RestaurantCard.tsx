'use client'
import { useRouter } from "next/navigation";
type Props = {
  restaurant: {
    _id:string
    name: string;
    image?: string;
    ratings: number;
    deliveryTime: number;
    area: string;
    isOpen: boolean;
  };
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80";

export default function RestaurantCard({ restaurant }: Props) {
  const router= useRouter()
  return (
    <div onClick={()=>router.push(`/customer/restaurant/${restaurant._id}`)} className="group bg-white dark:bg-slate-800 rounded-xl border overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image || DEFAULT_IMAGE}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Delivery Time Badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-900 shadow-sm">
          {restaurant.deliveryTime} mins
        </span>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate pr-2">
            {restaurant.name}
          </h3>
          <span className="flex items-center text-sm font-bold text-amber-500">
            ⭐ {restaurant.ratings || "New"}
          </span>
        </div>

        {/* Using Area as the subtitle/cuisine placeholder */}
        <p className="text-sm text-gray-500 mt-1">{restaurant.area} Area</p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Fast Delivery
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            restaurant.isOpen 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {restaurant.isOpen ? "Open Now" : "Closed"}
          </span>
        </div>
      </div>
    </div>
  );
}