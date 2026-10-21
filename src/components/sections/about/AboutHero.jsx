"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";
import driveOnScroll, { afterFonts } from "@/lib/scrub";

const IMAGE = {
  src: "/about-img/about-hero-dummy.jpeg",
  width: 2752,
  height: 1536,
  alt: "Figlmueller engineers in a concrete hall",
};

const HEADING = ["Industrial", "Engineering"];
const SUBTITLE = "For modern construction machinery";
const BODY = [
  "FIGLMUELLER is a UAE-based industrial engineering company. Mobile machinery, automated mixing systems, software-controlled equipment, custom technical solutions for construction.",
  "Built to support the future of construction material production — machinery that's mobile, accurate, reliable, site-ready.",
  "Engineering experience. Mechanical development. Automation. Process control. Practical infrastructure knowledge. One company, full capability.",
];


const TITLE_FILL_X = 0.92;
const TITLE_FILL_Y = 0.62;


const CLIP_CLOSED = "inset(0% 100% 0% 0%)";
const CLIP_OPEN = "inset(0% 0% 0% 0%)";
const PICTURE_FROM = 1.12;

const SCRUB = 0.1;

const PHONE_MAX = 767;

const PHONE_FILL_X = 0.98;

function fitLines(title, phone) {
  const lines = Array.from(title.children);

  if (!phone) {
    lines.forEach((line) => {
      line.style.fontSize = "";
    });
    return;
  }

  const holder = title.parentElement;
  const style = getComputedStyle(holder);
  const available =
    (holder.getBoundingClientRect().width -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight)) *
    PHONE_FILL_X;

  const range = document.createRange();

  lines.forEach((line) => {
    line.style.fontSize = "";
    range.selectNodeContents(line);
    const width = range.getBoundingClientRect().width;
    if (!width) return;

    const size = parseFloat(getComputedStyle(line).fontSize);
    line.style.fontSize = `${(size * available) / width}px`;
  });
}

const TITLE_DURATION = 6;
const REVEAL_AT = 2.4;
const REVEAL_DURATION = 3.6;
const COPY_AT = 5;
const COPY_IN = 1.4;
const COPY_STEP = 0.3;
const TIMELINE_END = 8.5;

export default function AboutHero({ content }) {
  const heading = content?.headingLines?.length
    ? content.headingLines
    : HEADING;
  const subtitle = content?.subtitle || SUBTITLE;
  const body = content?.body?.length ? content.body : BODY;
  const image = {
    src: content?.image?.url || IMAGE.src,
    width: content?.image?.width || IMAGE.width,
    height: content?.image?.height || IMAGE.height,
    alt: content?.imageAlt || IMAGE.alt,
  };

  const rootRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;

  useGSAP(
    () => {
      if (!animated) return;

      const root = rootRef.current;
      if (!root) return;

      const pane = root.querySelector(".hero-pane");
      const frame = root.querySelector(".hero-frame");
      const picture = root.querySelector(".hero-picture");
      const title = root.querySelector(".hero-title");
      const copy = root.querySelectorAll(".hero-copy-part");
      if (!pane || !frame || !picture || !title) return;

      let tl = null;
      let disposed = false;

      const build = () => {
        tl?.kill();

        const phone = window.innerWidth <= PHONE_MAX;

        gsap.set(frame, { clipPath: CLIP_CLOSED });
        gsap.set(picture, { scale: PICTURE_FROM, transformOrigin: "50% 50%" });
        gsap.set(copy, { autoAlpha: 0 });


        title.style.fontSize = "";
        gsap.set(title, { y: 0 });
        fitLines(title, phone);

        const paneBox = pane.getBoundingClientRect();
        const restSize = parseFloat(getComputedStyle(title).fontSize);
        const restBox = title.getBoundingClientRect();
        const widest = Array.from(title.children).reduce(
          (most, line) => Math.max(most, line.getBoundingClientRect().width),
          0
        );

        const byWidth = widest
          ? restSize * ((paneBox.width * TITLE_FILL_X) / widest)
          : restSize;
        const byHeight = restBox.height
          ? restSize * ((paneBox.height * TITLE_FILL_Y) / restBox.height)
          : restSize;

        const openSize = phone
          ? restSize
          : Math.max(restSize, Math.min(byWidth, byHeight));

        gsap.set(title, { fontSize: openSize });

        const openBox = title.getBoundingClientRect();
        const centred =
          paneBox.top +
          paneBox.height / 2 -
          (openBox.top + openBox.height / 2);

        gsap.set(title, { y: centred });

        tl = gsap.timeline({ paused: true });
        tl.to(
          title,
          {
            fontSize: restSize,
            y: 0,
            duration: TITLE_DURATION,
            ease: "power2.inOut",
          },
          0
        )
          .to(
            frame,
            {
              clipPath: CLIP_OPEN,
              duration: REVEAL_DURATION,
              ease: "power2.inOut",
            },
            REVEAL_AT
          )
          .to(
            picture,
            { scale: 1, duration: REVEAL_DURATION, ease: "power2.inOut" },
            REVEAL_AT
          )
          .to(
            copy,
            {
              autoAlpha: 1,
              duration: COPY_IN,
              stagger: COPY_STEP,
              ease: "power2.out",
            },
            COPY_AT
          )
          .to({}, { duration: 0.1 }, TIMELINE_END);
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
      id="about-hero"
      data-nav-dark=""
      aria-labelledby="about-hero-heading"
      className={`about-hero relative z-10 bg-black text-white [--runway:5] ${animated ? "h-[calc(var(--runway)*100vh)]" : ""
        }`}
    >
      <div
        className={`hero-pane relative h-svh overflow-hidden ${animated ? "sticky top-0" : ""
          }`}
      >
        <div className="hero-frame absolute inset-0 overflow-hidden">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority
            sizes="100vw"
            unoptimized
            className="hero-picture h-full w-full object-cover will-change-transform"
          />
        </div>

        <div
          className="hero-scrim pointer-events-none absolute inset-0 bg-black/45"
          aria-hidden="true"
        />

        <div className="hero-stack absolute inset-x-0 top-[15svh] z-10 flex flex-col items-center px-6">
          <h1
            id="about-hero-heading"
            className="hero-title whitespace-nowrap text-center font-display text-[clamp(1.75rem,5vw,6rem)] font-semibold uppercase leading-[0.92] tracking-[-0.03em] will-change-transform"
          >
            {heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <div className="hero-copy mt-6 w-full max-w-[86ch] text-center">
            <p className="hero-copy-part font-display text-[clamp(0.72rem,0.95vw,1.05rem)] font-medium uppercase tracking-[0.18em] text-white/70">
              {subtitle}
            </p>

            {body.map((paragraph) => (
              <p
                key={paragraph}
                className="hero-copy-part mt-3 text-[clamp(0.75rem,0.85vw,0.98rem)] leading-[1.55] text-white/70"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
