"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

// Import Google icon
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useLoginMutation } from "@/src/hooks/UseAuth";
import { setLogin } from "@/src/slice/authSlice";
// Updated imports
import { auth, provider, signInWithEmailAndPassword, signInWithPopup, logAnalyticsEvent } from "@/src/lib/firebase";
import app from "@/src/lib/firebase";
import { useResendWelcomeEmailMutation } from "@/src/hooks/useClients"

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [resendWelcomeEmail] = useResendWelcomeEmailMutation();

  // Track page view on component mount
  useEffect(() => {
    logAnalyticsEvent('page_view', {
      page_title: 'Login Page',
      page_location: '/auth/login'
    });
  }, []);

  // Enhanced login function with analytics
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields");

      // Track validation error
      logAnalyticsEvent('login_validation_error', {
        error_type: 'empty_fields',
        username_provided: !!username,
        password_provided: !!password
      });

      setIsLoading(false);
      return;
    }

    try {
      const result = await login({ username, password }).unwrap();
      console.log("Login result:", result);
      const user = result.user;

      const apikey = result.apikey || result.api_key;
      const token = result.token || result.access_token;
      const email = result?.user?.email || result.email;

      if (token && user?.role) {
        dispatch(setLogin({ token, role: user.role, api_key: apikey }));
        localStorage.setItem("token", token);
        localStorage.setItem("apikey", apikey);
        localStorage.setItem("email", email);
        localStorage.setItem("username", username);
        localStorage.setItem("userid", user.id);
        localStorage.setItem("userObject", JSON.stringify(user));

        // Track successful login
        logAnalyticsEvent('login_success', {
          method: 'email_password',
          user_id: user.id,
          user_role: user.role,
          username: username,
          email: email
        });

        // Track admin-specific login
        if (user.role === 'admin') {
          logAnalyticsEvent('admin_login', {
            user_id: user.id,
            username: username,
            email: email,
            login_timestamp: new Date().toISOString()
          });
        }

        toast.success("Login successful!");
        setTimeout(() => router.push("/dashboard"), 700);
      } else {
        setError("Invalid response from server");
        toast.error("Invalid response from server");

        // Track server error
        logAnalyticsEvent('login_server_error', {
          error_type: 'invalid_response',
          has_token: !!token,
          has_role: !!user?.role
        });
      }
    } catch (err: any) {
      const message = err?.data?.message || "Invalid username or password";
      setError(message);
      toast.error(message);

      // Track login failure
      logAnalyticsEvent('login_failed', {
        method: 'email_password',
        error_message: message,
        username: username,
        error_code: err?.data?.code || 'unknown'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced Google Sign-in with analytics
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    // Track Google sign-in attempt
    logAnalyticsEvent('google_signin_attempt');

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Track successful Google sign-in
      logAnalyticsEvent('google_signin_success', {
        user_id: user.uid,
        email: user.email,
        display_name: user.displayName
      });

      // *** IMPORTANT: Replace with your backend token exchange logic ***
      // After backend authentication, track admin status
      // Example:
      // const backendResponse = await yourBackendAuth(user);
      // if (backendResponse.user.role === 'admin') {
      //   logAnalyticsEvent('admin_google_login', {
      //     user_id: backendResponse.user.id,
      //     email: user.email,
      //     login_timestamp: new Date().toISOString()
      //   });
      // }

      toast.success(`Welcome, ${user.displayName || user.email}!`);
      setTimeout(() => router.push("/dashboard"), 700);

    } catch (err: any) {
      const message = err.code ? err.code.replace('auth/', '').replace(/-/g, ' ') : "An unknown error occurred during Google sign-in.";
      setError(`Google Sign-in failed: ${message}`);
      toast.error(`Google Sign-in failed: ${message}`);

      // Track Google sign-in failure
      logAnalyticsEvent('google_signin_failed', {
        error_code: err.code || 'unknown',
        error_message: message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password functionality
  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setForgotPasswordLoading(true);

    // Track forgot password attempt
    logAnalyticsEvent('forgot_password_attempt', {
      email: forgotPasswordEmail
    });

    try {
      // Note: You'll need to adjust this based on your actual API requirements
      // Since resendWelcomeEmail requires an ID, you might need a different endpoint
      // This is a placeholder implementation
      const response = await resendWelcomeEmail({
        id: 0 // You'll need to replace this with actual user ID or use a different endpoint
      }).unwrap();

      toast.success("Password reset instructions have been sent to your email!");

      // Track successful forgot password request
      logAnalyticsEvent('forgot_password_success', {
        email: forgotPasswordEmail
      });

      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    } catch (err: any) {
      const message = err?.data?.message || "Failed to send reset instructions";
      toast.error(message);

      // Track forgot password failure
      logAnalyticsEvent('forgot_password_failed', {
        email: forgotPasswordEmail,
        error_message: message
      });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Track other user interactions
  const trackUserInteraction = (interactionType: string, additionalParams = {}) => {
    logAnalyticsEvent('user_interaction', {
      interaction_type: interactionType,
      page: 'login',
      timestamp: new Date().toISOString(),
      ...additionalParams
    });
  };

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-[#eeeaff] to-white flex items-center justify-center">
      <div className="grid grid-cols-1 h-full lg:grid-cols-2 w-full bg-white shadow-xl overflow-hidden">
        {/* Left Section - Form - Always visible */}
        <div className="p-8 overflow-y-auto max-h-screen">
          <div className="flex flex-col w-full mb-12 items-start gap-3">
            <div className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
              <Image
                src="/Logo/Group.png"
                alt="Logo"
                width={30}
                height={30}
                className=""
                onClick={() => trackUserInteraction('logo_click')}
              />
              <h1 className="text-[22px] sm:text-2xl font-bold tracking-tight text-gray-900">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Chat Supplies
                </span>
              </h1>
            </div>
          </div>

          <div className="lg:px-28 md:px-12 sm:px-8 px-4 flex space-y-8 flex-col justify-center h-full animate-fade-in mt-18">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                {showForgotPassword ? "Reset Password" : "Welcome Back"}
              </h2>
              <p className="text-sm text-gray-500 mb-4 max-w-md">
                {showForgotPassword
                  ? "Enter your email address and we'll send you instructions to reset your password."
                  : "Start a new chat to engage users, automate responses, and grow smarter conversations with AI."
                }
              </p>
            </div>

            {/* Forgot Password Form */}
            {showForgotPassword ? (
              <div className="space-y-6 w-full max-w-md mx-auto bg-card backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/30 -mt-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  disabled={forgotPasswordLoading}
                  className="bg-[#f3f0ff]"
                />

                <Button
                  onClick={handleForgotPassword}
                  className="w-full rounded-full hover:opacity-90 text-white"
                  disabled={forgotPasswordLoading}
                >
                  {forgotPasswordLoading ? "Sending..." : "Send Reset Instructions"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail("");
                    trackUserInteraction('forgot_password_cancel');
                  }}
                  className="w-full cursor-pointer"
                  disabled={forgotPasswordLoading}
                >
                  Back to Login
                </Button>
              </div>
            ) : (
              /* The Login Form */
              <form
                onSubmit={handleLogin}
                className="space-y-6 w-full max-w-md mx-auto bg-card backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/30 -mt-3"
              >

                {error && (
                  <Alert
                    variant="destructive"
                    className="py-1 px-3 text-xs sm:text-sm rounded-md"
                  >
                    <AlertDescription className="text-xs sm:text-sm">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Username Input */}
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error && e.target.value.trim()) {
                      setError("");
                    }
                    trackUserInteraction('username_input', {
                      input_length: e.target.value.length
                    });
                  }}
                  onFocus={() => trackUserInteraction('username_focus')}
                  disabled={isLoading}
                  className={`bg-[#f3f0ff] ${error && !username ? "border border-red-500" : ""
                    }`}
                />

                {/* Password Input */}
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error && e.target.value.trim()) {
                        setError("");
                      }
                    }}
                    onFocus={() => trackUserInteraction('password_focus')}
                    disabled={isLoading}
                    className={`bg-[#f3f0ff] ${error && !password ? "border border-red-500" : ""
                      }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute bg-gray-100 right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => {
                      setShowPassword(!showPassword);
                      trackUserInteraction('toggle_password_visibility', {
                        new_state: !showPassword ? 'visible' : 'hidden'
                      });
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>



                {/* ✅ Primary Login button */}
                <Button
                  type="submit"
                  className="w-full rounded-full hover:opacity-90 text-white"
                  disabled={isLoading}
                  onClick={() => trackUserInteraction('login_button_click')}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                {/* Forgot Password Link */}
                <div className="text-right -mt-2 -mb-1">
                  <span
                    onClick={() => {
                      setShowForgotPassword(true);
                      trackUserInteraction('forgot_password_click');
                    }}
                    className="text-sm text-primary font-semibold cursor-pointer hover:underline"
                  >
                    Forgot password?
                  </span>
                </div>

                {/* === GOOGLE BUTTON === */}
                <div className="pt-2 space-y-4">
                  {/* Separator */}
                  <div className="relative flex items-center justify-center w-full">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm">
                      or continue with
                    </span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  {/* Google Button */}
                  <Button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-md transition-colors duration-300 flex items-center justify-center gap-3 font-medium"
                    disabled={isLoading}
                  >
                    <FcGoogle className="w-5 h-5" />
                    <span className="text-center flex-1">{isLoading ? "Signing in..." : "Sign in with Google"}</span>
                  </Button>
                </div>

                {/* ✅ Signup link */}
                <p className="text-center text-sm text-gray-600 mt-4">
                  Don't have an account?{" "}
                  <span
                    onClick={() => {
                      trackUserInteraction('signup_link_click');
                      router.push("/auth/signup");
                    }}
                    className="text-primary font-semibold cursor-pointer hover:underline"
                  >
                    Sign up
                  </span>
                </p>
              </form>
            )}

            <div className="text-center max-w-xl mx-auto sm:mt-1">
              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                <span
                  onClick={() => {
                    trackUserInteraction('website_link_click');
                    window.open("https://chatsupplies.com", "_blank");
                  }}
                  className="text-primary font-bold cursor-pointer"
                >
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

        {/* Right Section - Image - Only show on desktop (lg breakpoint and above) */}
        <div className="hidden lg:block bg-gradient-to-br from-primary to-secondary relative w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-3xl overflow-hidden p-8 bg-white/10 backdrop-blur-lg shadow-2xl border border-white/20">
              <Image
                src="/Bot-latest.png"
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
  )
}