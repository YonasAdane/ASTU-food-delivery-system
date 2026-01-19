"use client"

import { useState, useCallback } from "react"
import { PartnerSidebar } from "@/components/profile/partner-sidebar"
import { PartnerHeader } from "@/components/profile/partner-header"
import { RestaurantCover } from "@/components/profile/restaurant-cover"
import { BasicInformation } from "@/components/profile/basic-information"
import { LocationContact } from "@/components/profile/location-contact"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { RestaurantProfileData } from "@/types/restaurant"

const defaultData: RestaurantProfileData = {
  restaurantName: "Spicy Bites",
  tagline: "Best Tacos on Campus",
  cuisineType: "Mexican",
  priceRange: "$$ (Moderate)",
  address: "Adama Science and Technology University",
  latitude: 38.7577,
  longitude: -9.1168,
  coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
  logoImage: null,
}

export default function RestaurantProfilePage() {
  const [profileData, setProfileData] = useState<RestaurantProfileData>(defaultData)
  const [originalData, setOriginalData] = useState<RestaurantProfileData>(defaultData)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  const updateProfileData = useCallback((updates: Partial<RestaurantProfileData>) => {
    setProfileData((prev) => {
      const newData = { ...prev, ...updates }
    
      const prevForCompare = { ...prev, coverImage: prev.coverImage instanceof File ? "FILE" : prev.coverImage, logoImage: prev.logoImage instanceof File ? "FILE" : prev.logoImage }
      const newForCompare = { ...newData, coverImage: newData.coverImage instanceof File ? "FILE" : newData.coverImage, logoImage: newData.logoImage instanceof File ? "FILE" : newData.logoImage }
      const origForCompare = { ...originalData, coverImage: originalData.coverImage instanceof File ? "FILE" : originalData.coverImage, logoImage: originalData.logoImage instanceof File ? "FILE" : originalData.logoImage }
      const changed = JSON.stringify(newForCompare) !== JSON.stringify(origForCompare)
      setHasChanges(changed)
      return newData
    })
  }, [originalData])

  const handleSave = useCallback(async () => {
    try {
   
      const formData = new FormData()
      Object.entries(profileData).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value)
        } else if (value !== null) {
          formData.append(key, String(value))
        }
      })

      await new Promise((resolve) => setTimeout(resolve, 1000))

   
      const savedData: RestaurantProfileData = {
        ...profileData,
        coverImage: profileData.coverImage instanceof File 
          ? URL.createObjectURL(profileData.coverImage) 
          : profileData.coverImage,
        logoImage: profileData.logoImage instanceof File 
          ? URL.createObjectURL(profileData.logoImage) 
          : profileData.logoImage,
      }
      
      setOriginalData(savedData)
      setLastSaved(new Date())
      setHasChanges(false)
      toast.success("Profile saved successfully!")
    } catch (error) {
      toast.error("Failed to save profile. Please try again.")
      console.error("Save error:", error)
    }
  }, [profileData])

  const handleDiscard = useCallback(() => {
    setProfileData({ ...originalData })
    setHasChanges(false)
    toast.info("Changes discarded")
  }, [originalData])

  return (
    <div className="flex min-h-screen bg-background">
      <PartnerSidebar />
      <div className="flex-1 flex flex-col">
        <PartnerHeader />
        <main className="flex-1 p-8 bg-background">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Restaurant Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your restaurant&apos;s public information, branding, and operating details.
            </p>
          </div>

          <RestaurantCover 
            coverImage={profileData.coverImage}
            logoImage={profileData.logoImage}
            restaurantName={profileData.restaurantName}
            cuisineType={profileData.cuisineType}
            onCoverImageChange={(file) => updateProfileData({ coverImage: file })}
            onLogoImageChange={(file) => updateProfileData({ logoImage: file })}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <BasicInformation 
              data={profileData}
              onDataChange={updateProfileData}
            />
            <LocationContact 
              address={profileData.address}
              latitude={profileData.latitude}
              longitude={profileData.longitude}
              onLocationChange={(address, lat, lng) => 
                updateProfileData({ address, latitude: lat, longitude: lng })
              }
            />
          </div>
        </main>

        <footer className="border-t border-border bg-card px-8 py-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {lastSaved 
              ? `Last saved: ${format(lastSaved, "MMM d, yyyy 'at' h:mm a")}`
              : "No changes saved yet"
            }
          </span>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="bg-transparent text-foreground border-border"
              onClick={handleDiscard}
              disabled={!hasChanges}
            >
              Discard Changes
            </Button>
            <Button 
              className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white"
              onClick={handleSave}
              disabled={!hasChanges}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </div>
        </footer>
      </div>
    </div>
  )
}
