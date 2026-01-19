"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface LocationContactProps {
  address: string
  latitude: number
  longitude: number
  onLocationChange: (address: string, latitude: number, longitude: number) => void
}

export function LocationContact({ address, latitude, longitude, onLocationChange }: LocationContactProps) {
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [tempAddress, setTempAddress] = useState(address)
  const [tempLat, setTempLat] = useState(latitude)
  const [tempLng, setTempLng] = useState(longitude)

  const handleAddressChange = (newAddress: string) => {
    setTempAddress(newAddress)
    onLocationChange(newAddress, latitude, longitude)
  }

  const handleMapLocationSelect = (lat: number, lng: number) => {
    setTempLat(lat)
    setTempLng(lng)
    onLocationChange(address, lat, lng)
  }

  const handleConfirmLocation = () => {
    onLocationChange(tempAddress, tempLat, tempLng)
    setIsMapOpen(false)
  }

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBFw0Qbyq9zTFTd-tUY6d-s6U4UZu3J9aY"
  
 
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${tempLat},${tempLng}&zoom=15`

  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tempAddress)}`

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-card-foreground">
          <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/30 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-500" />
          </div>
          Location & Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="border-t border-border pt-4">
          <div className="relative h-40 bg-muted rounded-lg overflow-hidden mb-4 border border-border">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={googleMapsEmbedUrl}
              className="w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="pointer-events-auto">
                <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-card/90 hover:bg-card text-card-foreground shadow-lg border-border backdrop-blur-sm">
                      <MapPin className="w-4 h-4 mr-2 text-amber-500 dark:text-amber-400" />
                      Adjust Location
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Select Restaurant Location</DialogTitle>
                      <DialogDescription>
                        Search for your location or click on the map to set the exact coordinates.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">Search Address</Label>
                        <div className="flex gap-2">
                          <Input
                            value={tempAddress}
                            onChange={(e) => setTempAddress(e.target.value)}
                            placeholder="Enter address or search location"
                            className="bg-muted border-border focus:bg-background text-foreground"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              window.open(googleMapsSearchUrl, "_blank")
                            }}
                          >
                            Search on Maps
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-muted-foreground mb-2 block">Latitude</Label>
                          <Input
                            type="number"
                            step="any"
                            value={tempLat}
                            onChange={(e) => setTempLat(parseFloat(e.target.value) || 0)}
                            className="bg-muted border-border focus:bg-background text-foreground"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground mb-2 block">Longitude</Label>
                          <Input
                            type="number"
                            step="any"
                            value={tempLng}
                            onChange={(e) => setTempLng(parseFloat(e.target.value) || 0)}
                            className="bg-muted border-border focus:bg-background text-foreground"
                          />
                        </div>
                      </div>

                      <div className="h-96 rounded-lg overflow-hidden border border-border">
                        <iframe
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${tempLat},${tempLng}&zoom=15`}
                          className="w-full h-full"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsMapOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleConfirmLocation}>
                          Confirm Location
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
                className="bg-muted border-border focus:bg-background pl-10 text-foreground"
                placeholder="Enter restaurant address"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
