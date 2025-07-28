"use client"

import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs"
import { DashboardHeader } from "@/src/components/layout/dashboard-header"
import { Card, CardContent } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { ClipboardCopy } from "lucide-react"
import { toast } from "sonner" // Optional: if you want feedback on copy

const tabData = [
  {
    id: "react",
    label: "React.js",
    description: "React script and usage info",
    script: `<script src="https://cdn.example.com/react-widget.js"></script>`
  },
  {
    id: "next",
    label: "Next.js",
    description: "Next.js script and usage info",
    script: `<script src="https://cdn.example.com/next-widget.js"></script>`
  },
  {
    id: "vue",
    label: "Vue.js",
    description: "Vue script and usage info",
    script: `<script src="https://cdn.example.com/vue-widget.js"></script>`
  },
  {
    id: "nuxt",
    label: "Nuxt.js",
    description: "Nuxt script and usage info",
    script: `<script src="https://cdn.example.com/nuxt-widget.js"></script>`
  },
  {
    id: "angular",
    label: "Angular",
    description: "Angular script and usage info",
    script: `<script src="https://cdn.example.com/angular-widget.js"></script>`
  },
  {
    id: "solid",
    label: "SolidJS",
    description: "SolidJS script and usage info",
    script: `<script src="https://cdn.example.com/solid-widget.js"></script>`
  },
  {
    id: "wordpress",
    label: "WordPress",
    description: "WordPress script and usage info",
    script: `<script src="https://cdn.example.com/wp-widget.js"></script>`
  }
]

const ScriptManagementPage = () => {
  const handleCopy = (script: string) => {
    navigator.clipboard.writeText(script)
    toast.success("Copied to clipboard!" )
  }

  return (
<>
      <DashboardHeader
        title="Script Management"
        description="Copy and manage script"
      />
    <div className="space-y-6 p-4 md:p-5">
      {/* API Headers */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">API Headers</h2>
        {/* <ul className="list-decimal pl-6 text-sm text-gray-700 dark:text-gray-200 space-y-1">
          <li><code className="bg-muted px-2 py-0.5 rounded">Content-Type</code></li>
          <li><code className="bg-muted px-2 py-0.5 rounded">Authorization</code></li>
          <li><code className="bg-muted px-2 py-0.5 rounded">X-Idempotency-Key</code></li>
          <li><code className="bg-muted px-2 py-0.5 rounded">X-Trace-Id</code></li>
          <li><code className="bg-muted px-2 py-0.5 rounded">X-Scenario-Key</code></li>
        </ul> */}
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue={tabData[0].id} className="space-y-4">
       <TabsList className="grid grid-cols-4 sm:grid-cols-7 bg-secondary border border-black w-full">
  {tabData.map((tab) => (
    <TabsTrigger
      key={tab.id}
      value={tab.id}
      className="data-[state=active]:bg-primary data-[state=active]:text-white"
    >
      {tab.label}
    </TabsTrigger>
  ))}
</TabsList>


        {tabData.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <Card>
              <CardContent className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground">{tab.description}</p>

                {/* Static Terminal Box */}
                <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg relative">
                  <pre>{tab.script}</pre>
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
    </div>
    </>
  )
}

export default ScriptManagementPage
