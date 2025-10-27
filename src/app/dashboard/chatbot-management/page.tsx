import { redirect } from "next/navigation";

export default function ChatbotManagementPage() {
  // This ensures clicking on “Chatbot Management” itself
  // only expands sub-items, not open chatbot details.
  redirect("/dashboard/chatbot-management");
  return null;
}
