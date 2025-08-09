"use client";

import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/src/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";

import { DashboardHeader } from "@/src/components/layout/dashboard-header";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useGetChatbotQuery } from "@/src/hooks/useChatbot";
import { ClipboardCopy } from "lucide-react";
import { toast } from "sonner"; // Optional: if you want feedback on copy

interface Chatbot {
  name: string;
  description: string;
  client_name: string;
  created_at: string;
  personality_tone: string;
  bot_avatar: string;
  industry: string;
  language: string;
  welcome_message: string;
  business_hours_start: string;
  business_hours_end: string;
  updated_at: string;
  id: number;
  is_active: boolean;
  progress_status: string;
  user_id: number;
  total_interactions: number;
  interaction_change_percent: number;
}
const tabData = [
  {
    id: "react",
    label: "React.js",
    description: "React script and usage info",
    script: '<script src="https://cdn.example.com/react-widget.js"></script>',
    steps: [
      {
        title: "Step 1: Locate the global component",
        description:
          "Locate the global component. Open your main app layout file. For most React apps (created using Create React App or Vite), use App.js or App.tsx.",
      },
      {
        title: "Step 2: Use useEffect to inject script",
        description:
          "Use useEffect to inject script. Inside your main layout component (App.js), use useEffect() from React to dynamically inject the script after the DOM loads.",
      },
      {
        title: "Step 3: Dynamically add the chatbot script",
        description:
          "Dynamically add the chatbot script. Create the <script> tag programmatically and append it to the document only if it hasn’t been added yet. This avoids multiple inserts.",
      },
      {
        title: "Step 4: Make sure it loads once",
        description:
          'Make sure it loads once. Prevent duplicate script loading by checking document.getElementById("chatbot") before adding the script.',
      },
      {
        title: "Step 5: Confirm chatbot loads on every route",
        description:
          "Confirm chatbot loads on every route. Since App.js wraps your entire application, this ensures the chatbot appears on all pages/routes automatically.",
      },
    ],
  },
  {
    id: "next",
    label: "Next.js",
    description: "Next.js script and usage info",
    script: '<script src="https://cdn.example.com/next-widget.js"></script>',
    steps: [
      {
        title: "Step 1: Identify your project router",
        description:
          "Determine if your project uses the App Router (Next.js 13+ with /app) or Pages Router (older /pages setup). This affects where you'll inject the script.",
      },
      {
        title: "Step 2: Decide where to load the script",
        description:
          "To show the chatbot on all pages, place the script in a global file: layout.tsx (App Router) or _app.tsx (Pages Router).",
      },
      {
        title: "Step 3: Add your chatbot script",
        description:
          "Insert the chatbot <script> tag with type='module', src, data-admin-id, and data-token attributes into the chosen layout file.",
      },
      {
        title: "Step 4: Ensure the script loads early",
        description:
          "Use the right loading strategy so the chatbot loads before user interaction. Use 'beforeInteractive' in the Script component or place the tag inside <head>.",
      },
      {
        title: "Step 5: Test your chatbot",
        description:
          "Run the app and verify the chatbot appears on all pages. Check for console errors and validate the script source and token.",
      },
    ],
  },
  {
    id: "vue",
    label: "Vue.js",
    description: "Vue script and usage info",
    script: '<script src="https://cdn.example.com/vue-widget.js"></script>',
    steps: [
      {
        title: "Step 1: Locate Main Layout",
        description:
          "Find your main Vue component where all other pages are rendered — usually App.vue.",
      },
      {
        title: "Step 2: Add Script Dynamically",
        description:
          "Use the component’s lifecycle hook to inject the chatbot script into the page when the app starts.",
      },
      {
        title: "Step 3: Confirm Script Path",
        description:
          "Ensure the script file (e.g., index.js) is hosted publicly (like on a CDN) or accessible via your app’s /public directory.",
      },
      {
        title: "Step 4: Test Integration",
        description:
          "Run your Vue app and open it in the browser. Confirm the chatbot appears and loads without errors.",
      },
      {
        title: "Step 5: Optional - Make It Reusable",
        description:
          "To keep your code clean, you can move this logic into a reusable Vue plugin or utility function for future use.",
      },
    ],
  },
  {
    id: "nuxt",
    label: "Nuxt.js",
    description: "Nuxt script and usage info",
    script: '<script src="https://cdn.example.com/nuxt-widget.js"></script>',
    steps: [
      {
        title: "Step 1: Locate Your App Layout",
        description:
          "Locate your app layout file (e.g., layouts/default.vue) which is used across all pages. This is the best place to include global scripts like the chatbot.",
      },
      {
        title: "Step 2: Provide Script Parameters",
        description:
          "Use Nuxt’s <Head> section or useHead (in Nuxt 3 with Composition API) to inject the chatbot script so it loads client-side and avoids SSR issues.",
      },
      {
        title: "Step 3: Client-Side Only Handling",
        description:
          "Ensure the script runs only on the client. In Nuxt 3, wrap the logic inside onMounted() or create a plugin with client-only mode.",
      },
      {
        title: "Step 4: Provide Script Parameters",
        description:
          "Provide required data attributes like data-admin-id and data-token within the script tag, either hardcoded or dynamically based on user/session.",
      },
      {
        title: "Step 5: Test on All Pages",
        description:
          "Run your app (npm run dev or yarn dev), visit multiple pages, and confirm the chatbot is showing correctly site-wide.",
      },
    ],
  },
  {
    id: "angular",
    label: "Angular.js",
    description: "Angular script and usage info",
    script: '<script src="https://cdn.example.com/angular-widget.js"></script>',
    steps: [
      {
        title: "Step 1: Add the Chatbot Script to Your Main HTML File",
        description:
          "Insert the chatbot script directly into your index.html file. This ensures it loads once for the entire AngularJS app.",
      },
      {
        title: "Step 2: Make the Script Accessible",
        description:
          "If the script is hosted locally, place it in a public folder like 'assets/' to ensure it's available to the browser.",
      },
      {
        title: "Step 3: Insert Dynamic Data (Optional)",
        description:
          "To personalize the chatbot, inject the script dynamically using AngularJS's run() block or a custom directive with data attributes like token or admin ID.",
      },
      {
        title: "Step 4: Verify Script Load in the Browser",
        description:
          "Check your browser console to ensure the script loads without errors, and confirm the chatbot appears on the site.",
      },
      {
        title: "Step 5: Prevent Duplicate Loads",
        description:
          "When injecting dynamically, ensure the script is added only once. Use a check to avoid re-adding it on route changes or reloads.",
      },
    ],
  },
  {
    id: "solid",
    label: "SolidJS",
    description: "SolidJS script and usage info",
    script: '<script src="https://cdn.example.com/solid-widget.js"></script>',
    steps: [
      {
        title: "Step 1",
        description:
          "Locate your root layout component. In a Solid.js project (especially if using Vite), your root layout is typically defined in a file like `src/App.tsx` or `src/root.tsx`. This is the best place to inject global scripts that should appear across all pages.",
      },
      {
        title: "Step 2",
        description:
          "Inject the script using `onMount`. Since Solid.js runs on the client, use `onMount` from `solid-js` to ensure the script runs only after the DOM is available.",
      },
      {
        title: "Step 3",
        description:
          "Append the script dynamically. Inside the `onMount()` block, create a `<script>` tag, set its attributes (`type`, `src`, `id`, `data-admin-id`, `data-token`), and append it to the document body or head.",
      },
      {
        title: "Step 4",
        description:
          'Ensure the script loads only once. Use a condition like checking if an element with `id="chatbot"` already exists to avoid duplicate loading when navigating between routes.',
      },
      {
        title: "Step 5",
        description:
          "Run and verify. Start your project using `npm run dev` or `yarn dev`. Open the site, navigate through routes, and confirm that the chatbot appears and functions globally across your app.",
      },
    ],
  },
  {
    id: "wordpress",
    label: "WordPress",
    description: "WordPress script and usage info",
    script: '<script src="https://cdn.example.com/wp-widget.js"></script>',
    steps: [
      {
        title: "Step 1: Locate the Global Layout or App Component",
        description:
          "Locate the Global Layout or App Component. For Next.js WordPress frontend, this is usually pages/_app.js or pages/_app.tsx. For Gatsby, it's gatsby-browser.js or wrapRootElement.",
      },
      {
        title: "Step 2: Use a useEffect or DOM-ready lifecycle hook",
        description:
          "Use a useEffect() or DOM-ready lifecycle hook to ensure the script is injected after the page loads.",
      },
      {
        title: "Step 3: Dynamically Inject the Script",
        description:
          "Dynamically create a <script> tag with type='module', src='index.js', id='chatbot', and add data-admin-id and data-token attributes. Append this to document.body or document.head.",
      },
      {
        title: "Step 4: Prevent Duplicate Injections",
        description:
          "Before injecting the script, check if it already exists using: if (!document.getElementById('chatbot')) { /* append script */ } to prevent duplicate loading.",
      },
      {
        title: "Step 5: Test Across All Pages",
        description:
          "Run your WordPress frontend, visit various pages, and ensure the chatbot script is loaded and working on all routes using the provided data attributes.",
      },
    ],
  },
];

const ScriptManagementPage = () => {
  const [selectedBotId, setSelectedBotId] = React.useState<number | null>(null);
   const apikeyStore = localStorage.getItem("apikey")
  const apikey = apikeyStore;
  const scriptTag = `<script 
  type="module" 
  src="index.js"
   id="chatbot"
  data-admin-id="${selectedBotId}"
   api-key="${apikey}">
  </script>`;

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useGetChatbotQuery({ page: 1 });
  console.log("Chatbots data:", data);
  const handleCopy = (script: string) => {
    navigator.clipboard.writeText(script);
    toast.success("Copied to clipboard!");
  };
  React.useEffect(() => {
  if (data && data.length > 0 && selectedBotId === null) {
    setSelectedBotId(data[0].id);
  }
}, [data, selectedBotId]);

  return (
    <>
      <DashboardHeader
        title="Script Management"
        description="Copy and manage script"
      />
      <div className="space-y-6 p-4 md:p-5 overflow-x-hidden">
        {/* API Headers */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
            API Headers
          </h2>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Chatbot Dropdown */}
          <div className="w-full md:w-80">
            <h1 className="block text-xl font-medium  mb-2">
              Select Chatbot
            </h1>

            <Select onValueChange={(value:any) => setSelectedBotId(Number(value))}>
              <SelectTrigger className="w-full border border-gray-300 dark:border-primary rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-secondary dark:focus:border-secondary transition-colors">
                <SelectValue
                  placeholder={
                    isLoading ? "Loading chatbots..." : "Choose chatbot"
                  }
                  className="text-gray-800 dark:text-gray-100"
                />
              </SelectTrigger>

              <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
                {isLoading && (
                  <SelectItem value="loading" disabled>
                    <span className="text-gray-500 dark:text-gray-400">
                      Loading...
                    </span>
                  </SelectItem>
                )}

                {error && (
                  <SelectItem value="error" disabled>
                    <span className="text-red-500 dark:text-red-400">
                      Error fetching chatbots
                    </span>
                  </SelectItem>
                )}

                {!isLoading && !error && data?.length > 0 ? (
                  data.map((bot: Chatbot) => (
                    <SelectItem
                      key={bot.id}
                      value={bot.id.toString()}
                      className="hover:bg-primary/10 dark:hover:bg-secondary/10 focus:bg-primary/20 dark:focus:bg-secondary/20"
                    >
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {bot.name}
                      </span>
                      <span
                        className={`ml-2 text-xs font-semibold ${
                          bot.is_active
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {bot.is_active ? "Active" : "Inactive"}
                      </span>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-data" disabled>
                    <span className="text-gray-500 dark:text-gray-400">
                      No chatbots available
                    </span>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs Section */}
     {selectedBotId !== null && data.length > 0 && (
          <Tabs defaultValue={tabData[0].id} className="space-y-4">
            <TabsList className="grid grid-cols-4 sm:grid-cols-7 bg-white text-primary border border-black w-full">
              {tabData.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-primary  data-[state=active]:text-white"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabData.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                <Card>
                  <CardContent className="p-4 space-y-4">
                    {/* Main Description */}

                    {/* Integration Steps (if available) */}
                    {tab.steps && (
                      <div className="space-y-5">
                        <div>
                          <h3 className="text-2xl font-bold text-black">
                            Integration Steps
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {tab.description}
                          </p>
                        </div>

                        {tab.steps.map((step, index) => (
                          <div
                            key={index}
                            className="relative border-l-4 border-primary bg-gray-200 p-6 rounded-lg shadow-sm"
                          >
                            {/* Step Number Badge */}
                            <div className="absolute -left-4 top-6 w-8 h-8 rounded-full bg-primary text-white text-base font-semibold flex items-center justify-center shadow">
                              {index + 1}
                            </div>

                            {/* Step description */}
                            <div className="pl-7">
                              <p className="text-lg font-semibold text-black mb-2">
                                {step.title}
                              </p>
                              <p className="text-base text-gray-600 ">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Script Box */}
                    <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg relative">
                      <pre>
                        <code>{scriptTag}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 text-xs"
                        onClick={() => handleCopy(tab.script)}
                      >
                        <ClipboardCopy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </>
  );
};

export default ScriptManagementPage;
