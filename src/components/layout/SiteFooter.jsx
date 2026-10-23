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

/*
 * Which mark is drawn on a social button. The studio picks one of these by
 * name and types the address behind it; the drawing itself is the site's, so a
 * button cannot end up carrying somebody else's logo.
 */
const MARKS = {
  instagram: { label: "Instagram", Icon: InstagramIcon },
  linkedin: { label: "LinkedIn", Icon: LinkedinIcon },
  x: { label: "X", Icon: XIcon },
  youtube: { label: "YouTube", Icon: YoutubeIcon },
};

/* What the foot of the site ships with, where the studio has been left
   empty. */
const SHIPPED = {
  notice:
    "Please be informed that the intellectual property rights to all photos, designs, and other materials on this Site belong to FIGLMUELLER. You may request permission to use them by contacting us at: info@figlmueller.ae",
  noticeEmail: "info@figlmueller.ae",
  socials: [
    { place: "instagram", href: "https://www.instagram.com/figlmueller" },
    { place: "linkedin", href: "https://www.linkedin.com/company/figlmueller" },
    { place: "x", href: "https://x.com/figlmueller" },
    { place: "youtube", href: "https://www.youtube.com/@figlmueller" },
  ],
  links: [
    { label: "Privacy policy", href: "/privacy-policy" },
    { label: "Terms of use", href: "/terms-of-use" },
    { label: "Cookies", href: "/cookies" },
    { label: "Contact us", href: "/contact" },
  ],
  copyright: "© 2026 Figlmueller.",
  rights: "All rights reserved",
};

/* The signature of whoever built the site. It is not a field in the studio and
   it is not meant to be: it is set here, in the build. */
const MADE_BY = { label: "Made by temnyy", href: "https://temnyy.dev" };

const DARK_ROUTES = ["/about", "/resources"];

const BARE_ROUTES = ["/connect-us"];

export default function SiteFooter({ content }) {
  /* Written in the studio, or what the foot ships with - field by field. */
  const notice = content?.notice || SHIPPED.notice;
  const noticeEmail = content?.noticeEmail || SHIPPED.noticeEmail;
  const socials = content?.socials?.length ? content.socials : SHIPPED.socials;
  const links = content?.links?.length ? content.links : SHIPPED.links;
  const copyright = content?.copyright || SHIPPED.copyright;
  const rights = content?.rights || SHIPPED.rights;

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

  /* The address is a mail link wherever it is written into the sentence, and
     the sentence reads as it was typed where it is not in there at all. */
  const [before, after] = notice.split(noticeEmail);

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
          {after === undefined ? null : (
            <a
              href={`mailto:${noticeEmail}`}
              className={`underline-offset-4 transition-colors duration-300 hover:underline ${strong}`}
            >
              {noticeEmail}
            </a>
          )}
          {after}
        </p>

        {socials.length ? (
          <ul className="footer-socials mt-6 flex items-center justify-center gap-3">
            {socials.map((account) => {
              const mark = MARKS[account.place];
              if (!mark || !account.href) return null;

              const { label, Icon } = mark;

              return (
                <li key={account.place}>
                  <a
                    href={account.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className={`footer-social flex size-10 items-center justify-center rounded-full transition-colors duration-300 ${social}`}
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              );
            })}
          </ul>
        ) : null}

        <div className="footer-meta mt-8 flex flex-col items-center gap-6 font-display text-[0.85rem] font-bold uppercase tracking-[0.12em] md:grid md:grid-cols-3 md:items-center md:gap-8">

          <p className={`footer-copyright md:justify-self-start ${quiet}`}>
            <span>{copyright}</span> <span>{rights}</span>
          </p>

          <ul className="footer-links flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-self-center">
            {links.map((link) => (
              <li key={`${link.label}-${link.href}`}>
                <Link
                  href={link.href || "/"}
                  className={`transition-colors duration-300 ${quiet} ${strong}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <a
            href={MADE_BY.href}
            target="_blank"
            rel="noreferrer"
            className={`footer-madeby transition-colors duration-300 md:justify-self-end ${quiet} ${strong}`}
          >
            {MADE_BY.label}
          </a>
        </div>
      </div>
    </footer>
  );
}
