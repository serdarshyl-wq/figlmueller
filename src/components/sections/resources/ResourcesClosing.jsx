"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";
import LetsTalkButton from "@/components/layout/LetsTalkButton";
import driveOnScroll, { afterFonts } from "@/lib/scrub";

const LINES = ["Couldn't find the specifications", "you need?"];
const WORD = "Figlmueller";

const PROBE_PX = 200;
const WORD_FILL = 0.98;

const SCRUB = 0.1;

const COMPACT_MAX = 1279;

const LINE_AT = 0.2;
const LINE_IN = 1.4;
const LINE_STEP = 0.18;

const CTA_AT = LINE_AT + LINE_STEP * (LINES.length - 1) + 0.75;
const CTA_IN = 1;

const WORD_AT = 1.5;
const WORD_IN = 2.3;

const TIMELINE_END = Math.max(WORD_AT + WORD_IN, CTA_AT + CTA_IN);

export default function ResourcesClosing() {
  const rootRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;

  useGSAP(
    () => {
      if (!animated) return;

      const root = rootRef.current;
      if (!root) return;

      const pane = root.querySelector(".closing-pane");
      const lines = Array.from(root.querySelectorAll(".closing-line"));
      const cta = root.querySelector(".closing-cta");
      const word = root.querySelector(".closing-word");
      if (!pane || !lines.length || !cta || !word) return;

      let tl = null;
      let disposed = false;

      const footer = document.querySelector("footer");
      const fitPane = () => {
        const taken = footer ? footer.getBoundingClientRect().height : 0;
        pane.style.height = `calc(100svh - ${taken}px)`;
      };

      const build = () => {
        tl?.kill();
        fitPane();

        if (window.innerWidth <= COMPACT_MAX) {

          gsap.set([lines, word], { y: 0, yPercent: 0, clearProps: "transform" });
          gsap.set(cta, { y: 0, yPercent: 0, autoAlpha: 1 });
          word.style.fontSize = "";

          tl = gsap.timeline({ paused: true });
          tl.to({}, { duration: 0 }, TIMELINE_END);
          return;
        }

        gsap.set(lines, { y: 0, yPercent: 110 });
        gsap.set(word, { y: 0, yPercent: 110 });
        gsap.set(cta, { y: 0, yPercent: 60, autoAlpha: 0 });

        word.style.fontSize = `${PROBE_PX}px`;
        const probed = word.getBoundingClientRect().width;
        if (probed) {
          word.style.fontSize = `${PROBE_PX * ((pane.clientWidth * WORD_FILL) / probed)
            }px`;
        }

        tl = gsap.timeline({ paused: true });

        lines.forEach((line, index) => {
          tl.to(
            line,
            { yPercent: 0, duration: LINE_IN, ease: "power3.out" },
            LINE_AT + index * LINE_STEP
          );
        });

        tl.to(
          cta,
          { yPercent: 0, autoAlpha: 1, duration: CTA_IN, ease: "power2.out" },
          CTA_AT
        ).to(
          word,
          { yPercent: 0, duration: WORD_IN, ease: "power3.out" },
          WORD_AT
        );

        tl.to({}, { duration: 0 }, TIMELINE_END);
      };

      build();

      const clamp01 = gsap.utils.clamp(0, 1);

      const scrollProgress = () => {
        const rect = root.getBoundingClientRect();
        const travel = rect.height - pane.getBoundingClientRect().height;
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

      const watcher = footer ? new ResizeObserver(rebuild) : null;
      if (footer) watcher.observe(footer);

      return () => {
        disposed = true;
        scrub.stop();
        window.removeEventListener("resize", rebuild);
        watcher?.disconnect();
        tl?.kill();
      };
    },
    { dependencies: [animated] }
  );

  return (
    <section
      ref={rootRef}
      id="resources-closing"
      aria-labelledby="resources-closing-heading"

      className={`resources-closing relative bg-black text-white [--runway:3.5] ${animated ? "h-[calc(var(--runway)*100vh)]" : ""
        }`}
    >
      <div
        className={`closing-pane relative w-full overflow-hidden bg-black ${animated ? "sticky top-0 h-svh" : "h-svh"
          }`}
      >
        <div className="closing-stack flex h-full flex-col items-center justify-center">
          <div className="flex flex-col items-center px-[4vw] text-center">
            <h2
              id="resources-closing-heading"
              className="closing-question font-display text-[clamp(1.5rem,4vw,4.75rem)] font-semibold uppercase leading-[1.06] tracking-[-0.03em] text-white"
            >
              {LINES.map((line) => (

                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <span
                    className={`closing-line block will-change-transform ${animated ? "translate-y-[110%]" : ""
                      }`}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h2>

            <div
              className={`closing-cta mt-[5vh] will-change-transform ${animated ? "invisible" : ""
                }`}
            >
              <LetsTalkButton />
            </div>
          </div>

          <p className="closing-name w-full overflow-hidden px-[1vw] pt-[5vh]">
            <span
              className={`closing-word block whitespace-nowrap text-center font-display text-[13vw] font-bold uppercase leading-[0.82] tracking-[0.015em] text-white will-change-transform ${animated ? "translate-y-[110%]" : ""
                }`}
            >
              {WORD}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
