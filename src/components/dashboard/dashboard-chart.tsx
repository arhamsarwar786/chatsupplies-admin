// components/platform-usage-trends.tsx
import React from 'react';

const data = [
  { month: 'Jan', value: 70 },
  { month: 'Feb', value: 60 },
  { month: 'Mar', value: 50 },
  { month: 'Apr', value: 40 },
  { month: 'May', value: 30 },
  { month: 'Jun', value: 20 },
];

export const PlatformUsageTrends = () => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-lg font-semibold mb-6">Platform Usage Trends</h2>
      
      <div className="flex">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between  h-48">
          {[70, 60, 50, 40].map((value) => (
            <span key={value} className="text-sm text-gray-600 font-medium">
              {value}
            </span>
          ))}
        </div>
        
        {/* Chart bars */}
       <div className="w-full h-48 flex items-end px-2">
  {data.map((item) => (
    <div key={item.month} className="flex flex-col items-center flex-1">
      <div
        className="w-6 bg-blue-500 rounded-t-sm transition-all duration-300"
        style={{ height: `${(item.value / maxValue) * 100}%` }}
      />
      <span className="text-sm text-gray-600 mt-2">{item.month}</span>
    </div>
  ))}
</div>

      </div>
      
      <div className="mt-8 pt-4 border-t">
        <p className="text-sm text-gray-600">Interactions (K)</p>
      </div>
    </div>
  );
};