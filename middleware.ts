import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "it";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  if (pathname === "/en") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    const response = NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
    response.cookies.set("site_locale", locale, { path: "/" });
    return response;
  }

  if (pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en/, "");
    const response = NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
    response.cookies.set("site_locale", locale, { path: "/" });
    return response;
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.cookies.set("site_locale", locale, { path: "/" });
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
