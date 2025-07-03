"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
// import { toast } from 'sonner';
// import LoadingSpinner from "../loadingSpinner/LoadingSpinner";

// This HOC redirects UNAUTHENTICATED users to login.
// It renders the wrapped component ONLY if the user IS authenticated.
const requireAuth = (WrappedComponent: React.ComponentType<any>) => {
  const AuthComponent = (props: any) => {
    const router = useRouter();
    const token = useSelector((state: RootState) => state.authSlice.token);

    useEffect(() => {
      if (!token) {
        // Save the current path to redirect after login
        if (typeof window !== "undefined") {
          localStorage.setItem("lastVisitedPath", window.location.pathname);
        }
        router.replace("/"); // Redirect to login
      }
    }, [token, router]);

    if (!token) {
      return <div>Loading...</div>; // Or <LoadingSpinner />
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default requireAuth;
