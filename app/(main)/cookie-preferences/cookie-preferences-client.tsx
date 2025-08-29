"use client";

import { CookieSettings } from "@/shared/components/ui/cookie-settings";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useCookieConsentSafe } from "@/shared/lib/use-cookie-consent";
import { useEffect, useState } from "react";

export function CookiePreferencesClient() {
  const context = useCookieConsentSafe();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Caricamento...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Caricamento delle preferenze cookie...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!context) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preferenze Cookie</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Il sistema di gestione cookie non è disponibile al momento. Riprova
            tra qualche istante.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <CookieSettings />;
}
