"use client"

import { CreditCard, Plus, Check, Wallet, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

export function PaymentMethodsCard() {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "Visa", cardNumber: "4242", expiry: "12/25", isDefault: true },
    { id: 2, type: "ASTU Wallet", balance: "450.00", isDefault: false }
  ])

  const handlePaymentMethodClick = (id: number) => {
    if (id === 2) {
   
      return
    }
    
  }

  const handleSetDefault = (id: number) => {
    setPaymentMethods(prev => prev.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })))
  }

  const handleDeletePayment = (id: number) => {
    if (window.confirm("Are you sure you want to delete this payment method?")) {
      setPaymentMethods(prev => prev.filter(pm => pm.id !== id))
    }
  }

  const handleTopUp = () => {

    const amount = prompt("Enter amount to top up:")
    if (amount) {
      const payment = paymentMethods.find(pm => pm.type === "ASTU Wallet")
      if (payment && "balance" in payment) {
        const newBalance = (parseFloat(payment.balance || "0") + parseFloat(amount)).toFixed(2)
        setPaymentMethods(prev => prev.map(pm =>
          pm.type === "ASTU Wallet" && "balance" in pm 
            ? { id: pm.id, type: pm.type, balance: newBalance, isDefault: pm.isDefault } 
            : pm
        ))
      }
    }
  }

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#f59e0b]" />
          <h3 className="text-lg font-semibold text-foreground">Payment Methods</h3>
        </div>
        <button className="text-[#f48c25] hover:text-[#16a34a] cursor-pointer transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((payment) => (
          <div
            key={payment.id}
            onClick={() => handlePaymentMethodClick(payment.id)}
            className={`p-4 border border-border rounded-lg flex items-center justify-between cursor-pointer hover:bg-muted transition-colors ${
              payment.isDefault ? "border-[#f48c25]" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              {payment.type === "Visa" ? (
                <div className="w-12 h-8 bg-[#1a1f71] rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold italic">VISA</span>
                </div>
              ) : (
                <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-[#22c55e]" />
                </div>
              )}
              <div>
                {payment.type === "Visa" ? (
                  <>
                    <p className="font-medium text-foreground">Visa ending in {payment.cardNumber}</p>
                    <p className="text-sm text-muted-foreground">Expires {payment.expiry}</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-foreground">ASTU Wallet</p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Balance: </span>
                      <span className="text-[#22c55e] font-medium">ETB {payment.balance}</span>
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {payment.type === "ASTU Wallet" ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTopUp()
                  }}
                  className="text-[#22c55e] hover:text-[#16a34a] font-medium text-sm"
                >
                  Top Up
                </button>
              ) : (
                <>
                  {payment.isDefault ? (
                    <div className="w-6 h-6 bg-[#22c55e] rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSetDefault(payment.id)
                      }}
                      className="text-xs text-muted-foreground hover:text-[#f48c25]"
                    >
                      Set as default
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeletePayment(payment.id)
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
