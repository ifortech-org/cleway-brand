"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useCookieConsent } from "@/shared/lib/use-cookie-consent";
import { Badge } from "@/shared/components/ui/badge";

export function CookieSettings() {
  const {
    consent,
    categories,
    updateConsent,
    acceptAll,
    rejectAll,
    resetConsent,
    status,
    hasConsented,
  } = useCookieConsent();

  const [localConsent, setLocalConsent] = React.useState(consent);

  React.useEffect(() => {
    setLocalConsent(consent);
  }, [consent]);

  const handleCategoryToggle = (categoryId: string, enabled: boolean) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category?.required) return;

    setLocalConsent((prev) => ({
      ...prev,
      [categoryId]: enabled,
    }));
  };

  const handleSave = () => {
    updateConsent(localConsent);
  };

  const getStatusBadge = () => {
    const statusConfig = {
      pending: { label: "In attesa", variant: "secondary" as const },
      accepted: { label: "Tutti accettati", variant: "default" as const },
      rejected: { label: "Tutti rifiutati", variant: "destructive" as const },
      customized: { label: "Personalizzati", variant: "outline" as const },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!hasConsented) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preferenze Cookie</CardTitle>
          <CardDescription>
            Non hai ancora configurato le tue preferenze sui cookie.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={acceptAll} className="w-full">
              Accetta tutti i cookie
            </Button>
            <Button onClick={rejectAll} variant="outline" className="w-full">
              Rifiuta tutti i cookie (solo necessari)
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Preferenze Cookie</CardTitle>
            <CardDescription>
              Gestisci le tue preferenze sui cookie per questo sito.
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label
                    htmlFor={`settings-${category.id}`}
                    className="text-sm font-medium flex items-center gap-2">
                    {category.name}
                    {category.required && (
                      <Badge variant="secondary" className="text-xs">
                        Obbligatori
                      </Badge>
                    )}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                </div>
                <Switch
                  id={`settings-${category.id}`}
                  checked={localConsent[category.id] || false}
                  onCheckedChange={(checked: boolean) =>
                    handleCategoryToggle(category.id, checked)
                  }
                  disabled={category.required}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button onClick={handleSave} className="flex-1">
            Salva Preferenze
          </Button>
          <Button onClick={acceptAll} variant="outline" className="flex-1">
            Accetta Tutti
          </Button>
          <Button onClick={rejectAll} variant="outline" className="flex-1">
            Solo Necessari
          </Button>
        </div>

        <div className="flex justify-center pt-2">
          <Button
            onClick={resetConsent}
            variant="ghost"
            size="sm"
            className="text-xs">
            Resetta Preferenze
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
