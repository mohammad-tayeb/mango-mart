"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SpeedDial from "../SpeedDial";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Navbar />}

      {children}

      {!isAdmin && <SpeedDial />}

      {!isAdmin && <Footer />}
    </div>
  );
}