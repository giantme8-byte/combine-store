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
    return crypto.randomUUID();
  }
}

type ProductViewTrackerProps = {
  productId: number;
};

export default function ProductViewTracker({
  productId,
}: ProductViewTrackerProps) {
  const pathname =
    usePathname();

  useEffect(() => {
    /*
     * =========================================================
     * VALIDATION
     * =========================================================
     */

    if (
      !productId ||
      !Number.isInteger(
        productId
      )
    ) {
      return;
    }

    if (
      pathname.startsWith(
        "/admin"
      )
    ) {
      return;
    }

    /*
     * =========================================================
     * VISITOR ID
     * =========================================================
     */

    const visitorId =
      getVisitorId();

    /*
     * =========================================================
     * TRACK PRODUCT VIEW
     * =========================================================
     */

    const trackProductView =
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
                  "PRODUCT_VIEW",
                path:
                  pathname,
                productId,
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

    trackProductView();

  }, [
    productId,
    pathname,
  ]);

  return null;
}