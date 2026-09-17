"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/layout/SocialIcons";

const NOTICE =
  "Please be informed that the intellectual property rights to all photos, designs, and other materials on this Site belong to FIGLMUELLER. You may request permission to use them by contacting us at: info@figlmueller.ae";

const NOTICE_EMAIL = "info@figlmueller.ae";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/figlmueller",
    Icon: InstagramIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/figlmueller",
    Icon: LinkedinIcon,
  },
  { label: "X", href: "https://x.com/figlmueller", Icon: XIcon },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@figlmueller",
    Icon: YoutubeIcon,
  },
];

const LEGAL_LINKS = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms of use", href: "/terms-of-use" },
  { label: "Cookies", href: "/cookies" },
  { label: "Contact us", href: "/contact" },
];

const DARK_ROUTES = ["/about", "/resources"];

const BARE_ROUTES = ["/connect-us"];

export default function SiteFooter() {
  const rootRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const node = rootRef.current;
    const root = document.documentElement;

    if (!node) {
      root.style.removeProperty("--footer-height");
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      root.style.setProperty(
        "--footer-height",
        `${Math.round(entry.contentRect.height)}px`
      );
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
      root.style.removeProperty("--footer-height");
    };
  }, [pathname]);
  const dark = DARK_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const [before, after] = NOTICE.split(NOTICE_EMAIL);

  if (BARE_ROUTES.some((route) => pathname === route)) return null;

  const shell = dark ? "bg-black text-white" : "bg-bone text-black";
  const muted = dark ? "text-white/60" : "text-black/65";
  const quiet = dark ? "text-white/70" : "text-black/70";
  const strong = dark ? "hover:text-white" : "hover:text-black";
  const social = dark
    ? "bg-white/10 text-white hover:bg-white/20"
    : "bg-[#2D2A2A] text-bone hover:bg-black";

  return (
    <footer ref={rootRef} className={`site-footer relative z-10 ${shell}`}>
      <div className="w-full px-6 pb-8 pt-8 md:px-12">
        <p
          className={`footer-notice mx-auto max-w-[64ch] text-center text-[clamp(0.8rem,0.95vw,1.05rem)] leading-[1.6] ${muted}`}
        >
          {before}
          <a
            href={`mailto:${NOTICE_EMAIL}`}
            className={`underline-offset-4 transition-colors duration-300 hover:underline ${strong}`}
          >
            {NOTICE_EMAIL}
          </a>
          {after}
        </p>

        <ul className="footer-socials mt-6 flex items-center justify-center gap-3">
          {SOCIALS.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className={`footer-social flex size-10 items-center justify-center rounded-full transition-colors duration-300 ${social}`}
              >
                <Icon className="size-4" />
              </a>
            </li>
          ))}
        </ul>

        <div className="footer-meta mt-8 flex flex-col items-center gap-6 font-display text-[0.85rem] font-bold uppercase tracking-[0.12em] md:grid md:grid-cols-3 md:items-center md:gap-8">

          <p className={`footer-copyright md:justify-self-start ${quiet}`}>
            <span>© 2026 Figlmueller.</span> <span>All rights reserved</span>
          </p>

          <ul className="footer-links flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-self-center">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`transition-colors duration-300 ${quiet} ${strong}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <a
            href="https://temnyy.dev"
            target="_blank"
            rel="noreferrer"
            className={`footer-madeby transition-colors duration-300 md:justify-self-end ${quiet} ${strong}`}
          >
            Made by temnyy
          </a>
        </div>
      </div>
    </footer>
  );
}
