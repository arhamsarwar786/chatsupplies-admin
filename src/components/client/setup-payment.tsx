'use client'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Checkbox } from "@/src/components/ui/checkbox"
import { CreditCard } from "lucide-react"
import { useState } from "react"

export default function SetupPaymentForm() {
  const [paymentType, setPaymentType] = useState("Subscription")
  const [cardNumber, setCardNumber] = useState("")
  const [billingCycle, setBillingCycle] = useState("Monthly")
  const [autoRenew, setAutoRenew] = useState(true)
  const [sendInvoice, setSendInvoice] = useState(true)

  const handleSubmit = () => {
    console.log({
      paymentType,
      cardNumber,
      billingCycle,
      autoRenew,
      sendInvoice,
    })
  }

  return (
    <div className="rounded-xl border shadow-sm overflow-hidden bg-white">
      {/* Header */}
      <div className="bg-indigo-700 text-white px-6 py-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5" />
        <h3 className="font-semibold text-lg">Step 3: Setup Payment</h3>
      </div>

      {/* Form */}
      <div className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Payment Type</Label>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Subscription">Subscription</SelectItem>
                  <SelectItem value="One-Time">One-Time</SelectItem>
                  <SelectItem value="Invoice">Invoice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Billing Cycle</Label>
              <Select value={billingCycle} onValueChange={setBillingCycle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Card Number</Label>
              <Input
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Checkbox checked={autoRenew} onCheckedChange={(val) => setAutoRenew(!!val)} />
                <Label>Enable auto-renewal</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox checked={sendInvoice} onCheckedChange={(val) => setSendInvoice(!!val)} />
                <Label>Send payment invoice via email</Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-4 px-6 pt-4 pb-6 border-t">
        <Button variant="outline">Back</Button>
        <Button onClick={handleSubmit}>Proceed to Activation</Button>
      </div>
    </div>
  )
}
