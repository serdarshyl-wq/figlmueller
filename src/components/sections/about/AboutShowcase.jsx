"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";
import useIsCompact from "@/hooks/useIsCompact";
import useIsTablet from "@/hooks/useIsTablet";
import { getLenis } from "@/lib/lenis";
import driveOnScroll from "@/lib/scrub";

const COMPANIES = [
  { id: "figlmueller", word: "Figlmueller", label: "Figlmueller Industrial" },
  { id: "fillwaves", word: "FillWaves", label: "FillWaves Contracting" },
  { id: "windle", word: "Windle", label: "Windle Engineering" },
];


const CARDS = [
  { cx: 6, cy: 12, w: 9, h: 12 },
  { cx: 18, cy: 5, w: 7, h: 9 },
  { cx: 35, cy: 12, w: 8, h: 11 },
  { cx: 45, cy: 9, w: 6, h: 8 },
  { cx: 51, cy: 14, w: 6.5, h: 9 },
  { cx: 66, cy: 16, w: 13, h: 17 },
  { cx: 79, cy: 8, w: 6.5, h: 9 },
  { cx: 92, cy: 9, w: 8, h: 10.5 },
  { cx: 9, cy: 42, w: 12, h: 16 },
  { cx: 22, cy: 36, w: 6, h: 8 },
  { cx: 30, cy: 40, w: 6.5, h: 9 },
  { cx: 78, cy: 44, w: 6.5, h: 9 },
  { cx: 90, cy: 46, w: 10, h: 13 },
  { cx: 20, cy: 62, w: 7, h: 9.5 },
  { cx: 37, cy: 66, w: 8, h: 11 },
  { cx: 52, cy: 60, w: 6, h: 8 },
  { cx: 63, cy: 68, w: 7, h: 9 },
  { cx: 88, cy: 66, w: 8, h: 10.5 },
  { cx: 7, cy: 86, w: 7, h: 9 },
  { cx: 20, cy: 88, w: 9, h: 12 },
  { cx: 36, cy: 90, w: 7, h: 9.5 },
  { cx: 47, cy: 92, w: 8, h: 10.5 },
  { cx: 61, cy: 88, w: 9, h: 12 },
  { cx: 74, cy: 90, w: 8, h: 10.5 },
  { cx: 92, cy: 88, w: 9, h: 12 },
];


const ORIGIN_X = 0.5;
const ORIGIN_Y = 1.05;
const EXIT_ORIGIN_Y = -0.05;
const CONVERGE = 0.3;
const SKEW = -16;

const RUNWAY_VH = 10.5;
const SCRUB = 0.1;
const SEEK_SECONDS = 2;

const TITLE_AT = 0;
const TITLE_IN = 1.6;

const TITLE_SWAP_LEAD = 2.2;
const TAB_DIM = 0.25;

const CARDS_AT = 1.3;
const CARDS_IN = 2.4;

const CARDS_SPREAD = 1.1;
const IN_SPAN = CARDS_IN + CARDS_SPREAD;

const HOLD = 0.6;
const OUT_IN = 2;
const OUT_SPREAD = 0.9;
const PASS_STEP = IN_SPAN + HOLD + OUT_SPREAD + OUT_IN;
const passIn = (pass) => CARDS_AT + pass * PASS_STEP;
const passOut = (pass) => passIn(pass) + IN_SPAN + HOLD;
const TIMELINE_END = passIn(COMPANIES.length - 1) + IN_SPAN;
const GRID_COLUMNS = 2;
const OPENING_ROWS = 3;
const OPENING_TILES = GRID_COLUMNS * OPENING_ROWS;
const TABLET_COLUMNS = 3;
const TABLET_OPENING = TABLET_COLUMNS * OPENING_ROWS;

function ShowcaseGroup({ company, opening = OPENING_TILES }) {
  const [openedAll, setOpenedAll] = useState(false);
  const shown = openedAll ? CARDS.length : opening;

  return (
    <li className="showcase-group">
      <h2 className="showcase-group-title">{company.label}</h2>

      <ul className="showcase-grid" aria-hidden="true">
        {CARDS.slice(0, shown).map((card, tileIndex) => (
          <li
            key={`${card.cx}-${card.cy}-${tileIndex}`}
            className="showcase-tile"
          >
            <span>{tileIndex + 1}</span>
          </li>
        ))}
      </ul>

      {openedAll ? null : (
        <button
          type="button"
          onClick={() => setOpenedAll(true)}
          className="showcase-more"
        >
          Load more
        </button>
      )}
    </li>
  );
}

export default function AboutShowcase() {
  const rootRef = useRef(null);
  const seekRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const isCompact = useIsCompact();
  const isTablet = useIsTablet();
  const animated = !prefersReducedMotion && !isCompact;

  useGSAP(
    () => {
      if (!animated) return;

      const root = rootRef.current;
      if (!root) return;

      const pane = root.querySelector(".showcase-pane");
      const words = root.querySelectorAll(".showcase-word");
      const tabs = root.querySelectorAll(".showcase-tab");
      const index = root.querySelector(".showcase-index");
      const cards = root.querySelectorAll(".showcase-card");
      if (!pane || !index || !words.length || !tabs.length || !cards.length) {
        return;
      }

      let tl = null;
      let disposed = false;

      const build = () => {
        tl?.kill();

        gsap.set(cards, { x: 0, y: 0, scale: 1, skewX: 0 });

        const paneBox = pane.getBoundingClientRect();
        const originX = paneBox.left + paneBox.width * ORIGIN_X;
        const originY = paneBox.top + paneBox.height * ORIGIN_Y;
        const exitY = paneBox.top + paneBox.height * EXIT_ORIGIN_Y;

        const items = Array.from(cards).map((card) => {
          const box = card.getBoundingClientRect();
          const cardX = box.left + box.width / 2;
          const cardY = box.top + box.height / 2;
          const dx = cardX - originX;
          const dy = cardY - originY;
          const ex = cardX - originX;
          const ey = cardY - exitY;

          return {
            card,
            inX: -dx * (1 - CONVERGE),
            inY: -dy * (1 - CONVERGE),
            outX: -ex * (1 - CONVERGE),
            outY: -ey * (1 - CONVERGE),
            entering: Math.hypot(dx, dy),
            leaving: Math.hypot(ex, ey),
          };
        });

        const furthestIn =
          items.reduce((most, item) => Math.max(most, item.entering), 0) || 1;
        const furthestOut =
          items.reduce((most, item) => Math.max(most, item.leaving), 0) || 1;

        gsap.set(words, { autoAlpha: 0 });
        gsap.set(tabs, { opacity: TAB_DIM });
        gsap.set(index, { autoAlpha: 0 });

        tl = gsap.timeline({ paused: true });
        tl.to(
          index,
          { autoAlpha: 1, duration: TITLE_IN, ease: "power2.out" },
          TITLE_AT
        );

        COMPANIES.forEach((_, pass) => {
          const last = pass === COMPANIES.length - 1;
          const nameAt =
            pass === 0 ? TITLE_AT : passOut(pass - 1) + TITLE_SWAP_LEAD;

          tl.to(
            words[pass],
            { autoAlpha: 1, duration: TITLE_IN, ease: "power2.out" },
            nameAt
          ).to(
            tabs[pass],
            { opacity: 1, duration: TITLE_IN, ease: "power2.out" },
            nameAt
          );

          if (!last) {
            tl.to(
              words[pass],
              { autoAlpha: 0, duration: TITLE_IN, ease: "power2.in" },
              passOut(pass)
            ).to(
              tabs[pass],
              { opacity: TAB_DIM, duration: TITLE_IN, ease: "power2.in" },
              passOut(pass)
            );
          }
        });

        items.forEach((item) => {
          const { card, inX, inY, outX, outY } = item;

          gsap.set(card, {
            autoAlpha: 0,
            x: inX,
            y: inY,
            scale: CONVERGE,
            skewX: SKEW,
          });


          const inDelay = (item.entering / furthestIn) * CARDS_SPREAD;
          const outDelay = (item.leaving / furthestOut) * OUT_SPREAD;

          COMPANIES.forEach((_, pass) => {
            const at = passIn(pass) + inDelay;
            const placed = {
              x: 0,
              y: 0,
              scale: 1,
              skewX: 0,
              duration: CARDS_IN,
              ease: "power3.out",
            };

            if (pass === 0) {
              tl.to(card, placed, at);
            } else {

              tl.fromTo(
                card,
                { x: inX, y: inY, scale: CONVERGE, skewX: SKEW },
                { ...placed, immediateRender: false },
                at
              );
            }

            tl.to(
              card,
              { autoAlpha: 1, duration: CARDS_IN * 0.4, ease: "power1.out" },
              at
            );

            if (pass === COMPANIES.length - 1) return;

            const leaves = passOut(pass) + outDelay;

            tl.to(
              card,
              {
                x: outX,
                y: outY,
                scale: CONVERGE,
                skewX: SKEW,
                duration: OUT_IN,
                ease: "power3.in",
              },
              leaves
            ).to(
              card,
              { autoAlpha: 0, duration: OUT_IN * 0.55, ease: "power1.in" },
              leaves + OUT_IN * 0.45
            );
          });
        });

        tl.to({}, { duration: 0 }, TIMELINE_END);
      };

      build();

      const clamp01 = gsap.utils.clamp(0, 1);

      const scrollProgress = () => {
        const rect = root.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;
        if (travel <= 0) return 0;
        return clamp01(-rect.top / travel);
      };

      const scrub = driveOnScroll({
        root: root,
        progress: scrollProgress,
        apply: (value) => tl.progress(value),
        ease: SCRUB,
      });

      const rebuild = () => {
        if (disposed) return;
        build();
        scrub.reapply();
      };

      window.addEventListener("resize", rebuild);

      seekRef.current = (pass) => {
        const rect = root.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;
        const span = tl.duration();
        if (travel <= 0 || !span) return;

        const at = Math.min(passIn(pass) + IN_SPAN, span);
        const top = window.scrollY + rect.top + (at / span) * travel;

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
        scrub.stop();
        window.removeEventListener("resize", rebuild);
        tl?.kill();
      };
    },

    { dependencies: [animated], revertOnUpdate: true }
  );

  if (isCompact) {
    return (
      <section className="about-showcase relative z-10 bg-black text-white">
        <ul className="showcase-groups">
          {COMPANIES.map((company) => (
            <ShowcaseGroup
              key={company.id}
              company={company}
              opening={isTablet ? TABLET_OPENING : OPENING_TILES}
            />
          ))}
        </ul>
      </section>
    );
  }

  const names = animated ? COMPANIES : COMPANIES.slice(0, 1);

  return (
    <section
      ref={rootRef}
      aria-labelledby="showcase-heading"
      className="relative z-10 bg-black text-white"
      style={animated ? { height: `${RUNWAY_VH * 100}vh` } : undefined}
    >
      <div
        className={`showcase-pane relative h-svh overflow-hidden ${animated ? "sticky top-0" : ""
          }`}
      >
        <ul aria-hidden="true">
          {CARDS.map((card, cardIndex) => (
            <li
              key={`${card.cx}-${card.cy}-${cardIndex}`}
              style={{
                left: `calc(${card.cx}% - ${card.w / 2}vw)`,
                top: `calc(${card.cy}% - ${card.h / 2}vw)`,
                width: `${card.w}vw`,
                height: `${card.h}vw`,
              }}
              className={`showcase-card absolute flex items-center justify-center border border-white/10 bg-white/6 will-change-transform ${animated ? "invisible" : ""
                }`}
            >
              <span className="font-display text-[0.6rem] font-normal uppercase tracking-[0.2em] text-white/35">
                {cardIndex + 1}
              </span>
            </li>
          ))}
        </ul>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">

          <h2
            id="showcase-heading"
            className="relative text-center font-display text-[clamp(2.5rem,9vw,11rem)] font-medium uppercase leading-[0.9] tracking-[-0.03em]"
          >
            {names.map((company, nameIndex) => (
              <span
                key={company.id}
                className={`showcase-word block ${nameIndex === 0 ? "" : "absolute inset-0"
                  } ${animated ? "invisible" : ""}`}
              >
                {company.word}
              </span>
            ))}
          </h2>
        </div>

        <ul
          className={`showcase-index pointer-events-none absolute inset-x-0 bottom-[6svh] flex flex-col items-center gap-1 font-display text-[0.72rem] font-semibold uppercase tracking-[0.06em] ${animated ? "invisible" : ""
            }`}
        >
          {COMPANIES.map((company, tabIndex) => (
            <li
              key={company.id}
              className={`showcase-tab ${!animated && tabIndex > 0 ? "text-white/25" : "text-white"
                }`}
            >
              <button
                type="button"
                onClick={() => seekRef.current?.(tabIndex)}
                className="pointer-events-auto cursor-pointer uppercase transition-opacity duration-300 hover:opacity-60"
              >
                {company.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
