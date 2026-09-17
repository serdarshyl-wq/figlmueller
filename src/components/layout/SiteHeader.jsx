"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Send } from "lucide-react";
import NavLink from "@/components/layout/NavLink";
import LogoLockup from "@/components/brand/LogoLockup";
import LogoSymbol from "@/components/brand/LogoSymbol";
import LetsTalkButton from "@/components/layout/LetsTalkButton";
import NavPanel from "@/components/layout/NavPanel";
import { NAV_LINKS, NAV_LINKS_LEFT, NAV_LINKS_RIGHT } from "@/config/navigation";
import {
  registerNavLogoSlot,
  useIntroHandedOver,
  useLogoLanded,
} from "@/lib/intro-store";
import { getLenis } from "@/lib/lenis";
import useScrollLock from "@/hooks/useScrollLock";
import useIsCompact from "@/hooks/useIsCompact";
import { afterFonts } from "@/lib/scrub";

const SCROLLED_AT = 24;

const SHEET_OUT_MS = 620;

const SYMBOL_ROUTES = ["/contact"];

const BARE_ROUTES = ["/connect-us"];

const ALWAYS_VISIBLE_ABOVE = 120;

const DIRECTION_THRESHOLD = 4;

const panelId = (href) => `nav-panel-${href.replace(/[^a-z0-9]+/gi, "-")}`;

const SETTLED_PX = 0.5;

const sameBoxes = (a, b) => {
  const keys = Object.keys(b);
  if (keys.length !== Object.keys(a).length) return false;

  return keys.every(
    (key) =>
      a[key] &&
      Math.abs(a[key].left - b[key].left) < SETTLED_PX &&
      Math.abs(a[key].width - b[key].width) < SETTLED_PX
  );
};

export default function SiteHeader() {
  const rootRef = useRef(null);
  const lastScrollRef = useRef(0);
  const sheetExitRef = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [ruleBoxes, setRuleBoxes] = useState({});
  const [panelLit, setPanelLit] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isCompact = useIsCompact();
  const introHandedOver = useIntroHandedOver();
  const revealed = introHandedOver || pathname !== "/";
  const bare = BARE_ROUTES.some((route) => pathname === route);

  const logoLanded = useLogoLanded();
  const showOwnLogo = logoLanded || pathname !== "/";
  const symbolRoute = SYMBOL_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const symbolOnly = symbolRoute || scrolled;

  useScrollLock(menuOpen);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const followFromSheet = useCallback(
    (event, href) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      event.preventDefault();
      closeMenu();

      window.clearTimeout(sheetExitRef.current);
      sheetExitRef.current = window.setTimeout(
        () => router.push(href),
        SHEET_OUT_MS
      );
    },
    [closeMenu, router]
  );

  useEffect(() => () => window.clearTimeout(sheetExitRef.current), []);
  const setLogoSlot = useCallback((node) => registerNavLogoSlot(node), []);

  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;

    let darkUntil = 0;

    const applyGround = (scroll) => {
      setScrolled(scroll > SCROLLED_AT);
      setOnLight(scroll >= darkUntil - 1);
    };

    const measureDark = () => {
      const dark = document.querySelector("[data-nav-dark]");
      darkUntil = dark ? dark.offsetTop + dark.offsetHeight : 0;
      applyGround(lenis.scroll ?? window.scrollY);
    };

    const frame = requestAnimationFrame(measureDark);
    window.addEventListener("resize", measureDark);

    const onScroll = ({ scroll }) => {
      const delta = scroll - lastScrollRef.current;
      lastScrollRef.current = scroll;

      applyGround(scroll);

      if (scroll <= ALWAYS_VISIBLE_ABOVE) {
        setHidden(false);
        return;
      }

      if (Math.abs(delta) < DIRECTION_THRESHOLD) return;
      setHidden(delta > 0);
    };

    lenis.on("scroll", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measureDark);
      lenis.off("scroll", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen && !openPanel) return;

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      closeMenu();
      setOpenPanel(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, openPanel, closeMenu]);

  useEffect(() => {
    const bar = rootRef.current;

    const measure = () => {
      if (!bar) return;

      const barLeft = bar.getBoundingClientRect().left;
      const next = {};
      bar.querySelectorAll("[data-nav-item]").forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (!rect.width) return;
        next[item.dataset.navItem] = {
          left: rect.left - barLeft,
          width: rect.width,
        };
      });

      setRuleBoxes((current) => (sameBoxes(current, next) ? current : next));
    };

    const frame = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    afterFonts(measure);

    const observer = bar ? new ResizeObserver(measure) : null;
    observer?.observe(bar);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, [pathname]);

  useGSAP(
    () => {
      if (!revealed || bare) return;

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(rootRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 0)
        .fromTo(
          ".nav-item",
          { yPercent: 120 },
          { yPercent: 0, duration: 1, stagger: 0.06 },
          0.15
        );
    },
    { scope: rootRef, dependencies: [revealed, bare] }
  );

  const barHidden = hidden && !menuOpen;
  const activePanel = hidden ? null : openPanel;
  const barOnLight = onLight && scrolled && !menuOpen;
  const barGrounded = isCompact ? scrolled && !menuOpen : barOnLight;
  const contentOnLight = isCompact
    ? menuOpen || (onLight && !scrolled)
    : (onLight || Boolean(activePanel)) && !panelLit && !menuOpen;

  const enterItem = (link) => {
    setHovered(link.href);
    setOpenPanel(link.submenu ? link.href : null);
  };

  const leaveItems = () => {
    setHovered(null);
    setOpenPanel(null);
  };

  const renderNavItem = (link) => {
    const { submenu, ...rest } = link;

    return (
      <li
        key={link.href}
        data-nav-item={link.href}
        className="overflow-hidden"
        onMouseEnter={() => enterItem(link)}
        onFocus={() => enterItem(link)}
      >
        <NavLink
          {...rest}
          onClick={leaveItems}
          className="nav-item"
          aria-expanded={submenu ? activePanel === link.href : undefined}
          aria-controls={submenu ? panelId(link.href) : undefined}
        />
      </li>
    );
  };

  if (bare) return null;

  return (
    <header
      ref={rootRef}
      onMouseLeave={leaveItems}
      className={`header-shell invisible fixed inset-x-0 top-0 z-50 opacity-0 transition duration-500 ease-out ${barHidden ? "-translate-y-full" : "translate-y-0"
        } ${contentOnLight ? "text-black" : "text-white"} ${activePanel ? "delay-300" : "delay-0"
        }`}
    >
      <div
        className={`nav-ground absolute inset-0 -z-10 border-b transition-colors duration-500 ${barGrounded
          ? "is-solid border-black/10 bg-white"
          : "border-transparent bg-transparent"
          }`}
        aria-hidden="true"
      />

      {NAV_LINKS.map((link) =>
        ruleBoxes[link.href] ? (
          <span
            key={link.href}
            aria-hidden="true"
            style={ruleBoxes[link.href]}
            className={`pointer-events-none absolute top-0 z-20 h-1 origin-center bg-current transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${hovered === link.href ? "scale-x-100" : "scale-x-0"
              }`}
          />
        ) : null
      )}

      <nav
        aria-label="Primary"
        onMouseMove={(event) => {
          const box = hovered ? ruleBoxes[hovered] : null;
          if (!box) return;
          const x = event.clientX;
          if (x < box.left || x > box.left + box.width) leaveItems();
        }}
        className={`nav-bar relative z-10 mx-auto flex items-center justify-between gap-10 px-6 transition-[padding] duration-700 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:gap-32 xl:px-24 ${scrolled ? "is-scrolled py-6" : "py-9 xl:py-12"
          }`}
      >
        <ul className="hidden w-full items-center justify-between gap-6 font-display text-base font-medium uppercase tracking-[0.14em] xl:flex 2xl:text-lg">
          {NAV_LINKS_LEFT.map(renderNavItem)}
        </ul>

        <Link
          ref={setLogoSlot}
          href="/"
          aria-label="Figlmueller Ind — home"
          className="nav-logo relative inline-flex shrink-0 items-center justify-center justify-self-center"
        >

          <LogoLockup
            variant={contentOnLight ? "color" : "white"}
            className={`nav-lockup w-auto transition-[height,opacity] duration-700 ${scrolled ? "h-12" : "h-14 xl:h-16"
              } ${showOwnLogo && !symbolOnly ? "" : "opacity-0"}`}
          />

          <LogoSymbol
            variant={contentOnLight ? "color" : "white"}
            className={`nav-symbol absolute transition-[height,opacity] duration-700 ${scrolled ? "h-9" : "h-10 xl:h-12"
              } ${showOwnLogo && symbolOnly ? "" : "opacity-0"}`}
          />
        </Link>

        <ul className="hidden w-full items-center justify-between gap-6 font-display text-base font-medium uppercase tracking-[0.14em] xl:flex 2xl:text-lg">
          {NAV_LINKS_RIGHT.map(renderNavItem)}
          <li className="overflow-hidden">
            <LetsTalkButton className="nav-item" />
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="nav-burger relative z-50 -mr-2 flex cursor-pointer flex-col items-start justify-center gap-2 p-2 text-current xl:hidden"
        >
          <span
            aria-hidden="true"
            className={`block h-0.5 w-8 rounded-full bg-current transition-[translate,rotate] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? "translate-y-1.25 rotate-45" : ""
              }`}
          />
          <span
            aria-hidden="true"
            className={`block h-0.5 rounded-full bg-current transition-[translate,rotate,width] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? "w-8 -translate-y-1.25 -rotate-45" : "w-4"
              }`}
          />
        </button>

        <Link
          href="/connect-us"
          aria-label="Let's talk"
          className="nav-mail hidden"
        >
          <Send aria-hidden="true" className="size-4.5" strokeWidth={1.6} />
        </Link>
      </nav>

      {NAV_LINKS.filter((link) => link.submenu).map((link) => (
        <NavPanel
          key={link.href}
          id={panelId(link.href)}
          items={link.submenu}
          open={activePanel === link.href}
          onLitChange={setPanelLit}
          onLeave={leaveItems}
        />
      ))}

      <div
        id="mobile-menu"
        inert={!menuOpen}
        className={`nav-sheet fixed inset-0 -z-10 flex flex-col justify-center bg-black/95 px-6 text-white backdrop-blur-2xl transition-opacity duration-500 xl:hidden ${menuOpen ? "is-open visible opacity-100" : "invisible opacity-0"
          }`}
      >
        <ul className="nav-sheet-list flex flex-col gap-6 font-display text-3xl font-medium uppercase tracking-[0.08em] sm:text-4xl">

          {NAV_LINKS.map(({ submenu, ...link }, index) => (
            <li
              key={link.href}

              style={{
                "--i": index,
                transitionDelay: menuOpen ? `${120 + index * 70}ms` : "0ms",
              }}
              className={`nav-sheet-item transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
            >
              <div className="nav-sheet-line">
                <div className="nav-sheet-rise">
                  <NavLink
                    {...link}
                    onClick={(event) => followFromSheet(event, link.href)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
