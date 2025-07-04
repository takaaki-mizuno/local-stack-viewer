"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { Locale, locales } from "@/i18n/config";

const LOCALE_COOKIE_NAME = "locale";

export async function setLocale(locale: Locale) {
  if (!locales.includes(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
    httpOnly: false, // Allow client-side access
  });

  // Revalidate all paths to reflect the language change
  revalidatePath("/", "layout");
}
