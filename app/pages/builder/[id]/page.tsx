import React from "react";
import { redirect } from "next/navigation";
import PageBuilder from "@/app/components/builder/PageBuilder";
import dbConnect from "@/app/lib/db";
import Page from "@/app/models/Page";
import { auth } from "@clerk/nextjs/server";

interface BuilderPageProps {
  params: {
    id: string;
  };
}

export default async function BuilderPage({ params }: BuilderPageProps) {
  const { userId } = await auth();

  if (!userId) {
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
    createdBy: userId,
  });

  // Redirect to pages list if page not found
  if (!page) {
    redirect("/pages");
  }

  return (
    <PageBuilder
      pageId={id}
      initialData={{
        title: page.title,
        content: page.content || "",
      }}
    />
  );
}
