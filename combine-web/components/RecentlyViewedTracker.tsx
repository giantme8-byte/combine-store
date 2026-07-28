"use client";

import { useEffect } from "react";

import { saveRecentlyViewed } from "@/lib/recentlyViewed";

type RecentlyViewedTrackerProps = {
  slug: string;
};

export default function RecentlyViewedTracker({
  slug,
}: RecentlyViewedTrackerProps) {
  useEffect(() => {
    if (!slug) return;

    saveRecentlyViewed(slug);
  }, [slug]);

  return null;
}