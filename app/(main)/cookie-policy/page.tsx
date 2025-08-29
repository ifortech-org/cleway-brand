import { client } from "@/shared/sanity/lib/client";
import { COOKIE_POLICY_QUERY } from "@/shared/sanity/queries/policies";
import { urlFor } from "@/shared/sanity/lib/image";
import PortableTextRenderer from "@/shared/components/portable-text-renderer";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const policy = await client.fetch(COOKIE_POLICY_QUERY);

  if (!policy) {
    return {
      title: "Cookie Policy",
      description: "Cookie Policy",
    };
  }

  return {
    title: policy.seo?.title || policy.title || "Cookie Policy",
    description: policy.seo?.description || "Cookie Policy",
    keywords: policy.seo?.keywords || [],
    openGraph: {
      title: policy.seo?.title || policy.title || "Cookie Policy",
      description: policy.seo?.description || "Cookie Policy",
      images: policy.seo?.image?.asset?.url
        ? [
            {
              url: urlFor(policy.seo.image).quality(100).url(),
              width: policy.seo.image.asset.metadata?.dimensions?.width || 1200,
              height:
                policy.seo.image.asset.metadata?.dimensions?.height || 630,
            },
          ]
        : [],
    },
    robots: policy.seo?.robots || "index, follow",
  };
}

export default async function CookiePolicyPage() {
  const policy = await client.fetch(COOKIE_POLICY_QUERY);

  if (!policy) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        <p className="text-muted-foreground">
          Cookie Policy non trovata. Controlla la configurazione in Sanity
          Studio.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{policy.title}</h1>
        {policy.lastUpdated && (
          <p className="text-muted-foreground mb-8">
            Ultimo aggiornamento:{" "}
            {new Date(policy.lastUpdated).toLocaleDateString("it-IT")}
          </p>
        )}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <PortableTextRenderer value={policy.content} />
        </div>
      </div>
    </div>
  );
}
