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
import IntroLogo from "@/components/brand/IntroLogo";
import ActionButton from "@/components/ui/ActionButton";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/hero%26intro.mp4";
const HANDOVER_AT = 6;
const VIDEO_SCALE = 1.1;

const HANDOVER_POSTER = "/hero-handover.jpg";

const SKIP_RATE = 16;

const SKIP_CROSSFADE = 0.7;

export default function HeroIntro() {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const pushRef = useRef(null);
  const introLogoRef = useRef(null);
  const skipWatchRef = useRef(0);
  const freezeRef = useRef(null);
  const stillRef = useRef(null);

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
      const watch = () => {
        const current = videoRef.current;
        if (!current) return;

        if (current.currentTime >= HANDOVER_AT) {
          current.playbackRate = 1;
          if (stillRef.current) {
            gsap.to(stillRef.current, {
              autoAlpha: 0,
              duration: SKIP_CROSSFADE,
              ease: "power2.inOut",
            });
          }
          return;
        }

        skipWatchRef.current = requestAnimationFrame(watch);
      };

      const wind = () => {
        video.playbackRate = SKIP_RATE;
        video.play().catch(() => { });
        skipWatchRef.current = requestAnimationFrame(watch);
      };

      const held = window.setTimeout(wind, ARRIVAL_MS);

      markIntroHandedOver();
      markLogoLanded();

      return () => {
        window.clearTimeout(held);
        cancelAnimationFrame(skipWatchRef.current);
      };
    }

    video.play().catch(release);
  }, [release, prefersReducedMotion, navigated]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || handedOver) return;
    if (video.currentTime < HANDOVER_AT) return;

    video.playbackRate = 1;
    handOver();
  }, [handedOver, handOver]);

  const skipIntro = useCallback(() => {
    const video = videoRef.current;
    const freeze = freezeRef.current;
    setSkipped(true);

    if (!video || video.currentTime >= HANDOVER_AT) {
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

      if (current.currentTime >= HANDOVER_AT) {
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
        .fromTo(
          ".hero-reveal",
          { yPercent: 100 },
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
      <video
        ref={videoRef}
        className="hero-video absolute inset-0 h-full w-full scale-110 object-cover will-change-transform"
        src={VIDEO_SRC}
        autoPlay={!navigated}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        onTimeUpdate={handleTimeUpdate}
        onEnded={release}
        onError={release}
      />

      <canvas
        ref={freezeRef}
        aria-hidden="true"
        className="hero-freeze pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-0"
      />

      {navigated && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          ref={stillRef}
          src={HANDOVER_POSTER}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="hero-still pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover"
        />
      )}

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

      <div className="hero-copy relative z-10 flex h-full flex-col justify-end px-6 pb-16 md:px-12 md:pb-20">
        <h1 className="max-w-5xl text-balance font-light leading-[0.95] tracking-tight text-white">
          <span className="block overflow-hidden">
            <span className="hero-reveal block translate-y-full text-[13vw] md:text-[8vw]">
              Built to move
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-reveal block translate-y-full text-[13vw] md:text-[8vw]">
              heavy industry
            </span>
          </span>
        </h1>

        <div className="mt-8 flex items-end justify-end gap-8">
          <span
            className="hero-fade invisible flex translate-y-4 items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-white/60 opacity-0"
            aria-hidden="true"
          >
            Scroll
            <ChevronDown className="size-4 animate-bounce" strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </section>
  );
}
