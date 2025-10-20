// @ts-nocheck
"use client";

import React, { useState } from "react";
import { DashboardHeader } from "@/src/components/layout/dashboard-header";
import { Loader2, Check, Star, Gem, Trash2 } from "lucide-react";
import StripeCheckoutDialog from "@/src/components/StripeCheckoutDialog";
import { useSelector } from "react-redux";
import { stripePromise } from "@/src/lib/stripe";
import { RootState } from "@/src/store/store";
import { CheckoutForm } from "@/src/components/stripe/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import {
  useGetPackagesQuery,
  useDeletePackagesByIdMutation,
  usePurchasePackageMutation,
} from "@/src/hooks/usePackages";
import EditPackages from "@/src/components/packages/update-packages";

interface PackageFeature {
  name: string;
  value: string;
}

interface EnhancedPackage {
  id: number;
  name: string;
  price: number;
  currency: string;
  duration_days: number;
  is_recurring: boolean;
  billing_cycle?: string;
  is_active: boolean;
  created_at?: string;
  description: string[];
  features: PackageFeature[];
  isPopular: boolean;
}

const Page: React.FC = () => {
  // 🧩 Prevent SSR hydration mismatch
  if (typeof window === "undefined") return null;

  const [openDialogId, setOpenDialogId] = useState<number | null>(null);
  const role = useSelector((state: RootState) => state.authSlice.role);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const [purchasePackage] = usePurchasePackageMutation();
  const [deletePackage] = useDeletePackagesByIdMutation();

  // ✅ Simplified: Remove complex transformation that might be breaking the data
  const { data: packagesData, isLoading, error } = useGetPackagesQuery();

  // ✅ Transform data safely
  const displayPackages = React.useMemo(() => {
    if (!packagesData) {
      console.log("No packages data available");
      return [];
    }

    console.log("Raw packages data:", packagesData);
    
    const transformed: EnhancedPackage[] = packagesData.map((pkg: any) => {
      let descriptionArray: string[] = [];
      let features: PackageFeature[] = [];
      
      // Handle description transformation safely
      if (Array.isArray(pkg.description)) {
        descriptionArray = pkg.description.map((d: any) => String(d).trim());
      } else if (typeof pkg.description === 'string') {
        // Handle pipe-separated descriptions like "Limited Form|5 Form"
        // Split by newlines first, then by pipes within each line
        const lines = pkg.description.split('\n');
        descriptionArray = lines.flatMap((line: string) => 
          line.split('|').map((item: string) => item.trim())
        ).filter(item => item.length > 0);
      }
      
      // Extract features from package data
      // For your data format, we'll parse features from the description
      if (pkg.features && Array.isArray(pkg.features)) {
        features = pkg.features.map((feature: any) => ({
          name: feature.name || 'Feature',
          value: feature.value || ''
        }));
      } else {
        // Parse features from description lines that contain pipe separator
        features = [];
        if (typeof pkg.description === 'string') {
          const lines = pkg.description.split('\n');
          lines.forEach((line: string) => {
            if (line.includes('|')) {
              const [name, value] = line.split('|').map(part => part.trim());
              if (name && value) {
                features.push({
                  name: name,
                  value: value
                });
              }
            } else if (line.trim()) {
              // For lines without pipe, treat the whole line as a feature name
              features.push({
                name: line.trim(),
                value: ''
              });
            }
          });
        }
        
        // If no features were parsed from pipe format, fall back to description array
        if (features.length === 0 && descriptionArray.length > 0) {
          features = descriptionArray.map((desc: string) => ({
            name: 'Feature',
            value: desc
          }));
        }
      }
      
      return {
        ...pkg,
        description: descriptionArray,
        features: features,
        isPopular: pkg.isPopular || false,
        is_active: pkg.is_active ?? true
      };
    });
    
    console.log("Transformed packages:", transformed);
    return transformed;
  }, [packagesData]);

  const handleDelete = async (id: number) => {
    try {
      await deletePackage(id).unwrap();
      toast.success("Package deleted");
    } catch (err) {
      toast.error("Failed to delete package");
      console.error(err);
    }
  };

  const handlePurchase = async (packageId: number) => {
    try {
      const res = await purchasePackage({ packageId }).unwrap();
      if (res.clientSecret) {
        setClientSecret(res.clientSecret);
        setShowPaymentDialog(true);
      } else {
        toast.error("Client secret not returned.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Failed to initiate payment.");
    }
  };

  // ✅ Debug: Check what's actually rendering
  console.log("Rendering - isLoading:", isLoading, "error:", error, "packages:", displayPackages);

  return (
    <>
      <DashboardHeader
        title="Pricing Plans"
        description="Select the perfect plan for your chatbot needs."
        buttonText="Back to Dashboard"
      />

      <div className="w-full p-4 md:p-6 max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-3">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Start with a free trial. No credit card required. Upgrade anytime.
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center h-64 text-gray-500 gap-2">
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Loading plans...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg max-w-2xl mx-auto text-center">
              Failed to load plans. Please try again later.
              <div className="text-xs mt-2">{JSON.stringify(error)}</div>
            </div>
          )}

          {/* ✅ Debug info */}
          {!isLoading && !error && (
            <div className="text-center text-sm text-gray-500">
              Found {displayPackages.length} package(s)
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPackages?.map((pkg: EnhancedPackage) => (
              <div
                key={pkg.id}
                className={`relative p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                  pkg.isPopular
                    ? "border-2 border-primary shadow-xl bg-gradient-to-b from-primary/5 to-white"
                    : "border border-gray-200 shadow-md bg-white"
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    MOST POPULAR
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                  {role === "super_admin" && (
                    <div className="flex items-center space-x-2">
                      <EditPackages id={pkg.id} pkg={pkg as any} />
                      <Dialog
                        open={openDialogId === pkg.id}
                        onOpenChange={o => !o && setOpenDialogId(null)}
                      >
                        <DialogTrigger asChild>
                          <button onClick={() => setOpenDialogId(pkg.id)}>
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Package</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete{" "}
                              <strong>{pkg.name}</strong>? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="ghost" onClick={() => setOpenDialogId(null)}>
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                handleDelete(pkg.id);
                                setOpenDialogId(null);
                              }}
                            >
                              Confirm Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>

                {/* Pricing Section */}
                <div className="mb-6 text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-end justify-center">
                    <span className="text-3xl font-bold">${pkg.price}</span>
                    <span className="text-lg text-gray-500 ml-1">
                      {pkg.billing_cycle === 'yearly' ? '/year' : '/month'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{pkg.duration_days} days</span>
                  {role !== "super_admin" && (
                    <Button
                      className="bg-primary hover:bg-primary/80 w-full mt-2"
                      onClick={() => handlePurchase(pkg.id)}
                    >
                      Purchase {pkg.billing_cycle === 'yearly' ? 'Yearly' : 'Monthly'}
                    </Button>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Features
                  </h4>
                  <ul className="space-y-3">
                    {pkg.features && pkg.features.map((feature: PackageFeature, i: number) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                          {feature.name && feature.name !== 'Feature' && (
                            <span className="font-medium text-gray-900">{feature.name}</span>
                          )}
                          {feature.value && (
                            <span className="text-gray-700 text-sm mt-0.5">
                              {feature.value}
                            </span>
                          )}
                          {/* If there's only a name and no value, show just the name */}
                          {feature.name && feature.name !== 'Feature' && !feature.value && (
                            <span className="text-gray-700">{feature.name}</span>
                          )}
                        </div>
                      </li>
                    ))}
                    
                    {/* Fallback to description if no features available */}
                    {(!pkg.features || pkg.features.length === 0) && pkg.description && pkg.description.map((line: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">
                          {line}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {!isLoading && !error && displayPackages.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 p-6 rounded-lg max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold mb-2">No Plans Available</h3>
                <p>There are no pricing plans available at the moment.</p>
              </div>
            </div>
          )}
          
          <div className="mt-12 bg-gray-50 rounded-xl p-8 text-center">
            <Gem className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">Enterprise Solutions</h3>
            <p className="text-gray-600 mb-6">
              Need custom pricing or features for your organization? Our team can create a plan tailored to your specific requirements.
            </p>
            <button className="bg-white border border-primary text-primary hover:bg-primary/10 py-2 px-6 rounded-lg">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
            },
          }}
        >
          <StripeCheckoutDialog
            clientSecret={clientSecret}
            open={showPaymentDialog}
            onClose={() => {
              setShowPaymentDialog(false);
              setClientSecret(null);
            }}
          />
        </Elements>
      )}
    </>
  );
};

export default Page;