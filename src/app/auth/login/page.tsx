"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useLoginMutation } from "@/src/hooks/UseAuth";
import { setLogin } from "@/src/slice/authSlice";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [missingFields, setMissingFields] = useState<{ username: boolean; password: boolean }>({
    username: false,
    password: false,
  });

  const router = useRouter();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMissingFields({ username: false, password: false });

    if (!username || !password) {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields");

      setMissingFields({
        username: !username,
        password: !password,
      });

      setIsLoading(false);
      return;
    }

    try {
      const result = await login({ username, password }).unwrap();
      const user = result.user;
      const apikey = result.apikey || result.api_key;
      const token = result.token || result.access_token;
      const email = result?.user?.email || result.email;

      if (token && user?.role) {
        dispatch(setLogin({ token, role: user.role, api_key: apikey }));
        localStorage.setItem("token", token);
        localStorage.setItem("apikey", apikey);
        localStorage.setItem("email", email);

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
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-[#eeeaff] to-white flex items-center justify-center">
      <div className="grid grid-cols-1 h-full md:grid-cols-2 w-full bg-white shadow-xl overflow-hidden">
        {/* Left Section - Form */}
        <div className="p-4 sm:p-6 md:p-8">
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

          <div className="px-4 sm:px-6 md:px-12 lg:px-28 flex space-y-6 sm:space-y-8 flex-col justify-center h-full animate-fade-in -mt-8">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 max-w-md">
                Start a new chat to engage users, automate responses, and grow
                smarter conversations with AI.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="space-y-4 sm:space-y-6 w-full max-w-md mx-auto bg-card backdrop-blur-md p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl border border-white/30 -mt-2"
            >
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (e.target.value.trim() !== "") {
                    setMissingFields((prev) => ({ ...prev, username: false }));
                    if (error) setError("");
                  }
                }}
                disabled={isLoading}
                className={`bg-[#f3f0ff] ${missingFields.username ? "border-red-500" : ""}`}
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value.trim() !== "") {
                      setMissingFields((prev) => ({ ...prev, password: false }));
                      if (error) setError("");
                    }
                  }}
                  disabled={isLoading}
                  className={`bg-[#f3f0ff] ${missingFields.password ? "border-red-500" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute bg-gray-100 right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>

              {/* Login button */}
              <Button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-[#2648EF] to-[#252F8B] hover:opacity-90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              {/* Signup link */}
              <p className="text-center text-xs sm:text-sm text-gray-600">
                Don't have an account?{" "}
                <span
                  onClick={() => router.push("/auth/signup")}
                  className="text-primary font-semibold cursor-pointer hover:underline"
                >
                  Sign up
                </span>
              </p>
            </form>

            <div className="text-center max-w-xl mx-auto sm:mt-1 ">
              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                <span
                  onClick={() => router.push("/auth/signup")}
                  className="text-primary font-semibold cursor-pointer">
                    ChatSupplies
                    </span>{" "}
                is a modern AI-powered platform designed to enhance customer
                interactions through intelligent chat solutions. It empowers
                businesses to automate conversations, improve support
                efficiency, and drive user engagement with smart, responsive
                chatbots.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="hidden md:block bg-gradient-to-br from-primary to-secondary relative w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-3xl overflow-hidden p-4 lg:p-8 bg-white/10 backdrop-blur-lg shadow-2xl border border-white/20">
              <Image
                src="/Bot.png"
                alt="Login Illustration"
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