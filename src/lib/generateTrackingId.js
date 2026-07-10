export function generateTrackingId() {
  const now = new Date();

  const date =
    now.getFullYear().toString().slice(-2) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `MM-${date}-${random}`;
}