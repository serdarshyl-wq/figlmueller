"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";
import driveOnScroll, { afterFonts } from "@/lib/scrub";

const HEADING = ["Founder &", "Engineering background"];
const LEFT_LABEL = "+30 Years";
const RIGHT_LABEL = "Expertise";

const IMAGE_SIZE = { width: 2752, height: 1536 };


const BLOCKS = [
  {
    id: "intro",
    image: "/about-img/about-founder-dummy1.jpeg",
    paragraphs: [
      [
        "Civil Engineer.",
        "Master's in Construction Management.",
        "30+ years in infrastructure development — civil engineering, urban planning, geotechnical works, earthworks, project management.",
      ],
      ["Complex infrastructure projects delivered across Germany and the UAE."],
    ],
  },
  {
    id: "germany",
    title: "Germany",
    image: "/about-img/about-founder-dummy2.jpeg",
    paragraphs: [
      [
        "10+ years in Frankfurt am Main's municipal utility sector.",
        "District heating.",
        "Water supply.",
        "Wastewater.",
        "Gas pipelines.",
      ],
      [
        "Later led the modernization of Frankfurt's electrical distribution network.",
      ],
    ],
  },
  {
    id: "uae",
    title: "UAE",
    image: "/about-img/about-founder-dummy3.jpeg",
    paragraphs: [
      [
        "Recent years dedicated to material innovation.",
        "This work led to FillWaves® — a proprietary Temporarily Flowable Self-Compacting Backfill Material for civil engineering and underground infrastructure.",
      ],
      [
        "To produce it, he also designed the machine built specifically for it — Citrine®.",
      ],
    ],
  },
  {
    id: "vision",
    title: "Engineering Vision",
    image: "/about-img/about-founder-dummy4.jpeg",
    paragraphs: [
      [
        "Decades of expertise.",
        "New technology.",
        "Smarter, more sustainable, more cost-effective infrastructure solutions.",
      ],
      [
        "Through FIGLMUELLER, that vision becomes machinery, automation, and industrial systems.",
      ],
    ],
  },
];

const sentenceCount = (block) =>
  block.paragraphs.reduce((total, paragraph) => total + paragraph.length, 0);

const RUNWAY_VH = 5.2;
const SCRUB = 0.1;

const FIRST_BLOCK_AT = 0.2;
const HEADING_IN = 1;

const LINE_AT = 0.35;
const LINE_IN = 1;
const LINE_STEP = 0.3;
const IMAGE_FADE = 1;

const BLOCK_OVERLAP = 0.4;

const blockSpan = (block) =>
  (block.title ? LINE_AT : 0) +
  (sentenceCount(block) - 1) * LINE_STEP +
  LINE_IN;

/*
 * Where each chapter starts: a chapter takes as long as its sentences take to
 * be read out, and the next one is started a little before it ends. The timing
 * is measured from the writing rather than written down, so a chapter that
 * gains a sentence simply takes longer.
 */
const startsFor = (blocks) =>
  blocks.reduce(
    (starts, block, index) =>
      index === 0
        ? [FIRST_BLOCK_AT]
        : [
          ...starts,
          starts[index - 1] + blockSpan(blocks[index - 1]) - BLOCK_OVERLAP,
        ],
    []
  );

export default function AboutFounder({ content }) {
  const heading = content?.headingLines?.length
    ? content.headingLines
    : HEADING;
  const leftLabel = content?.leftLabel || LEFT_LABEL;
  const rightLabel = content?.rightLabel || RIGHT_LABEL;

  /* The chapters as they are written, each one read over the chapter the page
     ships with: the shipped list carries the names the timeline and the links
     into this section use, and the writing, the heading and the picture come
     from the studio. */
  const blocks = (content?.blocks?.length ? content.blocks : BLOCKS).map(
    (block, index) => ({
      id: BLOCKS[index]?.id ?? `block-${index + 1}`,
      title: block.title ?? BLOCKS[index]?.title,
      image: block.image?.url || block.image || BLOCKS[index]?.image,
      alt: block.alt || "",
      paragraphs:
        block.paragraphs
          ?.map((paragraph) => paragraph.sentences ?? paragraph)
          .filter((sentences) => sentences?.length) ??
        BLOCKS[index]?.paragraphs ??
        [],
    })
  );

  const blockAt = startsFor(blocks);
  const timelineEnd =
    blockAt[blocks.length - 1] + blockSpan(blocks[blocks.length - 1]);

  const rootRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;

  useGSAP(
    () => {
      if (!animated) return;

      const root = rootRef.current;
      if (!root) return;

      const pictures = root.querySelectorAll(".founder-picture");
      if (pictures.length !== blocks.length) return;

      let tl = null;
      let disposed = false;

      const build = () => {
        tl?.kill();

        gsap.set(pictures[0], { autoAlpha: 1 });
        gsap.set(Array.from(pictures).slice(1), { autoAlpha: 0 });

        tl = gsap.timeline({ paused: true });

        blocks.forEach((block, index) => {
          const at = blockAt[index];
          const title = root.querySelector(`[data-title="${block.id}"]`);
          const sentences = root.querySelectorAll(
            `[data-lines="${block.id}"] .founder-sentence`
          );

          if (index > 0) {
            tl.to(
              pictures[index],
              { autoAlpha: 1, duration: IMAGE_FADE, ease: "power2.inOut" },
              at
            ).to(
              pictures[index - 1],
              { autoAlpha: 0, duration: IMAGE_FADE, ease: "power2.inOut" },
              at
            );
          }

          if (title) {
            gsap.set(title, { y: 0, yPercent: 100 });
            tl.to(
              title,
              { yPercent: 0, duration: HEADING_IN, ease: "power3.out" },
              at
            );
          }

          gsap.set(sentences, { autoAlpha: 0 });
          tl.to(
            sentences,
            {
              autoAlpha: 1,
              duration: LINE_IN,
              stagger: LINE_STEP,
              ease: "power2.out",
            },
            at + (title ? LINE_AT : 0)
          );
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
      afterFonts(rebuild);

      return () => {
        disposed = true;
        scrub.stop();
        window.removeEventListener("resize", rebuild);
        tl?.kill();
      };
    },
    { dependencies: [animated] }
  );

  return (
    <section
      ref={rootRef}
      id="founder"
      aria-labelledby="founder-heading"
      className="relative z-10 bg-black text-white"
      style={animated ? { height: `${RUNWAY_VH * 100}vh` } : undefined}
    >
      <div

        className={`relative flex h-svh flex-col overflow-hidden px-[4vw] pb-[50svh] pt-[6svh] ${animated ? "sticky top-0" : ""
          }`}
      >
        <div className="flex items-start justify-between gap-6 font-display uppercase">
          <span className="text-[clamp(0.9rem,1.6vw,2rem)] font-medium tracking-[-0.01em]">
            {leftLabel}
          </span>

          <h2
            id="founder-heading"
            className="text-center text-[clamp(1.1rem,2.4vw,3rem)] font-medium leading-[1.08] tracking-[-0.02em]"
          >
            {heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <span className="text-[clamp(0.9rem,1.6vw,2rem)] font-medium tracking-[-0.01em]">
            {rightLabel}
          </span>
        </div>

        <div className="mt-[6svh] grid flex-1 grid-cols-1 items-stretch gap-[6vw] md:grid-cols-[54%_1fr]">
          <div className="relative h-full w-full overflow-hidden">
            {blocks.map((block, index) => (
              <Image
                key={block.id}
                src={block.image}
                alt={block.alt}
                aria-hidden="true"
                width={IMAGE_SIZE.width}
                height={IMAGE_SIZE.height}
                sizes="42vw"
                className={`founder-picture absolute inset-0 h-full w-full object-cover ${animated && index > 0 ? "invisible" : ""
                  } ${!animated && index > 0 ? "hidden" : ""}`}
              />
            ))}
          </div>

          <div className="flex flex-col gap-[3.5svh]">
            {blocks.map((block) => (
              <div key={block.id}>
                {block.title ? (
                  <h3
                    id={block.id === "vision" ? "engineering-vision" : undefined}
                    className="overflow-hidden font-display text-[clamp(0.85rem,1.05vw,1.25rem)] font-medium uppercase tracking-[0.04em]"
                  >
                    <span
                      data-title={block.id}
                      className={`block will-change-transform ${animated ? "translate-y-full" : ""
                        }`}
                    >
                      {block.title}
                    </span>
                  </h3>
                ) : null}

                <div
                  data-lines={block.id}
                  className={`text-[clamp(0.72rem,0.85vw,1rem)] leading-[1.55] text-white/70 ${block.title ? "mt-3" : ""
                    }`}
                >
                  {block.paragraphs.map((paragraph, paragraphIndex) => (
                    <p
                      key={paragraph[0]}
                      className={paragraphIndex > 0 ? "mt-3" : ""}
                    >
                      {paragraph.map((sentence) => (
                        <span
                          key={sentence}
                          className={`founder-sentence ${animated ? "invisible" : ""
                            }`}
                        >
                          {`${sentence} `}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
