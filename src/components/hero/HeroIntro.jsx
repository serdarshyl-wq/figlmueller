"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";
import useScrollLock from "@/hooks/useScrollLock";
import useReducedMotion from "@/hooks/useReducedMotion";
import { ARRIVAL_MS } from "@/lib/arrival";
import {
  arrivedFromElsewhere,
  getNavLogoSlot,
  introAlreadyRan,
  markIntroHandedOver,
  markLogoLanded,
  useLogoLanded,
} from "@/lib/intro-store";
import { filmSources, shippedSource } from "@/lib/film";
import IntroLogo from "@/components/brand/IntroLogo";
import ActionButton from "@/components/ui/ActionButton";

gsap.registerPlugin(ScrollTrigger);

/*
 * What the site ships with, and what a page with nothing in the content store
 * still opens on. Everything here can be replaced from /admin; these are the
 * values the page falls back to, not the values it prefers.
 */
const FALLBACK = {
  video: "/hero-original.mp4",
  headingLines: ["Built to move", "heavy industry"],
  scrollLabel: "Scroll",
};

const HANDOVER_AT = 6;
const VIDEO_SCALE = 1.1;

/* How much of the film a reader arriving from another page is given: the last
   seconds of it, played out rather than wound forward behind a still. */
const ARRIVAL_TAIL = 3;

/*
 * When the intro lets go of the screen: six seconds in, and sooner on a film
 * with less than that to give. Never later than the tail a returning reader
 * sees, so whatever the client uploads, the page arrives before the film runs
 * out - nothing for anyone to set, and nothing to get wrong.
 */
const handoverAt = (video) => {
  const { duration } = video;
  if (!Number.isFinite(duration)) return HANDOVER_AT;

  return Math.min(HANDOVER_AT, Math.max(0, duration - ARRIVAL_TAIL));
};

/*
 * Which cut of the film the screen gets is not decided here.
 *
 * It is not a width but a shape: a screen taller than it is wide is a screen a
 * 16:9 film has to be cropped to the middle of, whoever is holding it - a
 * phone upright, a tablet upright. Turned on its side, either of them is a
 * wide screen again and gets the wide cut. The browser reads that off the
 * condition on the source, along with which format it can play, and takes the
 * first source that answers both - which is what `filmSources` puts in order.
 *
 * It is read when the film loads and not again, so a device turned mid-intro
 * keeps the cut it started with. That is the right trade: re-picking would
 * mean reloading the film and starting the intro over.
 */
const SKIP_RATE = 16;

const SKIP_CROSSFADE = 0.7;

export default function HeroIntro({ content }) {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const pushRef = useRef(null);
  const introLogoRef = useRef(null);
  const skipWatchRef = useRef(0);
  const freezeRef = useRef(null);

  /*
   * Every file of the film, in the order the browser is offered them. Nothing
   * uploaded at all is the film the site ships with, which is how it read
   * before any of this was written in the studio.
   */
  const written = filmSources(content?.video);
  const film = written.length ? written : shippedSource(FALLBACK.video);
  const headingLines = content?.headingLines?.length
    ? content.headingLines
    : FALLBACK.headingLines;
  const scrollLabel = content?.scrollLabel || FALLBACK.scrollLabel;

  const logoLanded = useLogoLanded();
  const [navigated] = useState(
    () => arrivedFromElsewhere("/") || introAlreadyRan()
  );

  const [handedOverState, setHandedOver] = useState(false);
  const [unlockedState, setUnlocked] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const handedOver = handedOverState || prefersReducedMotion || navigated;
  const unlocked = unlockedState || prefersReducedMotion || navigated;

  useScrollLock(!unlocked, { resetToTop: true });

  const handOver = useCallback(() => {
    setHandedOver(true);
    markIntroHandedOver();
  }, []);

  const release = useCallback(() => {
    setHandedOver(true);
    setUnlocked(true);
    markIntroHandedOver();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (prefersReducedMotion) {
      video.pause();
      markIntroHandedOver();
      return;
    }

    if (navigated) {
      /*
       * A reader who has already been here does not sit through the intro
       * again. The film is placed three seconds from its own end and plays
       * that tail out - the page arrives on moving picture rather than on a
       * held frame, and leaves the screen on the frame it always ended on.
       *
       * The tail is measured off the cut the browser actually loaded, since
       * two cuts of the same film are rarely the same length, and it is not
       * started until the page has finished sliding in: none of those three
       * seconds is spent off the side of the screen.
       */
      let disposed = false;
      let placed = false;
      let settled = false;

      const roll = () => {
        if (disposed || !placed || !settled) return;
        video.play().catch(() => { });
      };

      const place = () => {
        const { duration } = video;
        if (placed || !Number.isFinite(duration)) return;

        video.currentTime = Math.max(0, duration - ARRIVAL_TAIL);
        placed = true;
        roll();
      };

      const settle = () => {
        settled = true;
        roll();
      };

      place();
      video.addEventListener("loadedmetadata", place);

      /* The arrival hold is the site's own measure of a page having landed;
         where the browser is still sliding one in, it has the last word. The
         page and the footer slide as two animations, so it is the later of
         them that says when the screen has come to rest. */
      const held = window.setTimeout(() => {
        const sliding = document
          .getAnimations()
          .filter((animation) => animation.animationName === "page-in")
          .map((animation) => animation.finished);

        if (!sliding.length) {
          settle();
          return;
        }

        Promise.allSettled(sliding).then(settle);
      }, ARRIVAL_MS);

      markIntroHandedOver();
      markLogoLanded();

      return () => {
        disposed = true;
        window.clearTimeout(held);
        video.removeEventListener("loadedmetadata", place);
      };
    }

    video.play().catch(release);
  }, [release, prefersReducedMotion, navigated]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || handedOver) return;
    if (video.currentTime < handoverAt(video)) return;

    video.playbackRate = 1;
    handOver();
  }, [handedOver, handOver]);

  const skipIntro = useCallback(() => {
    const video = videoRef.current;
    const freeze = freezeRef.current;
    setSkipped(true);

    if (!video || video.currentTime >= handoverAt(video)) {
      handOver();
      return;
    }

    pushRef.current?.kill();

    let frozen = false;
    if (freeze && video.videoWidth) {
      freeze.width = video.videoWidth;
      freeze.height = video.videoHeight;
      try {
        freeze
          .getContext("2d")
          .drawImage(video, 0, 0, freeze.width, freeze.height);
        freeze.style.transform = getComputedStyle(video).transform;
        gsap.set(freeze, { opacity: 1 });
        frozen = true;
      } catch {
      }
    }

    try {
      video.playbackRate = SKIP_RATE;
    } catch {
    }
    video.play().catch(release);

    const watch = () => {
      const current = videoRef.current;
      if (!current) return;

      if (current.currentTime >= handoverAt(current)) {
        current.playbackRate = 1;
        if (frozen) {
          gsap.to(freeze, {
            opacity: 0,
            duration: SKIP_CROSSFADE,
            ease: "power2.inOut",
          });
        }
        handOver();
        return;
      }

      skipWatchRef.current = requestAnimationFrame(watch);
    };

    skipWatchRef.current = requestAnimationFrame(watch);
  }, [handOver, release]);

  useEffect(() => () => cancelAnimationFrame(skipWatchRef.current), []);

  useGSAP(
    () => {
      if (prefersReducedMotion || navigated) return;

      pushRef.current = gsap.fromTo(
        ".hero-video",
        { scale: VIDEO_SCALE * 1.12 },
        { scale: VIDEO_SCALE, duration: 9, ease: "power1.out" }
      );
    },
    { scope: rootRef, dependencies: [prefersReducedMotion, navigated] }
  );

  useGSAP(
    () => {
      if (!handedOver) return;

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      const flier = introLogoRef.current;
      const slot = getNavLogoSlot();
      const from = flier?.getBoundingClientRect();

      if (flier && slot && from.width) {
        const to = slot.getBoundingClientRect();

        gsap.set(flier, { transformOrigin: "top left" });
        tl.to(
          flier,
          {
            x: to.left - from.left,
            y: to.top - from.top,
            scale: to.width / from.width,
            duration: 1.5,
            ease: "power4.inOut",
            onComplete: markLogoLanded,
          },
          0
        );
      } else {
        tl.to(
          ".intro-mark",
          { autoAlpha: 0, duration: 0.8, onComplete: markLogoLanded },
          0
        );
      }

      tl.to(".hero-scrim", { opacity: 1, duration: 1.6 }, 0.1)
        /* The line starts the page a line below its own mask, held there by a
           class. GSAP reads that class as a translate of its own and keeps it
           underneath whatever it animates, so the start is stated here in full
           - the percentage the line travels, and no pixels under it. */
        .fromTo(
          ".hero-reveal",
          { y: 0, yPercent: 100 },
          { yPercent: 0, duration: 1.5, stagger: 0.09 },
          0.35
        )
        .fromTo(
          ".hero-fade",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.12 },
          0.9
        );

      if (prefersReducedMotion) tl.progress(1, false);
    },
    { scope: rootRef, dependencies: [handedOver, prefersReducedMotion] }
  );

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      gsap.to(".hero-copy", {
        yPercent: -12,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: () => window.innerHeight,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: rootRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      ref={rootRef}
      aria-label="Figlmueller Ind"
      data-nav-dark=""
      className="hero-intro sticky top-0 z-0 h-svh w-full overflow-hidden bg-black text-white"
    >
      {/* In order: the tall cut, which only a screen taller than it is wide
          takes, and then the wide one, which carries no condition and is what
          every other screen falls to - each of them as WebM before MP4. The
          browser takes the first it can both match and read. */}
      <video
        ref={videoRef}
        className="hero-video absolute inset-0 h-full w-full scale-110 object-cover will-change-transform"
        autoPlay={!navigated}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        onTimeUpdate={handleTimeUpdate}
        onEnded={release}
        onError={release}
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

      <canvas
        ref={freezeRef}
        aria-hidden="true"
        className="hero-freeze pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-0"
      />

      <div
        className="hero-scrim pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/40 opacity-0"
        aria-hidden="true"
      />

      <div
        className="intro-mark pointer-events-none absolute inset-0 z-60 flex items-center justify-center"
        style={{ display: logoLanded ? "none" : undefined }}
      >
        <IntroLogo
          rootRef={introLogoRef}
          instant={skipped}
          className="w-[64vw] max-w-125"
        />
      </div>

      {!handedOver && (
        <div className="absolute bottom-8 right-6 z-20 md:bottom-10 md:right-10">
          <ActionButton onClick={skipIntro} className="cursor-pointer">
            Skip
          </ActionButton>
        </div>
      )}

      <div className="hero-copy relative z-10 flex h-full flex-col justify-end px-6 pb-6 md:px-12 md:pb-8">
        {/* A signature rather than a headline: the two halves of the line stand
            side by side in the bottom corner, and the scroll cue keeps the far
            one, so the film is what the screen is actually for. Each half still
            rises out of its own mask when the intro hands over. */}
        <div className="hero-foot flex items-end justify-between gap-8">
          <h1 className="hero-signature flex flex-wrap items-baseline gap-x-10 gap-y-1 font-display text-[clamp(0.68rem,0.86vw,0.95rem)] font-medium uppercase leading-none tracking-[0.16em] text-white md:gap-x-16">
            {headingLines.map((headingLine) => (
              <span key={headingLine} className="block overflow-hidden">
                <span className="hero-reveal block translate-y-full">
                  {headingLine}
                </span>
              </span>
            ))}
          </h1>

          <span
            className="hero-fade invisible flex shrink-0 translate-y-4 items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-white/60 opacity-0"
            aria-hidden="true"
          >
            {scrollLabel}
            <ChevronDown className="size-4 animate-bounce" strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </section>
  );
}
