"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import useIsCompact from "@/hooks/useIsCompact";
import { afterFonts } from "@/lib/scrub";

const IMAGE_SIZE = { width: 2752, height: 1536 };
const PROBE_PX = 200;
const TITLE_FILL_FALLBACK = 1;

const toLines = (title) =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .reduce((lines, word) => {
      const previous = lines[lines.length - 1];

      if (previous && previous.length <= 1) {
        lines[lines.length - 1] = `${previous} ${word}`;
        return lines;
      }

      lines.push(word);
      return lines;
    }, []);

export default function ServicesHero({ hero }) {
  const rowRef = useRef(null);
  const isCompact = useIsCompact();
  const lines = isCompact ? toLines(hero.title) : [hero.title];

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const range = document.createRange();

    const fit = () => {
      const fill =
        parseFloat(getComputedStyle(row).getPropertyValue("--title-fill")) ||
        TITLE_FILL_FALLBACK;

      row.querySelectorAll(".hero-line").forEach((line) => {
        line.style.fontSize = `${PROBE_PX}px`;

        range.selectNodeContents(line);
        const probed = range.getBoundingClientRect().width;
        if (!probed) return;

        line.style.fontSize = `${PROBE_PX * ((row.clientWidth * fill) / probed)
          }px`;
      });
    };

    fit();
    window.addEventListener("resize", fit);
    afterFonts(fit);

    return () => window.removeEventListener("resize", fit);
  }, [isCompact]);

  return (
    <section
      data-nav-dark=""
      aria-labelledby="services-hero-heading"
      className="services-hero relative h-[140vh] w-full overflow-hidden bg-black text-white"
    >
      <Image
        src={hero.image}
        alt={hero.alt}
        width={IMAGE_SIZE.width}
        height={IMAGE_SIZE.height}
        priority
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="hero-row absolute inset-x-0 top-[19svh] z-10 px-[3vw]">
        <h1
          ref={rowRef}
          id="services-hero-heading"
          className="text-center font-display text-[8vw] uppercase leading-[0.86] tracking-[-0.03em]"
        >
          {lines.map((line) => (
            <span
              key={line}
              className="hero-line inline-block whitespace-nowrap font-medium"
            >
              {line}
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
