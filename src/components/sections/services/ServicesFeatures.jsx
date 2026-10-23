"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import LetsTalkButton from "@/components/layout/LetsTalkButton";
import useIsCompact from "@/hooks/useIsCompact";

const IMAGE_SIZE = { width: 2752, height: 1536 };

const HOLD_MS = 10000;
const FADE_MS = 700;
const ZOOM_MS = 1800;
const ZOOM_FROM = "1.08";

const ENTER_RATIO = 0.4;

const RING_RADIUS = 11;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

export default function ServicesFeatures({ blocks, cta = false }) {
  const rootRef = useRef(null);
  const isCompact = useIsCompact();
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || running || isCompact) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setRunning(true);
      },
      { threshold: ENTER_RATIO }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [running, isCompact]);

  useEffect(() => {
    if (!running) return;

    const id = setTimeout(
      () => setActive((current) => (current + 1) % blocks.length),
      HOLD_MS
    );

    return () => clearTimeout(id);
  }, [running, active, blocks.length]);

  const frame = (
    <div className="feature-frame relative h-[55svh] w-full overflow-hidden xl:h-full xl:w-[70%]">
      {blocks.map((block, index) => (
        <Image
          key={block.id}
          src={block.image}
          alt={block.alt || ""}
          aria-hidden="true"
          width={IMAGE_SIZE.width}
          height={IMAGE_SIZE.height}
          sizes="70vw"

          fetchPriority="low"
          style={{

            transitionProperty: "opacity, scale",
            transitionDuration: `${FADE_MS}ms, ${ZOOM_MS}ms`,
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            scale: index === active ? "1" : ZOOM_FROM,
          }}
          className={`absolute inset-0 h-full w-full object-cover ${index === active ? "opacity-100" : "opacity-0"
            }`}
        />
      ))}
    </div>
  );

  if (isCompact) {
    const block = blocks[active];
    const turn = (step) =>
      setActive((current) => (current + step + blocks.length) % blocks.length);

    return (
      <section
        ref={rootRef}
        aria-label="Systems"
        aria-roledescription="carousel"
        className="services-features feature-slider"
      >
        {frame}

        <div className="feature-slide" aria-live="polite">
          <h3 className="feature-title">{block.title}</h3>

          {block.body ? <p className="feature-copy">{block.body}</p> : null}

          {block.items ? (
            <ul className="feature-copy feature-items">
              {block.items.map((item) => (
                <li key={item}>
                  <span aria-hidden="true">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="feature-foot">
          {cta ? <LetsTalkButton icon="arrow" swapLabel={false} /> : null}

          <div className="feature-nav">
            <button
              type="button"
              onClick={() => turn(-1)}
              aria-label="Previous system"
              className="feature-arrow"
            >
              <ArrowLeft aria-hidden="true" className="size-4.5" strokeWidth={1.6} />
            </button>

            <button
              type="button"
              onClick={() => turn(1)}
              aria-label="Next system"
              className="feature-arrow"
            >
              <ArrowRight aria-hidden="true" className="size-4.5" strokeWidth={1.6} />
            </button>
          </div>
        </div>

        <p className="feature-count" aria-hidden="true">
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(blocks.length).padStart(2, "0")}
        </p>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      aria-label="Systems"
      className="services-features flex flex-col xl:h-svh xl:flex-row"
    >
      {frame}

      <div className="flex w-full flex-col px-[3vw] py-[6vh] xl:h-full xl:w-[30%] xl:overflow-y-auto">
        <ul className="flex flex-col">
          {blocks.map((block, index) => {
            const current = index === active;

            return (
              <li key={block.id} className="relative pl-7">
                {current ? (

                  <svg
                    key={active}
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="absolute left-0 top-[0.36em] size-3.5 -rotate-90"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r={RING_RADIUS}
                      fill="none"
                      stroke="currentColor"
                      strokeOpacity="0.2"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r={RING_RADIUS}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={RING_LENGTH}
                      strokeDashoffset={RING_LENGTH}
                      className="product-timer"
                      style={{
                        "--dash": RING_LENGTH,
                        animationDuration: `${HOLD_MS}ms`,
                        animationPlayState: running ? "running" : "paused",
                      }}
                    />
                  </svg>
                ) : null}

                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-current={current ? "true" : undefined}
                  className={`feature-title block cursor-pointer text-left font-display text-[clamp(0.85rem,1.05vw,1.3rem)] font-medium uppercase leading-[1.35] tracking-[0.01em] transition-colors duration-500 ${current ? "text-black" : "text-black/25 hover:text-black/50"
                    }`}
                >
                  {block.title}
                </button>

                <div
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${current
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className="overflow-hidden">
                    {block.body ? (
                      <p className="feature-copy pb-6 pt-3 text-[clamp(0.75rem,0.88vw,1.05rem)] leading-[1.55] text-black/60">
                        {block.body}
                      </p>
                    ) : null}

                    {block.items ? (
                      <ul className="feature-copy flex flex-col gap-1 pb-6 pt-3 text-[clamp(0.75rem,0.88vw,1.05rem)] leading-[1.45] text-black/60">
                        {block.items.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span aria-hidden="true" className="text-black/30">
                              ●
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {cta ? (
          <div className="mt-auto flex pl-7 pt-[6vh]">
            <LetsTalkButton icon="arrow" swapLabel={false} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
