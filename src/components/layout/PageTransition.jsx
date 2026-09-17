import { ViewTransition } from "react";
import SiteFooter from "@/components/layout/SiteFooter";

export default function PageTransition({ children }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
      <SiteFooter />
    </ViewTransition>
  );
}
