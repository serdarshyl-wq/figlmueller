"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { afterFonts } from "@/lib/scrub";

const IDLE_LABEL = "Let's talk";
const HOVER_LABEL = "Say hi";

const PADDING_REM = 5.5;

const TYPE =
  "font-display text-[0.9rem] font-medium uppercase tracking-[0.16em]";

export default function LetsTalkButton({
  href = "/connect-us",
  tone = "light",
  icon = "plus",
  swapLabel = true,
  className = "",
}) {
  const Glyph = icon === "arrow" ? ArrowUpRight : Plus;
  const hoverLabel = swapLabel ? HOVER_LABEL : IDLE_LABEL;
  const idleRef = useRef(null);
  const hoverRef = useRef(null);
  const [widths, setWidths] = useState(null);

  useEffect(() => {
    const measure = () => {
      const idle = idleRef.current?.getBoundingClientRect().width;
      const hover = hoverRef.current?.getBoundingClientRect().width;
      if (!idle || !hover) return;

      const rem = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      const padding = PADDING_REM * rem;

      setWidths({
        "--pill-idle": `${idle + padding}px`,
        "--pill-hover": `${hover + padding}px`,
      });
    };

    measure();
    afterFonts(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <Link
      href={href}
      aria-label={IDLE_LABEL}
      style={widths ?? undefined}
      className={`talk-pill group relative grid justify-items-end ${className}`}
    >
      <span aria-hidden="true" className={`talk-sizer invisible py-4 pl-8 pr-14 ${TYPE}`}>
        {IDLE_LABEL}
      </span>

      <span
        className={`talk-body absolute inset-y-0 right-0 flex items-center overflow-hidden rounded-full pl-8 pr-14 transition-[width] duration-300 ease-out ${tone === "dark" ? "bg-black text-bone" : "bg-[#e3e1dc] text-black"
          } ${widths
            ? swapLabel
              ? "w-(--pill-idle) group-hover:w-(--pill-hover)"
              : "w-(--pill-idle)"
            : ""
          } ${TYPE}`}
      >

        <span
          ref={idleRef}
          className={`talk-label whitespace-nowrap ${swapLabel
            ? "group-hover:invisible"
            : "transition-[translate] duration-300 ease-out group-hover:translate-x-6"
            }`}
        >
          {IDLE_LABEL}
        </span>

        <span
          ref={hoverRef}
          aria-hidden="true"
          className={`talk-hover invisible absolute left-14 whitespace-nowrap ${swapLabel ? "group-hover:visible" : ""
            }`}
        >
          {hoverLabel}
        </span>

        <Glyph
          aria-hidden="true"
          className="absolute top-1/2 right-8 size-5 -translate-y-1/2 transition-[right] duration-300 ease-out group-hover:-right-10"
          strokeWidth={1.75}
        />
        <Glyph
          aria-hidden="true"
          className="absolute top-1/2 -left-10 size-5 -translate-y-1/2 transition-[left] duration-300 ease-out group-hover:left-8"
          strokeWidth={1.75}
        />
      </span>
    </Link>
  );
}
