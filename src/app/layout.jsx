import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/providers/QueryProvider";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://mangomartbd.shop"),

  title: {
    default: "Mango Mart BD | Fresh Mangoes Online in Bangladesh",
    template: "%s | Mango Mart BD",
  },

  description:
    "Buy fresh, chemical-free mangoes online in Bangladesh. Enjoy fast home delivery, premium quality mangoes, and secure ordering from Mango Mart BD.",

  keywords: [
    "Mango",
    "Mango Bangladesh",
    "Buy Mango Online",
    "Fresh Mango",
    "Amrapali Mango",
    "Langra Mango",
    "Himsagar Mango",
    "Mango Mart BD",
    "Online Fruit Shop",
  ],

  authors: [{ name: "Mango Mart BD" }],
  creator: "Mango Mart BD",
  publisher: "Mango Mart BD",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title: "Mango Mart BD",
    description:
      "Order fresh mangoes online with delivery across Bangladesh.",
    url: "https://mangomartbd.shop",
    siteName: "Mango Mart BD",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mango Mart BD",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Mango Mart BD",
    description:
      "Fresh mangoes delivered across Bangladesh.",
    images: ["/og-image.jpg"],
  },

  alternates: {
    canonical: "https://mangomartbd.shop",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className={manrope.className}>
        <QueryProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </QueryProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
      </body>
    </html>
  );
}