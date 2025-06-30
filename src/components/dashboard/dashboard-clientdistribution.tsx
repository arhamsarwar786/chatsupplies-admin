// components/client-distribution-chart.tsx
import React from "react";

// Define TypeScript types
type ClientSegment = {
  name: "Startup" | "Enterprise" | "SMB";
  value: number;
  color: string;
  textColor: string;
};

const data: ClientSegment[] = [
  { name: "Startup", value: 35, color: "bg-blue-500", textColor: "text-blue-500" },
  { name: "Enterprise", value: 45, color: "bg-purple-500", textColor: "text-purple-500" },
  { name: "SMB", value: 20, color: "bg-green-500", textColor: "text-green-500" },
];

const totalValue = data.reduce((sum, item) => sum + item.value, 0);

export const ClientDistributionChart = () => {
  // Calculate segment angles
  const segments = data.map((item) => ({
    ...item,
    percentage: (item.value / totalValue) * 360,
  }));

  // Calculate cumulative angles for positioning
  let cumulativeAngle = 0;
  const positionedSegments = segments.map((segment) => {
    const segmentData = {
      ...segment,
      startAngle: cumulativeAngle,
      endAngle: cumulativeAngle + segment.percentage,
    };
    cumulativeAngle += segment.percentage;
    return segmentData;
  });

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Client Distribution</h2>
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Pie Chart Container */}
        <div className="relative w-48 h-48">
          {/* Base circle */}
          <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
          
          {/* Segments */}
          {positionedSegments.map((segment, index) => (
            <div
              key={segment.name}
              className={`absolute inset-0 rounded-full ${segment.color} opacity-90`}
              style={{
                clipPath: getSegmentClipPath(segment),
                transform: `rotate(${segment.startAngle}deg)`,
              }}
              aria-label={`${segment.name}: ${Math.round(segment.percentage / 3.6)}%`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="space-y-3 min-w-[160px]">
          {data.map((segment) => (
            <div key={segment.name} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${segment.color} mr-2`}></div>
              <div className="flex justify-between w-full">
                <span className="text-sm font-medium text-gray-700">{segment.name}</span>
                <span className={`text-sm font-medium ${segment.textColor}`}>
                  {Math.round((segment.value / totalValue) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate clip paths
function getSegmentClipPath(segment: {
  percentage: number;
  startAngle: number;
  endAngle: number;
}): string {
  if (segment.percentage >= 360) return "none";
  if (segment.percentage <= 0) return "inset(50%)";

  const isLargeArc = segment.percentage > 180 ? 1 : 0;
  const endX = Math.cos((segment.endAngle * Math.PI) / 180);
  const endY = Math.sin((segment.endAngle * Math.PI) / 180);

  return `path('M 1 0 A 1 1 0 ${isLargeArc} 1 ${endX} ${endY} L 0 0 Z')`;
}