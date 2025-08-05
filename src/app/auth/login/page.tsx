"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { FaGoogle, FaApple } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card } from "@/src/components/ui/card";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useLoginMutation } from "@/src/hooks/UseAuth";
import { setLogin } from "@/src/slice/authSlice";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const result = await login({ username, password }).unwrap();
      const user = result.user;
      const apikey = result.apikey || result.api_key;
      const token = result.token || result.access_token;

      if (token && user?.role ) {
        dispatch(setLogin({ token, role: user.role, api_key: apikey }));
        localStorage.setItem("token", token);
        localStorage.setItem("apikey", apikey);
        toast.success("Login successful!");
        setTimeout(() => router.push("/dashboard"), 700);
      } else {
        setError("Invalid response from server");
        toast.error("Invalid response from server");
      }
    } catch (err: any) {
      const message = err?.data?.message || "Invalid username or password";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eeeaff] to-white flex items-center justify-center px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Left Section - Form */}
        <div className="p-8 flex flex-col justify-center">
         <div className="flex flex-col w-full mb-12 items-start gap-3">
           {/* <h1 className="text-3xl font-bold">Welcome to</h1> */}
          <div className="flex items-center  gap-3 hover:scale-105 transition-transform duration-300">
            <Image
              src="/Frame.svg"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-md shadow-sm"
            />
            <h1 className="text-[22px] sm:text-2xl font-bold tracking-tight text-gray-900">
              <span className="bg-gradient-to-r from-[#2648EF] to-[#303447] bg-clip-text text-transparent">
                Chat Supplies
              </span>
            </h1>
          </div>
         </div>
 <div className="px-16">
          <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign in</h2>
          <p className="text-sm  text-gray-500  text-center  mb-6">
            Start a new chat to engage users, automate responses, and grow
            smarter conversations with AI
          </p>
         </div>
          

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="bg-[#f3f0ff]"
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-[#f3f0ff]"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full bg-primary hover:bg-primary/80 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login Now"}
            </Button>
          </form>

          <div className="my-6 border-t border-gray-200 text-center">
            <span className="relative -top-3 bg-white px-2 text-sm text-gray-500">
              or Signin with
            </span>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="rounded-full px-4 text-sm shadow-sm"
            >
              <FaGoogle className="mr-2" /> Google
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-4 text-sm shadow-sm"
            >
              <FaApple className="mr-2" /> Apple
            </Button>
          </div>
 </div>
        </div>

        {/* Right Section - Image */}
        <div className="hidden md:block bg-gradient-to-br from-primary to-secondary relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-3xl overflow-hidden p-8">
              <Image
                src="/Chatbot-image.png"
                alt="Login Illustration"
                width={400}
                height={400}
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
