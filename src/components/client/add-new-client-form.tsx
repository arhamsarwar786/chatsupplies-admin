// @ts-nocheck
'use client'

import { Textarea } from "@/src/components/ui/textarea"
import { Label } from "@/src/components/ui/label"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Button } from "@/src/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
SelectItem,
} from "@/src/components/ui/select"
import { Input } from "@/src/components/ui/input"
import { UserPlus } from "lucide-react"
import { useState } from "react"
import { useCreateClientMutation } from "@/src/hooks/useClients"
import { toast } from "sonner"

export default function AddNewClientForm() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number_number: "",
    company_name: "",
    industry: "",
    access_level: "",
    max_chatbots: "",
    notes: "",
    send_welcome_email: false,
    auto_activate_account: false,
  })

  const [createClient, { isLoading }] = useCreateClientMutation();
  console.log("AddNewClientForm form state:", form);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (value: string, name: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const result = await createClient(form).unwrap();
      toast.success("Client created successfully!");
      // Optionally reset form or redirect
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create client.");
    }
  };

  return (
    <div className="rounded-xl border shadow-sm overflow-hidden bg-white">
      <div className="bg-indigo-600 text-white px-6 py-4 flex items-center gap-2">
        <UserPlus className="w-5 h-5" />
        <h3 className="font-semibold text-lg">Step 1: Add New Client</h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Client Info */}
          <div>
            <h4 className="font-medium mb-4">Client Information</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input name="first_name" value={form.first_name} onChange={handleChange} placeholder="John" />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Doe" />
                </div>
              </div>

              <div>
                <Label>Email Address</Label>
                <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@company.com" />
              </div>

              <div>
                <Label>phone Number</Label>
                <Input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="+1 (555) 123-4567" />
              </div>

                 <div>
                <Label>Password</Label>
                <Input name="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
              </div>

              <div>
                <Label>Company Name</Label>
                <Input name="company_name" value={form.company_name} onChange={handleChange} placeholder="TechCorp Inc." />
              </div>

              <div>
                <Label>Industry</Label>
                <Select className="w-full" value={form.industry} onValueChange={(val) => handleSelectChange(val, "industry")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="health">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <h4 className="font-medium mb-4">Account Settings</h4>
            <div className="space-y-4">
              <div>
                <Label>Access Level</Label>
                <Select value={form.access_level} onValueChange={(val) => handleSelectChange(val, "access_level")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Max Chatbots</Label>
                <Input name="max_chatbots" value={form.max_chatbots} onChange={handleChange} />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Additional notes about the client..." />
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="welcome" checked={form.send_welcome_email} onCheckedChange={(val) => setForm(f => ({ ...f, send_welcome_email: !!val }))} />
                  <Label htmlFor="welcome">Send welcome email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="auto" checked={form.auto_activateaccount} onCheckedChange={(val) => setForm(f => ({ ...f, auto_activate_account: !!val }))} />
                  <Label htmlFor="auto">Auto-activate account</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" type="button">Cancel</Button>
          <Button onClick={handleSubmit} type="submit">Save & Continue</Button>
        </div>
      </form>
    </div>
  )
}
