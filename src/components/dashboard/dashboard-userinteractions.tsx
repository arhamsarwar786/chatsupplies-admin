import { FC } from "react";

interface UserInteraction {
  name: string;
  message: string;
  time: string;
  status: "Resolved" | "Pending" | "In Progress";
  avatar: string;
}

const statusStyles: Record<UserInteraction["status"], string> = {
  Resolved: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
};

const users: UserInteraction[] = [
  {
    name: "Sarah Johnson",
    message: "Asked about product pricing and availability",
    time: "2 min ago",
    status: "Resolved",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Mike Chen",
    message: "Requested technical support for integration",
    time: "5 min ago",
    status: "Pending",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Emma Wilson",
    message: "Inquired about custom chatbot features",
    time: "8 min ago",
    status: "In Progress",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

export const UserInteractions: FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Recent User Interactions
      </h2>
      <div className="space-y-4">
        {users.map((user, idx) => (
          <div
            key={idx}
            className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-start gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-gray-600 text-sm">{user.message}</p>
                <span
                  className={`mt-2 inline-block px-2 py-1 text-xs font-medium rounded-full ${statusStyles[user.status]}`}
                >
                  {user.status}
                </span>
              </div>
            </div>
            <span className="text-sm text-gray-500">{user.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
