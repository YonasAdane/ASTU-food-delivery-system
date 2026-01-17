type Props = {
  restaurant: any;
};

export default function RestaurantCard({ restaurant }: Props) {
  return (
    <div className="group bg-white dark:bg-surface-dark rounded-xl border overflow-hidden shadow-2xl transition-transform duration-750 hover:scale-105">
      
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-2000 group-hover:scale-110"
        />
        <span className="absolute top-3 left-3 bg-white px-2 py-1 rounded text-xs font-bold dark:text-slate-900">
          {restaurant.time}
        </span>
      </div>

      <div className="p-4">
        <div className="flex justify-between">
          <h3 className="font-bold dark:text-slate-900">
            {restaurant.name}
          </h3>
          <span className="text-sm font-bold text-secondary">
            ⭐ {restaurant.rating}
          </span>
        </div>

        <p className="text-sm text-gray-500">{restaurant.cuisine}</p>

        <div className="flex justify-between mt-4">
          <span className="text-sm font-semibold dark:text-slate-900">
            {restaurant.delivery}
          </span>
          <span className="text-xs bg-secondary/10 px-2 py-1 rounded-full dark:text-slate-900">
            {restaurant.status}
          </span>
        </div>
      </div>
    </div>
  );
}
