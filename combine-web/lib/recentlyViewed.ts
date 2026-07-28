const STORAGE_KEY = "combine_recently_viewed";

const MAX_ITEMS = 8;

export function getRecentlyViewed(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value = localStorage.getItem(STORAGE_KEY);

    if (!value) {
      return [];
    }

    return JSON.parse(value);
  } catch {
    return [];
  }
}

export function saveRecentlyViewed(slug: string) {
  if (typeof window === "undefined") {
    return;
  }

  const current = getRecentlyViewed();

  const updated = [
    slug,
    ...current.filter((item) => item !== slug),
  ].slice(0, MAX_ITEMS);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
}