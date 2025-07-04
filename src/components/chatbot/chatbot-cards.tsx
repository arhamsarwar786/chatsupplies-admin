'use client'

import { Card, CardContent } from "@/src/components/ui/card";
import { FaChartLine, FaPlug, FaListUl } from "react-icons/fa";
import { Badge } from "@/src/components/ui/badge";

export default function ChatbotCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Performance Overview */}
      <Card className="h-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Performance Overview</h2>
            <FaChartLine className="text-primary" />
          </div>
          {/* Empty for now */}
        </CardContent>
      </Card>

      {/* Recent Logs */}
      <Card className="h-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Logs</h2>
            <FaListUl className="text-primary" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">Bot Response Time</p>
                <p className="text-muted-foreground text-sm">Avg: 1.2s</p>
              </div>
              <span className="text-green-600 font-semibold">Good</span>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="font-medium">Error Rate</p>
                <p className="text-muted-foreground text-sm">Last 24h: 0.8%</p>
              </div>
              <span className="text-green-600 font-semibold">Low</span>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="font-medium">User Satisfaction</p>
                <p className="text-muted-foreground text-sm">Rating: 4.7/5</p>
              </div>
              <span className="text-green-600 font-semibold">High</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Status */}
      <Card className="h-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">API Status</h2>
            <FaPlug className="text-primary" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-medium">Chat API</p>
              <Badge variant="outline" className="bg-green-100 text-green-600">Online</Badge>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Analytics API</p>
              <Badge variant="outline" className="bg-green-100 text-green-600">Online</Badge>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Training API</p>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-700">Maintenance</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
