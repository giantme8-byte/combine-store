export function getWishlist(): number[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem("wishlist");

  return data ? JSON.parse(data) : [];
}

export function saveWishlist(ids: number[]) {
  localStorage.setItem(
    "wishlist",
    JSON.stringify(ids)
  );
}

export function isWishlisted(id: number) {
  return getWishlist().includes(id);
}

export function toggleWishlist(id: number) {
  const wishlist = getWishlist();

  if (wishlist.includes(id)) {
    const updated = wishlist.filter(
      (item) => item !== id
    );

    saveWishlist(updated);

    return false;
  }

  wishlist.push(id);

  saveWishlist(wishlist);

  return true;
}