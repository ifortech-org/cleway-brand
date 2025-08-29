"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/shared/components/ui/button";
import { useCookieConsent } from "@/shared/lib/use-cookie-consent";
import { CookieCustomizeDialog } from "@/shared/components/ui/cookie-customize-dialog";
import Link from "next/link";
import { X, Cookie } from "lucide-react";

interface CookieBannerProps {
  settings: {
    title: string;
    description: string;
    acceptAllText: string;
    rejectAllText: string;
    customizeText: string;
    privacyPolicyText: string;
    cookiePolicyText: string;
    position: "top" | "bottom" | "center";
    showRejectButton: boolean;
    showCustomizeButton: boolean;
  };
}

export function CookieBanner({ settings }: CookieBannerProps) {
  const { hasConsented, acceptAll, rejectAll, isConsentRequired } =
    useCookieConsent();
  const [showCustomize, setShowCustomize] = React.useState(false);
  const [isDismissed, setIsDismissed] = React.useState(false);

  // Non mostrare il banner se l'utente ha già dato il consenso o se non è richiesto
  if (hasConsented || !isConsentRequired || isDismissed) {
    return null;
  }

  const isModal = settings.position === "center";

  const bannerVariants = {
    hidden: {
      opacity: 0,
      y:
        settings.position === "top"
          ? -100
          : settings.position === "bottom"
          ? 100
          : 0,
      scale: isModal ? 0.95 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      y:
        settings.position === "top"
          ? -100
          : settings.position === "bottom"
          ? 100
          : 0,
      scale: isModal ? 0.95 : 1,
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const handleAcceptAll = () => {
    acceptAll();
  };

  const handleRejectAll = () => {
    rejectAll();
  };

  const handleCustomize = () => {
    setShowCustomize(true);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  const positionClasses = {
    top: "top-0 left-0 right-0",
    bottom: "bottom-0 left-0 right-0",
    center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <>
      <AnimatePresence>
        {isModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
        )}

        <motion.div
          className={`fixed ${positionClasses[settings.position]} z-50 ${
            isModal ? "max-w-lg mx-4" : "w-full"
          }`}
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}>
          <div
            className={`bg-card border shadow-lg ${
              isModal
                ? "rounded-lg"
                : settings.position === "top"
                ? "rounded-b-lg"
                : "rounded-t-lg"
            } p-4 sm:p-6`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <Cookie className="w-5 h-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {settings.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  {settings.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <Button
                    onClick={handleAcceptAll}
                    size="sm"
                    className="flex-1 sm:flex-none">
                    {settings.acceptAllText}
                  </Button>

                  {settings.showRejectButton && (
                    <Button
                      onClick={handleRejectAll}
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none">
                      {settings.rejectAllText}
                    </Button>
                  )}

                  {settings.showCustomizeButton && (
                    <Button
                      onClick={handleCustomize}
                      variant="ghost"
                      size="sm"
                      className="flex-1 sm:flex-none">
                      {settings.customizeText}
                    </Button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 text-xs text-muted-foreground">
                  <Link href="/privacy-policy" className="hover:underline">
                    {settings.privacyPolicyText}
                  </Link>
                  <span className="hidden sm:inline">•</span>
                  <Link href="/cookie-policy" className="hover:underline">
                    {settings.cookiePolicyText}
                  </Link>
                </div>
              </div>

              {!isModal && (
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 h-6 w-6">
                  <X className="w-4 h-4" />
                  <span className="sr-only">Chiudi</span>
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <CookieCustomizeDialog
        open={showCustomize}
        onOpenChangeAction={setShowCustomize}
        settings={{
          acceptAllText: settings.acceptAllText,
          rejectAllText: settings.rejectAllText,
          privacyPolicyText: settings.privacyPolicyText,
          cookiePolicyText: settings.cookiePolicyText,
          showRejectButton: settings.showRejectButton,
        }}
      />
    </>
  );
}
