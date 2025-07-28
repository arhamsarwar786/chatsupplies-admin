"use client";
import React, { useState } from "react";
import { DashboardHeader } from "@/src/components/layout/dashboard-header";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { toast } from "sonner";

const FeedbackPage = () => {
  const [feedbackType, setFeedbackType] = useState("general");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.error("Please enter your feedback message.");
      return;
    }

    // 👉 Replace with API call
    console.log("Feedback Submitted:", { feedbackType, message });

    toast.success("Thank you! Your feedback has been sent.");
    setMessage("");
    setFeedbackType("general");
  };

  return (
    <>
      <DashboardHeader
        title="Client Feedback"
        description="Submit your feedback or suggestions to the admin"
      />

    <div className="m-6 p-4 md:p-5 space-y-6 rounded-2xl shadow-xl border border-primary/30 bg-secondary/40 backdrop-blur-md transition-all">
  {/* Feedback Type */}
  <div className="space-y-2">
    <Label className="text-primary font-medium">Feedback Type</Label>
    <Select value={feedbackType} onValueChange={setFeedbackType}>
      <SelectTrigger className="bg-white/80 border border-primary/20 rounded-md shadow-sm focus:ring-2 focus:ring-primary">
        <SelectValue placeholder="Select feedback type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="general">💬 General</SelectItem>
        <SelectItem value="bug">🐛 Bug Report</SelectItem>
        <SelectItem value="feature">🚀 Feature Request</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Message */}
  <div className="space-y-2">
    <Label className="text-primary font-medium">Message</Label>
    <Textarea
      rows={5}
      placeholder="Write your feedback here..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      className="bg-white/80 border border-primary/20 rounded-md shadow-sm focus:ring-2 focus:ring-primary"
    />
  </div>

  {/* Submit */}
  <div className="flex justify-end">
    <Button className="bg-primary text-white hover:bg-primary/90 transition-all duration-200">
      Send Feedback
    </Button>
  </div>
</div>
    </>
  );
};

export default FeedbackPage;
