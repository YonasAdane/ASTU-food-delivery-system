"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import RestaurantCard from "./RestaurantCard";

export default function RestaurantGrid() {
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `http://localhost:5000/restaurants?${searchParams.toString()}`,{withCredentials:true}
        );
        setRestaurants(res.data.restaurants);
        console.log(res.data.restaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchParams]);

  if (loading) {
    return <p className="text-center">Loading restaurants...</p>;
  }

  if (!restaurants.length) {
    return <p className="text-center">No restaurants found</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {restaurants.map((r) => (
        <RestaurantCard key={r._id} restaurant={r} />
      ))}
    </div>
  );
}
