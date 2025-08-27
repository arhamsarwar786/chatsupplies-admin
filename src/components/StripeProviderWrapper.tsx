// components/StripeProviderWrapper.tsx
"use client";

import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/src/lib/stripe";
import React from "react";

const StripeProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeProviderWrapper;
