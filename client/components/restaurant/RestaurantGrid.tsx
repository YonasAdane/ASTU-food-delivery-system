import RestaurantCard from './RestaurantCard'
import { restaurants } from '@/components/data/restaurants'

export default function RestaurantGrid() {
  // TODO: Replace with API call
  // const { data } = await fetch('/api/restaurants')
  const data = restaurants
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map(r => (
        <RestaurantCard key={r.id} restaurant={r} />
      ))}
    </div>
  )
}
