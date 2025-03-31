import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  // Default to English if locale is undefined
  const localeToUse = locale || "en";

  return {
    locale: localeToUse,
    messages: (await import(`../messages/${localeToUse}/index.json`)).default,
  };
});
