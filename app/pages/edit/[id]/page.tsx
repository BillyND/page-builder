import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]";
import PageForm from "@/app/components/pages/PageForm";
import dbConnect from "@/app/lib/db";
import Page from "@/app/models/Page";

interface EditPageProps {
  params: {
    id: string;
  };
}

export default async function EditPagePage({ params }: EditPageProps) {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  // Connect to database
  await dbConnect();

  // Ensure params is properly resolved
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Fetch page data
  const page = await Page.findOne({
    _id: id,
    createdBy: session.user.id,
  });

  // Redirect to pages list if page not found
  if (!page) {
    redirect("/pages");
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <PageForm
        initialData={{
          title: page.title,
          description: page.description || "",
          slug: page.slug,
          metaTags: page.metaTags || {
            title: "",
            description: "",
            keywords: "",
          },
          status: page.status,
        }}
        isEditing={true}
        pageId={id}
      />
    </main>
  );
}
