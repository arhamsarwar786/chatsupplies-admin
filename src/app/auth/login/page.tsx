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
    <div className="h-screen bg-gradient-to-br from-[#eeeaff] to-white flex items-center justify-center ">
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
        className=" rounded-md shadow-md shadow-primary"
      />
      <h1 className="text-[22px] sm:text-2xl font-bold tracking-tight text-gray-900">
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Chat Supplies
        </span>
      </h1>
    </div>
  </div>

  <div className="lg:px-28 md:px-12 sm:px-8 px-4 flex space-y-8 flex-col  justify-center h-full animate-fade-in">
    <div className="flex flex-col items-center text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h2>
      <p className="text-sm text-gray-500 mb-4 max-w-md">
        Start a new chat to engage users, automate responses, and grow smarter conversations with AI.
      </p>
    </div>

    <form onSubmit={handleLogin} className="space-y-6 w-full max-w-md mx-auto bg-card backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/30">
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
          className="absolute bg-gray-100 right-2 top-1/2  -translate-y-1/2"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
      </div>

      <Button
        type="submit"
        className="w-full rounded-full bg-primary   from-primary to-secondary hover:opacity-90 text-white"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login "}
      </Button>
    </form>

    <div className="text-center max-w-xl mx-auto mt-6">
      <p className="text-sm text-muted-foreground font-medium leading-relaxed">
        <span className="text-primary font-semibold">ChatSupplies</span> is a modern AI-powered platform designed to enhance customer interactions through intelligent chat solutions. It empowers businesses to automate conversations, improve support efficiency, and drive user engagement with smart, responsive chatbots.
      </p>
    </div>
  </div>
</div>


        {/* Right Section - Image */}
    <div className="hidden md:block bg-gradient-to-br from-primary to-secondary relative w-full h-full">
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="rounded-3xl overflow-hidden p-8 bg-white/10 backdrop-blur-lg shadow-2xl border border-white/20">
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
