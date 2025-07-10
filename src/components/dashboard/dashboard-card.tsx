import { FC } from "react";
import {
  Building2,
  Bot,
  MessageCircle,
  CheckCircle,
  LucideIcon,
} from "lucide-react";
import { useGetSummaryQuery } from "@/src/hooks/useDashboard";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  note: string;
  iconType: "building" | "bot" | "message" | "check";
  iconBg: string;
}

// Mapping iconType to Lucide icon component
const iconMap: Record<StatCardProps["iconType"], LucideIcon> = {
  building: Building2,
  bot: Bot,
  message: MessageCircle,
  check: CheckCircle,
};

const StatCard: FC<StatCardProps> = ({
  title,
  value,
  change,
  note,
  iconType,
  iconBg,
}) => {
  const Icon = iconMap[iconType];

  return (
    <div className="bg-white rounded-xl shadow-sm px-6 py-5 flex justify-between items-center w-full">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
        <p className="text-green-600 text-sm mt-1">
          {change} <span className="text-gray-600">{note}</span>
        </p>
      </div>
      <div className={`p-3 rounded-lg ${iconBg}`}>
        <Icon className="w-6 h-6 text-current" />
      </div>
    </div>
  );
};

export function CardSection() {
  const { data, isLoading, error } = useGetSummaryQuery({});
  console.log("CardSection data:", data);

  if (isLoading) {
    return <div>Loading summary...</div>;
  }

  if (error) {
    return <div className="text-red-500">Failed to load summary.</div>;
  }

  const stats: StatCardProps[] = [
    {
      title: "Total Clients",
      value: data?.total_clients.count ?? 0,
      change: data?.total_clients.percentage_change ?? 0,
      note: "this month",
      iconType: "building",
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      title: "Active Clients",
      value: data?.active_clients.count ?? 0,
      change: data?.active_clients.percentage_changes ?? 0,
      note: "this month",
      iconType: "bot",
      iconBg: "bg-green-100 text-green-600",
    },
    {
      title: "Daily Interactions",
      value: data?.daily_interactions.count ?? 0,
      change: data?.daily_interactions.percentage_changes ?? 0,
      note: "today",
      iconType: "message",
      iconBg: "bg-purple-100 text-purple-600",
    },
    {
      title: "Success Rate",
      value: data?.success_rate.percentage  ?? 0,
      change: data?.success_rate.percentage_changes ?? 0,
      note: "this week",
      iconType: "check",
      iconBg: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((card, idx) => (
        <StatCard key={idx} {...card} />
      ))}
    </div>
  );
}
