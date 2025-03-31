import { redirect } from "next/navigation";
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

export default async function Home({ params }: { params: { locale: string } }) {
  // Await the params to ensure locale is available
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale || "en";

  // Redirect to the pages list
  redirect(`/${locale}/pages`);
}
