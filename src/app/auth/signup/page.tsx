"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useCreateClientMutation } from "@/src/hooks/useClients";

export default function SignupPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    industry: "",
  });

  const [error, setError] = useState("");
  const [createClient, { isLoading }] = useCreateClientMutation();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Trim all fields
   const trimmedForm = {
  first_name: form.first_name.trim(),
  last_name: form.last_name.trim(),
  email: form.email.trim(),
  phone_number: form.phone_number.trim(),
  company_name: form.company_name.trim(),
  industry: form.industry.trim(),
  send_welcome_email: true,   // 👈 REQUIRED
  auto_activate_account: true // 👈 REQUIRED
};


    // Required fields check
    const isEmptyField = Object.values(trimmedForm).some((val) => val === "");
    if (isEmptyField) {
      setError("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await createClient(trimmedForm).unwrap();

      // ✅ Safe check for "success"
      if (response && "success" in response && response.success === false) {
        toast.error(response.detail || "Something went wrong.");
        setError(response.detail || "Something went wrong.");
        return;
      }

      toast.success("Signup successful! Please log in.");
      router.push("/auth/login");
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.data?.detail ||
        err?.message ||
        "Failed to create client";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-[#eeeaff] to-white flex items-center justify-center">
      <div className="grid grid-cols-1 h-full md:grid-cols-2 w-full bg-white shadow-xl overflow-hidden">
        {/* Left Section - Form */}
        <div className="p-8">
          <div className="flex flex-col w-full mb-12 items-start gap-3">
            <div className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
              <Image
                src="/Frame.svg"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-md shadow-md shadow-primary"
              />
              <h1 className="text-[22px] sm:text-2xl font-bold tracking-tight text-gray-900">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Chat Supplies
                </span>
              </h1>
            </div>
          </div>

          <div className="lg:px-28 md:px-12 sm:px-8 px-4 flex space-y-8 flex-col justify-center h-full animate-fade-in">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                Create Account
              </h2>
              <p className="text-sm text-gray-500 mb-4 max-w-md">
                Start a new chat to engage users, automate responses, and grow
                smarter conversations with AI.
              </p>
            </div>

            <form
              onSubmit={handleSignup}
              className="space-y-6 w-full max-w-md mx-auto bg-card backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/30"
            >
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* First & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                />
                <Input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
              </div>

              {/* Email */}
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
              />

              {/* Phone */}
              <Input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="Phone Number"
              />

              {/* Company */}
              <Input
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                placeholder="Company Name"
              />

              {/* Industry */}
              <Input
                name="industry"
                value={form.industry}
                onChange={handleChange}
                placeholder="Industry"
              />

              {/* Signup Button */}
              <Button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-[#2648EF] to-[#252F8B] hover:opacity-90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing up..." : "Signup"}
              </Button>

              {/* Redirect to Login link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <span
                  onClick={() => router.push("/auth/login")}
                  className="text-primary font-semibold cursor-pointer hover:underline"
                >
                  Login
                </span>
              </p>
            </form>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="hidden md:block bg-gradient-to-br from-primary to-secondary relative w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-3xl overflow-hidden p-8 bg-white/10 backdrop-blur-lg shadow-2xl border border-white/20">
              <Image
                src="/Bot.png"
                alt="Signup Illustration"
                width={500}
                height={500}
                className="rounded-2xl object-cover"
              />
              <p className="text-white text-sm text-center mt-4 font-light">
                Empower conversations with AI
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
