import { redirect } from "next/navigation";

export default function PackageManagementPage() {
  // Redirect clicking on "Package Management" to /dashboard/packages
  redirect("/dashboard/packages");
}
