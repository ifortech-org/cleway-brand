"use client";

import {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
  createContext,
} from "react";
import { validate as isUuid } from "uuid";

export type CookieCategory = {
  id: string;
  name: string;
  description: string;
  required: boolean;
  defaultEnabled: boolean;
};

export type CookieConsent = Record<string, boolean>;
export type CookieConsentStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "customized";

type StoredConsent = {
  version: "1.0";
  consent: CookieConsent;
  status: CookieConsentStatus;
  timestamp: number;
  pendingSync?: boolean;
};

type PrivacyIdentity = {
  uuid: string;
  technical?: boolean;
  analytics?: boolean;
  marketing?: boolean;
};

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
  isInitializing: boolean;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);
const CONSENT_STORAGE_KEY = "cookie-consent";
const UUID_STORAGE_KEY = "privacy-uuid";
const STORAGE_VERSION = "1.0";
const API_BASE_URL = process.env.NEXT_PUBLIC_PRIVACY_API_URL?.replace(/\/$/, "") || "";

const privacyUrl = (path: string) => `${API_BASE_URL}${path}`;

function defaultConsent(categories: CookieCategory[]): CookieConsent {
  return Object.fromEntries(
    categories.map((category) => [category.id, category.required])
  );
}

function statusFromConsent(consent: CookieConsent): CookieConsentStatus {
  if (consent.analytics && consent.marketing) return "accepted";
  if (!consent.analytics && !consent.marketing) return "rejected";
  return "customized";
}

function consentFromIdentity(identity: PrivacyIdentity): CookieConsent | null {
  const values = [
    identity.technical,
    identity.analytics,
    identity.marketing,
  ];

  if (values.every((value) => value === undefined)) return null;
  if (!values.every((value) => typeof value === "boolean")) {
    throw new Error("Risposta consensi privacy non valida");
  }

  return {
    necessary: true,
    analytics: identity.analytics!,
    marketing: identity.marketing!,
  };
}

function readStoredConsent(): StoredConsent | null {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!value) return null;

    const parsed = JSON.parse(value) as StoredConsent;
    if (
      parsed.version !== STORAGE_VERSION ||
      !parsed.consent ||
      typeof parsed.timestamp !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Errore nel caricare il consenso cookie:", error);
    return null;
  }
}

function writeStoredConsent(stored: StoredConsent) {
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stored));
}

async function requestIdentity(): Promise<PrivacyIdentity> {
  const response = await fetch(privacyUrl("/api/privacy/uuid"), {
    method: "POST",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Recupero UUID privacy fallito (${response.status})`);
  }

  const identity = (await response.json()) as PrivacyIdentity;
  if (!identity || !isUuid(identity.uuid)) {
    throw new Error("UUID privacy non valido");
  }

  consentFromIdentity(identity);
  return identity;
}

async function postConsent(uuid: string, consent: CookieConsent) {
  return fetch(privacyUrl("/api/privacy/consents"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uuid,
      technical: true,
      analytics: Boolean(consent.analytics),
      marketing: Boolean(consent.marketing),
    }),
  });
}

async function syncConsent(consent: CookieConsent) {
  let uuid = localStorage.getItem(UUID_STORAGE_KEY);

  if (!uuid || !isUuid(uuid)) {
    const identity = await requestIdentity();
    uuid = identity.uuid;
    localStorage.setItem(UUID_STORAGE_KEY, uuid);
  }

  let response = await postConsent(uuid, consent);

  if (response.status === 404 || response.status === 422) {
    localStorage.removeItem(UUID_STORAGE_KEY);
    const identity = await requestIdentity();
    uuid = identity.uuid;
    localStorage.setItem(UUID_STORAGE_KEY, uuid);
    response = await postConsent(uuid, consent);
  }

  if (response.status !== 204) {
    throw new Error(`Salvataggio consensi fallito (${response.status})`);
  }
}

export function useCookieConsent() {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error(
      "useCookieConsent deve essere usato all'interno di CookieConsentProvider"
    );
  }
  return context;
}

export function useCookieConsentSafe() {
  return useContext(CookieContext);
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
  const [isInitializing, setIsInitializing] = useState(true);
  const syncQueue = useRef<Promise<void>>(Promise.resolve());
  const isConsentRequired = true;

  const queueSync = useCallback(
    (newConsent: CookieConsent, timestamp: number) => {
      syncQueue.current = syncQueue.current
        .catch(() => undefined)
        .then(() => syncConsent(newConsent))
        .then(() => {
          const current = readStoredConsent();
          if (current?.timestamp === timestamp) {
            writeStoredConsent({ ...current, pendingSync: false });
          }
        })
        .catch((error) => {
          console.error("Errore nella sincronizzazione dei consensi:", error);
        });
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function initializeConsent() {
      const saved = readStoredConsent();
      const fallback = defaultConsent(categories);
      const storedUuid = localStorage.getItem(UUID_STORAGE_KEY);

      if (saved) {
        setConsent({ ...fallback, ...saved.consent, necessary: true });
        setStatus(saved.status);
        setHasConsented(true);
      } else {
        setConsent(fallback);
      }

      if (storedUuid && isUuid(storedUuid)) {
        if (saved?.pendingSync) queueSync(saved.consent, saved.timestamp);
        setIsInitializing(false);
        return;
      }

      if (storedUuid) localStorage.removeItem(UUID_STORAGE_KEY);

      try {
        const identity = await requestIdentity();
        if (cancelled) return;

        localStorage.setItem(UUID_STORAGE_KEY, identity.uuid);
        const recovered = consentFromIdentity(identity);

        if (saved?.pendingSync) {
          queueSync(saved.consent, saved.timestamp);
        } else if (recovered) {
          const recoveredStatus = statusFromConsent(recovered);
          const recoveredStored: StoredConsent = {
            version: STORAGE_VERSION,
            consent: recovered,
            status: recoveredStatus,
            timestamp: Date.now(),
            pendingSync: false,
          };
          writeStoredConsent(recoveredStored);
          setConsent(recovered);
          setStatus(recoveredStatus);
          setHasConsented(true);
        } else if (saved) {
          writeStoredConsent({ ...saved, pendingSync: true });
          queueSync(saved.consent, saved.timestamp);
        }
      } catch (error) {
        console.error("Errore nell'inizializzazione privacy:", error);
        if (saved) writeStoredConsent({ ...saved, pendingSync: true });
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    }

    void initializeConsent();
    return () => {
      cancelled = true;
    };
  }, [categories, queueSync]);

  const saveConsent = useCallback(
    (newConsent: CookieConsent, newStatus: CookieConsentStatus) => {
      const normalized = { ...newConsent, necessary: true };
      const timestamp = Date.now();
      const stored: StoredConsent = {
        version: STORAGE_VERSION,
        consent: normalized,
        status: newStatus,
        timestamp,
        pendingSync: true,
      };

      try {
        writeStoredConsent(stored);
        setConsent(normalized);
        setStatus(newStatus);
        setHasConsented(true);
        queueSync(normalized, timestamp);

        window.dispatchEvent(
          new CustomEvent("cookieConsentChange", {
            detail: { consent: normalized, status: newStatus },
          })
        );
      } catch (error) {
        console.error("Errore nel salvare il consenso cookie:", error);
      }
    },
    [queueSync]
  );

  const updateConsent = useCallback(
    (newConsent: CookieConsent) => saveConsent(newConsent, "customized"),
    [saveConsent]
  );

  const acceptAll = useCallback(() => {
    saveConsent(
      Object.fromEntries(categories.map((category) => [category.id, true])),
      "accepted"
    );
  }, [categories, saveConsent]);

  const rejectAll = useCallback(() => {
    saveConsent(defaultConsent(categories), "rejected");
  }, [categories, saveConsent]);

  const resetConsent = useCallback(() => {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    setHasConsented(false);
    setStatus("pending");
    setConsent(defaultConsent(categories));
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
        isInitializing,
      }}>
      {children}
    </CookieContext.Provider>
  );
}

export function useCookieCategory(categoryId: string): boolean {
  const { consent } = useCookieConsent();
  return consent[categoryId] || false;
}

export function useAnalyticsCookies(): boolean {
  return useCookieCategory("analytics");
}

export function useMarketingCookies(): boolean {
  return useCookieCategory("marketing");
}
