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
import PhoneInput from "../PhoneInput"

export default function AddNewClientForm() {
  const initialFormState = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    industry: "",
    access_level: "",
    max_chatbots: "",
    notes: "",
    send_welcome_email: false,
    auto_activate_account: false,
  };

  const [form, setForm] = useState(initialFormState);

  const [createClient, { isLoading }] = useCreateClientMutation();
  // console.log("AddNewClientForm form state:", form);

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

  if (!isFormComplete()) {
    toast.warning("Please fill in all required fields.");
    return;
  }

  try {
    const response = await createClient(form).unwrap();

    if (response?.success === false) {
      // If API call succeeded (200 OK) but business logic failed
      toast.error(response.detail || "Something went wrong.");
      return;
    }

    // Success
    toast.success(response.detail || "Client created successfully!");
    setForm(initialFormState);
  } catch (err: any) {
    // If API call failed (non-200 status)
    const errorMessage =
      err?.status === 400 && err?.data?.detail ||
      err?.data?.message ||
      err?.message ||
      "Failed to create client.";

    toast.error(errorMessage); 
  }
};

const handlePhoneChange = (value: string | undefined) => {
  setForm((prev) => ({
    ...prev,
    phone_number: value,
  }));
};



const isFormComplete = () => {
  return (
    form.first_name.trim() &&
    form.last_name.trim() &&
    form.email.trim() &&
    form.phone_number.trim() &&
    form.company_name.trim() &&
    form.industry.trim() &&
    form.access_level.trim() &&
    form.max_chatbots.trim()
  );
};
  return (
    <div className="rounded-xl border shadow-sm overflow-hidden bg-card">
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
                  <Label className="mb-2 text-md">First Name <span className="text-red-500">*</span></Label>
                  <Input
  name="first_name"
  value={form.first_name}
  onChange={handleChange}
  className="mt-1 w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  placeholder="Enter First Name"
/>

                </div>
                <div>
                  <Label className="mb-2 text-md">Last Name <span className="text-red-500">*</span></Label>
                  <Input 
                  name="last_name" 
                  value={form.last_name} 
                  onChange={handleChange} 
                  className="mt-1 w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter Last Name" />
                </div>
              </div>

              <div>
                <Label className="mb-2 text-md">Email Address <span className="text-red-500">*</span></Label>
                <Input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                className="mt-1 w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter Email Address" />
              </div>

              <div>
                <Label className="mb-2 text-md">Phone Number <span className="text-red-500">*</span></Label>
                <PhoneInput 
                name="phone_number" 
                value={form.phone_number}  
                onChange={handlePhoneChange} 
                className="mt-1 w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter Phone Number" />
              </div>

              <div>
                <Label className="mb-2 text-md">Company Name <span className="text-red-500">*</span></Label>
                <Input name="company_name" value={form.company_name} onChange={handleChange} 
                className="mt-1 w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter Company Name" />
              </div>

              <div>
                <Label className="mb-2 text-md">Industry <span className="text-red-500">*</span></Label>
                <Select value={form.industry} onValueChange={(val) => handleSelectChange(val, "industry")}>
                  <SelectTrigger className="mt-1 w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <SelectValue 
                    placeholder="Select Industry" />
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
                <Label className="mb-2 text-md">Access Level <span className="text-red-500">*</span></Label>
                <Select value={form.access_level} onValueChange={(val) => handleSelectChange(val, "access_level")}  >
                  <SelectTrigger  
                   className="mt-1 w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
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
                <Label className="mb-2 text-md">Max Chatbots <span className="text-red-500">*</span></Label>
                <Input 
                name="max_chatbots" 
                value={form.max_chatbots}
                className="mt-1 w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={handleChange} />
              </div>

              <div>
                <Label className="mb-2 text-md">Notes <span className="text-red-500">*</span></Label>
                <Textarea name="notes" value={form.notes} onChange={handleChange} 
                className="mt-1 w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Additional notes about the client..." />
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="welcome" checked={form.send_welcome_email} onCheckedChange={(val) => setForm(f => ({ ...f, send_welcome_email: !!val }))} className="border border-gray-400" />
                  <Label htmlFor="welcome" className="text-md">Send welcome email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="auto" checked={form.auto_activateaccount} onCheckedChange={(val) => setForm(f => ({ ...f, auto_activate_account: !!val }))} className="border border-gray-400" />
                  <Label htmlFor="auto"className="text-md">Auto-activate account</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
<div className="flex justify-end gap-4 pt-4 border-t">
  <Button variant="outline" type="button">Cancel</Button>
  <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
    {isLoading ? "Creating..." : "Create Client"}
  </Button>
</div>

      </form>
    </div>
  )
}
