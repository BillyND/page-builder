import React from "react";
import dbConnect from "@/app/lib/db";
import Page from "@/app/models/Page";
import { elementsToHtml } from "@/app/lib/elementToHtml";

interface ViewPageProps {
  params: {
    slug: string;
  };
}

export default async function ViewPage({ params }: ViewPageProps) {
  // Connect to database
  await dbConnect();

  console.log("===>params:", params);

  // Ensure params is properly resolved
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Fetch page data
  const page = await Page.findOne({
    slug: slug,
    status: "published",
  });

  // Return 404 if page not found
  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600">Page not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page metadata */}
      <head>
        <title>{page.metaTags?.title || page.title}</title>
        {page.metaTags?.description && (
          <meta name="description" content={page.metaTags.description} />
        )}
        {page.metaTags?.keywords && (
          <meta name="keywords" content={page.metaTags.keywords} />
        )}
      </head>

      {/* Page content */}
      {page.contentHtml ? (
        <div
          className="page-content"
          dangerouslySetInnerHTML={{
            __html: page.contentHtml,
          }}
        />
      ) : page.content ? (
        <div
          className="page-content"
          dangerouslySetInnerHTML={{
            __html: page.content.startsWith("<")
              ? page.content
              : elementsToHtml(JSON.parse(page.content).elements || []),
          }}
        />
      ) : (
        <div className="p-8 text-center text-gray-500">
          This page has no content yet.
        </div>
      )}
    </div>
  );
}
