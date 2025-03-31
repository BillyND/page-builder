"use client";

import React from "react";
import PageForm from "@/app/components/pages/PageForm";
import { useUser } from "@clerk/nextjs";

export default function CreatePagePage() {
  const { user } = useUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            You must be logged in to create a page.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <PageForm />
    </main>
  );
}
