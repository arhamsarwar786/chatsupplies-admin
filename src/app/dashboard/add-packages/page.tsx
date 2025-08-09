"use client";

import { DashboardHeader } from "@/src/components/layout/dashboard-header";
import React, { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Switch } from "@/src/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { useCreatePackagesMutation } from "@/src/hooks/usePackages";
import { toast } from "sonner";
import { Loader2, PlusCircle, DollarSign, Calendar, RefreshCw } from "lucide-react";

const Page = () => {
const [form, setForm] = useState({
  name: "",
  description: [] as string[], // updated to array of strings
  price: 0,
  currency: "usd",
  duration_days: 0,
  is_recurring: false,
  billing_cycle: "",
});

const [newDesc, setNewDesc] = useState({ title: "", value: "" });

  const [createPackage, { isLoading }] = useCreatePackagesMutation();

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Prepare payload
  // const payload = {
  //   ...form,
  //   description: form.description

  //     .map((item) => item.trim()) // trim whitespace
  //     .filter((item) => item.length > 0), // remove empty lines
  // };
    const payload = { ...form };

  try {
    const response = await createPackage(payload).unwrap();
    toast.success("Package created successfully!", {
      description: `${form.name} is now available for subscription.`,
    });
    console.log("Created Package:", response);

    // Reset form after successful submission
    setForm({
      name: "",
      description: [] as string[],
      price: 0,
      currency: "usd",
      duration_days: 0,
      is_recurring: false,
      billing_cycle: "",
    });
  } catch (err) {
    console.error("Error creating package:", err);
    toast.error("Failed to create package", {
      description: "Please check the form and try again.",
    });
  }
};

  return (
    <>
      <DashboardHeader
        title="Create New Package"
        description="Design a subscription plan for your customers"
        buttonText="Back to Packages"
      />

      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <PlusCircle className="w-6 h-6 text-primary" />
              <div>
                <CardTitle className="text-2xl font-bold">New Subscription Plan</CardTitle>
                <CardDescription>
                  Fill in the details to create a new package
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Package Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-1">
                    <span>Package Name</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g. Premium Plan"
                    className="h-11"
                    required
                  />
                </div>

                {/* Currency */}
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={form.currency}
                    onValueChange={(value:any) => handleChange("currency", value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd" className="flex items-center gap-2">
                        <span className="font-semibold">USD</span>
                        <span className="text-muted-foreground">US Dollar</span>
                      </SelectItem>
                      <SelectItem value="eur">
                        <span className="font-semibold">EUR</span>
                        <span className="text-muted-foreground">Euro</span>
                      </SelectItem>
                      <SelectItem value="gbp">
                        <span className="font-semibold">GBP</span>
                        <span className="text-muted-foreground">British Pound</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>Price</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      {form.currency.toUpperCase()}
                    </span>
                    <Input
                      id="price"
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        handleChange("price", parseFloat(e.target.value))
                      }
                      placeholder="0.00"
                      className="h-11 pl-12"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration_days" className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Duration (Days)</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="duration_days"
                    type="number"
                    value={form.duration_days}
                    onChange={(e) =>
                      handleChange("duration_days", parseInt(e.target.value))
                    }
                    placeholder="30"
                    className="h-11"
                    min="1"
                    required
                  />
                </div>

                {/* Recurring Subscription */}
                <div className="space-y-2">
                  <Label htmlFor="is_recurring" className="flex items-center gap-1">
                    <RefreshCw className="w-4 h-4" />
                    <span>Recurring Subscription</span>
                  </Label>
                  <div className="flex items-center justify-between p-3 border rounded-lg h-11">
                    <span className="text-sm text-muted-foreground">
                      {form.is_recurring ? "Enabled" : "Disabled"}
                    </span>
                    <Switch
                      id="is_recurring"
                      checked={form.is_recurring}
                      onCheckedChange={(value:any) =>
                        handleChange("is_recurring", value)
                      }
                    />
                  </div>
                </div>

                {/* Billing Cycle */}
                {form.is_recurring && (
                  <div className="space-y-2">
                    <Label htmlFor="billing_cycle">Billing Cycle</Label>
                    <Select
                      value={form.billing_cycle}
                      onValueChange={(value:any) =>
                        handleChange("billing_cycle", value)
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select billing cycle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly (3 months)</SelectItem>
                        <SelectItem value="yearly">Yearly (12 months)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Description */}
             {/* === Description Input Section === */}
<div className="space-y-4">
  <Label htmlFor="description">Package Description</Label>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Value Field */}
    <Input
      placeholder="Enter feature"
      value={newDesc.value}
      onChange={(e) =>
        setNewDesc((prev) => ({ ...prev, value: e.target.value }))
      }
    />
  </div>

  {/* Add Button */}
  <Button
    type="button"
    className="h-10"
    disabled={ !newDesc.value}
    onClick={() => {
      setForm((prevForm) => ({
        ...prevForm,
        description: [
          ...prevForm.description,
          `${newDesc.value}`,
        ],
      }));
      setNewDesc({ title: "", value: "" });
    }}
  >
    Add Feature
  </Button>

  {/* Show Added Descriptions */}
  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
    {form.description.map((desc, index) => (
      <li key={index} className="flex justify-between items-center">
        {desc}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const updated = [...form.description];
            updated.splice(index, 1);
            setForm((prevForm) => ({ ...prevForm, description: updated }));
          }}
        >
          Remove
        </Button>
      </li>
    ))}
  </ul>
</div>
              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-11 text-lg font-medium bg-primary hover:bg-primary/80"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Package...
                    </>
                  ) : (
                    "Create Package"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Page;