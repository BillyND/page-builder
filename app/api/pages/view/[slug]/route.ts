import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Page from "@/app/models/Page";

// GET /api/pages/view/[slug] - Get a published page by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();

    const { slug } = params;

    // Find published page by slug
    const page = await Page.findOne({
      slug,
      status: "published",
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Return page data
    return NextResponse.json(page);
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 }
    );
  }
}
