"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PixelPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  return null;
}