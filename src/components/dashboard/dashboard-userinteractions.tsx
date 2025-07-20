import { FC } from "react";
import { useGetRecentUserInteractionQuery } from "@/src/hooks/useDashboard";

interface UserInteraction {
  client_name: string;
  bot_response: string;
  created_at: string;
  intent: string;
  user_message: string;
  id: number;
  confidence: number;
}

export const UserInteractions: FC = () => {
  const { data, isLoading, error } = useGetRecentUserInteractionQuery({ limit: 4 });
  console.log("User Interactions API Data:", data);

  const users: UserInteraction[] = Array.isArray(data?.recent_interactions)
    ? data.recent_interactions
    : [];
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Recent User Interactions
      </h2>

      {isLoading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500">Failed to load interactions.</div>}
      {!isLoading && !error && users.length === 0 && (
        <div className="text-gray-500">No recent interactions found.</div>
      )}

      {/* Scrollable Section */}
      <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2 border shadow-sm hover:shadow transition"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-900">{user.client_name}</p>
              <p className="text-xs text-gray-500">{(user.confidence * 100).toFixed(1)}% Confidence</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-700">User Message:</p>
              <p className="text-sm text-gray-600">{user.user_message}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-700">Bot Response:</p>
              <p className="text-sm text-gray-600">{user.bot_response}</p>
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {user.intent || 'No Intent'}
              </span>
              <span className="text-xs text-gray-500 whitespace-nowrap">{user.created_at || ''}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
