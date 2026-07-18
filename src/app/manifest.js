export default function manifest() {
  return {
    name: "Mango Mart BD",
    short_name: "MangoMart",
    description: "Fresh mangoes delivered across Bangladesh",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#16a34a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}