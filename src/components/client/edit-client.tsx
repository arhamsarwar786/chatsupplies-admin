// @ts-nocheck
'use client'
import React, { useState, useEffect } from "react";
import { Textarea } from "@/src/components/ui/textarea"
import { Label } from "@/src/components/ui/label"
import { useParams } from "next/navigation";
import { Button } from "@/src/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select"
import { Input } from "@/src/components/ui/input"
import { UserPlus, Loader2 } from "lucide-react"
import { useUpdateClientByIdMutation, useGetClientByIdQuery } from "@/src/hooks/useClients"
import { toast } from "sonner"
import PhoneInput from "../PhoneInput";

export default function EditClientForm() {
  const params = useParams();
  const id = params?.id ? Number(params.id) : undefined;

  const { data: clientData, isLoading: isFetching } = useGetClientByIdQuery(id!, {
    skip: !id,
  });
  const [editClient, { isLoading }] = useUpdateClientByIdMutation();

  const initialFormState = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    industry: "",
    max_chatbots: "",
    notes: "",
    send_welcome_email: true,
    auto_activate_account: true,
  };
  const [form, setForm] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (clientData) {
      setForm({
        first_name: clientData.first_name || "",
        last_name: clientData.last_name || "",
        email: clientData.email || "",
        phone_number: clientData.phone_number || "",
        company_name: clientData.company_name || "",
        industry: clientData.industry || "",
        max_chatbots: clientData.max_chatbots || "",
        notes: clientData.notes || "",
        send_welcome_email: clientData.send_welcome_email ?? true,
        auto_activate_account: clientData.auto_activate_account ?? true,
      });
    }
  }, [clientData]);

  // Validation helpers
  const validateName = (val: string) => /^[A-Za-z\s]+$/.test(val);
  const validateNumber = (val: string) => /^\d+$/.test(val);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "first_name" || name === "last_name") {
      setFormErrors((prev) => ({
        ...prev,
        [name]: value.trim() !== "" && !validateName(value),
      }));
    }

    if (name === "max_chatbots") {
      setFormErrors((prev) => ({
        ...prev,
        [name]: value.trim() !== "" && !validateNumber(value),
      }));
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run validation on submit
    const errors: any = {};
    if (!validateName(form.first_name)) errors.first_name = true;
    if (!validateName(form.last_name)) errors.last_name = true;
    if (!validateNumber(form.max_chatbots)) errors.max_chatbots = true;

    setFormErrors(errors);

    // If any errors exist, stop submission
    if (Object.values(errors).some(Boolean)) {
      toast.error("Please fix validation errors before submitting.");
      return;
    }

    try {
      await editClient({
        id,
        body: form,
      }).unwrap();
      toast.success("Client updated successfully");
    } catch (error) {
      toast.error("Error updating client");
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    setForm((prev) => ({
      ...prev,
      phone_number: value,
    }));
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6" />
        <span className="ml-2">Loading client data...</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border shadow-sm overflow-hidden bg-card">
      <div className="bg-indigo-600 text-white px-6 py-4 flex items-center gap-2">
        <UserPlus className="w-5 h-5" />
        <h3 className="font-semibold text-lg">Edit Client</h3>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Client Info */}
          <div>
            <h4 className="font-medium mb-4">Client Information</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">First Name</Label>
                  <Input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    className={`mt-1 w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 
                      ${formErrors.first_name ? "border border-red-500 focus:ring-red-500" : "border border-gray-400 focus:ring-indigo-500"}`}
                    placeholder="Enter First Name"
                  />
                </div>
                <div>
                  <Label className="mb-2">Last Name</Label>
                  <Input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    className={`mt-1 w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 
                      ${formErrors.last_name ? "border border-red-500 focus:ring-red-500" : "border border-gray-400 focus:ring-indigo-500"}`}
                    placeholder="Enter Last Name"
                  />
                </div>
              </div>
              <div>
                <Label className="mb-2">Email Address</Label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter Email Address"
                />
              </div>
              <div>
                <Label className="mb-2">Phone Number</Label>
                <PhoneInput
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handlePhoneChange}
                  className="mt-1 w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter Phone Number"
                />
              </div>
              <div>
                <Label className="mb-2">Company Name</Label>
                <Input
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter Company Name"
                />
              </div>
              <div>
                <Label className="mb-2">Industry</Label>
                <Select
                  className="w-full"
                  value={form.industry}
                  onValueChange={(val) => handleSelectChange(val, "industry")}
                >
                  <SelectTrigger className="mt-1 w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
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
                <Label className="mb-2">Max Chatbots</Label>
                <Input
                  name="max_chatbots"
                  value={form.max_chatbots}
                  onChange={handleChange}
                  className={`mt-1 w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 
                    ${formErrors.max_chatbots ? "border border-red-500 focus:ring-red-500" : "border border-gray-400 focus:ring-indigo-500"}`}
                  placeholder="Enter Max Chatbots"
                />
              </div>
              <div>
                <Label className="mb-2">Notes</Label>
                <Textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Additional notes about the client..."
                />
              </div>
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" type="button">Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Editing..." : "Edit Client"}
          </Button>
        </div>
      </form>
    </div>
  );
}
