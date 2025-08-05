// components/stripe/CheckoutForm.tsx
"use client";

import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Optional: send user to a thank-you page after success
        return_url: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      toast.error(error.message || "Payment failed");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="w-full"
      >
        {loading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};
