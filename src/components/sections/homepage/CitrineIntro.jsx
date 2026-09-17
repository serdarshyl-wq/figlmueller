"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";
import ActionButton from "@/components/ui/ActionButton";
import driveOnScroll from "@/lib/scrub";
const LEAD_IN = "Introducing";
const HEADING = "Citrine®";
const CTA = { label: "View Citrine® System", href: "/citrine" };

const FRAME_COUNT = 160;
const FRAME_SRC = (index) =>
  `/ctrine-dummy/frame-${String(index).padStart(3, "0")}.jpg`;
const FRAME_WIDTH = 1280;
const FRAME_HEIGHT = 720;

const SCROLL_PER_FRAME = 34;
const RUNWAY_PX = FRAME_COUNT * SCROLL_PER_FRAME;

const PLAYOUT_FRAMES = 10;
const PLAYOUT_PX = PLAYOUT_FRAMES * SCROLL_PER_FRAME;
const PINNED_PX = RUNWAY_PX - PLAYOUT_PX;

const SCRUB = 0.14;

export default function CitrineIntro() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {
      const root = rootRef.current;
      const canvas = canvasRef.current;
      if (!root || !canvas) return;

      const context = canvas.getContext("2d");
      canvas.width = FRAME_WIDTH;
      canvas.height = FRAME_HEIGHT;

      const frames = Array.from({ length: FRAME_COUNT }, (_, index) => {
        const image = new Image();
        image.decoding = "async";
        image.src = FRAME_SRC(index);
        return image;
      });

      const isReady = (image) => image?.complete && image.naturalWidth > 0;

      const nearestReady = (index) => {
        if (isReady(frames[index])) return index;
        for (let step = 1; step < FRAME_COUNT; step += 1) {
          if (isReady(frames[index - step])) return index - step;
          if (isReady(frames[index + step])) return index + step;
        }
        return -1;
      };

      let painted = -1;
      const paint = (index) => {
        const target = nearestReady(index);
        if (target < 0 || target === painted) return;
        context.drawImage(frames[target], 0, 0, FRAME_WIDTH, FRAME_HEIGHT);
        painted = target;
      };

      const first = frames[0];
      if (first.complete) {
        paint(0);
        setReady(true);
      } else {
        first.onload = () => {
          paint(0);
          setReady(true);
        };
      }

      if (!animated) return;

      const clamp01 = gsap.utils.clamp(0, 1);
      const scrollProgress = () => {
        const rect = root.getBoundingClientRect();
        if (rect.height <= 0) return 0;
        return clamp01(
          (window.innerHeight - rect.top) / (rect.height + PLAYOUT_PX)
        );
      };

      const scrub = driveOnScroll({
        root,
        progress: scrollProgress,
        apply: (value) => paint(Math.round(value * (FRAME_COUNT - 1))),
        ease: SCRUB,
      });

      return () => {
        scrub.stop();
        frames.forEach((image) => {
          image.onload = null;
          image.src = "";
        });
      };
    },
    { dependencies: [animated] }
  );

  return (
    <section
      ref={rootRef}
      id="citrine"
      aria-labelledby="citrine-heading"
      className="citrine-intro relative z-10 bg-black text-white"
      style={animated ? { height: `${PINNED_PX}px` } : undefined}
    >
      <div
        className={
          animated
            ? "sticky top-0 h-svh overflow-hidden"
            : "relative h-svh overflow-hidden"
        }
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`citrine-frames absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"
            }`}
        />

        <div
          className="pointer-events-none absolute inset-0 bg-black/45"
          aria-hidden="true"
        />

        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center md:px-12">
          <h2 id="citrine-heading" className="font-display uppercase">
            <span className="citrine-lead block text-[clamp(0.95rem,1.5vw,1.5rem)] font-medium leading-[1.3] tracking-[0.06em]">
              {LEAD_IN}
            </span>
            <span className="citrine-title mt-3 block text-[clamp(1.75rem,4.2vw,4.5rem)] font-medium leading-[1.05] tracking-[0.03em]">
              {HEADING}
            </span>
          </h2>

          <ActionButton href={CTA.href} className="mt-10">
            {CTA.label}
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
