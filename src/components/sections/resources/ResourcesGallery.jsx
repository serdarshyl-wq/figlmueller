"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";
import ActionButton from "@/components/ui/ActionButton";
import ResourcesPanel from "@/components/sections/resources/ResourcesPanel";
import { getLenis } from "@/lib/lenis";
import { afterFonts } from "@/lib/scrub";

/* The list as the page ships with it, and what it falls back to line by line
   where the studio has been left empty. */
const SHIPPED = [
  { title: "Company brochure", image: "/resources-assets/resources-dummy1.jpeg" },
  {
    title: "Machine technical overview",
    image: "/resources-assets/resources-dummy2.jpeg",
  },
  {
    title: "Citrine® machine gallery",
    image: "/resources-assets/resources-dummy3.jpeg",
  },
  { title: "Machine animations", image: "/resources-assets/resources-dummy4.jpeg" },
  { title: "Product videos", image: "/resources-assets/resources-dummy5.jpeg" },
  {
    title: "Frequently asked questions",
    image: "/resources-assets/resources-dummy6.jpeg",
  },
  {
    title: "Downloadable documents",
    image: "/resources-assets/resources-dummy7.jpeg",
  },
  { title: "Project updates", image: "/resources-assets/resources-dummy8.jpeg" },
];

const PARAM = "item";

/* What a resource is called in the address bar while its panel is open, so a
   panel can be linked to and comes back open when that link is followed. */
const slugOf = (title) =>
  String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const CTA_LABEL = "More info";
const PANEL_NOTE = "Coming soon";
const CTA_FONT = "var(--cta-font, 0.92rem)";
const RUNWAY_VH = 10;
const SCRUB = 0.1;

const COMPACT_MAX = 1279;
const PHONE_LIST_FROM = 0.34;

const LIST_FROM = 0.72;
const LINE_SPREAD = 0.05;
const LINES_AT = 0;
const LINES_IN = 1.3;

const ITEMS_AT = LINES_IN + 0.4;
const ITEM_STEP = 1.2;
const SLOT_IN = 0.7;

const SLIDE_MS = 700;
const OPEN_MS = 1900;
const OPEN_FROM = "1.12";
const IMAGE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const DIM = 0.7;
const DIM_IN = 0.6;

const TIMELINE_TAIL = SLOT_IN + 0.4;

const SEEK_SECONDS = 1.2;

const ARRIVED = 0.002;

export default function ResourcesGallery({ content }) {
  /* Written in the studio, or the list the page ships with. */
  const items = content?.items?.length ? content.items : SHIPPED;
  const ctaLabel = content?.ctaLabel || CTA_LABEL;
  const panelNote = content?.panelNote || PANEL_NOTE;

  /* Each resource is called by its own address while it is open, so a panel
     can be linked to. It is written in the studio, and worked out from the
     name where it has not been. */
  const slugs = useMemo(
    () => items.map((item) => item.slug || slugOf(item.title)),
    [items]
  );

  /* The timeline is as long as there are lines to read in. */
  const timelineEnd = ITEMS_AT + ITEM_STEP * (items.length - 1) + TIMELINE_TAIL;

  const rootRef = useRef(null);
  const seekRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;

  const [reached, setReached] = useState(-1);

  const [panel, setPanel] = useState({ open: false, index: 0 });

  const pushedRef = useRef(false);

  const openPanel = useCallback(
    (index) => {
      window.history.pushState(
        null,
        "",
        `${window.location.pathname}?${PARAM}=${slugs[index]}`
      );
      pushedRef.current = true;
      setPanel({ open: true, index });
    },
    [slugs]
  );

  const closePanel = useCallback(() => {
    if (pushedRef.current) {
      pushedRef.current = false;
      window.history.back();
      return;
    }

    window.history.replaceState(null, "", window.location.pathname);
    setPanel((current) => ({ ...current, open: false }));
  }, []);

  useEffect(() => {
    const sync = () => {
      const slug = new URLSearchParams(window.location.search).get(PARAM);
      const index = slug ? slugs.indexOf(slug) : -1;

      pushedRef.current = false;
      setPanel((current) =>
        index < 0 ? { ...current, open: false } : { open: true, index }
      );
    };

    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [slugs]);

  useGSAP(
    () => {
      if (!animated) return;

      const root = rootRef.current;
      if (!root) return;

      const list = root.querySelector(".gallery-list");
      const lines = Array.from(root.querySelectorAll(".gallery-line"));
      const slots = Array.from(root.querySelectorAll(".gallery-slot"));
      const buttons = Array.from(root.querySelectorAll(".gallery-cta"));
      if (!list || !lines.length) return;

      let tl = null;
      let disposed = false;

      const build = () => {
        tl?.kill();

        gsap.set(lines, { opacity: 1 });
        gsap.set(buttons, { autoAlpha: 0 });

        gsap.set(slots, { height: "auto" });
        const slotHeights = slots.map(
          (slot) => slot.getBoundingClientRect().height
        );
        gsap.set(slots, { height: 0 });

        const compact = window.innerWidth <= COMPACT_MAX;
        const spread = window.innerHeight * LINE_SPREAD;
        gsap.set(list, {
          y: window.innerHeight * (compact ? PHONE_LIST_FROM : LIST_FROM),
          yPercent: 0,
        });
        gsap.set(lines, { y: (index) => index * spread, yPercent: 0 });

        tl = gsap.timeline({ paused: true });

        tl.to(list, { y: 0, duration: LINES_IN, ease: "none" }, LINES_AT).to(
          lines,
          { y: 0, duration: LINES_IN, ease: "none" },
          LINES_AT
        );

        tl.to(
          lines.slice(1),
          { opacity: DIM, duration: DIM_IN, ease: "power2.out" },
          ITEMS_AT - DIM_IN
        );

        items.forEach((_, index) => {
          const at = ITEMS_AT + index * ITEM_STEP;

          if (index > 0) {
            tl.to(
              lines[index],
              { opacity: 1, duration: DIM_IN, ease: "power2.out" },
              at
            ).to(
              lines[index - 1],
              { opacity: DIM, duration: DIM_IN, ease: "power2.out" },
              at
            );
          }

          tl.to(
            slots[index],
            {
              height: slotHeights[index],
              duration: SLOT_IN,
              ease: "power3.out",
            },
            at
          ).to(
            buttons[index],
            { autoAlpha: 1, duration: SLOT_IN, ease: "power2.out" },
            at
          );

          if (index > 0) {
            tl.to(
              slots[index - 1],
              { height: 0, duration: SLOT_IN, ease: "power3.out" },
              at
            ).to(
              buttons[index - 1],
              { autoAlpha: 0, duration: SLOT_IN * 0.6, ease: "power2.in" },
              at
            );
          }
        });

        tl.to({}, { duration: 0 }, timelineEnd);
      };

      build();

      const clamp01 = gsap.utils.clamp(0, 1);

      const scrollProgress = () => {
        const rect = root.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;
        if (travel <= 0) return 0;

        if (window.innerWidth <= COMPACT_MAX) {
          return clamp01((window.innerHeight - rect.top) / rect.height);
        }

        return clamp01(-rect.top / travel);
      };

      let eased = scrollProgress();
      tl.progress(eased);

      let cue = -1;
      const applyCue = (next) => {
        if (next === cue) return;
        cue = next;
        setReached(next);
      };

      let heldAt = null;
      let heldUntil = 0;

      const cueAt = (progress) => {
        const time = progress * timelineEnd;
        if (time < ITEMS_AT) return -1;
        return Math.min(
          items.length - 1,
          Math.floor((time - ITEMS_AT) / ITEM_STEP)
        );
      };

      const tick = () => {
        const rect = root.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
          const edge = rect.bottom <= 0 ? 1 : 0;
          if (eased !== edge && heldAt === null) {
            eased = edge;
            tl.progress(edge);
            applyCue(cueAt(edge));
          }
          return;
        }

        const target = scrollProgress();

        if (heldAt !== null) {
          eased = heldAt;
          if (
            Math.abs(target - heldAt) < ARRIVED ||
            performance.now() > heldUntil
          ) {
            heldAt = null;
          }
        } else {
          eased += (target - eased) * SCRUB;
          if (Math.abs(target - eased) < 0.0002) eased = target;
        }

        tl.progress(eased);
        applyCue(cueAt(eased));
      };

      let running = false;
      const begin = () => {
        if (running || disposed) return;
        running = true;
        stopWaiting();
        gsap.ticker.add(tick);
      };

      const reaches = ["wheel", "touchmove", "keydown", "scroll"];
      const idleHandle = window.requestIdleCallback
        ? window.requestIdleCallback(begin, { timeout: 500 })
        : window.setTimeout(begin, 300);

      function stopWaiting() {
        if (window.cancelIdleCallback) window.cancelIdleCallback(idleHandle);
        else window.clearTimeout(idleHandle);
        reaches.forEach((type) => window.removeEventListener(type, begin));
      }

      reaches.forEach((type) =>
        window.addEventListener(type, begin, { passive: true })
      );

      const rebuild = () => {
        if (disposed) return;
        build();
        tl.progress(eased);
      };

      window.addEventListener("resize", rebuild);
      afterFonts(rebuild);

      seekRef.current = (index) => {
        const rect = root.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;
        const span = tl.duration();
        if (travel <= 0 || !span) return;

        const at = Math.min(ITEMS_AT + index * ITEM_STEP + SLOT_IN, span);
        const share = at / span;
        const top =
          window.innerWidth <= COMPACT_MAX
            ? window.scrollY +
            rect.top -
            window.innerHeight +
            share * rect.height
            : window.scrollY + rect.top + share * travel;

        heldAt = share;
        heldUntil = performance.now() + SEEK_SECONDS * 1000 + 600;
        begin();

        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(top, { duration: SEEK_SECONDS });
          return;
        }

        window.scrollTo({ top, behavior: "smooth" });
      };

      return () => {
        disposed = true;
        seekRef.current = null;
        stopWaiting();
        if (running) gsap.ticker.remove(tick);
        window.removeEventListener("resize", rebuild);
        tl?.kill();
      };
    },
    { dependencies: [animated, items.length] }
  );

  return (
    <section
      ref={rootRef}
      id="resources-gallery"
      aria-labelledby="resources-gallery-heading"
      className="resources-gallery relative bg-bone text-black"
      style={animated ? { height: `${RUNWAY_VH * 100}vh` } : undefined}
    >
      <div
        className={`relative flex w-full items-center justify-center overflow-hidden px-[3vw] ${animated ? "sticky top-0 h-svh" : "py-[12vh]"
          }`}
      >
        <h2 id="resources-gallery-heading" className="sr-only">
          Resources gallery
        </h2>

        <div className="absolute inset-0" aria-hidden="true">
          {items.map((item, index) => {
            const here = !animated || index <= reached;
            const first = index === 0;

            return (
              <div
                key={item.title}
                className="gallery-frame absolute inset-0 will-change-transform"
                style={{

                  transitionProperty: "translate, opacity, scale",
                  transitionDuration: `${first ? OPEN_MS : SLIDE_MS}ms`,
                  transitionTimingFunction: IMAGE_EASE,
                  translate: first || here ? "0 0" : "0 100%",
                  opacity: first && !here ? 0 : 1,
                  scale: first && !here ? OPEN_FROM : "1",
                }}
              >
                <Image
                  src={item.image?.url || item.image}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/45" />
              </div>
            );
          })}
        </div>

        <ul
          className={`gallery-list relative z-10 flex w-full flex-col items-center text-center transition-colors ${animated ? "will-change-transform" : ""
            } ${reached < 0 && animated ? "text-black" : "text-white"}`}
          style={{ transitionDuration: `${OPEN_MS}ms`, transitionTimingFunction: IMAGE_EASE }}
        >
          {items.map((item, index) => (
            <li
              key={item.title}
              className={`gallery-line ${animated ? "will-change-transform" : ""}`}
            >
              <button
                type="button"
                onClick={() => seekRef.current?.(index)}
                aria-current={index === reached ? "true" : undefined}
                className="block cursor-pointer font-display text-[clamp(1.15rem,3.4vw,3.5rem)] font-semibold uppercase leading-[1.16] tracking-[-0.02em]"
              >
                {item.title}
              </button>

              <span
                className={`gallery-slot block ${animated ? "h-0 overflow-hidden" : ""
                  }`}
              >
                <span className="flex justify-center pb-[1.4vh] pt-[1vh]">
                  <ActionButton
                    className={`gallery-cta ${animated ? "invisible" : ""}`}
                    style={{ fontSize: CTA_FONT }}
                    aria-label={`${ctaLabel} — ${item.title}`}
                    onClick={() => openPanel(index)}
                  >
                    {ctaLabel}
                  </ActionButton>
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <ResourcesPanel
        open={panel.open}
        title={items[panel.index]?.title ?? ""}
        body={items[panel.index]?.body}
        note={panelNote}
        onClose={closePanel}
      />
    </section>
  );
}
