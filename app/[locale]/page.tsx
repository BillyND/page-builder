import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  // Properly await the params object before accessing its properties
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams?.locale || "en";

  try {
    const t = await getTranslations({ locale, namespace: "app" });
    return {
      title: t("title"),
    };
  } catch {
    // Fallback to a default title if there's an error
    return {
      title: "Page Builder",
    };
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const t = await getTranslations("home");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">
          {t("welcome", { name: session.user?.name || "" })}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t("loggedInAs", { email: session.user?.email || "" })}
        </p>
        <div className="flex justify-center">
          <Link
            href="/api/auth/signout"
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
          >
            {t("signOut")}
          </Link>
        </div>
      </div>
    </div>
  );
}
