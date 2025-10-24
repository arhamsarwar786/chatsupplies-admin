"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";
import PhoneInput from "@/src/components/PhoneInput";

export default function SignupPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    website_url: "",
    industry: "",
    send_welcome_email: true,
    auto_activate_account: true,
  });

  const [error, setError] = useState("");
  const [missing, setMissing] = useState<string[]>([]);
  const [invalidNames, setInvalidNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // ✅ Handle input changes with live validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Live validation for first_name & last_name
    if (name === "first_name" || name === "last_name") {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setInvalidNames((prev) => prev.filter((field) => field !== name));
      } else {
        if (!invalidNames.includes(name)) setInvalidNames((prev) => [...prev, name]);
      }
    }

    setForm({ ...form, [name]: value });

    // Remove from missing if user filled it
    if (value.trim() !== "" && missing.includes(name)) {
      setMissing((prev) => prev.filter((field) => field !== name));
    }

    if (error) setError("");
  };

  const handlePhoneChange = (value: string | undefined) => {
    const phoneValue = value || "";
    setForm({ ...form, phone_number: phoneValue });

    if (phoneValue.trim() !== "" && missing.includes("phone_number")) {
      setMissing((prev) =>
        prev.filter((field) => field !== "phone_number")
      );
    }

    if (error) setError("");
  };

  const handleSelectChange = (value: string, name: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    if (value.trim() !== "" && missing.includes(name)) {
      setMissing((prev) => prev.filter((field) => field !== name));
    }

    if (error) setError("");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Trim all values
    const trimmedForm = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone_number: form.phone_number.trim(),
      website_url: form.website_url.trim(),
      industry: form.industry.trim(),
      send_welcome_email: form.send_welcome_email,
      auto_activate_account: form.auto_activate_account,
    };

    // Check for empty fields - only check string fields that are required
    const requiredFields = {
      first_name: trimmedForm.first_name,
      last_name: trimmedForm.last_name,
      email: trimmedForm.email,
      phone_number: trimmedForm.phone_number,
      industry: trimmedForm.industry,
    };

    const emptyFields = Object.entries(requiredFields)
      .filter(([_, val]) => val === "")
      .map(([key]) => key);

    // Check for invalid first/last names - only check string fields
    const invalidNameFields = ["first_name", "last_name"].filter((key) => {
      const value = trimmedForm[key as keyof typeof trimmedForm];
      return typeof value === "string" && !/^[A-Za-z\s]+$/.test(value);
    });

    if (emptyFields.length > 0 || invalidNameFields.length > 0) {
      setMissing(emptyFields);
      setInvalidNames(invalidNameFields);

      if (invalidNameFields.length > 0) {
        toast.error("Fill the fields with correct Information.");
        setError("Fill the fields with correct Information.");
      } else {
        toast.error("Please fill in all required fields");
        setError("Please fill in all required fields");
      }
      return; // Prevent form submission
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://api.chatsupplies.com/beta/signup", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedForm),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast.error("Account already exists");
          setError("Account already exists");
          return; // Don't redirect to login
        } else {
          let errorMsg = "Something went wrong";

          if (typeof data.detail === "string") {
            errorMsg = data.detail;
          } else if (Array.isArray(data.detail) && data.detail.length > 0) {
            errorMsg = data.detail.map((err: any) => err.msg).join(", ");
          } else if (data.detail?.msg) {
            errorMsg = data.detail.msg;
          } else if (data.error) {
            errorMsg = data.error;
          }

          throw new Error(errorMsg);
        }
      }

      // Handle successful response - always show custom success message
      if (data.success || response.ok) {
        toast.success("Account is created successfully, please log in");
        router.push("/auth/login");
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (err: any) {
      const message = err?.message || "Failed to create client";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-[#eeeaff] to-white flex items-center justify-center">
      <div className="grid grid-cols-1 h-full md:grid-cols-2 w-full bg-white shadow-xl overflow-hidden">
        {/* Left Section - Form */}
        <div className="p-8 overflow-y-auto h-screen">
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

          <div className="lg:px-28 md:px-12 sm:px-8 px-4 flex space-y-8 flex-col justify-center h-full animate-fade-in -mt-9">
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
              className="space-y-6 w-full max-w-md mx-auto bg-card backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/30 -mt-4"
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
                  className={`${missing.includes("first_name") || invalidNames.includes("first_name")
                    ? "border-red-500"
                    : "border-gray-400"
                    }`}
                />
                <Input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className={`${missing.includes("last_name") || invalidNames.includes("last_name")
                    ? "border-red-500"
                    : "border-gray-400"
                    }`}
                />
              </div>

              {/* Email */}
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={missing.includes("email") ? "border-red-500" : "border-gray-400"}
              />

              {/* Phone */}
              <PhoneInput
                value={form.phone_number}
                onChange={handlePhoneChange}
                // FIX: Modify padding classes to allow CSS to control it, but keep border/size/error state
                // We remove px-3 and py-1.5 from here, as that space is now controlled by CSS on internal elements
                className={`mt-1 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${missing.includes("phone_number") ? "border-red-500" : "border-gray-400"
                  }`}
              />

              {/* Website URL */}
              <Input
                name="website_url"
                type="url"
                value={form.website_url}
                onChange={handleChange}
                placeholder="Website URL (optional)"
                className="border-gray-400"
              />

              {/* Industry */}
              <div>
                <Select
                  value={form.industry}
                  onValueChange={(val) => handleSelectChange(val, "industry")}
                >
                  <SelectTrigger
                    className={`mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${missing.includes("industry")
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
              <p className="text-center text-sm text-gray-600">
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