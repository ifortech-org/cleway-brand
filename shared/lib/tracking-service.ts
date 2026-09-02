import { v4 as uuidv4 } from "uuid";

// URL del servizio di tracking esterno
export const LOCAL_TRACKING_API = "https://tracking.ifortech.com";

// API locale che arricchisce gli eventi con IP e user agent
const LOCAL_TRACKING_ENRICHMENT_API = "/api/tracker";

// URL del tuo server di tracciamento esterno
const TRACKING_SERVER_URL = `${LOCAL_TRACKING_API}/webhook/endpoint`;

const getSessionId = (): string => {
  if (typeof document !== "undefined") {
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
      return null;
    };

    const setCookie = (name: string, value: string, days: number): void => {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      const expires = `expires=${date.toUTCString()}`;
      document.cookie = `${name}=${value}; ${expires}; path=/`;
    };

    let sessionId = getCookie("ift_session_id");

    if (!sessionId) {
      sessionId = uuidv4();
      setCookie("ift_session_id", sessionId, 1);
    }

    return sessionId;
  }

  return "";
};

interface TrackingData {
  path: string;
  referer?: string;
  timestamp: number;
  session_id?: string;
  user_email?: string | null;
  // Aggiungi altri dati di tracciamento che desideri raccogliere
}

export const trackPageView = async (path: string): Promise<void> => {
  try {
    const sessionId = getSessionId();
    if (!sessionId) return;

    const urlParams = new URLSearchParams(window.location.search);
    const referer = urlParams.get("referer") || "direct_traffic";
    const user_email = urlParams.get("email") || null;

    const data: TrackingData = {
      path,
      referer,
      timestamp: Date.now(),
      session_id: sessionId,
      user_email,
    };

    // Facciamo la richiesta alla nostra API locale invece che direttamente
    // al server di tracciamento esterno
    const response = await fetch(LOCAL_TRACKING_ENRICHMENT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      keepalive: true,
    });

    if (!response.ok) {
      console.error("Failed to send tracking data", response.statusText);
    }

    const fd = new FormData();

    // Aggiungi i dati di tracciamento al FormData

    let dt = await response.json();
    Object.entries(dt.enrichedData).forEach(([key, value]) => {
      fd.append(key, value as string);
    });

    const eventType = /\/blog\/.+/.test(path) ? "ARTICLE_VIEW" : "PAGE_VIEW";

    const response_remote = await fetch(TRACKING_SERVER_URL, {
      method: "POST",
      headers: {
        "X-Tracker-Webhook-Event": eventType,
      },
      body: fd,
    });

    if (!response_remote.ok) {
      console.error(
        "Failed to send tracking data to external server",
        response_remote.statusText
      );
      return;
    }
  } catch (error) {
    console.error("Failed to send tracking data", error);
  }
};

interface ButtonClickData {
  id?: string;
  text: string;
  trackId?: string | null;
  className?: string;
  path: string;
  timestamp: string;
  session_id?: string;
}

export const trackButtonClick = async (
  buttonData: ButtonClickData
): Promise<void> => {
  try {
    const sessionId = getSessionId();
    if (!sessionId) return;

    const urlParams = new URLSearchParams(window.location.search);
    const referer = urlParams.get("referer") || "direct_traffic";
    const user_email = urlParams.get("email") || null;

    const data = {
      ...buttonData,
      referer,
      user_email,
      session_id: sessionId,
      event_type: "button_click",
    };

    // Facciamo la richiesta alla nostra API locale invece che direttamente
    // al server di tracciamento esterno
    const response = await fetch(LOCAL_TRACKING_ENRICHMENT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      keepalive: true,
    });

    if (!response.ok) {
      console.error("Failed to send tracking data", response.statusText);
    }

    const fd = new FormData();

    // Aggiungi i dati di tracciamento al FormData

    let dt = await response.json();
    Object.entries(dt.enrichedData).forEach(([key, value]) => {
      fd.append(key, value as string);
    });

    // Inviamo i dati tramite la nostra API locale
    const response_remote = await fetch(TRACKING_SERVER_URL, {
      method: "POST",
      headers: {
        "X-Tracker-Webhook-Event": "DID_PRESS_BUTTON",
      },
      body: fd,
      keepalive: true,
    });

    if (!response_remote.ok) {
      console.error(
        "Failed to send button tracking data",
        response_remote.statusText
      );
    }
  } catch (error) {
    console.error("Failed to send button tracking data", error);
  }
};

interface ScrollData {
  scroll_percentage: number;
  session_id?: string;
  path: string;
}

export const trackScroll = async (scrollData: ScrollData): Promise<void> => {
  try {
    const sessionId = getSessionId();
    if (!sessionId) return;

    const data = {
      ...scrollData,
      session_id: sessionId,
      event_type: "scroll",
    };

    // Facciamo la richiesta alla nostra API locale invece che direttamente
    // al server di tracciamento esterno
    const response = await fetch(LOCAL_TRACKING_ENRICHMENT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      keepalive: true,
    });

    if (!response.ok) {
      console.error("Failed to send tracking data", response.statusText);
    }

    const fd = new FormData();

    // Aggiungi i dati di tracciamento al FormData

    let dt = await response.json();
    Object.entries(dt.enrichedData).forEach(([key, value]) => {
      fd.append(key, value as string);
    });

    // Inviamo i dati tramite la nostra API locale
    const response_remote = await fetch(TRACKING_SERVER_URL, {
      method: "POST",
      headers: {
        "X-Tracker-Webhook-Event": "SCROLL_UPDATE",
      },
      body: fd,
      keepalive: true,
    });

    if (!response_remote.ok) {
      console.error(
        "Failed to send scroll tracking data",
        response_remote.statusText
      );
    }
  } catch (error) {
    console.error("Failed to send scroll tracking data", error);
  }
};
