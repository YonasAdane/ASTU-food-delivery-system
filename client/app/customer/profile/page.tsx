"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/profile/header"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { ProfileCard } from "@/components/profile/profile-card"
import { PersonalInformation } from "@/components/profile/personel-information"
import { AddressesCard } from "@/components/profile/addresses-card"
import { PaymentMethodsCard } from "@/components/profile/payment-methods-card"
import { SecurityCard } from "@/components/profile/side-card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function ProfilePage() {
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7244/ingest/86b2df56-d754-4baa-b70e-e72d02b31cab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'profile/page.tsx:14',
        message: 'ProfilePage component mounted',
        data: { hydrated: typeof window !== 'undefined' },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'B'
      })
    }).catch(() => {});
  }, []);
  // #endregion

  const [profileData, setProfileData] = useState({
    name: "John Doe",
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@astu.edu",
    phone: "+251 91 234 5678",
    avatarFile: null as File | null
  })

  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleNameChange = (name: string) => {
    const parts = name.split(" ")
    setProfileData(prev => ({
      ...prev,
      name,
      firstName: parts[0] || prev.firstName,
      lastName: parts.slice(1).join(" ") || prev.lastName
    }))
    setHasChanges(true)
  }

  const handleAvatarChange = (file: File) => {
    setProfileData(prev => ({ ...prev, avatarFile: file }))
    setHasChanges(true)
  }

  const handleFieldChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/86b2df56-d754-4baa-b70e-e72d02b31cab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'profile/page.tsx:48',
          message: 'handleSave started',
          data: { profileData },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'A'
        })
      }).catch(() => {});
      // #endregion
 
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Profile updated successfully!")
      setHasChanges(false)
    } catch (error) {
   
      fetch('http://127.0.0.1:7244/ingest/86b2df56-d754-4baa-b70e-e72d02b31cab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'profile/page.tsx:66',
          message: 'handleSave error caught',
          data: { error: error instanceof Error ? error.message : String(error) },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'A'
        })
      }).catch(() => {});
      // #endregion
      toast.error("Failed to update profile. Please try again.")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset to original values
    setProfileData({
      name: "John Doe",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@astu.edu",
      phone: "+251 91 234 5678",
      avatarFile: null
    })
    setHasChanges(false)
    toast.info("Changes discarded")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="flex gap-6">
   
          <ProfileSidebar />

    
          <div className="flex-1 space-y-6">
            <ProfileCard
              name={profileData.name}
              email={profileData.email}
              onNameChange={handleNameChange}
              onAvatarChange={handleAvatarChange}
            />
            <PersonalInformation
              firstName={profileData.firstName}
              lastName={profileData.lastName}
              email={profileData.email}
              phone={profileData.phone}
              onFieldChange={handleFieldChange}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AddressesCard />
              <PaymentMethodsCard />
            </div>

            <SecurityCard />
  
            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="ghost"
                className="text-foreground"
                onClick={handleCancel}
                disabled={!hasChanges || isSaving}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#f48c25] hover:bg-[#16a34a] text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
