import Header from '@/components/restaurant/Header'
import PromoBanner from '@/components/restaurant/PromoBanner'
import RestaurantGrid from '@/components/restaurant/RestaurantGrid'
import FiltersSidebar from '@/components/restaurant/FilterSidebar'

export default function RestaurantPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-360 mx-auto px-4 py-6 flex gap-8">
        <FiltersSidebar />

        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-2">
            Good Morning, Student 👋
          </h1>
          <p className="text-gray-500 mb-6">
            What are you craving today?
          </p>

          <PromoBanner />

          <div className="mt-8">
            <RestaurantGrid />
          </div>
        </main>
      </div>
    </div>
  )
}

