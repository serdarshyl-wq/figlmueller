import { ViewTransition } from "react";
import SiteFooter from "@/components/layout/SiteFooter";
import { getSiteFooter } from "@/sanity/lib/site";

/*
 * The foot of the site is read here rather than in each page: it is the same
 * under all of them, so a page does not have to know it is there. The read is
 * the same request every time and is served from Next's own cache after the
 * first page.
 */
export default async function PageTransition({ children }) {
  const footer = await getSiteFooter();

  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
      <SiteFooter content={footer} />
    </ViewTransition>
  );
}
