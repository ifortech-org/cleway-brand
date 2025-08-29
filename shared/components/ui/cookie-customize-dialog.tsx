"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { useCookieConsent } from "@/shared/lib/use-cookie-consent";
import Link from "next/link";

interface CookieCustomizeDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  settings: {
    acceptAllText: string;
    rejectAllText: string;
    privacyPolicyText: string;
    cookiePolicyText: string;
    showRejectButton: boolean;
  };
}

export function CookieCustomizeDialog({
  open,
  onOpenChangeAction,
  settings,
}: CookieCustomizeDialogProps) {
  const { consent, categories, updateConsent, acceptAll, rejectAll } =
    useCookieConsent();
  const [localConsent, setLocalConsent] = React.useState(consent);

  React.useEffect(() => {
    setLocalConsent(consent);
  }, [consent]);

  const handleCategoryToggle = (categoryId: string, enabled: boolean) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category?.required) return; // Non permettere di disabilitare i cookie obbligatori

    setLocalConsent((prev) => ({
      ...prev,
      [categoryId]: enabled,
    }));
  };

  const handleSave = () => {
    updateConsent(localConsent);
    onOpenChangeAction(false);
  };

  const handleAcceptAll = () => {
    acceptAll();
    onOpenChangeAction(false);
  };

  const handleRejectAll = () => {
    rejectAll();
    onOpenChangeAction(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Personalizza i Cookie</DialogTitle>
          <DialogDescription>
            Scegli quali categorie di cookie vuoi abilitare. I cookie necessari
            non possono essere disabilitati.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor={category.id} className="text-sm font-medium">
                    {category.name}
                    {category.required && (
                      <span className="text-xs text-muted-foreground ml-2">
                        (Obbligatori)
                      </span>
                    )}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                </div>
                <Switch
                  id={category.id}
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

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleSave} className="flex-1">
              Salva Preferenze
            </Button>
            <Button
              onClick={handleAcceptAll}
              variant="outline"
              className="flex-1">
              {settings.acceptAllText}
            </Button>
          </div>

          {settings.showRejectButton && (
            <Button
              onClick={handleRejectAll}
              variant="ghost"
              className="w-full"
              size="sm">
              {settings.rejectAllText}
            </Button>
          )}

          <div className="flex flex-col sm:flex-row gap-2 text-xs text-muted-foreground">
            <Link
              href="/privacy-policy"
              className="hover:underline"
              onClick={() => onOpenChangeAction(false)}>
              {settings.privacyPolicyText}
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link
              href="/cookie-policy"
              className="hover:underline"
              onClick={() => onOpenChangeAction(false)}>
              {settings.cookiePolicyText}
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
