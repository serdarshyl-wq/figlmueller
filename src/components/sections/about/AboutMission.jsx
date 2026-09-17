"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";
import driveOnScroll from "@/lib/scrub";

const FRONT = {
  src: "/about-img/front-card.jpeg",
  width: 1792,
  height: 2400,
};

const BACK = {
  src: "/about-img/back-bg.jpeg",
  width: 2752,
  height: 1536,
};


const WHY_EYEBROW = "Why Figlmueller";
const WHY_TITLE = ["Our mission", "& vision"];


const HELD_WORD = "Our";

const PANELS = [
  {
    id: "mission",
    word: "Mission",
    body: "Mobile, automated, field-ready machinery. Built for efficient material production and real site operation.",
  },
  {
    id: "vision",
    word: "Vision",

    tracking: "tracking-[0.05em]",
    body: "Smarter, more reliable, more sustainable machinery. Built to shape the future of infrastructure development.",
  },
];

const CARD_HEIGHT = 0.62;
const CARD_RATIO = FRONT.width / FRONT.height;
const CARD_RISE_FROM = 0.5;
const FRONT_ZOOM_TO = 1.18;
const DRIFT_TO = 1.15;
const DRIFT_SECONDS = 14;
const SCRUB = 0.1;
const COMPACT_MAX = 1279;

const COMPACT_RISE_DURATION = 6.4;

const RISE_AT = 0;
const RISE_DURATION = 2.4;

const FLIP_AT = RISE_AT + RISE_DURATION;
const FLIP_DURATION = 3.4;

const EXPAND_AT = FLIP_AT + FLIP_DURATION / 2;
const EXPAND_DURATION = 2.2;
const MISSION_AT = 7.2;
const SWAP_AT = 11;
const COPY_FADE = 1.4;

const WORD_ROLL = 2.2;
const WORD_LEAD = 0.5;

const EXIT_AT = 14.2;
const COLLAPSE_AT = 15;
const COLLAPSE_DURATION = 3.2;

export default function AboutMission() {
  const rootRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;

  useGSAP(
    () => {
      if (!animated) return;

      const root = rootRef.current;
      if (!root) return;

      const pane = root.querySelector(".mission-pane");
      const card = root.querySelector(".mission-card");
      const front = root.querySelector(".mission-face-front");
      const frontPicture = root.querySelector(".mission-front-picture");
      const plate = root.querySelector(".mission-plate");
      const plateBox = root.querySelector(".mission-plate-box");
      const held = root.querySelector(".mission-held");
      const wordOut = root.querySelector('[data-word="mission"]');
      const wordIn = root.querySelector('[data-word="vision"]');
      const mission = root.querySelector('[data-copy="mission"]');
      const vision = root.querySelector('[data-copy="vision"]');
      if (
        !pane ||
        !card ||
        !front ||
        !frontPicture ||
        !plate ||
        !plateBox ||
        !held ||
        !wordOut ||
        !wordIn ||
        !mission ||
        !vision
      ) {
        return;
      }


      const drift = gsap.to(plate, {
        scale: DRIFT_TO,
        duration: DRIFT_SECONDS,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      let tl = null;
      let disposed = false;

      const build = () => {
        tl?.kill();

        const compact = window.innerWidth <= COMPACT_MAX;
        const paneWidth = root.clientWidth;
        const paneHeight = compact
          ? pane.getBoundingClientRect().height
          : window.innerHeight;
        const cardHeight = paneHeight * CARD_HEIGHT;
        const cardWidth = cardHeight * CARD_RATIO;
        const riseHeight = cardHeight * CARD_RISE_FROM;
        gsap.set(card, {
          width: compact ? paneWidth : cardWidth * CARD_RISE_FROM,
          height: compact ? paneHeight : riseHeight,
          xPercent: -50,
          yPercent: -50,
          x: 0,

          y: compact ? paneHeight : paneHeight / 2 + riseHeight / 2,
          rotationY: compact ? 180 : 0,
        });
        gsap.set(front, { autoAlpha: compact ? 0 : 1 });

        gsap.set(plateBox, {
          xPercent: -50,
          yPercent: -50,
          width: compact ? paneWidth : cardWidth,
          height: compact ? paneHeight : cardHeight,
        });
        gsap.set(frontPicture, { scale: 1, transformOrigin: "50% 50%" });
        gsap.set([mission, vision], { autoAlpha: 0 });

        gsap.set([held, wordOut, wordIn], { y: 0, yPercent: 100 });

        tl = gsap.timeline({ paused: true });

        if (compact) {
          tl.to(
            card,
            { y: 0, duration: COMPACT_RISE_DURATION, ease: "none" },
            RISE_AT
          );
        } else {
          tl.to(
            card,
            {
              y: 0,
              width: cardWidth,
              height: cardHeight,
              duration: RISE_DURATION,
              ease: "none",
            },
            RISE_AT
          )
            .to(
              frontPicture,
              {
                scale: FRONT_ZOOM_TO,
                duration: RISE_DURATION,
                ease: "none",
              },
              RISE_AT
            )

            .to(
              card,
              { rotationY: 180, duration: FLIP_DURATION, ease: "none" },
              FLIP_AT
            )

            .to(
              front,
              { autoAlpha: 0, duration: 0.01 },
              FLIP_AT + FLIP_DURATION / 2
            )
            .to(
              card,
              {
                width: paneWidth,
                height: paneHeight,
                duration: EXPAND_DURATION,
                ease: "none",
              },
              EXPAND_AT
            )
            .to(
              plateBox,
              {
                width: paneWidth,
                height: paneHeight,
                duration: EXPAND_DURATION,
                ease: "none",
              },
              EXPAND_AT
            );
        }

        tl.to(
          mission,
          { autoAlpha: 1, duration: COPY_FADE, ease: "power2.out" },
          MISSION_AT
        )
          .to(
            [held, wordOut],
            { yPercent: 0, duration: WORD_ROLL, ease: "power3.out" },
            MISSION_AT
          )

          .to(
            wordOut,
            {
              yPercent: -100,
              duration: WORD_ROLL,
              ease: "power3.inOut",
            },
            SWAP_AT
          )
          .to(
            wordIn,
            {
              yPercent: 0,
              duration: WORD_ROLL,
              ease: "power3.inOut",
            },
            SWAP_AT + WORD_LEAD
          )
          .to(
            mission,
            { autoAlpha: 0, duration: COPY_FADE, ease: "power2.in" },
            SWAP_AT
          )
          .to(
            vision,
            { autoAlpha: 1, duration: COPY_FADE, ease: "power2.out" },
            SWAP_AT + COPY_FADE * 0.6
          )

          .to(
            [held, wordIn],
            { yPercent: -100, duration: WORD_ROLL, ease: "power3.inOut" },
            EXIT_AT
          )
          .to(
            vision,
            { autoAlpha: 0, duration: COPY_FADE, ease: "power2.in" },
            EXIT_AT
          );

        if (!compact) {
          tl.to(
            card,
            {
              width: cardWidth,
              height: cardHeight,
              duration: COLLAPSE_DURATION,
              ease: "none",
            },
            COLLAPSE_AT
          );
        }
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

      return () => {
        disposed = true;
        scrub.stop();
        window.removeEventListener("resize", rebuild);
        drift.kill();
        tl?.kill();
      };
    },
    { dependencies: [animated] }
  );

  return (
    <section
      ref={rootRef}
      id="mission-vision"
      aria-labelledby="why-heading"
      className={`about-mission relative z-10 bg-bone text-black [--runway:11] ${animated ? "h-[calc(var(--runway)*100vh)]" : ""
        }`}
    >
      <div
        className={`mission-pane relative h-svh overflow-hidden [perspective:1400px] ${animated ? "sticky top-0" : ""
          }`}
      >
        <h2
          id="why-heading"
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center font-display uppercase"
        >
          <span className="block text-[clamp(0.65rem,0.78vw,0.9rem)] font-semibold tracking-[0.08em]">
            {WHY_EYEBROW}
          </span>

          <span className="mt-4 block text-[clamp(1.5rem,3.4vw,4rem)] font-semibold leading-[1.06] tracking-[-0.02em]">
            {WHY_TITLE.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
        </h2>


        <div
          className={`mission-card absolute left-1/2 top-1/2 transform-3d will-change-transform ${animated ? "" : "h-full w-full -translate-x-1/2 -translate-y-1/2"
            }`}
        >
          <div className="mission-face-front absolute inset-0 overflow-hidden backface-hidden transform-[translateZ(1px)]">
            <Image
              src={FRONT.src}
              alt=""
              aria-hidden="true"
              width={FRONT.width}
              height={FRONT.height}
              sizes="60vh"
              className="mission-front-picture h-full w-full object-cover will-change-transform"
            />
          </div>

          <div className="absolute inset-0 overflow-hidden backface-hidden transform-[rotateY(180deg)_translateZ(1px)]">
            <div
              className={`mission-plate-box overflow-hidden ${animated ? "absolute left-1/2 top-1/2" : "absolute inset-0"
                }`}
            >
              <Image
                src={BACK.src}
                alt="Figlmueller machinery on a construction site"
                width={BACK.width}
                height={BACK.height}
                sizes="100vw"
                className="mission-plate h-full w-full object-cover will-change-transform"
              />
            </div>

            <div
              className="absolute inset-0 bg-black/50"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-white">
          <h2
            className="mission-headline flex items-baseline justify-center gap-[0.22em] font-display text-[clamp(2.5rem,11vw,12rem)] font-black uppercase leading-[0.88] tracking-[-0.04em]"
          >
            <span className="relative block overflow-hidden">
              <span
                className={`mission-held block will-change-transform ${animated ? "translate-y-full" : ""
                  }`}
              >
                {HELD_WORD}
              </span>
            </span>

            <span className="relative block overflow-hidden">
              <span className="invisible block" aria-hidden="true">
                {PANELS[0].word}
              </span>

              {PANELS.map((panel, index) => (
                <span
                  key={panel.id}
                  data-word={panel.id}
                  aria-hidden={index === 1 ? "true" : undefined}
                  className={`absolute inset-0 block will-change-transform ${panel.tracking ?? ""
                    } ${animated ? "translate-y-full" : ""}`}
                >
                  {panel.word}
                </span>
              ))}
            </span>
          </h2>

          <div className="relative mt-6 h-[16svh] w-full max-w-[46ch]">
            {PANELS.map((panel) => (
              <p
                key={panel.id}
                data-copy={panel.id}
                className={`mission-copy absolute inset-x-0 top-0 text-[clamp(0.9rem,1.15vw,1.35rem)] leading-normal text-white/75 ${animated ? "invisible opacity-0" : ""
                  }`}
              >
                {panel.body}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
