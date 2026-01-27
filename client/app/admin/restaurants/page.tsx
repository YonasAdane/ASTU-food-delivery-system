
// Use the API route for dashboard data to avoid direct DB calls from the client bundle
import RestaurantGrid from '@/components/restaurant/RestaurantGrid'
export default async function AdminRestaurantPage() {

	return (
		<div className="min-w-4xl p-8">
			<header className="flex justify-between items-end mb-8">
					<div className="flex flex-col gap-1">
						<h2 className="text-3xl font-bold tracking-tight">
							Restaurant Management
						</h2>
						<p className="text-gray-500 dark:text-gray-400">
							Data-driven summary of system performance
						</p>
					</div>
				</header>
			<RestaurantGrid/>
		</div>
	)
}
