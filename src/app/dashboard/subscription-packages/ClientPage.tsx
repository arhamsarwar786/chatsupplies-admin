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

interface Package {
  id: number;
  name: string;
  description: string[]; // always an array after transform
  price: number;
  currency: string;
  is_active: boolean;
  duration_days: number;
  is_recurring: boolean;
  billing_cycle: string;
  created_at: string;
  isPopular?: boolean;
  perUser?: boolean;
}

interface PurchasePackageResponse {
  clientSecret: string;
  payment: {
    id: number;
    user_id: number;
    package_id: number;
    amount: number;
    currency: string;
    stripe_payment_intent: string;
    status: string;
    created_at: string;
  };
}

const Page: React.FC = () => {
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);
  const role = useSelector((state: RootState) => state.authSlice.role);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const [purchasePackage] = usePurchasePackageMutation();
  const [deletePackage] = useDeletePackagesByIdMutation();

  const { data, isLoading, error } = useGetPackagesQuery(undefined, {
    selectFromResult: ({ data, ...rest }) => ({
      ...rest,
      data: data?.map((pkg: Package) => ({
        ...pkg,
        description: Array.isArray(pkg.description)
          ? pkg.description
          : typeof pkg.description === "string"
          ? pkg.description.replace(/^"|"$/g, "").split(",").map(s => s.trim())
          : [],
      })) as Package[],
    }),
  });

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
    const res = (await purchasePackage({ packageId }).unwrap()) as PurchasePackageResponse;
    if (res.clientSecret) {
      setClientSecret(res.clientSecret);
      setShowPaymentDialog(true); // <-- open modal
    } else {
      toast.error("Client secret not returned.");
    }
  } catch (err) {
    console.error("Payment error:", err);
    toast.error("Failed to initiate payment.");
  }
};


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
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data?.map(pkg => (
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
                      <EditPackages id={pkg.id} pkg={pkg} />
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

                <div className="mb-6">
                  <div className="flex items-end">
                    <span className="text-4xl font-bold">${pkg.price}</span>
                    <span className="text-lg text-gray-500 ml-1">/{pkg.billing_cycle}</span>
                  </div>
                  <span className="text-sm text-gray-500">{pkg.duration_days} days</span>
                </div>
  {role !== "super_admin" && (
                <Button
                  className="bg-primary hover:bg-primary/80 w-full"
                  onClick={() => handlePurchase(pkg.id)}
                >
                  Purchase Package
                </Button>
  )}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Features
                  </h4>
                  <ul className="space-y-3">
                    {pkg.description.map((line, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-gray-700">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
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
        theme: "stripe", // or "night", "flat", etc.
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
