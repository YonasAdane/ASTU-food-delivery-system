"use client"

import { MapPin, Plus, Home, Briefcase, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

export function AddressesCard() {
  const [addresses, setAddresses] = useState([
    { id: 1, type: "Home", address: "123 Campus Dorm, Block B, Room 304, Adama Science and Technology University", isDefault: true },
    { id: 2, type: "Work", address: "Science Library, 2nd Floor, Quiet Zone", isDefault: false }
  ])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editAddress, setEditAddress] = useState("")

  const handleAddressClick = (id: number, address: string) => {
    setEditingId(id)
    setEditAddress(address)
  }

  const handleSaveAddress = (id: number) => {
    setAddresses(prev => prev.map(addr => 
      addr.id === id ? { ...addr, address: editAddress } : addr
    ))
    setEditingId(null)
    setEditAddress("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditAddress("")
  }

  const handleSetDefault = (id: number) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })))
  }

  const handleDeleteAddress = (id: number) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setAddresses(prev => prev.filter(addr => addr.id !== id))
    }
  }

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#22c55e]" />
          <h3 className="text-lg font-semibold text-foreground">Addresses</h3>
        </div>
        <button className="text-[#22c55e] hover:text-[#16a34a] cursor-pointer transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`p-4 border border-border rounded-lg bg-card cursor-pointer hover:bg-muted transition-colors ${
              address.isDefault ? "border-[#f48c25]" : ""
            }`}
            onClick={() => !editingId && handleAddressClick(address.id, address.address)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {address.type === "Home" ? (
                  <Home className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="font-medium text-foreground">{address.type}</span>
              </div>
              <div className="flex items-center gap-2">
                {address.isDefault ? (
                  <span className="px-2 py-1 bg-[#f48c25] text-white text-xs font-medium rounded">
                    DEFAULT
                  </span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSetDefault(address.id)
                    }}
                    className="text-xs text-muted-foreground hover:text-[#f48c25]"
                  >
                    Set as default
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteAddress(address.id)
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {editingId === address.id ? (
              <div className="space-y-2">
                <textarea
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full p-2 border border-border rounded-lg resize-none bg-background text-foreground"
                  rows={3}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSaveAddress(address.id)
                    }}
                    className="text-sm text-[#22c55e] hover:text-[#16a34a] font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCancelEdit()
                    }}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{address.address}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
