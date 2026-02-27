import { sanityFetch } from "@/shared/sanity/lib/live";
import { PAGE_QUERY, PAGES_SLUGS_QUERY } from "@/shared/sanity/queries/page";
import {
  POST_QUERY,
  POSTS_QUERY,
  POSTS_SLUGS_QUERY,
} from "@/shared/sanity/queries/post";
import { cookies, headers } from "next/headers";
import {
  PAGE_QUERYResult,
  PAGES_SLUGS_QUERYResult,
  POST_QUERYResult,
  POSTS_QUERYResult,
  POSTS_SLUGS_QUERYResult,
} from "@/sanity.types";

const getRequestLanguage = async (): Promise<"it" | "en"> => {
  const requestHeaders = await headers();
  const headerLocale = requestHeaders.get("x-locale");
  if (headerLocale === "en" || headerLocale === "it") {
    return headerLocale;
  }

  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("site_locale")?.value;
  return cookieLocale === "en" ? "en" : "it";
};

export const fetchSanityPageBySlug = async ({
  slug,
  language,
}: {
  slug: string;
  language?: "it" | "en";
}): Promise<PAGE_QUERYResult> => {
  const resolvedLanguage = language ?? (await getRequestLanguage());
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug, language: resolvedLanguage },
  });

  return data;
};

export const fetchSanityPagesStaticParams =
  async (language: "it" | "en" = "it"): Promise<PAGES_SLUGS_QUERYResult> => {
    const { data } = await sanityFetch({
      query: PAGES_SLUGS_QUERY,
      params: { language },
      perspective: "published",
      stega: false,
    });

    return data;
  };

export const fetchSanityPosts = async (language?: "it" | "en"): Promise<POSTS_QUERYResult> => {
  const resolvedLanguage = language ?? (await getRequestLanguage());
  const { data } = await sanityFetch({
    query: POSTS_QUERY,
    params: { language: resolvedLanguage },
  });

  return data;
};

export const fetchSanityPostBySlug = async ({
  slug,
  language,
}: {
  slug: string;
  language?: "it" | "en";
}): Promise<POST_QUERYResult> => {
  const resolvedLanguage = language ?? (await getRequestLanguage());
  const { data } = await sanityFetch({
    query: POST_QUERY,
    params: { slug, language: resolvedLanguage },
  });

  return data;
};

export const fetchSanityPostsStaticParams =
  async (language: "it" | "en" = "it"): Promise<POSTS_SLUGS_QUERYResult> => {
    const { data } = await sanityFetch({
      query: POSTS_SLUGS_QUERY,
      params: { language },
      perspective: "published",
      stega: false,
    });

    return data;
  };
