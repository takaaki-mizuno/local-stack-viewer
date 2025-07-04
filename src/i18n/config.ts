export const locales = ["en", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function getMessages(locale: Locale) {
  return import(`../../messages/${locale}.json`).then(
    (module) => module.default
  );
}
