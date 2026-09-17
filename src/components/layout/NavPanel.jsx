"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const OPEN_MS = 560;
const LINK_STEP_MS = 70;

const OPEN_DELAY_MS = 300;

const IMAGE_MS = 700;
const IMAGE_SIZE = { width: 2752, height: 1536 };

export default function NavPanel({ items, open, id, onLitChange, onLeave }) {
  const [lit, setLit] = useState(null);
  const hasImages = items.some((item) => item.image);

  const shown = open ? lit : null;

  useEffect(() => {
    onLitChange?.(shown !== null);
  }, [shown, onLitChange]);

  return (
    <div
      id={id}
      inert={!open}
      className={`absolute inset-x-0 top-0 z-0 hidden h-svh overflow-hidden xl:block ${open ? "" : "pointer-events-none"
        }`}
    >
      <div
        className={`relative h-full overflow-hidden bg-bone transition-transform ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? "translate-y-0" : "-translate-y-full"
          }`}
        style={{
          transitionDuration: `${OPEN_MS}ms`,
          transitionDelay: open ? `${OPEN_DELAY_MS}ms` : "0ms",
        }}
      >
        {hasImages
          ? items.map((item, index) =>
            item.image ? (
              <Image
                key={item.label}
                src={item.image}
                alt=""
                aria-hidden="true"
                width={IMAGE_SIZE.width}
                height={IMAGE_SIZE.height}
                loading="eager"
                fetchPriority="low"
                sizes="100vw"
                style={{ transitionDuration: `${IMAGE_MS}ms` }}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity ease-out ${shown === index ? "opacity-100" : "opacity-0"
                  }`}
              />
            ) : null
          )
          : null}

        {hasImages ? (
          <div
            aria-hidden="true"
            style={{ transitionDuration: `${IMAGE_MS}ms` }}
            className={`absolute inset-0 bg-black/45 transition-opacity ease-out ${shown !== null ? "opacity-100" : "opacity-0"
              }`}
          />
        ) : null}

        <ul
          onMouseLeave={() => setLit(null)}
          className={`relative flex h-full flex-col items-start justify-center gap-1 px-6 transition-colors duration-500 md:px-24 ${shown !== null ? "text-white" : "text-black"
            }`}
        >
          {items.map((item, index) => (
            <li key={item.label} className="overflow-hidden">
              <Link
                href={item.href}

                data-section={item.section}
                onMouseEnter={() => item.image && setLit(index)}
                onFocus={() => item.image && setLit(index)}
                onClick={() => {
                  setLit(null);
                  onLeave?.();
                }}
                className={`block font-display text-[clamp(1.25rem,2.6vw,2.6rem)] font-semibold uppercase leading-tight tracking-[-0.01em] transition-transform ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? "translate-y-0" : "translate-y-full"
                  }`}
                style={{
                  transitionDuration: `${OPEN_MS}ms`,
                  transitionDelay: open
                    ? `${OPEN_DELAY_MS + index * LINK_STEP_MS}ms`
                    : "0ms",
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
