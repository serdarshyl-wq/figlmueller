"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import ClosePill from "@/components/ui/ClosePill";
import { getLenis } from "@/lib/lenis";

const PANEL_MS = 800;
const PANEL_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

const TITLE_SIZE = "var(--panel-title, 4.7vw)";

/* Read in the middle of a panel of a resource that has not been written out
   yet, in place of what it would otherwise say. */
const NOTE = "Coming soon";

export default function ResourcesPanel({ open, title, body, note, onClose }) {
  const written = (body ?? []).filter((part) => part?.text || part?.image?.url);
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

        {written.length ? (
          /* What the resource says, a piece at a time, read down the panel.
             Lenis is stopped while this is open, so the panel scrolls on its
             own rather than taking the page with it. */
          <div className="panel-body min-h-0 flex-1 overflow-y-auto px-[3vw] pb-[8vh] pt-[5vh]">
            <div className="panel-reading flex flex-col gap-[4vh]">
              {written.map((part, index) => (
                <div key={index} className="panel-part flex flex-col gap-[2.5vh]">
                  {part.text
                    ? part.text
                      .split("\n")
                      .map((paragraph) => paragraph.trim())
                      .filter(Boolean)
                      .map((paragraph) => (
                        <p
                          key={paragraph}
                          className="panel-text max-w-[52ch] text-[clamp(0.85rem,1.05vw,1.15rem)] leading-[1.7] tracking-[0.01em] text-black/70"
                        >
                          {paragraph}
                        </p>
                      ))
                    : null}

                  {part.image?.url ? (
                    /* Described by the words it is set under, so it is read
                       as part of them rather than announced again. */
                    <Image
                      src={part.image.url}
                      alt=""
                      width={part.image.width || 1600}
                      height={part.image.height || 900}
                      sizes="(min-width: 1280px) 40vw, 100vw"
                      className="panel-picture h-auto w-full"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="panel-body flex flex-1 items-center justify-center px-[3vw]">
            <p className="panel-note font-display text-[clamp(1.4rem,3vw,3.4rem)] font-semibold uppercase leading-none tracking-[-0.02em] text-black/30">
              {note || NOTE}
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
