"use client";

import {
  useEffect,
} from "react";

import {
  usePathname,
} from "next/navigation";

const VISITOR_STORAGE_KEY =
  "combine-analytics-visitor-id";

function getVisitorId() {
  try {
    const existing =
      window.localStorage.getItem(
        VISITOR_STORAGE_KEY
      );

    if (existing) {
      return existing;
    }

    const visitorId =
      crypto.randomUUID();

    window.localStorage.setItem(
      VISITOR_STORAGE_KEY,
      visitorId
    );

    return visitorId;

  } catch {
    /*
     * If localStorage is unavailable,
     * create a temporary ID.
     */

    return crypto.randomUUID();
  }
}

export default function WebsiteAnalytics() {
  const pathname =
    usePathname();

  useEffect(() => {
    /*
     * =========================================================
     * IGNORE ADMIN
     * =========================================================
     *
     * We only want real customer traffic.
     */

    if (
      pathname.startsWith(
        "/admin"
      )
    ) {
      return;
    }

    /*
     * Ignore API routes.
     */

    if (
      pathname.startsWith(
        "/api"
      )
    ) {
      return;
    }

    const visitorId =
      getVisitorId();

    /*
     * =========================================================
     * TRACK PAGE VIEW
     * =========================================================
     */

    const trackPageView =
      async () => {
        try {
          await fetch(
            "/api/analytics/track",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                visitorId,
                event:
                  "PAGE_VIEW",
                path:
                  pathname,
              }),

              keepalive: true,
            }
          );

        } catch {
          /*
           * Analytics must never interrupt
           * the customer's browsing experience.
           */
        }
      };

    trackPageView();

  }, [
    pathname,
  ]);

  return null;
}