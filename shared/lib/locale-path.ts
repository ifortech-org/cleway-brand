export function isEnglishPath(pathname: string): boolean {
  return pathname === "/en" || pathname.startsWith("/en/");
}

export function toEnglishPath(pathname: string): string {
  if (isEnglishPath(pathname)) {
    return pathname;
  }

  if (pathname === "/") {
    return "/en";
  }

  return `/en${pathname}`;
}

export function toItalianPath(pathname: string): string {
  if (!isEnglishPath(pathname)) {
    return pathname;
  }

  const withoutPrefix = pathname.replace(/^\/en/, "");
  return withoutPrefix || "/";
}

export function localizeHref(href: string, useEnglish: boolean): string {
  if (!href.startsWith("/")) {
    return href;
  }

  return useEnglish ? toEnglishPath(href) : toItalianPath(href);
}
