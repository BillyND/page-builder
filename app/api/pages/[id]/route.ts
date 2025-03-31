import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import dbConnect from "@/app/lib/db";
import Page from "@/app/models/Page";
import mongoose from "mongoose";
import { elementsToHtml } from "@/app/lib/elementToHtml";

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/pages/[id] - Get a single page by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = params;

    // Validate ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid page ID" }, { status: 400 });
    }

    // Find page by ID and creator
    const page = await Page.findOne({
      _id: id,
      createdBy: userId,
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 }
    );
  }
}

// PUT /api/pages/[id] - Update a page
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = params;
    const body = await request.json();

    // Validate ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid page ID" }, { status: 400 });
    }

    // Check if slug is being updated and already exists
    if (body.slug) {
      const existingPage = await Page.findOne({
        slug: body.slug,
        _id: { $ne: id }, // Exclude current page
      });

      if (existingPage) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    // Process content if it contains page elements
    if (body.content && body.content.includes('"elements":')) {
      try {
        // Parse the content to get the elements
        const pageStructure = JSON.parse(body.content);
        if (pageStructure.elements && Array.isArray(pageStructure.elements)) {
          // Generate HTML from elements
          const html = elementsToHtml(pageStructure.elements);
          // Store both the raw elements JSON and the generated HTML
          body.contentHtml = html;
        }
      } catch (err) {
        console.error("Error processing page content:", err);
      }
    }

    // Update page
    const updatedPage = await Page.findOneAndUpdate(
      { _id: id, createdBy: userId },
      body,
      { new: true, runValidators: true }
    );

    if (!updatedPage) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 }
    );
  }
}

// DELETE /api/pages/[id] - Delete a page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = params;

    // Validate ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid page ID" }, { status: 400 });
    }

    // Delete page
    const deletedPage = await Page.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });

    if (!deletedPage) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Page deleted successfully" });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 }
    );
  }
}
