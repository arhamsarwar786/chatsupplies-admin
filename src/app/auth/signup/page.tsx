"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";

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
  const [missing, setMissing] = useState<string[]>([]);
  const [createClient, { isLoading }] = useCreateClientMutation();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // remove red border immediately when user types
    if (value.trim() !== "" && missing.includes(name)) {
      setMissing((prev) => prev.filter((field) => field !== name));
    }

    // remove error message if field is being fixed
    if (error) {
      setError("");
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    // remove red border immediately when user selects
    if (value.trim() !== "" && missing.includes(name)) {
      setMissing((prev) => prev.filter((field) => field !== name));
    }

    // remove error message if field is being fixed
    if (error) {
      setError("");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMissing([]);

    const trimmedForm = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone_number: form.phone_number.trim(),
      company_name: form.company_name.trim(),
      industry: form.industry.trim(),
      send_welcome_email: true,
      auto_activate_account: true,
    };

    const emptyFields = Object.entries(trimmedForm)
      .filter(
        ([key, val]) =>
          val === "" &&
          key !== "send_welcome_email" &&
          key !== "auto_activate_account"
      )
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      setMissing(emptyFields);
      setError("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await createClient(trimmedForm).unwrap();
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
        <div className="p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col w-full mb-8 sm:mb-10 md:mb-12 items-start gap-3">
            <div className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
              <Image
                src="/Frame.svg"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-md shadow-md shadow-primary"
              />
              <h1 className="text-[20px] sm:text-[22px] md:text-2xl font-bold tracking-tight text-gray-900">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Chat Supplies
                </span>
              </h1>
            </div>
          </div>

          <div className="px-4 sm:px-6 md:px-12 lg:px-28 flex space-y-6 sm:space-y-8 flex-col justify-center h-full animate-fade-in -mt-12">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Create Account
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 max-w-md">
                Start a new chat to engage users, automate responses, and grow
                smarter conversations with AI.
              </p>
            </div>

            <form
              onSubmit={handleSignup}
              className="space-y-4 sm:space-y-6 w-full max-w-md mx-auto bg-card backdrop-blur-md p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl border border-white/30 -mt-5"
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
                  className={
                    missing.includes("first_name") ? "border-red-500" : ""
                  }
                />
                <Input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className={
                    missing.includes("last_name") ? "border-red-500" : ""
                  }
                />
              </div>

              {/* Email */}
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={missing.includes("email") ? "border-red-500" : ""}
              />

              {/* Phone */}
              <Input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="Phone Number"
                className={
                  missing.includes("phone_number") ? "border-red-500" : ""
                }
              />

              {/* Company */}
              <Input
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                placeholder="Company Name"
                className={
                  missing.includes("company_name") ? "border-red-500" : ""
                }
              />

              {/* Industry */}
              <div>
                <Select
                  value={form.industry}
                  onValueChange={(val) => handleSelectChange(val, "industry")}
                >
                  <SelectTrigger
                    className={`mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      missing.includes("industry")
                        ? "border-red-500"
                        : "border-gray-400"
                    }`}
                  >
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="health">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Signup Button */}
              <Button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-[#2648EF] to-[#252F8B] hover:opacity-90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing up..." : "Signup"}
              </Button>

              {/* Redirect to Login link */}
              <p className="text-center text-xs sm:text-sm text-gray-600">
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
            <div className="rounded-3xl overflow-hidden p-4 lg:p-8 bg-white/10 backdrop-blur-lg shadow-2xl border border-white/20">
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