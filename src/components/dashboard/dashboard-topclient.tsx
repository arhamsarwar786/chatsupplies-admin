"use client"
import { FC } from "react";
import { useGetTopPerformingClientsQuery } from "@/src/hooks/useDashboard";

interface top_clients {
  total_interactions: number;
  client_name: string;
  negative_feedback: number;
  is_active: boolean;
  success_rate: number;
  user_id: number;
  payment_status: string;
}

export const TopClients: FC = () => {
  const { data, isLoading, error } = useGetTopPerformingClientsQuery({ limit: 1 });

  console.log("API Data:", data);

  const topclients: top_clients[] = Array.isArray(data?.top_clients)
    ? data.top_clients
    : [];
  console.log("Top Clients Data:", topclients);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Top Performing Clients
      </h2>
        {isLoading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500">Failed to load Top Clients.</div>}
      {!isLoading && !error && topclients.length === 0 && (
        <div className="text-gray-500">No Top Clients found.</div>
      )}
      <div className="space-y-4">
        {topclients.map((client) => (
          <div
            key={client.user_id}
            className="flex items-center justify-between border p-3 rounded-lg hover:shadow transition"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-full text-white font-semibold flex items-center justify-center ${
                  client.negative_feedback > 5 ? "bg-red-500" : "bg-blue-500"
                }`}
              >
                {client.negative_feedback}
              </div>
              <div>
                <p className="font-medium text-gray-900">{client.client_name}</p>
                <p className="text-sm text-gray-500">
                  {client.total_interactions} Interactions
                </p>
              </div>
            </div>
            <p className="text-green-600 font-medium">{client.success_rate}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};
