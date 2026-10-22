"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useReducedMotion from "@/hooks/useReducedMotion";
import { ARRIVAL_MS, arrivedByNavigation } from "@/lib/arrival";
import { getLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

/*
 * A legal page: the title held on its own screen, and under it the clauses
 * read beside an index that follows the reader down.
 *
 * It is a page of type rather than a timeline, so nothing here is scrubbed: a
 * clause is set where it is and lifted in once as it is reached, and the index
 * marks where in the page the reader has got to. A reader who has asked for
 * less movement gets the same page, set still.
 */
const JUMP_SHARE = 0.16; /* of the screen, kept clear above a clause */
const JUMP_SECONDS = 1;
const HERE_LINE = 45; /* per cent down the screen, where the reader is */

const TITLE_IN = 1.2;
const TITLE_STEP = 0.08;
const META_IN = 1;
const CLAUSE_IN = 0.9;
const CLAUSE_FROM = 36;
const SETTLED_MS = 120;

const slugOf = (heading) =>
  String(heading)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/* Each clause is reached by its own name, so a clause can be linked to. Two
   with the same name are told apart by their number. */
const named = (clauses) => {
  const taken = new Set();

  return clauses.map((clause, index) => {
    const from = slugOf(clause.heading || "") || `clause-${index + 1}`;
    const id = taken.has(from) ? `${from}-${index + 1}` : from;
    taken.add(id);

    return { ...clause, id, number: String(index + 1).padStart(2, "0") };
  });
};

/* A new line starts a new paragraph; nothing else is read as markup. */
const paragraphsOf = (body) =>
  String(body ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const readDate = (value) => {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

export default function LegalPage({ content }) {
  const clauses = named(content?.clauses ?? []);
  const eyebrow = content?.eyebrow || "Legal";
  const heading = content?.heading || "";
  const lead = content?.lead || "";
  const indexLabel = content?.indexLabel || "On this page";
  const updated = readDate(content?.updated);

  const rootRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;

  const pathname = usePathname();
  const [navigated] = useState(() => arrivedByNavigation(pathname));
  const [here, setHere] = useState(0);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const sections = Array.from(root.querySelectorAll(".legal-clause"));

      /* Where the reader has got to, marked in the index: the clause crossing
         a line drawn across the middle of the screen is the one being read.
         The line is the observer's own box, flattened to nothing. */
      const watcher = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const at = sections.indexOf(entry.target);
            if (at >= 0) setHere(at);
          });
        },
        { rootMargin: `${-HERE_LINE}% 0px ${HERE_LINE - 100}% 0px` }
      );

      sections.forEach((section) => watcher.observe(section));

      let timer = 0;

      if (animated) {
        const rows = root.querySelectorAll(".legal-title-row");
        const meta = root.querySelectorAll(".legal-meta");

        /* `y: 0` as well as the percentage: the rows carry a translate of
           their own in the markup, and GSAP folds it into its transform. */
        gsap.set(rows, { y: 0, yPercent: 110 });
        gsap.set(meta, { autoAlpha: 0, y: 24 });

        const start = () => {
          gsap.to(rows, {
            yPercent: 0,
            duration: TITLE_IN,
            ease: "power3.out",
            stagger: TITLE_STEP,
          });

          gsap.to(meta, {
            autoAlpha: 1,
            y: 0,
            duration: META_IN,
            ease: "power2.out",
            stagger: TITLE_STEP,
            delay: TITLE_STEP * 2,
          });
        };

        /* Held until the page has finished sliding in, where it was arrived
           at from another page. */
        timer = window.setTimeout(start, navigated ? ARRIVAL_MS : SETTLED_MS);

        sections.forEach((section) => {
          gsap.fromTo(
            section,
            { autoAlpha: 0, y: CLAUSE_FROM },
            {
              autoAlpha: 1,
              y: 0,
              duration: CLAUSE_IN,
              ease: "power2.out",
              scrollTrigger: { trigger: section, start: "top 88%", once: true },
            }
          );
        });
      }

      return () => {
        watcher.disconnect();
        window.clearTimeout(timer);
      };
    },
    { dependencies: [animated, clauses.length] }
  );

  const jump = (event, id) => {
    event.preventDefault();

    const target = document.getElementById(id);
    if (!target) return;

    const offset = -window.innerHeight * JUMP_SHARE;
    const lenis = getLenis();

    if (lenis) lenis.scrollTo(target, { offset, duration: JUMP_SECONDS });
    else window.scrollTo({ top: target.offsetTop + offset, behavior: "smooth" });

    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <article ref={rootRef} className="legal-page bg-bone text-black">
      <header className="legal-head px-[3vw] pb-[10vh] pt-[26svh]">
        <p className="legal-eyebrow legal-meta font-display text-[clamp(0.7rem,0.85vw,1rem)] font-medium uppercase tracking-[0.12em] text-black/50">
          {eyebrow}
        </p>

        <h1 className="legal-title mt-[3vh] font-display text-[clamp(2.4rem,7.5vw,9rem)] font-semibold uppercase leading-[0.92] tracking-[-0.035em]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span
              className={`legal-title-row block will-change-transform ${animated ? "translate-y-full" : ""
                }`}
            >
              {heading}
            </span>
          </span>
        </h1>

        {lead ? (
          <p className="legal-lead legal-meta mt-[5vh] max-w-[52ch] text-[clamp(0.95rem,1.25vw,1.45rem)] leading-[1.6] text-black/70">
            {lead}
          </p>
        ) : null}

        {updated ? (
          <p className="legal-updated legal-meta mt-[4vh] font-display text-[clamp(0.68rem,0.8vw,0.9rem)] font-medium uppercase tracking-[0.12em] text-black/45">
            Last updated {updated}
          </p>
        ) : null}
      </header>

      <div className="legal-body grid grid-cols-[minmax(0,15vw)_minmax(0,1fr)] gap-[6vw] px-[3vw] pb-[18vh]">
        <nav
          aria-label={indexLabel}
          className="legal-index sticky top-[18svh] self-start"
        >
          <p className="legal-index-label font-display text-[clamp(0.62rem,0.72vw,0.82rem)] font-medium uppercase tracking-[0.14em] text-black/40">
            {indexLabel}
          </p>

          <ol className="legal-index-list mt-[2.5vh] flex flex-col gap-[1.4vh]">
            {clauses.map((clause, index) => (
              <li key={clause.id}>
                <a
                  href={`#${clause.id}`}
                  onClick={(event) => jump(event, clause.id)}
                  aria-current={index === here ? "true" : undefined}
                  className={`legal-index-link block cursor-pointer font-display text-[clamp(0.68rem,0.8vw,0.92rem)] font-medium uppercase leading-[1.35] tracking-[0.04em] transition-colors duration-500 hover:text-black ${index === here ? "text-black" : "text-black/35"
                    }`}
                >
                  <span className="legal-index-number mr-2 tabular-nums text-black/30">
                    {clause.number}
                  </span>
                  {clause.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="legal-reading flex flex-col gap-[10vh]">
          {clauses.map((clause) => (
            <section
              key={clause.id}
              id={clause.id}
              className="legal-clause scroll-mt-[18svh]"
            >
              <h2 className="legal-clause-heading flex gap-[1.5vw] font-display text-[clamp(1.25rem,2.2vw,2.6rem)] font-medium uppercase leading-[1.12] tracking-[-0.02em]">
                <span className="legal-clause-number pt-[0.45em] text-[0.42em] tabular-nums tracking-[0.1em] text-black/35">
                  {clause.number}
                </span>

                <span className="max-w-[22ch] flex-1">{clause.heading}</span>
              </h2>

              <div className="legal-clause-body mt-[3.5vh] flex flex-col gap-[2.4vh]">
                {paragraphsOf(clause.body).map((paragraph) => (
                  <p
                    key={paragraph}
                    className="legal-text max-w-[70ch] text-[clamp(0.9rem,1.02vw,1.2rem)] leading-[1.75] text-black/70"
                  >
                    {paragraph}
                  </p>
                ))}

                {clause.points?.length ? (
                  <ul className="legal-points mt-[1vh] flex max-w-[70ch] flex-col gap-[1.4vh]">
                    {clause.points.map((point) => (
                      <li
                        key={point}
                        className="legal-point flex gap-[1.2vw] text-[clamp(0.9rem,1.02vw,1.2rem)] leading-[1.6] text-black/70"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.75em] h-px w-[1.6vw] shrink-0 bg-black/30"
                        />
                        <span className="flex-1">{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
