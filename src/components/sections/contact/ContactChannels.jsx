"use client";

import { useState } from "react";
import useIsCompact from "@/hooks/useIsCompact";

const TOPICS = [
  {
    label: "Machinery enquiries",
    details: [
      {
        tag: "E.",
        value: "sales@figlmueller.ae",
        href: "mailto:sales@figlmueller.ae",
      },
      { tag: "T.", value: "+971 4 123 4567", href: "tel:+97141234567" },
    ],
  },
  {
    label: "Technical discussions",
    details: [
      {
        tag: "E.",
        value: "engineering@figlmueller.ae",
        href: "mailto:engineering@figlmueller.ae",
      },
      { tag: "T.", value: "+971 4 123 4568", href: "tel:+97141234568" },
    ],
  },
  {
    label: "Project partnerships",
    details: [
      {
        tag: "E.",
        value: "partners@figlmueller.ae",
        href: "mailto:partners@figlmueller.ae",
      },
      { tag: "L.", value: "Dubai Industrial City, UAE" },
    ],
  },
  {
    label: "Custom systems",
    details: [
      {
        tag: "E.",
        value: "systems@figlmueller.ae",
        href: "mailto:systems@figlmueller.ae",
      },
      { tag: "L.", value: "Dubai Industrial City, UAE" },
    ],
  },
];

const LABEL_CLASS =
  "channel-label block w-full font-display text-[clamp(1.9rem,6.4vw,7rem)] font-semibold uppercase leading-[1.05] tracking-tight text-[#2D2A2A] transition-opacity duration-500 group-hover:opacity-60";

export default function ContactChannels({ className = "min-h-svh" }) {
  const isCompact = useIsCompact();
  const [openTopic, setOpenTopic] = useState(null);

  return (
    <div
      className={`contact-channels relative flex items-center justify-center px-6 py-24 ${className}`}
    >
      <ul className="flex flex-col items-center text-center">
        {TOPICS.map((topic) => {
          const open = isCompact && openTopic === topic.label;

          return (
            <li
              key={topic.label}
              className={`group cursor-default${open ? " is-open" : ""}`}
            >
              {isCompact ? (
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() =>
                    setOpenTopic((current) =>
                      current === topic.label ? null : topic.label
                    )
                  }
                  className={`${LABEL_CLASS} cursor-pointer`}
                >
                  {topic.label}
                </button>
              ) : (
                <span className={LABEL_CLASS}>{topic.label}</span>
              )}

              <div className="channel-drawer grid grid-rows-[0fr] transition-[grid-template-rows] duration-600 ease-out group-focus-within:grid-rows-[1fr] group-hover:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <div className="channel-details flex flex-col items-center gap-1 py-3 text-[clamp(0.7rem,0.85vw,1rem)] tracking-[0.04em] text-black/60 opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 group-hover:opacity-100">
                    {topic.details.map((detail) => (
                      <span key={detail.tag + detail.value} className="block">
                        <span className="text-black/35">{detail.tag}</span>{" "}
                        {detail.href ? (
                          <a
                            href={detail.href}
                            className="cursor-pointer underline-offset-4 transition-colors duration-300 hover:text-black hover:underline"
                          >
                            {detail.value}
                          </a>
                        ) : (
                          detail.value
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
