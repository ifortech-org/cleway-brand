import { CookiePreferencesClient } from "./cookie-preferences-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preferenze Cookie",
  description: "Gestisci le tue preferenze sui cookie per questo sito web.",
  robots: "noindex, nofollow",
};

export default function CookiePreferencesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Preferenze Cookie</h1>
        <p className="text-muted-foreground mb-8">
          Personalizza le tue impostazioni sui cookie. Puoi cambiare queste
          impostazioni in qualsiasi momento.
        </p>
        <CookiePreferencesClient />
      </div>
    </div>
  );
}
