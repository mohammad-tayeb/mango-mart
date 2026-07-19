export async function getAdminBanners() {
  const res = await fetch("/api/admin/banners");

  if (!res.ok) {
    throw new Error("Failed to fetch banners");
  }

  return res.json();
}