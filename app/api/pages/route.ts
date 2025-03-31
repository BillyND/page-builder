import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/app/lib/db";
import Page from "@/app/models/Page";

// GET /api/pages - Get all pages for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    // Build query
    interface PageQuery {
      createdBy: string;
      status?: string;
      $text?: { $search: string };
    }

    const query: PageQuery = { createdBy: session.user.id };

    // Add status filter if provided
    if (status && ["draft", "published"].includes(status)) {
      query.status = status;
    }

    // Add search filter if provided
    if (searchTerm) {
      query.$text = { $search: searchTerm };
    }

    // Get pages
    const pages = await Page.find(query).sort({ updatedAt: -1 });

    return NextResponse.json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}

// POST /api/pages - Create a new page
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();

    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!body.slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Check if slug already exists
    const existingPage = await Page.findOne({ slug: body.slug });
    if (existingPage) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    // Create page
    const page = await Page.create({
      ...body,
      createdBy: session.user.id,
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}
