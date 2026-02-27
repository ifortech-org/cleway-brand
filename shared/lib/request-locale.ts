import { cookies, headers } from "next/headers";

export const getRequestLanguage = async (): Promise<"it" | "en"> => {
  const requestHeaders = await headers();
  const headerLocale = requestHeaders.get("x-locale");

  if (headerLocale === "en" || headerLocale === "it") {
    return headerLocale;
  }

  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("site_locale")?.value;

  return cookieLocale === "en" ? "en" : "it";
};
