import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]";
import PageBuilder from "@/app/components/builder/PageBuilder";
import dbConnect from "@/app/lib/db";
import Page from "@/app/models/Page";

interface BuilderPageProps {
  params: {
    id: string;
  };
}

export default async function BuilderPage({ params }: BuilderPageProps) {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  // Connect to database
  await dbConnect();

  // Fetch page data
  const page = await Page.findOne({
    _id: params.id,
    createdBy: session.user.id,
  });

  // Redirect to pages list if page not found
  if (!page) {
    redirect("/pages");
  }

  return (
    <PageBuilder
      pageId={params.id}
      initialData={{
        title: page.title,
        content: page.content || "",
      }}
    />
  );
}
