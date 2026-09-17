import localFont from "next/font/local";

export const clashGrotesk = localFont({
  src: [
    {
      path: "../assets/fonts/ClashGrotesk-Variable.woff2",
      weight: "200 700",
      style: "normal",
    },
  ],
  variable: "--font-clash-grotesk",
  display: "swap",
  preload: true,
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const satoshi = localFont({
  src: [
    {
      path: "../assets/fonts/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});
