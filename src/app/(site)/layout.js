import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import SiteHeader from "@/components/layout/SiteHeader";
import { clashGrotesk, satoshi } from "@/lib/fonts";
import "../globals.css";

export const metadata = {
  title: "Figlmueller Ind | L.L.C",
  description: "Figlmueller Ind | L.L.C — Dubai, UAE",
};

/*
 * The site's own root. It is a root rather than the root because the studio at
 * /admin has one of its own: this one brings the smooth scroll, the bar, the
 * fonts and the whole of the site's CSS, and the studio must have none of them.
 * Two roots side by side is what the group folders are for - the URLs are
 * unchanged by them.
 *
 * There is no cookie line here, and there is nothing for one to say: the site
 * sets no cookies, counts nobody and writes nothing to a reader's device. What
 * it does and does not do is written out on /cookies instead.
 */
export default function SiteLayout({ children }) {
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
      </body>
    </html>
  );
}
