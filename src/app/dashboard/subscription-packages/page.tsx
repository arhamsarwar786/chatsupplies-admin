// ts-nocheck
"use client";

import React, { useState } from "react";
import { DashboardHeader } from "@/src/components/layout/dashboard-header";
import { Loader2, Check, Zap, Star, Gem, Trash2, Pencil } from "lucide-react";
import { useSelector } from "react-redux";
import { stripePromise } from "@/src/lib/stripe";
import { RootState } from "@/src/store/store";
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
import { CheckoutForm } from "@/src/components/stripe/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";

interface Package {
  id: number;
  name: string;
  description: string[]; // array of feature strings
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
type PurchasePackageResponse = {
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
};

const Page = () => {
  const [openDialogId, setOpenDialogId] = React.useState<number | null>(null);
  const role = useSelector((state: RootState) => state.authSlice.role);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(
    null
  );
  const [stripePaymentIntent, setStripePaymentIntent] = useState<string | null>(
    null
  );
  const [purchasePackage] = usePurchasePackageMutation({});
  const [open, setOpen] = useState(false);
  const { data, isLoading, error } = useGetPackagesQuery();
  console.log("Packages Data:", data);
  const [deletePackage] = useDeletePackagesByIdMutation({});
  const handleDelete = async (id: number) => {
    try {
      // call delete mutation or API
      await deletePackage(id).unwrap(); // adjust based on your hook
      toast.success("Package deleted");
    } catch (error) {
      toast.error("Failed to delete package");
      console.error(error);
    }
  };
  const handlePurchase = async (
    packageId: number,
    stripe_payment_intent: string
  ) => {
    try {
      const res = await purchasePackage({ packageId }).unwrap();

      if (res?.clientSecret) {
        setClientSecret(res.clientSecret); // Set Stripe client secret
        toast.success("Ready to complete payment");
      } else {
        toast.error("No client secret received.");
      }
    } catch (error) {
      toast.error("Purchase failed.");
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

          {/* === Loading === */}
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Loading plans...</span>
              </div>
            </div>
          )}

          {/* === Error === */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg max-w-2xl mx-auto text-center">
              Failed to load plans. Please try again later.
            </div>
          )}

          {/* === Package List === */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data?.map((pkg: Package) => (
              <div
                key={pkg.id}
                className={`relative p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                  pkg.isPopular
                    ? "border-2 border-primary shadow-xl bg-gradient-to-b from-primary/5 to-white"
                    : "border border-gray-200 shadow-md bg-white"
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full inline-flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    MOST POPULAR
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {pkg.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {/* edit packages */}
                    {role === "super_admin" && (
                      <EditPackages id={pkg.id} pkg={pkg} />
                    )}

                    {/* Delete Button */}
                    {role === "super_admin" && (
                      <Dialog
                        open={openDialogId === pkg.id}
                        onOpenChange={(open) => !open && setOpenDialogId(null)}
                      >
                        <DialogTrigger asChild>
                          <button
                            className="text-sm text-red-500 hover:underline"
                            onClick={() => setOpenDialogId(pkg.id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Package</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete{" "}
                              <strong>{pkg.name}</strong>? This action cannot be
                              undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="ghost"
                              onClick={() => setOpenDialogId(null)}
                            >
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
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-end">
                    <span className="text-4xl font-bold text-gray-900">
                      ${pkg.price}
                    </span>
                    <span className="text-lg text-gray-500 ml-1">
                      /{pkg.billing_cycle}
                    </span>
                  </div>
                  {/* {pkg.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${pkg.originalPrice}
                    </span>
                  )} */}
                  <span className="text-sm text-gray-500">
                    {pkg.duration_days} days
                  </span>
                </div>

                <div>
                  <Button
                  className="bg-secondary hover:bg-primary w-full"
                    onClick={async () => {
                      try {
                        const res = await purchasePackage({
                          packageId: pkg.id,
                        }).unwrap();
                        if (res?.clientSecret) {
                          setClientSecret(res.clientSecret);
                          toast.success(
                            "Client secret received. Proceed with payment."
                          );
                        } else {
                          toast.error("Client secret not returned.");
                        }
                      } catch (error: any) {
                        console.error("Payment error:", error);
                        toast.error("Failed to initiate payment.");
                      }
                    }}
                  >
                    Purchase Package
                  </Button>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Features
                  </h4>
                  <ul className="space-y-3">
                    {pkg.description?.map((line, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{line.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          {/* {clientSecret && (
            <Elements options={{ clientSecret }} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          )} */}
          {/* Additional Information */}
          <div className="mt-12 bg-gray-50 rounded-xl p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <Gem className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Enterprise Solutions
              </h3>
              <p className="text-gray-600 mb-6">
                Need custom pricing or features for your organization? Our team
                can create a plan tailored to your specific requirements.
              </p>
              <button className="bg-white border border-primary text-primary hover:bg-primary/10 font-medium py-2 px-6 rounded-lg transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
