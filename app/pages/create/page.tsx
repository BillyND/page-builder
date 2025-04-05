"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { FiPlus, FiLoader } from "react-icons/fi";

export default function CreatePagePage() {
  const router = useRouter();
  const { user } = useUser();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePage = async () => {
    try {
      setIsCreating(true);
      const pageTitle = "New Page";
      // Generate a default slug based on title and timestamp
      const timestamp = Date.now().toString().slice(-6);
      const defaultSlug = `page-${timestamp}`;

      // Create a new page with default title and generated slug
      const response = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: pageTitle,
          description: "",
          slug: defaultSlug,
          metaTags: {
            title: pageTitle,
            description: "",
            keywords: "",
          },
          status: "draft",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create page");
      }

      const data = await response.json();

      // Redirect directly to the builder
      router.push(`/pages/builder/${data._id}`);
    } catch (error) {
      console.error("Error creating page:", error);
      setIsCreating(false);
    }
  };

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
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Create a New Page</h1>
          <p className="text-gray-600 mb-8">
            Start building your page with our drag and drop editor
          </p>
          <button
            onClick={handleCreatePage}
            disabled={isCreating}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center mx-auto transition-colors"
          >
            {isCreating ? (
              <FiLoader className="animate-spin mr-2" size={20} />
            ) : (
              <FiPlus className="mr-2" size={20} />
            )}
            {isCreating ? "Creating..." : "Create New Page"}
          </button>
        </div>
      </div>
    </main>
  );
}
