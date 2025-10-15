"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CardSection } from "@/src/components/dashboard/dashboard-card"
import { UserInteractions } from "@/src/components/dashboard/dashboard-userinteractions"
import { TopClients } from "@/src/components/dashboard/dashboard-topclient"
import { PlatformUsageTrends } from "@/src/components/dashboard/dashboard-chart"
import { ClientDistributionChart } from "@/src/components/dashboard/dashboard-clientdistribution"
import { useSelector } from "react-redux"
import { RootState } from "@/src/store/store"
import { DashboardHeader } from "@/src/components/layout/dashboard-header"
import { Split } from "lucide-react"

export default function DashboardPage() {
  const token = useSelector((state: RootState) => state.authSlice.token)
    const role = useSelector((state: RootState) => state.authSlice.role);
  const [namePart, setNamePart] = useState("")
  const router = useRouter()

   useEffect(() => {
    if (!token) {
      router.push("/")
    }
  }, [token, router])

  useEffect(() => {
    reloadData();
  }, [])

 const reloadData = () => {
  console.log("Reloading user data from localStorage...");
  try {
    const userString = localStorage.getItem("userObject");
    if (!userString) {
      console.log("No userObject found in localStorage.");
      return;
    }

    const user = JSON.parse(userString);
    console.log("User Object:", user);

    const fullName =
      (user?.first_name ? user.first_name + " " : "") + (user?.username || "");
    setNamePart(fullName.trim());
  } catch (error) {
    console.error("Failed to parse userObject:", error);
  }
};


  useEffect(() => {
  const handleFocus = () => {
    reloadData();
  };
  window.addEventListener("focus", handleFocus);
  return () => window.removeEventListener("focus", handleFocus);
}, []);

  return (
   
      <>
        <DashboardHeader
          title="Dashboard Overview"
        description="Here’s a summary of your recent activity"
        // buttonText="Add New"
        />
        <div className="flex-1 space-y-4 p-4 md:p-5">
          <h1 className="text-3xl font-bold">Welcome
            <span className="text-primary"> {namePart}!</span>
            </h1>
            {role === "super_admin" && (
        <CardSection/>
            )}
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        <PlatformUsageTrends/>
        <ClientDistributionChart/>
            </div>
             {role === "super_admin" && (
       <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        
         <UserInteractions/>
        <TopClients/>
       
       </div>
      )}
      </div>
  </>
  )
}
