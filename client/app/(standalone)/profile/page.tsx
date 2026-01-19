"use client"

import { Header } from "@/components/customer-profile/header"
import { ProfileSidebar } from "@/components/customer-profile/profile-sidebar"
import { ProfileCard } from "@/components/customer-profile/profile-card"
import { PersonalInformation } from "@/components/customer-profile/personel-information"
import { AddressesCard } from "@/components/customer-profile/addresses-card"
import { PaymentMethodsCard } from "@/components/customer-profile/payment-methods-card"
import { SecurityCard } from "@/components/customer-profile/side-card"
import { Button } from "@/components/ui/button"

export default function StandaloneProfilePage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <ProfileSidebar />

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <ProfileCard />
            <PersonalInformation />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AddressesCard />
              <PaymentMethodsCard />
            </div>

            <SecurityCard />

            {/* Footer Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="ghost" className="text-foreground">
                Cancel
              </Button>
              <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-8">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
