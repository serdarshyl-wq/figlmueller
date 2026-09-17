"use client";

import { useEffect, useRef } from "react";
import ClosePill from "@/components/ui/ClosePill";
import { getLenis } from "@/lib/lenis";

const PANEL_MS = 800;
const PANEL_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

const TITLE_SIZE = "var(--panel-title, 4.7vw)";

export default function ResourcesPanel({ open, title, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const lenis = getLenis();
    lenis?.stop();

    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-110 bg-black/50 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        style={{
          transitionDuration: `${PANEL_MS}ms`,
          transitionTimingFunction: PANEL_EASE,
        }}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="resources-panel-title"

        inert={!open}

        className={`resources-panel fixed inset-y-0 right-0 z-120 flex w-[40vw] flex-col bg-bone text-black ${open ? "is-open translate-x-0" : "translate-x-full"
          }`}
        style={{
          transitionProperty: "translate",
          transitionDuration: `${PANEL_MS}ms`,
          transitionTimingFunction: PANEL_EASE,
        }}
      >
        <div className="panel-head flex justify-end px-[3vw] pt-[4vh]">
          <ClosePill ref={closeRef} onClick={onClose} />
        </div>

        <div className="panel-titles px-[3vw] pt-[5vh]">
          <h2
            id="resources-panel-title"
            style={{ fontSize: TITLE_SIZE }}
            className="panel-title font-display font-semibold uppercase leading-[0.9] tracking-[-0.035em]"
          >
            {title.split(" ").map((word) => (
              <span key={word} className="block whitespace-nowrap">
                {word}
              </span>
            ))}
          </h2>
        </div>

        <div className="panel-body flex flex-1 items-center justify-center px-[3vw]">
          <p className="panel-note font-display text-[clamp(1.4rem,3vw,3.4rem)] font-semibold uppercase leading-none tracking-[-0.02em] text-black/30">
            Coming soon
          </p>
        </div>
      </aside>
    </>
  );
}
