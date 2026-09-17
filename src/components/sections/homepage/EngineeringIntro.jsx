"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import MaskedWords from "@/components/ui/MaskedWords";
import useReducedMotion from "@/hooks/useReducedMotion";
import driveOnScroll from "@/lib/scrub";

const PARTS = [
  {
    id: "title",
    lines: ["Mobile industrial machinery for", "advanced construction", "material applications"],
    size: "text-[clamp(1.75rem,4.6vw,5rem)]",
    measure: "mx-auto max-w-[24ch]",
  },
  {
    id: "what",
    lines: [
      "FIGLMUELLER builds mobile mixing machinery, automated production systems, and software-controlled equipment for construction and infrastructure sites.",
    ],
    size: "text-[clamp(1.35rem,2.9vw,3.1rem)]",
    measure: "mx-auto max-w-[30ch]",
  },
  {
    id: "experience",
    lines: [
      "Decades of engineering experience. Mechanical design, automation, process control, real field knowledge",
    ],
    size: "text-[clamp(1.35rem,2.9vw,3.1rem)]",
    measure: "mx-auto max-w-[30ch]",
  },
  {
    id: "closer",
    /* Two lines in the markup and one on screen: the rows are run together
       into a single line here and only allowed to fall apart on a phone, where
       the sentence is set large enough to need both. */
    lines: ["All in", "one place."],
    size:
      "text-[8.26vw] whitespace-nowrap [&>span]:inline [&>span:first-child]:mr-[0.24em]",
    measure: "w-screen max-w-none ml-[calc(50%-50vw)]",
  },
];

const HIDDEN_SHIFT = 140;

const IN = 2;
const HOLD = 1.4;
const OUT = 1.6;
const GAP = 0.5;
const TAIL = 1.5;

const slots = PARTS.map((_, index) => {
  const start = index * (IN + HOLD + OUT + GAP);
  return { start, exit: start + IN + HOLD };
});
const TIMELINE_END =
  slots[slots.length - 1].start + IN + HOLD + TAIL;

const START_VH = 0.5;
const SCRUB = 0.055;

export default function EngineeringIntro() {
  const rootRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;

  useGSAP(
    () => {
      if (!animated) return;

      const root = rootRef.current;
      if (!root) return;

      const words = PARTS.map((part) =>
        root.querySelectorAll(`.part-${part.id} .reveal-word`)
      );

      words.forEach((set) => gsap.set(set, { y: 0, yPercent: HIDDEN_SHIFT }));

      const tl = gsap.timeline({ paused: true });

      words.forEach((set, index) => {
        const { start, exit } = slots[index];
        const isLast = index === PARTS.length - 1;

        tl.to(
          set,
          { yPercent: 0, duration: IN, ease: "expo.out", stagger: 0.055 },
          start
        );

        if (!isLast) {
          tl.to(
            set,
            {
              yPercent: -HIDDEN_SHIFT,
              duration: OUT,
              ease: "power3.in",
              stagger: 0.045,
            },
            exit
          );
        }
      });

      tl.to({}, { duration: TAIL }, TIMELINE_END - TAIL);

      const scrollProgress = () => {
        const viewport = window.innerHeight;
        const start = viewport * START_VH;
        const end = root.getBoundingClientRect().height;
        return gsap.utils.clamp(0, 1, (window.scrollY - start) / (end - start));
      };

      const scrub = driveOnScroll({
        root: root,
        progress: scrollProgress,
        apply: (value) => tl.progress(value),
        ease: SCRUB,
      });

      return () => {
        scrub.stop();
        tl.kill();
      };
    },
    { dependencies: [animated] }
  );

  const partClassName = animated
    ? "col-start-1 row-start-1 block"
    : "block";

  const wordClassName = animated
    ? "reveal-word [transform:translateY(140%)]"
    : "reveal-word";

  return (
    <section
      ref={rootRef}
      id="engineering"
      aria-labelledby="engineering-heading"
      className="engineering-intro relative z-10 bg-bone text-black [--runway:5.6]"
    >
      <div className={animated ? "h-[calc(var(--runway)*100vh)]" : undefined}>
        <div
          className={
            animated
              ? "sticky top-0 flex h-svh items-center overflow-x-clip"
              : "flex items-center overflow-x-clip py-32 md:py-44"
          }
        >
          <div className="mx-auto w-full max-w-400 px-6 md:px-12">
            <h2
              id="engineering-heading"
              className={`text-center font-display font-medium uppercase leading-[0.94] tracking-[-0.02em] ${animated ? "grid" : "space-y-[0.3em]"
                }`}
            >
              {PARTS.map((part) => (
                <span
                  key={part.id}
                  className={`part-${part.id} ${partClassName} ${part.measure} ${part.size}`}
                >
                  {part.lines.map((line) => (
                    <span key={line} className="block">
                      <MaskedWords text={line} wordClassName={wordClassName} />
                    </span>
                  ))}
                </span>
              ))}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
