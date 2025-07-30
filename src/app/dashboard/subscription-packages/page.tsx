// ts-nocheck
"use client";

import React from "react";
import { DashboardHeader } from "@/src/components/layout/dashboard-header";
import { Loader2, Check, Zap, Star, Gem } from "lucide-react";
import { useGetPackagesQuery } from "@/src/hooks/usePackages";

const Page = () => {
  const { data, isLoading, error } = useGetPackagesQuery();
  console.log("Packages Data:", data);

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
            {data?.map((pkg: any) => (
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
                  <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                  {pkg.isPopular && <Zap className="w-5 h-5 text-yellow-500" />}
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
                  {pkg.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${pkg.originalPrice}
                    </span>
                  )}
                  {pkg.perUser && (
                    <span className="text-sm text-gray-500 block mt-1">
                      per user
                    </span>
                  )}
                </div>

                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 mb-6 ${
                    pkg.isPopular
                      ? "bg-primary text-white hover:bg-primary shadow-md"
                      : "bg-primary text-white hover:bg-gray-800"
                  }`}
                >
                  Start Free Trial
                </button>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Features
                  </h4>
                  <ul className="space-y-3">
                    {pkg.description
                      ?.split("\n")
                      .filter((line: any) => line.trim() !== "")
                      .map((line: string, index: number) => (
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