"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";
import ActionButton from "@/components/ui/ActionButton";
import { filmSources } from "@/lib/film";
import driveOnScroll from "@/lib/scrub";

const LEAD_IN = "Introducing";
const HEADING = "Citrine®";
const CTA = { label: "View Citrine® System", href: "/citrine" };

/*
 * The machine is turned by the scroll rather than played.
 *
 * Written in the studio it is a film, wound by setting the time on it as the
 * screen is scrolled - and uploaded in two cuts, so a phone is given a film
 * shot for a phone instead of a wide one cropped to it. Which cut, and in
 * which format, is the browser's own decision: it takes the first source it
 * can match and read.
 *
 * With nothing written it is the run of frames the site ships with, painted
 * into a canvas one at a time. That is what this screen was built on, and it
 * is still what it falls back to.
 */
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

/* Close enough to the time already shown that winding to it would paint the
   same frame twice. */
const FRAME_SECONDS = 1 / 30;

/* How long a seek is given to answer before another may be asked for. */
const SEEK_WAIT_MS = 200;

const SCRUB = 0.14;

export default function CitrineIntro({ content }) {
  const leadIn = content?.leadIn || LEAD_IN;
  const heading = content?.heading || HEADING;
  const cta = {
    label: content?.cta?.label || CTA.label,
    href: content?.cta?.href || CTA.href,
  };

  /* Every file of the film, in the order the browser is offered them. Empty
     is what sends this screen back to its frames. */
  const film = filmSources(content?.video);

  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const clamp01 = gsap.utils.clamp(0, 1);
      const scrollProgress = () => {
        const rect = root.getBoundingClientRect();
        if (rect.height <= 0) return 0;
        return clamp01(
          (window.innerHeight - rect.top) / (rect.height + PLAYOUT_PX)
        );
      };

      /* The film, wound by the scroll. */
      if (film.length) {
        const video = videoRef.current;
        if (!video) return;

        const show = () => setReady(true);
        if (video.readyState >= 2) show();
        else video.addEventListener("loadeddata", show, { once: true });

        /*
         * A film that has never been played paints nothing on a phone and
         * decodes nothing either: the screen stays black however hard it is
         * wound. So the first time the section comes into view the film is
         * started and stopped in the same breath - a frame is drawn, the
         * decoder is awake, and there is something for the scroll to wind.
         */
        let primed = false;
        const prime = () => {
          if (primed) return;
          primed = true;

          const started = video.play();
          if (started?.then) started.then(() => video.pause()).catch(() => { });
          else video.pause();
        };

        const watcher = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) prime();
          },
          { threshold: 0.05 }
        );

        watcher.observe(root);

        /*
         * Winding is seeking, and seeking is the most expensive thing a phone
         * can be asked for. So it is asked as rarely as the picture allows:
         * never while a seek is still being answered, never for a step
         * shorter than a frame, and through `fastSeek` where the browser has
         * it - which settles on the nearest key frame instead of decoding its
         * way to an exact one. The film is cut with a key frame every five
         * frames for exactly this.
         */
        const quick = typeof video.fastSeek === "function";
        let asked = 0;

        const settled = () => {
          asked = 0;
        };

        video.addEventListener("seeked", settled);

        const wind = (value) => {
          const span = video.duration;
          if (!Number.isFinite(span) || span <= 0) return;

          /* One seek at a time - and if a seek is never answered, no more
             than this long before another may be asked for. */
          const now = performance.now();
          if (asked && now - asked < SEEK_WAIT_MS) return;

          const at = Math.min(span - FRAME_SECONDS, value * span);
          if (Math.abs(video.currentTime - at) < FRAME_SECONDS) return;

          asked = now;
          if (quick) video.fastSeek(at);
          else video.currentTime = at;
        };

        const scrub = driveOnScroll({
          root,
          progress: scrollProgress,
          apply: wind,
          ease: SCRUB,
        });

        return () => {
          scrub.stop();
          watcher.disconnect();
          video.removeEventListener("seeked", settled);
          video.removeEventListener("loadeddata", show);
        };
      }

      /* The frames the site ships with. */
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      canvas.width = FRAME_WIDTH;
      canvas.height = FRAME_HEIGHT;

      /* Only what will be painted. Where the run is not being wound - a phone,
         or a reader who has asked for less movement - that is the first frame
         and nothing else, rather than thirty-six megabytes of them. */
      const wanted = animated ? FRAME_COUNT : 1;

      const frames = Array.from({ length: wanted }, (_, index) => {
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

      if (!animated) {
        return () => {
          frames.forEach((image) => {
            image.onload = null;
          });
        };
      }

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
    /* Reverted when the answer changes: the screen is read as a desk's until
       the media query answers, and the scroll driver set up for one must be
       taken down before the film is handed to the other. */
    {
      dependencies: [animated, film.map((source) => source.url).join()],
      revertOnUpdate: true,
    }
  );

  const shown = `transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"
    }`;

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
        {film.length ? (
          /* In order: the tall cut, which only a screen taller than it is wide
             takes, then the wide one, which carries no condition - each as
             WebM before MP4. */
          <video
            ref={videoRef}
            className={`citrine-film absolute inset-0 h-full w-full object-cover ${shown}`}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
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
        ) : (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={`citrine-frames absolute inset-0 h-full w-full object-cover ${shown}`}
          />
        )}

        <div
          className="pointer-events-none absolute inset-0 bg-black/45"
          aria-hidden="true"
        />

        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center md:px-12">
          <h2 id="citrine-heading" className="font-display uppercase">
            <span className="citrine-lead block text-[clamp(0.95rem,1.5vw,1.5rem)] font-medium leading-[1.3] tracking-[0.06em]">
              {leadIn}
            </span>
            <span className="citrine-title mt-3 block text-[clamp(1.75rem,4.2vw,4.5rem)] font-medium leading-[1.05] tracking-[0.03em]">
              {heading}
            </span>
          </h2>

          <ActionButton href={cta.href} className="mt-10">
            {cta.label}
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
