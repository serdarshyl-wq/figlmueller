"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";
import useIsCompact from "@/hooks/useIsCompact";
import useIsTablet from "@/hooks/useIsTablet";
import { getLenis } from "@/lib/lenis";
import driveOnScroll from "@/lib/scrub";

/*
 * The companies, as the section ships with them. In the studio they are
 * written once as the row of cards above this section, and a pass of this
 * slider is handed one of them by name - so what flies past here is never a
 * company of its own. What is below is what the page falls back to.
 */
const COMPANIES = [
  { word: "Figlmueller", label: "Figlmueller Industrial" },
  { word: "FillWaves", label: "FillWaves Contracting" },
  { word: "Windle", label: "Windle Engineering" },
];

/* Every card is a picture of its own, added one at a time in the studio. A
   company with none yet carries its name alone. */
const CARDS_MOST = 20;

/*
 * Where the cards are laid out, for however many there are.
 *
 * The screen is cut up and handed out: it is split in two, then one of the
 * largest pieces is split again, and again, until there is a piece for every
 * card. Every piece is used, so the field reaches every corner whether it
 * holds five cards or twenty - with five, each one is simply enormous. The
 * cuts are uneven and taken at the longer side, which is what leaves cards of
 * every size and shape rather than a grid of one.
 *
 * What keeps the field breathing is that a card does not fill its piece. It
 * takes somewhere between half and most of it, across and down by different
 * amounts, and sits where it likes inside what is left - so the black between
 * two cards is wide in one place and narrow in the next, and never a gutter
 * running the length of the screen.
 *
 * No two cards can meet: each is held inside its own piece, and the pieces are
 * cut from one another rather than placed.
 */
const FIELD_SHAPE = 1.7; /* the screen the field is cut for */
const CUT_LEAST = 0.36; /* the smallest share a cut may leave */
const CUT_MOST = 0.64;
const CARD_LEAST = 0.52; /* of its own piece */
const CARD_MOST = 0.92;
const KEEP_CLEAR = 0.025; /* of the piece, on every side, whatever else */

/* The same field every time, and the same on the server as in the browser:
   stirred from the card's own place in the list rather than from chance. */
const wobble = (seed) => {
  const spun = Math.sin(seed * 12.9898) * 43758.5453;
  return spun - Math.floor(spun);
};

/* Written out short, because a browser reads a length back rounded and the two
   have to agree for the page to hydrate without being re-rendered. */
const place = (share) => `${Math.round(share * 100000) / 1000}%`;

function fieldFor(count) {
  /* A company whose pictures have not been uploaded yet has no field at all. */
  if (count < 1) return [];

  const pieces = [{ x: 0, y: 0, w: 1, h: 1 }];
  let seed = count * 3.1 + 1;

  while (pieces.length < count) {
    /* One of the largest three, so no card is cut down to a crumb while
       another keeps half the screen. */
    const largest = [...pieces].sort((a, b) => b.w * b.h - a.w * a.h);
    const taken = largest[Math.floor(wobble(seed++) * Math.min(3, largest.length))];
    const at = pieces.indexOf(taken);

    const share = CUT_LEAST + (CUT_MOST - CUT_LEAST) * wobble(seed++);
    const across = taken.w * FIELD_SHAPE >= taken.h;

    pieces.splice(
      at,
      1,
      across
        ? { ...taken, w: taken.w * share }
        : { ...taken, h: taken.h * share },
      across
        ? {
          ...taken,
          x: taken.x + taken.w * share,
          w: taken.w * (1 - share),
        }
        : {
          ...taken,
          y: taken.y + taken.h * share,
          h: taken.h * (1 - share),
        }
    );
  }

  return pieces.map((piece, index) => {
    const seedForIt = index + 1;
    const across =
      CARD_LEAST + (CARD_MOST - CARD_LEAST) * wobble(seedForIt * 2.3);
    const down =
      CARD_LEAST + (CARD_MOST - CARD_LEAST) * wobble(seedForIt * 5.1);

    const width = piece.w * across;
    const height = piece.h * down;

    /* Where in its piece it settles - hard against one side, or anywhere in
       between - with a little kept clear whichever side it takes. */
    const roomX = Math.max(0, piece.w - width - piece.w * KEEP_CLEAR * 2);
    const roomY = Math.max(0, piece.h - height - piece.h * KEEP_CLEAR * 2);

    return {
      left: place(
        piece.x + piece.w * KEEP_CLEAR + roomX * wobble(seedForIt * 8.7)
      ),
      top: place(
        piece.y + piece.h * KEEP_CLEAR + roomY * wobble(seedForIt * 11.9)
      ),
      width: place(width),
      height: place(height),
    };
  });
}

const ORIGIN_X = 0.5;
const ORIGIN_Y = 1.05;
const EXIT_ORIGIN_Y = -0.05;
const CONVERGE = 0.3;
const SKEW = -16;

const RUNWAY_PER_PASS = 3.5;
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

const GRID_COLUMNS = 2;
const OPENING_ROWS = 3;
const OPENING_TILES = GRID_COLUMNS * OPENING_ROWS;
const TABLET_COLUMNS = 3;
const TABLET_OPENING = TABLET_COLUMNS * OPENING_ROWS;

function ShowcaseGroup({ company, opening = OPENING_TILES }) {
  const [openedAll, setOpenedAll] = useState(false);
  const shown = openedAll ? company.cards.length : opening;

  return (
    <li className="showcase-group">
      <h2 className="showcase-group-title">{company.label}</h2>

      <ul className="showcase-grid" aria-hidden="true">
        {company.cards.slice(0, shown).map((card) => (
          <li key={card.key} className="showcase-tile">
            <Image
              src={card.url}
              alt=""
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="h-full w-full object-cover"
            />
          </li>
        ))}
      </ul>

      {openedAll || company.cards.length <= opening ? null : (
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

export default function AboutShowcase({ content }) {
  /*
   * A pass for each company that is written, carrying the pictures written
   * with it - and the three the section ships with where nothing has been
   * written at all.
   */
  const written = content?.companies?.length ? content.companies : COMPANIES;
  const companies = written.map((company, index) => ({
    /* The key the studio gave it: two companies may end up sharing a name,
       and nothing else about one is unchanging. */
    id: company.id || company.name || `company-${index + 1}`,
    word: company.word || COMPANIES[index]?.word || company.name,
    label: company.name || company.label,
    cards: (company.gallery ?? [])
      .slice(0, CARDS_MOST)
      .map((picture, card) => ({
        key: `${picture.url}-${card}`,
        url: picture.url,
      })),
  }));

  const rootRef = useRef(null);
  const seekRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const isCompact = useIsCompact();
  const isTablet = useIsTablet();
  const animated = !prefersReducedMotion && !isCompact;

  const timelineEnd = passIn(companies.length - 1) + IN_SPAN;
  const runwayVh = companies.length * RUNWAY_PER_PASS;

  useGSAP(
    () => {
      if (!animated) return;

      const root = rootRef.current;
      if (!root) return;

      const pane = root.querySelector(".showcase-pane");
      const words = root.querySelectorAll(".showcase-word");
      const tabs = root.querySelectorAll(".showcase-tab");
      const index = root.querySelector(".showcase-index");
      const fields = Array.from(root.querySelectorAll(".showcase-field"));
      if (!pane || !index || !words.length || !tabs.length || !fields.length) {
        return;
      }

      let tl = null;
      let disposed = false;

      const build = () => {
        tl?.kill();

        const paneBox = pane.getBoundingClientRect();
        const originX = paneBox.left + paneBox.width * ORIGIN_X;
        const originY = paneBox.top + paneBox.height * ORIGIN_Y;
        const exitY = paneBox.top + paneBox.height * EXIT_ORIGIN_Y;

        /* Each field is measured where it lies, with the stagger read from its
           own furthest card - so a field of five opens as evenly as one of
           twenty rather than in a fraction of the time. */
        const passes = fields.map((field) => {
          /* A company whose pictures have not been uploaded yet has no cards
             at all: its pass carries the name across on its own. */
          const cards = Array.from(field.querySelectorAll(".showcase-card"));
          if (cards.length) gsap.set(cards, { x: 0, y: 0, scale: 1, skewX: 0 });

          const items = cards.map((card) => {
            const box = card.getBoundingClientRect();
            const cardX = box.left + box.width / 2;
            const cardY = box.top + box.height / 2;
            const dx = cardX - originX;
            const dy = cardY - originY;
            const ey = cardY - exitY;

            return {
              card,
              inX: -dx * (1 - CONVERGE),
              inY: -dy * (1 - CONVERGE),
              outX: -dx * (1 - CONVERGE),
              outY: -ey * (1 - CONVERGE),
              entering: Math.hypot(dx, dy),
              leaving: Math.hypot(dx, ey),
            };
          });

          return {
            items,
            furthestIn:
              items.reduce((most, item) => Math.max(most, item.entering), 0) ||
              1,
            furthestOut:
              items.reduce((most, item) => Math.max(most, item.leaving), 0) ||
              1,
          };
        });

        gsap.set(words, { autoAlpha: 0 });
        gsap.set(tabs, { opacity: TAB_DIM });
        gsap.set(index, { autoAlpha: 0 });

        tl = gsap.timeline({ paused: true });
        tl.to(
          index,
          { autoAlpha: 1, duration: TITLE_IN, ease: "power2.out" },
          TITLE_AT
        );

        companies.forEach((_, pass) => {
          const last = pass === companies.length - 1;
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

          const { items, furthestIn, furthestOut } = passes[pass];

          items.forEach((item) => {
            const { card, inX, inY, outX, outY } = item;

            gsap.set(card, {
              autoAlpha: 0,
              x: inX,
              y: inY,
              scale: CONVERGE,
              skewX: SKEW,
            });

            const at =
              passIn(pass) + (item.entering / furthestIn) * CARDS_SPREAD;

            tl.to(
              card,
              {
                x: 0,
                y: 0,
                scale: 1,
                skewX: 0,
                duration: CARDS_IN,
                ease: "power3.out",
              },
              at
            ).to(
              card,
              { autoAlpha: 1, duration: CARDS_IN * 0.4, ease: "power1.out" },
              at
            );

            if (last) return;

            const leaves =
              passOut(pass) + (item.leaving / furthestOut) * OUT_SPREAD;

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

        tl.to({}, { duration: 0 }, timelineEnd);
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

    { dependencies: [animated, companies.length], revertOnUpdate: true }
  );

  if (isCompact) {
    return (
      <section className="about-showcase relative z-10 bg-black text-white">
        <ul className="showcase-groups">
          {companies.map((company) => (
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

  const names = animated ? companies : companies.slice(0, 1);

  return (
    <section
      ref={rootRef}
      aria-labelledby="showcase-heading"
      className="relative z-10 bg-black text-white"
      style={animated ? { height: `${runwayVh * 100}vh` } : undefined}
    >
      <div
        className={`showcase-pane relative h-svh overflow-hidden ${animated ? "sticky top-0" : ""
          }`}
      >
        {names.map((company) => (
          <ul
            key={company.id}
            className="showcase-field absolute inset-0"
            aria-hidden="true"
          >
            {fieldFor(company.cards.length).map((cell, cardIndex) => {
              const card = company.cards[cardIndex];

              return (
                <li
                  key={card.key}
                  style={{
                    left: cell.left,
                    top: cell.top,
                    width: cell.width,
                    height: cell.height,
                  }}
                  className="absolute"
                >
                  <div
                    className={`showcase-card absolute inset-0 overflow-hidden will-change-transform ${animated ? "invisible" : ""
                      }`}
                  >
                    {/* The picture as it was uploaded: a card can take half
                        the screen, and these are what the field is for. */}
                    <Image
                      src={card.url}
                      alt=""
                      fill
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        ))}

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
          {companies.map((company, tabIndex) => (
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
