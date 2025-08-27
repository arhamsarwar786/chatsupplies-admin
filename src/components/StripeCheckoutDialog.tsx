// src/components/StripeCheckoutDialog.tsx
"use client";

import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  clientSecret: string;
}

export default function StripeCheckoutDialog({ open, onClose, clientSecret }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else if (result.paymentIntent?.status === "succeeded") {
      console.log("Payment succeeded!");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardElement />
          <DialogFooter>
            <Button type="submit" disabled={!stripe}>
              Pay Now
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
