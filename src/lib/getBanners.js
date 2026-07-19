export async function getBanners() {
  const res = await fetch("/api/banners");

  if (!res.ok) {
    throw new Error("Failed to fetch banners");
  }

  return res.json();
}