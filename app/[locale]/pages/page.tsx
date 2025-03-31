import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]";
import PageList from "@/app/components/pages/PageList";

export default async function PagesPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <PageList />
    </main>
  );
}
