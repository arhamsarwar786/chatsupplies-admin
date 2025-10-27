"use client";

import dynamic from "next/dynamic";

const ClientPage = dynamic(() => import("../subscription-packages/ClientPage"), { ssr: false });

export default function PackagesPage() {
  return <ClientPage />;
}
