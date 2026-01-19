"use client"

import { useRef, useState, useEffect } from "react"
import { Camera, Pencil, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface RestaurantCoverProps {
  coverImage: string | File | null
  logoImage: string | File | null
  restaurantName: string
  cuisineType: string
  onCoverImageChange: (file: File | null) => void
  onLogoImageChange: (file: File | null) => void
}

export function RestaurantCover({
  coverImage,
  logoImage,
  restaurantName,
  cuisineType,
  onCoverImageChange,
  onLogoImageChange,
}: RestaurantCoverProps) {
  const coverInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  useEffect(() => {
    if (coverImage instanceof File) {
   
      const preview = URL.createObjectURL(coverImage)
      setCoverPreview(preview)
      return () => {
        URL.revokeObjectURL(preview)
      }
    } else {
      
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview)
      }
      setCoverPreview(null)
    }
  }, [coverImage])

  useEffect(() => {
    if (logoImage instanceof File) {
      const preview = URL.createObjectURL(logoImage)
      setLogoPreview(preview)
      return () => URL.revokeObjectURL(preview)
    } else if (logoImage && typeof logoImage === "string") {
      setLogoPreview(null)
    } else {
      setLogoPreview(null)
    }
  }, [logoImage])

  const getCoverImageUrl = () => {
  
    if (coverImage instanceof File) {
      return coverPreview || ""
    }
    if (coverImage && typeof coverImage === "string") {
      return coverImage
    }
    return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"
  }

  const getLogoImageUrl = () => {
    if (logoImage instanceof File) {
      return logoPreview || ""
    }
    if (logoImage && typeof logoImage === "string") {
      return logoImage
    }
    return null
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) { 
        if (coverPreview) {
          URL.revokeObjectURL(coverPreview)
        }

        const preview = URL.createObjectURL(file)
        setCoverPreview(preview)
      
        onCoverImageChange(file)
      } else {
        alert("Please select an image file")
      }
    }
    setTimeout(() => {
      if (coverInputRef.current) {
        coverInputRef.current.value = ""
      }
    }, 100)
  }

  const handleLogoImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        onLogoImageChange(file)
      } else {
        alert("Please select an image file")
        if (logoInputRef.current) {
          logoInputRef.current.value = ""
        }
      }
    }
  }

  const handleRemoveCover = () => {
    onCoverImageChange(null)
    if (coverInputRef.current) {
      coverInputRef.current.value = ""
    }
  }

  const handleRemoveLogo = () => {
    onLogoImageChange(null)
    if (logoInputRef.current) {
      logoInputRef.current.value = ""
    }
  }

  const coverImageUrl = getCoverImageUrl()

  return (
    <div className="relative">

      <div className="relative h-64 rounded-xl overflow-hidden bg-amber-900 dark:bg-amber-950">
    
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 z-10" />
        
     
        <img
          src={coverImageUrl}
          alt="Restaurant cover"
          className="w-full h-full object-cover"
          key={coverImage instanceof File ? `file-${coverPreview || Date.now()}` : `url-${coverImageUrl}`}
          onError={(e) => {   
            e.currentTarget.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"
          }}
        />
        
        <input
          type="file"
          ref={coverInputRef}
          accept="image/*"
          onChange={handleCoverImageChange}
          className="hidden"
        />
        <div className="absolute bottom-4 right-4 flex gap-2 z-20">
          {coverImage && (
            <Button
              variant="outline"
              size="icon"
              className="bg-card hover:bg-muted text-card-foreground border-border"
              onClick={handleRemoveCover}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button 
            variant="outline" 
            className="bg-card hover:bg-muted text-card-foreground border-border"
            onClick={() => coverInputRef.current?.click()}
          >
            <Camera className="w-4 h-4 mr-2" />
            {coverImage ? "Change Cover" : "Add Cover"}
          </Button>
        </div>
      </div>

      <div className="flex items-end gap-6 -mt-16 ml-6 relative z-10">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-amber-50 dark:bg-amber-950/30 border-4 border-background shadow-lg flex items-center justify-center overflow-hidden">
            {getLogoImageUrl() ? (
              <Image
                src={getLogoImageUrl()!}
                alt="Restaurant logo"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span className="text-amber-600 dark:text-amber-500 text-2xl">🌶️</span>
                <span className="text-amber-700 dark:text-amber-400 font-bold text-xs mt-1">
                  {restaurantName.toUpperCase().slice(0, 12)}
                </span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={logoInputRef}
            accept="image/*"
            onChange={handleLogoImageChange}
            className="hidden"
          />
          <button 
            className="absolute bottom-2 right-2 w-8 h-8 bg-amber-500 dark:bg-amber-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-amber-600 dark:hover:bg-amber-700 transition-colors"
            onClick={() => logoInputRef.current?.click()}
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">{restaurantName}</h2>
            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded">
              VERIFIED
            </span>
            <span className="text-muted-foreground">• {cuisineType} Cuisine</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 border border-green-200 dark:border-green-800 rounded-full bg-card">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-green-600 dark:text-green-400 font-medium text-sm">Open for Orders</span>
          </div>
        </div>
      </div>
    </div>
  )
}
