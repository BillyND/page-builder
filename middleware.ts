import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = ["/", "/pages", "/view/:slug", "/api/pages/view/:slug"];

// Function to check if a route is public
function isPublicRoute(req: NextRequest) {
  const { pathname } = req.nextUrl;
  return publicRoutes.some((route) => {
    // Convert route patterns with params to regex
    const pattern = route.replace(/:\w+/g, "[^/]+");
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(pathname);
  });
}

// Middleware function that combines Clerk
export default clerkMiddleware(async (auth, req) => {
  // Check if the request is for a public route
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  try {
    // For protected routes, check authentication using auth.protect()
    await auth.protect();
    return NextResponse.next();
  } catch {
    // If authentication fails, redirect to the pages list
    const pagesUrl = new URL("/pages", req.url);
    return NextResponse.redirect(pagesUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
