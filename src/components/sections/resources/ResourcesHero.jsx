"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";
import { ARRIVAL_MS, arrivedByNavigation } from "@/lib/arrival";
import { filmSources, shippedSource } from "@/lib/film";
import driveOnScroll, { afterFonts } from "@/lib/scrub";

/*
 * What the screen ships with, and what it falls back to: a statement is a row
 * or two of type, and the studio writes one as a line or two of text.
 */
const FALLBACK = {
  video: "/resources-assets/resources-dummy-video.mp4",
  poster: "/resources-assets/resources-first-frame.jpg",
  statements: [
    ["Built for", "contractors"],
    ["consultants"],
    ["partners"],
    ["and", "technical visitors"],
  ],
  stackRows: ["Technical", "Resources", "and Media"],
};

const ROWS_MOST = 2;
const rowsOf = (statement) =>
  String(statement)
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean)
    .slice(0, ROWS_MOST);

const PLAY_BY_MS = 1500;
const PLAY_AFTER_MS = 900;

const STACK_OFFSET_CHARS = 2;
const SCRUB = 0.1;
const COMPACT_MAX = 1279;
const LINE_AT = 0.4;
const LINE_IN = 1.4;
const LINE_OUT = 1.4;
const LINE_STEP = 2;
const LINE_LEAD = 0.5;
const CLEAR_AFTER = 0.8;
const ROW_LEAD = 0.4;
const ROW_PASS = 6;
const PLATE_IN = 2.3;
const PHONE_RISE = 4;
const PHONE_HOLD = 2.8;
const PROBE_PX = 200;
const STATEMENT_FILL = 1;
const STATEMENT_MAX = 0.21;
const BEHIND = [
  { opacity: 0.45, blur: 7 },
  { opacity: 0.2, blur: 14 },
];
const BEHIND_IN = 1.2;
const BEHIND_AT = ROW_PASS * 0.3;

export default function ResourcesHero({ content }) {
  /* Written in the studio, or what the screen ships with. */
  /* Every file of the film, in the order the browser is offered them: the tall
     cut first and taken only by a screen taller than it is wide, each cut as
     WebM before MP4. Nothing uploaded is the film the screen ships with. */
  const written = filmSources(content?.video);
  const film = written.length ? written : shippedSource(FALLBACK.video);
  const poster = content?.poster?.url || FALLBACK.poster;

  const statements = content?.statements?.length
    ? content.statements.map(rowsOf)
    : FALLBACK.statements;
  const stackRows = content?.stackRows?.length
    ? content.stackRows
    : FALLBACK.stackRows;

  /* The widest row and the deepest statement: the heading is held open to
     them, so the ones read in after it do not move the screen. */
  const widest = statements
    .flat()
    .reduce((most, row) => (row.length > most.length ? row : most), "");
  const tallest = statements.reduce(
    (most, rows) => Math.max(most, rows.length),
    1
  );

  /* The timeline is as long as there are statements to read in. */
  const clearAt =
    LINE_AT + LINE_STEP * (statements.length - 1) + LINE_IN + CLEAR_AFTER;
  const rowsAt = clearAt + ROW_LEAD;

  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;

  const pathname = usePathname();

  const [navigated] = useState(() => arrivedByNavigation(pathname));

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const start = () => {

      video.play().catch(() => { });
    };

    if (navigated) {
      const timer = window.setTimeout(start, ARRIVAL_MS);
      return () => window.clearTimeout(timer);
    }

    const idle = window.requestIdleCallback;
    const handle = idle
      ? idle(start, { timeout: PLAY_BY_MS })
      : window.setTimeout(start, PLAY_AFTER_MS);

    return () => {
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [navigated]);

  useGSAP(
    () => {
      if (!animated) return;

      const root = rootRef.current;
      if (!root) return;

      const pane = root.querySelector(".resources-pane");
      const lines = Array.from(root.querySelectorAll(".resources-line"));
      const plate = root.querySelector(".resources-plate");
      const stack = root.querySelector(".resources-stack");
      const rows = Array.from(root.querySelectorAll(".resources-row"));
      const measures = Array.from(root.querySelectorAll(".resources-measure"));
      if (!pane || !lines.length || !plate || !stack || !rows.length) return;

      const heading = root.querySelector(".resources-statements");
      const range = document.createRange();
      const fitStatements = (compact) => {
        if (!heading) return;

        if (!compact) {
          heading.style.height = "";
          heading.querySelectorAll(".resources-line span").forEach((row) => {
            row.style.fontSize = "";
          });
          return;
        }

        const room = heading.clientWidth * STATEMENT_FILL;
        let tallest = 0;

        lines.forEach((line) => {
          let stacked = 0;

          line.querySelectorAll("span").forEach((row) => {
            row.style.fontSize = `${PROBE_PX}px`;
            range.selectNodeContents(row);
            const probed = range.getBoundingClientRect().width;
            if (!probed) return;

            const fitted = PROBE_PX * (room / probed);
            row.style.fontSize = `${Math.min(fitted, room * STATEMENT_MAX)}px`;
            stacked += row.getBoundingClientRect().height;
          });

          tallest = Math.max(tallest, stacked);
        });

        if (tallest) heading.style.height = `${Math.ceil(tallest)}px`;
      };

      let tl = null;
      let disposed = false;

      const build = () => {
        tl?.kill();

        const compact = window.innerWidth <= COMPACT_MAX;
        fitStatements(compact);

        gsap.set(lines, { y: 0, yPercent: 100 });
        if (compact) gsap.set(lines[0], { yPercent: 0 });
        gsap.set(rows, { x: 0, opacity: 1, filter: "blur(0px)" });

        gsap.set(plate, {
          autoAlpha: compact ? 1 : 0,
          yPercent: compact ? 100 : 0,
        });
        gsap.set(stack, { yPercent: compact ? 100 : 0 });

        let steps = [];
        let paneBox = null;
        let boxes = [];
        let crossings = [];
        let speed = 1;
        let rowAt = [];

        if (!compact) {

          steps = measures.map(
            (measure) => measure.getBoundingClientRect().width
          );

          paneBox = pane.getBoundingClientRect();
          boxes = rows.map((row) => row.getBoundingClientRect());
          rows.forEach((row, index) => {
            gsap.set(row, { x: paneBox.right - boxes[index].left });
          });

          crossings = boxes.map((box) => paneBox.width + box.width);
          speed = Math.max(...crossings) / ROW_PASS;

          let behindBy = 0;
          rowAt = rows.map((_, index) => {
            if (index > 0) behindBy += steps[index - 1] ?? 0;
            return rowsAt + behindBy / speed;
          });
        }

        tl = gsap.timeline({ paused: true });

        lines.forEach((line, index) => {
          const at = LINE_AT + index * LINE_STEP;
          const last = index === lines.length - 1;

          if (!(compact && index === 0)) {
            tl.to(
              line,
              { yPercent: 0, duration: LINE_IN, ease: "power2.out" },
              at
            );
          }

          tl.to(
            line,
            { yPercent: -100, duration: LINE_OUT, ease: "power2.inOut" },
            last ? clearAt : at + LINE_STEP - LINE_LEAD
          );
        });

        if (compact) {

          tl.to(
            [plate, stack],
            { yPercent: 0, duration: PHONE_RISE, ease: "none" },
            clearAt
          ).to({}, { duration: 0 }, clearAt + PHONE_RISE + PHONE_HOLD);

          return;
        }

        tl.to(
          plate,
          { autoAlpha: 1, duration: PLATE_IN, ease: "power2.inOut" },
          clearAt
        );

        rows.forEach((row, index) => {
          const at = rowAt[index];

          tl.to(
            row,
            {
              x: -(boxes[index].right - paneBox.left),
              duration: crossings[index] / speed,
              ease: "none",
            },
            at
          );

          for (let behind = 0; behind < index; behind += 1) {
            const step = BEHIND[Math.min(index - behind, BEHIND.length) - 1];

            tl.to(
              rows[behind],
              {
                opacity: step.opacity,
                filter: `blur(${step.blur}px)`,
                duration: BEHIND_IN,
                ease: "power2.out",
              },
              at + BEHIND_AT
            );
          }
        });


        const end = Math.max(
          ...rowAt.map((at, index) => at + crossings[index] / speed)
        );
        tl.to({}, { duration: 0 }, end);
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
      afterFonts(rebuild);

      return () => {
        disposed = true;
        scrub.stop();
        window.removeEventListener("resize", rebuild);
        tl?.kill();
      };
    },
    { dependencies: [animated, statements.length, stackRows.length] }
  );

  return (
    <section
      ref={rootRef}
      data-nav-dark=""
      aria-labelledby="resources-heading"

      className={`resources-hero relative bg-black text-white [--runway:14] ${animated ? "h-[calc(var(--runway)*100vh)]" : ""
        }`}
    >
      <div
        className={`resources-pane relative h-svh w-full overflow-hidden ${animated ? "sticky top-0" : ""
          }`}
      >

        {/* The browser takes the first source it can both match and read. */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster={poster}
          loop
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        >
          {film.map((source) => (
            <source
              key={`${source.url}-${source.media ?? ""}`}
              src={source.url}
              type={source.type}
              media={source.media}
            />
          ))}
        </video>

        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"
          aria-hidden="true"
        />


        <div
          className={`resources-plate pointer-events-none absolute inset-0 z-5 bg-[#171616] ${animated ? "invisible" : ""
            }`}
          aria-hidden="true"
        />

        <div className="resources-slot absolute inset-x-0 bottom-[18svh] z-10 px-[3vw]">
          <h1
            id="resources-heading"
            className="resources-statements relative text-center font-display text-[clamp(1.75rem,7vw,10rem)] font-semibold uppercase leading-[1.04] tracking-[-0.03em]"
          >
            {Array.from({ length: tallest }).map((_, row) => (
              <span
                key={row}
                aria-hidden="true"
                className="invisible block whitespace-nowrap"
              >
                {widest}
              </span>
            ))}

            {statements.map((rows) => (
              <span
                key={rows.join(" ")}
                className="absolute inset-0 block overflow-hidden"
              >
                <span
                  className={`resources-line flex h-full flex-col items-center justify-center whitespace-nowrap will-change-transform ${animated ? "translate-y-full" : ""
                    }`}
                >
                  {rows.map((row) => (
                    <span key={row} className="block">
                      {row}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>
        </div>

        <div className="resources-stack pointer-events-none absolute inset-0 z-20 flex flex-col justify-center overflow-hidden px-[3vw]">
          <h2 className="resources-stack-rows relative font-display text-[10vw] font-bold uppercase leading-[0.82] tracking-[-0.035em]">

            <span
              aria-hidden="true"
              className="invisible absolute left-0 top-0 whitespace-pre"
            >
              {stackRows.map((row) => (

                <span key={row} className="resources-measure inline-block">
                  {row.slice(0, STACK_OFFSET_CHARS)}
                </span>
              ))}
            </span>

            {stackRows.map((row) => (
              <span
                key={row}
                className="resources-row block whitespace-nowrap will-change-transform"
              >
                {row}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}
