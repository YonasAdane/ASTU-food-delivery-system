export interface RestaurantProfileData {
  restaurantName: string
  tagline: string
  cuisineType: string
  priceRange: string
  address: string
  latitude: number
  longitude: number
  coverImage: string | File | null
  logoImage: string | File | null
}
