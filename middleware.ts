import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  // A list of all locales that are supported
  locales: ["en", "vi"],

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: "en",
});

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/:locale",
  "/:locale/login",
  "/:locale/register",
  "/:locale/view/:slug",
  "/api/pages/view/:slug",
];

// Middleware function
export default async function middleware(req: NextRequest) {
  // Apply internationalization middleware first
  const intlResponse = intlMiddleware(req);

  // Check if the request is for a public route
  const { pathname } = req.nextUrl;
  const isPublicRoute = publicRoutes.some((route) => {
    // Convert route patterns with params to regex
    const pattern = route.replace(/:\w+/g, "[^/]+");
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(pathname);
  });

  // If it's a public route, just apply the intl middleware
  if (isPublicRoute) {
    return intlResponse;
  }

  // For protected routes, check authentication
  const { userId } = getAuth(req);

  // If the user is not authenticated and trying to access a protected route,
  // redirect to the login page
  if (!userId) {
    const locale = req.nextUrl.pathname.split("/")[1] || "en";
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set("redirect_url", encodeURIComponent(req.url));
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated, proceed with the request
  return intlResponse;
}

// Configure the middleware matcher
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
