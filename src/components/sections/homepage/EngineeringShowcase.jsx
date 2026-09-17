"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";
import useIsPhone from "@/hooks/useIsPhone";
import useIsTablet from "@/hooks/useIsTablet";
import LetsTalkButton from "@/components/layout/LetsTalkButton";
import driveOnScroll from "@/lib/scrub";

const HEADING_LINES = [
  "Engineering site-ready machinery",
  "for modern infrastructure",
];

const BODY = [
  "Construction sites demand machinery that's mobile, accurate, reliable, and simple to run.",
  "FIGLMUELLER integrates material storage, precision weighing, conveying, mixing, water supply, compressed air, and electronic control — all on one platform.",
  "Built to raise production consistency. Cut setup time. Improve site control.",
];

const RUNWAY_VH = 4.6;
const SCRUB = 0.14;
const OPEN_FROM = 30;
const CLIP_START = `inset(0% ${100 - OPEN_FROM}% 0% 0%)`;
const CLIP_START_COMPACT = "inset(58% 0% 0% 0%)";
const CLIP_HOLD_COMPACT = "inset(53% 0% 0% 0%)";
const CLIP_END = "inset(0% 0% 0% 0%)";
const FRAME_ENTRY = { xPercent: -(OPEN_FROM + 4), yPercent: 22 };


const TIMELINE_END = 7;
const BLOCK_FROM = "43vh";
const BLOCK_TO = "-45vh";
const BODY_INDENT = "17vw";
const OPEN_DURATION = 6;
const ALIGN_AT_OPEN = 0.6;
const ALIGN_AT_UNIT = OPEN_DURATION * ALIGN_AT_OPEN;
const BODY_ALIGN_START = 0;

const CURTAIN_SHUT = "inset(50% 0% 50% 0%)";
const CURTAIN_SPAN = 0.75;

const COPY_RISE = 96;
const COPY_SPAN = 0.5;
const CURTAIN_SCRUB = 0.16;

export default function EngineeringShowcase() {
  const rootRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const isPhone = useIsPhone();
  const isTablet = useIsTablet();
  const animated = !prefersReducedMotion && !isPhone && !isTablet;
  const curtain = !prefersReducedMotion && isTablet;

  useGSAP(
    () => {
      if (!animated) return;

      const root = rootRef.current;
      if (!root) return;

      const frame = root.querySelector(".showcase-frame");
      const picture = root.querySelector(".showcase-picture");
      const follow = root.querySelector(".showcase-follow");
      const heading = root.querySelector(".showcase-heading");
      const body = root.querySelector(".showcase-body");

      const compact = window.innerWidth < 768;
      const followDistance = window.innerWidth * (1 - OPEN_FROM / 100);

      gsap.set(frame, { clipPath: compact ? CLIP_START_COMPACT : CLIP_START });
      gsap.set(picture, { scale: 1.35 });
      gsap.set(follow, { x: 0, y: BLOCK_FROM, xPercent: 0, yPercent: 0 });
      gsap.set(heading, { x: 0, y: 0, xPercent: 0, yPercent: 0 });
      gsap.set(body, {
        x: compact ? 0 : BODY_INDENT,
        y: 0,
        xPercent: 0,
        yPercent: 0,
      });

      const tl = gsap.timeline({ paused: true });

      if (compact) {
        tl.to(
          frame,
          { clipPath: CLIP_HOLD_COMPACT, duration: 4, ease: "none" },
          0
        )
          .to(frame, { clipPath: CLIP_END, duration: 2, ease: "power2.inOut" }, 4)
          .to(follow, { x: window.innerWidth, duration: 2, ease: "power2.in" }, 4);
      } else {

        tl.to(
          frame,
          { clipPath: CLIP_END, duration: OPEN_DURATION, ease: "none" },
          0
        ).to(
          follow,
          { x: followDistance, duration: OPEN_DURATION, ease: "none" },
          0
        );
      }

      tl.to(picture, { scale: 1, duration: OPEN_DURATION, ease: "none" }, 0)
        .to(follow, { y: BLOCK_TO, duration: OPEN_DURATION, ease: "none" }, 0)
        .to(
          body,
          {
            x: 0,
            duration: ALIGN_AT_UNIT - BODY_ALIGN_START,
            ease: "none",
          },
          BODY_ALIGN_START
        )
        .to({}, { duration: TIMELINE_END - 6 }, 6);

      const entryTl = gsap.timeline({ paused: true });
      entryTl.fromTo(
        frame,
        { x: 0, y: 0, ...FRAME_ENTRY },
        { xPercent: 0, yPercent: 0, duration: 1, ease: "none" }
      );

      const clamp01 = gsap.utils.clamp(0, 1);

      const scrollProgress = () => {
        const rect = root.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;
        if (travel <= 0) return 0;
        return clamp01(-rect.top / travel);
      };

      const entryProgress = () => {
        const viewport = window.innerHeight;
        const { top } = root.getBoundingClientRect();
        return clamp01((viewport - top) / viewport);
      };

      const scrub = driveOnScroll({
        root,
        progress: scrollProgress,
        apply: (value) => {
          tl.progress(value);
          entryTl.progress(entryProgress());
        },
        ease: SCRUB,
      });

      return () => {
        scrub.stop();
        tl.kill();
        entryTl.kill();
      };
    },

    { dependencies: [animated], revertOnUpdate: true }
  );

  useGSAP(
    () => {
      if (!curtain) return;

      const root = rootRef.current;
      const frame = root?.querySelector(".showcase-frame");
      const copy = root?.querySelector(".showcase-copy");
      if (!frame || !copy) return;

      gsap.set(frame, { clipPath: CURTAIN_SHUT });

      const tl = gsap
        .timeline({ paused: true })
        .fromTo(
          frame,
          { clipPath: CURTAIN_SHUT },
          { clipPath: CLIP_END, duration: 1, ease: "none" }
        );

      const copyTl = gsap
        .timeline({ paused: true })
        .fromTo(
          copy,
          { y: COPY_RISE },
          { y: 0, duration: 1, ease: "power2.out" }
        );

      const clamp01 = gsap.utils.clamp(0, 1);

      const progress = () => {
        const rect = frame.getBoundingClientRect();
        const travel = rect.height * CURTAIN_SPAN;
        if (travel <= 0) return 0;
        return clamp01((window.innerHeight - rect.bottom) / travel);
      };

      const copyProgress = () => {
        const viewport = window.innerHeight;
        return clamp01(
          (viewport - copy.getBoundingClientRect().top) / (viewport * COPY_SPAN)
        );
      };

      const scrub = driveOnScroll({
        root,
        progress,
        apply: (value) => {
          tl.progress(value);
          copyTl.progress(copyProgress());
        },
        ease: CURTAIN_SCRUB,
      });

      return () => {
        scrub.stop();
        tl.kill();
        copyTl.kill();
      };
    },

    { dependencies: [curtain], revertOnUpdate: true }
  );

  return (
    <section
      ref={rootRef}
      aria-labelledby="showcase-heading"
      className="engineering-showcase relative z-10 bg-bone text-black"
    >
      <div style={animated ? { height: `${RUNWAY_VH * 100}vh` } : undefined}>
        <div
          className={
            animated
              ? "showcase-stack sticky top-0 h-svh overflow-hidden"
              : "showcase-stack flex flex-col gap-12 py-24"
          }
        >
          <div
            className={
              animated
                ? "showcase-frame absolute inset-0 overflow-hidden [clip-path:inset(58%_0%_0%_0%)] transform-[translate(-26%,22%)] will-change-[clip-path,transform] md:[clip-path:inset(0%_78%_0%_0%)]"
                : "showcase-frame relative mx-6 aspect-video overflow-hidden md:mx-12"
            }
          >
            <Image
              src="/CUSTOM-MACHINERY.jpg"
              alt="Excavator and service trucks working a road site in cold morning steam"
              fill
              sizes="100vw"
              className="showcase-picture h-full w-full object-cover will-change-transform"
            />
          </div>

          <div
            className={
              animated
                ? "showcase-copy showcase-follow absolute inset-y-0 left-0 flex w-screen flex-col justify-center px-6 transform-[translateY(43vh)] will-change-transform md:left-[30vw] md:px-0"
                : "showcase-copy mx-auto w-full max-w-400 px-6 md:px-12"
            }
          >
            <div
              className={
                animated
                  ? "showcase-heading w-full md:ml-[2.2vw] md:w-[37vw]"
                  : "showcase-heading"
              }
            >
              <h2
                id="showcase-heading"
                className="font-display text-[clamp(1.15rem,1.85vw,2.1rem)] font-medium uppercase leading-[1.16] tracking-[-0.01em]"
              >
                {HEADING_LINES.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
            </div>

            <div
              className={
                animated
                  ? "showcase-body mt-[7svh] w-full space-y-4 will-change-transform md:ml-[2.2vw] md:w-[20vw] md:transform-[translateX(17vw)]"
                  : "showcase-body mt-8 space-y-4"
              }
            >
              {BODY.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[clamp(0.85rem,0.92vw,1.05rem)] leading-[1.6] text-black/75"
                >
                  {paragraph}
                </p>
              ))}

              <div className="flex pt-2">
                <LetsTalkButton icon="arrow" swapLabel={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
