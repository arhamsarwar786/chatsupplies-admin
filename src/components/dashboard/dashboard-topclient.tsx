import { FC } from "react";

interface TopClient {
  rank: number;
  name: string;
  interactions: string;
  growth: string;
  color: string;
}

const topClients: TopClient[] = [
  {
    rank: 1,
    name: "TechCorp Inc.",
    interactions: "15.2K interactions",
    growth: "+18%",
    color: "bg-blue-500",
  },
  {
    rank: 2,
    name: "RetailMax",
    interactions: "12.8K interactions",
    growth: "+12%",
    color: "bg-green-500",
  },
  {
    rank: 3,
    name: "FinanceHub",
    interactions: "9.1K interactions",
    growth: "+8%",
    color: "bg-orange-500",
  },
];

export const TopClients: FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Top Performing Clients
      </h2>
      <div className="space-y-4">
        {topClients.map((client) => (
          <div key={client.rank} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-full text-white font-semibold flex items-center justify-center ${client.color}`}
              >
                {client.rank}
              </div>
              <div>
                <p className="font-medium text-gray-900">{client.name}</p>
                <p className="text-sm text-gray-500">{client.interactions}</p>
              </div>
            </div>
            <p className="text-green-600 font-medium">{client.growth}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
