"use client"

import { UtensilsCrossed, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RestaurantProfileData } from "@/types/restaurant"

interface BasicInformationProps {
  data: RestaurantProfileData
  onDataChange: (updates: Partial<RestaurantProfileData>) => void
}

const CUISINE_TYPES = ["Mexican", "Italian", "Chinese", "Indian", "American", "Thai", "Japanese", "Mediterranean"]
const PRICE_RANGES = ["$ (Budget)", "$$ (Moderate)", "$$$ (Expensive)", "$$$$ (Very Expensive)"]

export function BasicInformation({ data, onDataChange }: BasicInformationProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-card-foreground">
          <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/30 rounded-lg flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-amber-600 dark:text-amber-500" />
          </div>
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="border-t border-border pt-4">
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Restaurant Name</Label>
              <Input 
                value={data.restaurantName}
                onChange={(e) => onDataChange({ restaurantName: e.target.value })}
                className="bg-muted border-border focus:bg-background text-foreground dark:text-[rgba(135,130,130,1)]"
                placeholder="Enter restaurant name"
              />
            </div>

            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Tagline / Slogan</Label>
              <Input 
                value={data.tagline}
                onChange={(e) => onDataChange({ tagline: e.target.value })}
                className="bg-muted border-border focus:bg-background text-foreground"
                placeholder="Enter tagline or slogan"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Cuisine Type</Label>
                <div className="relative">
                  <select 
                  value={data.cuisineType}
                  onChange={(e) => onDataChange({ cuisineType: e.target.value })}
                  className="w-full h-10 px-3 bg-muted border border-border rounded-md text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent cursor-pointer"
                >
                  {CUISINE_TYPES.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Price Range</Label>
                <div className="relative">
                  <select 
                  value={data.priceRange}
                  onChange={(e) => onDataChange({ priceRange: e.target.value })}
                  className="w-full h-10 px-3 bg-muted border border-border rounded-md text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent cursor-pointer"
                >
                  {PRICE_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
