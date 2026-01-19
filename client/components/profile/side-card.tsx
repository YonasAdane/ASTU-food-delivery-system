"use client"

import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function SecurityCard() {
  const [showDialog, setShowDialog] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const handleChangePassword = () => {
    setShowDialog(true)
  }

  const handleSavePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!")
      return
    }
    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!")
      return
    }

    alert("Password changed successfully!")
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setShowDialog(false)
  }

  const handleCancel = () => {
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setShowDialog(false)
  }

  return (
    <>
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-[#f59e0b]" />
          <h3 className="text-lg font-semibold text-foreground">Security</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Password</p>
            <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
          </div>
          <Button
            variant="outline"
            className="border-border text-[var(--background)] hover:bg-muted bg-transparent cursor-pointer"
            onClick={handleChangePassword}
          >
            Change Password
          </Button>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Current Password</label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSavePassword} className="bg-[#f48c25] hover:bg-[#16a34a]">
              Save Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
