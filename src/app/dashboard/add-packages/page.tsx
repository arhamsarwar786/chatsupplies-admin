"use client";

import { DashboardHeader } from "@/src/components/layout/dashboard-header";
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import { Loader2, PlusCircle, DollarSign, Calendar, RefreshCw, XCircle } from "lucide-react"; // Added XCircle for remove icon
import ConfirmationPopup from "../../../components/chatbot/confirmationPopup"; // Your custom popup
import { useRouter } from "next/navigation"; // App Router
import Link from 'next/link'; // Import Link to help identify navigation elements

// Define the structure for a single description item
interface DescriptionItem {
  title: string;
  value: string;
}

// Define a default/initial state to check for changes
const INITIAL_FORM_STATE = {
  name: "",
  description: [] as string[],
  price: 0,
  currency: "usd",
  duration_days: 0,
  is_recurring: false,
  billing_cycle: "",
};

const Page = () => {
  const router = useRouter();

  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [newDesc, setNewDesc] = useState<DescriptionItem>({ title: "", value: "" });

  // State to track if the form has been modified
  const [isDirty, setIsDirty] = useState(false);
  // State to control the visibility of the custom confirmation dialog
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  // State to store the path the user is trying to navigate to
  const [nextPath, setNextPath] = useState("");

  const [createPackage, { isLoading }] = useCreatePackagesMutation();

  // Memoize the form state string for easy comparison
  const formStateString = useMemo(() => JSON.stringify(form), [form]);

  // Hook to check if the form is dirty
  useEffect(() => {
    const initialFormStateString = JSON.stringify(INITIAL_FORM_STATE);
    const isFormModified = formStateString !== initialFormStateString;
    setIsDirty(isFormModified);
  }, [formStateString]);


  // === 1. Handle Native Browser Events (Reload/Close/External Navigation) ===
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = '';
        return '';
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);


  // 🔑 === FIX: Handle Client-Side Navigation (Sidebar, Next/Link clicks) ===
  // This effect listens for all clicks and intercepts Next.js <Link> navigations.
  useEffect(() => {
    if (!isDirty) return;

    const handleLinkClick = (event: MouseEvent) => {
      // Find the closest ancestor that is a Link or has an href, but isn't the form submit button
      const target = event.target as HTMLElement;
      let linkElement: HTMLAnchorElement | null = null;

      // Traverse up the DOM to find a parent <a> tag with an href attribute
      let currentElement: HTMLElement | null = target;
      while (currentElement && currentElement !== document.body) {
        if (currentElement.tagName === 'A' && currentElement.hasAttribute('href')) {
          linkElement = currentElement as HTMLAnchorElement;
          break;
        }
        currentElement = currentElement.parentElement;
      }

      if (linkElement) {
        const url = linkElement.href;

        // Ensure it's an internal link and not the current page
        if (url && url !== window.location.href) {

          // Check if this is an internal Next.js navigation (same origin and not forcing a full reload)
          const urlPath = new URL(url).pathname;
          const isExternal = linkElement.target === '_blank' || linkElement.rel === 'noopener noreferrer';

          if (urlPath !== window.location.pathname && !isExternal) {
            // Prevent the default navigation
            event.preventDefault();
            event.stopPropagation();

            // Store the path and show the custom dialog
            setNextPath(urlPath);
            setShowConfirmPopup(true);
          }
        }
      }
    };

    // Attach the listener to the whole window
    window.addEventListener('click', handleLinkClick, true); // Use capture phase

    return () => {
      window.removeEventListener('click', handleLinkClick, true);
    };
  }, [isDirty]);


  // Helper function to navigate away
  const handleNavigateAway = useCallback(() => {
    setIsDirty(false);
    setShowConfirmPopup(false);

    if (nextPath) {
      // Use push for the intercepted sidebar link
      router.push(nextPath);
    } else {
      // Default to back (used by handleBackButton fallback)
      router.back();
    }
    setNextPath("");
  }, [nextPath, router]);

  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setForm((prevForm) => ({ ...prevForm, [field]: value }));
  };

  // Handle addition of features - Store as "title|value" format
  const handleAddFeature = () => {
    // Store as string with pipe delimiter for parsing later
    const featureString = `${newDesc.title}|${newDesc.value}`;
    
    setForm((prevForm) => ({
      ...prevForm,
      description: [
        ...prevForm.description,
        featureString
      ],
    }));
    setNewDesc({ title: "", value: "" });
  };

  // Handle removal of features
  const handleRemoveFeature = (index: number) => {
    setForm((prevForm) => {
      const updated = [...prevForm.description];
      updated.splice(index, 1);
      return { ...prevForm, description: updated };
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // No transformation needed - description is already array of strings
    const payload = { ...form };

    try {
      await createPackage(payload).unwrap();
      toast.success("Package created successfully!", {
        description: `${form.name} is now available for subscription.`,
      });

      // Reset form and dirty state after successful submission
      setForm(INITIAL_FORM_STATE);
      setIsDirty(false);
      setNewDesc({ title: "", value: "" });

    } catch (err) {
      console.error("Error creating package:", err);
      toast.error("Failed to create package", {
        description: "Please check the form and try again.",
      });
    }
  };

  /**
   * Function to handle the click on the DashboardHeader button.
   * This handles the **internal navigation** prompt.
   */
  const handleBackButton = () => {
    if (isDirty) {
      // Set the intended path for the back button
      setNextPath('/dashboard/subscription-packages');
      setShowConfirmPopup(true);
    } else {
      router.back();
    }
  };

  // Custom Confirmation Popup handlers
  const onCancelLeave = () => {
    setShowConfirmPopup(false);
    setNextPath("");
  };

  const onConfirmLeave = () => {
    handleNavigateAway();
  };


  return (
    <>
      <DashboardHeader
        title="Create New Package"
        description="Design a subscription plan for your customers"
        buttonText="Back to Packages"
        // This handles the button click
        onButtonClick={handleBackButton}
      />

      {/* The Custom Confirmation Popup Component */}
      <ConfirmationPopup
        open={showConfirmPopup}
        onConfirm={onConfirmLeave}
        onCancel={onCancelLeave}
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
                    onValueChange={(value: any) => handleChange("currency", value)}
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
                      onCheckedChange={(value: any) =>
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
                      onValueChange={(value: any) =>
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

              {/* Description - UPDATED: Show Title and Value on Separate Lines */}
              <div className="space-y-4">
                <Label htmlFor="description">Package Description / Features</Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title/Name Field */}
                  <Input
                    placeholder="Feature Name (e.g., Max Users)"
                    value={newDesc.title}
                    onChange={(e) =>
                      setNewDesc((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                  {/* Value Field */}
                  <Input
                    placeholder="Feature Value (e.g., 50)"
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
                  disabled={!newDesc.title || !newDesc.value}
                  onClick={handleAddFeature}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>

                {/* Show Added Descriptions - UPDATED: Parse strings to show title and value separately */}
                <ul className="space-y-3 text-sm">
                  {form.description.map((desc, index) => {
                    // Parse the string back into title and value
                    const [title, value] = desc.split('|');
                    
                    return (
                      <li key={index} className="flex justify-between items-start bg-muted/50 p-3 rounded-lg border border-border">
                        <div className="flex-1">
                          <div className="font-medium text-primary">{title}</div>
                          <div className="text-muted-foreground mt-1">{value}</div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFeature(index)}
                          className="text-red-500 hover:bg-red-500/10 ml-2"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </li>
                    );
                  })}
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