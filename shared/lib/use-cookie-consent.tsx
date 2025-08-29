"use client";

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";

export type CookieCategory = {
  id: string;
  name: string;
  description: string;
  required: boolean;
  defaultEnabled: boolean;
};

export type CookieConsent = {
  [categoryId: string]: boolean;
};

export type CookieConsentStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "customized";

interface CookieContextType {
  consent: CookieConsent;
  status: CookieConsentStatus;
  categories: CookieCategory[];
  updateConsent: (consent: CookieConsent) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  resetConsent: () => void;
  hasConsented: boolean;
  isConsentRequired: boolean;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export function useCookieConsent() {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error(
      "useCookieConsent deve essere usato all'interno di CookieConsentProvider"
    );
  }
  return context;
}

// Hook sicuro che non lancia errori
export function useCookieConsentSafe() {
  const context = useContext(CookieContext);
  return context;
}

interface CookieConsentProviderProps {
  children: React.ReactNode;
  categories: CookieCategory[];
}

export function CookieConsentProvider({
  children,
  categories,
}: CookieConsentProviderProps) {
  const [consent, setConsent] = useState<CookieConsent>({});
  const [status, setStatus] = useState<CookieConsentStatus>("pending");
  const [hasConsented, setHasConsented] = useState(false);

  // Verifica se l'utente è in UE (semplificato - in produzione usare un servizio di geolocalizzazione)
  const [isConsentRequired, setIsConsentRequired] = useState(true);

  const STORAGE_KEY = "cookie-consent";
  const STORAGE_VERSION = "1.0";

  // Carica il consenso salvato
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.version === STORAGE_VERSION) {
          setConsent(parsed.consent);
          setStatus(parsed.status);
          setHasConsented(true);
          return;
        }
      }
    } catch (error) {
      console.error("Errore nel caricare il consenso cookie:", error);
    }

    // Imposta valori di default per categorie obbligatorie
    const defaultConsent: CookieConsent = {};
    categories.forEach((category) => {
      if (category.required) {
        defaultConsent[category.id] = true;
      } else {
        defaultConsent[category.id] = false;
      }
    });
    setConsent(defaultConsent);
  }, [categories]);

  // Salva il consenso
  const saveConsent = useCallback(
    (newConsent: CookieConsent, newStatus: CookieConsentStatus) => {
      if (typeof window === "undefined") return;

      try {
        const toSave = {
          version: STORAGE_VERSION,
          consent: newConsent,
          status: newStatus,
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        setConsent(newConsent);
        setStatus(newStatus);
        setHasConsented(true);

        // Invia evento personalizzato per integrazioni esterne
        window.dispatchEvent(
          new CustomEvent("cookieConsentChange", {
            detail: { consent: newConsent, status: newStatus },
          })
        );
      } catch (error) {
        console.error("Errore nel salvare il consenso cookie:", error);
      }
    },
    []
  );

  const updateConsent = useCallback(
    (newConsent: CookieConsent) => {
      saveConsent(newConsent, "customized");
    },
    [saveConsent]
  );

  const acceptAll = useCallback(() => {
    const allAccepted: CookieConsent = {};
    categories.forEach((category) => {
      allAccepted[category.id] = true;
    });
    saveConsent(allAccepted, "accepted");
  }, [categories, saveConsent]);

  const rejectAll = useCallback(() => {
    const allRejected: CookieConsent = {};
    categories.forEach((category) => {
      // Mantieni abilitati solo i cookie obbligatori
      allRejected[category.id] = category.required;
    });
    saveConsent(allRejected, "rejected");
  }, [categories, saveConsent]);

  const resetConsent = useCallback(() => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(STORAGE_KEY);
    setHasConsented(false);
    setStatus("pending");

    const defaultConsent: CookieConsent = {};
    categories.forEach((category) => {
      defaultConsent[category.id] = category.required;
    });
    setConsent(defaultConsent);
  }, [categories]);

  return (
    <CookieContext.Provider
      value={{
        consent,
        status,
        categories,
        updateConsent,
        acceptAll,
        rejectAll,
        resetConsent,
        hasConsented,
        isConsentRequired,
      }}>
      {children}
    </CookieContext.Provider>
  );
}

// Hook di utilità per verificare categorie specifiche
export function useCookieCategory(categoryId: string): boolean {
  const { consent } = useCookieConsent();
  return consent[categoryId] || false;
}

// Hook per tracciamento analytics (da usare nei componenti di analytics)
export function useAnalyticsCookies(): boolean {
  return useCookieCategory("analytics");
}

// Hook per marketing cookies
export function useMarketingCookies(): boolean {
  return useCookieCategory("marketing");
}
