import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]";
import PageForm from "@/app/components/pages/PageForm";

export default async function CreatePagePage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <PageForm />
    </main>
  );
}
