import { cookies, headers } from "next/headers";
import { defaultLocale, Locale, locales } from "./config";

const LOCALE_COOKIE_NAME = "locale";

export async function getLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value as
      | Locale
      | undefined;

    if (cookieLocale && locales.includes(cookieLocale)) {
      console.log("Using cookie locale:", cookieLocale);
      return cookieLocale;
    }

    const headersList = await headers();
    const acceptLanguage = headersList.get("accept-language") || "";
    console.log("Accept-Language header:", acceptLanguage);

    // Parse Accept-Language header properly
    const languages = acceptLanguage
      .split(",")
      .map((lang) => lang.trim().split(";")[0].toLowerCase())
      .map((lang) => lang.split("-")[0]); // Extract primary language code

    console.log("Parsed languages:", languages);

    // Check each language in order of preference
    for (const lang of languages) {
      const matchedLocale = locales.find((locale) => locale === lang);
      if (matchedLocale) {
        console.log("Matched locale from header:", matchedLocale);
        return matchedLocale;
      }
    }
  } catch (error) {
    console.error("Error getting locale:", error);
  }

  console.log("Using default locale:", defaultLocale);
  return defaultLocale;
}
