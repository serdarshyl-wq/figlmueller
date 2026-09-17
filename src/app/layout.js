import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import SiteHeader from "@/components/layout/SiteHeader";
import CookieNotice from "@/components/layout/CookieNotice";
import { clashGrotesk, satoshi } from "@/lib/fonts";
import "./globals.css";

export const metadata = {
  title: "Figlmueller Ind | L.L.C",
  description: "Figlmueller Ind | L.L.C — Dubai, UAE",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${clashGrotesk.variable} ${satoshi.variable} antialiased`}
    >
      <body className="flex min-h-svh flex-col">
        <SmoothScrollProvider>
          <SiteHeader />
          {children}
        </SmoothScrollProvider>
        <CookieNotice />
      </body>
    </html>
  );
}
