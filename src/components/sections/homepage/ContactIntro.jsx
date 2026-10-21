"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";
import ActionButton from "@/components/ui/ActionButton";
import ContactChannels from "@/components/sections/contact/ContactChannels";
import driveOnScroll, { afterFonts } from "@/lib/scrub";

const DISPLAY_LINES = ["Next gen", "Machinery"];

const HEADING = "Let's build the next generation of construction machinery";

const DISPLAY_FILL_FALLBACK = 0.7;

const LEAD =
  "Machinery enquiries. Technical discussions. Project partnerships. Custom system development.";

const ACTIONS = [
  { label: "Contact FIGLMUELLER", href: "/contact", primary: true },
  { label: "Request Technical Meeting", href: "/connect-us" },
];

const MACHINE = {
  src: "/figlmueller-contact-cut.png",
  alt: "Figlmueller mobile mixing machinery on site",
  width: 1046,
  height: 1174,
};

const IMAGE_START_LEFT = 0.53;

const IMAGE_TRAVEL_FALLBACK = 24;
const SCRUB = 0.1;

export default function ContactIntro({ content }) {
  const displayLines = content?.displayLines?.length ? content.displayLines : DISPLAY_LINES;
  const heading = content?.heading || HEADING;
  const lead = content?.lead || LEAD;
  const actions = content?.actions?.length ? content.actions : ACTIONS;
  const machine = content?.image?.url || MACHINE.src;
  const machineAlt = content?.imageAlt || MACHINE.alt;

  const partOneRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;

  useGSAP(
    () => {
      const partOne = partOneRef.current;
      if (!partOne) return;

      const heading = partOne.querySelector(".contact-display");
      const lines = partOne.querySelectorAll(".contact-line");
      const picture = partOne.querySelector(".contact-picture");
      if (!heading || !picture) return;


      const fitLines = () => {
        const style = getComputedStyle(heading);
        const fill =
          parseFloat(style.getPropertyValue("--display-fill")) ||
          DISPLAY_FILL_FALLBACK;
        const available =
          (heading.clientWidth -
            parseFloat(style.paddingLeft) -
            parseFloat(style.paddingRight)) *
          fill;
        if (available <= 0) return;

        lines.forEach((line) => {
          line.style.fontSize = "100px";
          const natural = line.getBoundingClientRect().width;
          if (!natural) return;
          line.style.fontSize = `${(available / natural) * 100}px`;
        });
      };

      fitLines();

      if (!animated) {
        const refit = () => fitLines();
        window.addEventListener("resize", refit);
        afterFonts(refit);
        return () => window.removeEventListener("resize", refit);
      }

      let disposed = false;
      let tl = null;

      const build = () => {
        tl?.kill();
        fitLines();

        const unit = window.innerWidth / 100;
        const travel =
          parseFloat(
            getComputedStyle(picture).getPropertyValue("--image-travel")
          ) || IMAGE_TRAVEL_FALLBACK;

        gsap.set(picture, { x: 0, y: 0, xPercent: 0 });
        const startX =
          window.innerWidth * IMAGE_START_LEFT -
          picture.getBoundingClientRect().left;
        const endX = startX - travel * unit;

        gsap.set(picture, { x: startX });

        tl = gsap.timeline({ paused: true });
        tl.to(picture, { x: endX, duration: 1, ease: "none" }, 0);
      };

      build();

      const clamp01 = gsap.utils.clamp(0, 1);

      const scrollProgress = () => {
        const rect = partOne.getBoundingClientRect();
        const span = window.innerHeight + rect.height;
        if (span <= 0) return 0;
        return clamp01((window.innerHeight - rect.top) / span);
      };

      const scrub = driveOnScroll({
        root: partOne,
        progress: scrollProgress,
        apply: (value) => tl.progress(value),
        ease: SCRUB,
      });

      const rebuild = () => {
        if (disposed) return;
        build();
        scrub.reapply();
      };

      window.addEventListener("resize", rebuild);
      afterFonts(rebuild);

      return () => {
        disposed = true;
        scrub.stop();
        window.removeEventListener("resize", rebuild);
        tl?.kill();
      };
    },
    { dependencies: [animated] }
  );

  return (
    <section
      id="contact-intro"
      aria-labelledby="contact-heading"
      className="contact-intro relative z-10 bg-bone text-black"
    >
      <div
        ref={partOneRef}
        className={
          animated
            ? "contact-part-one relative h-svh overflow-hidden"
            : "contact-part-one relative overflow-hidden py-20"
        }
      >
        <div
          aria-hidden="true"
          className={`contact-display flex flex-col px-6 font-display font-semibold uppercase leading-[0.8] tracking-[-0.03em] text-[#2D2A2A] [--display-fill:0.7] md:px-12 ${animated
            ? "absolute inset-0 justify-between py-[4svh]"
            : "gap-[38vh]"
            }`}
        >
          {displayLines.map((line, index) => (
            <span
              key={line}
              className={`contact-line whitespace-nowrap ${index === 0 ? "self-start" : "self-end"
                }`}
            >
              {line}
            </span>
          ))}
        </div>

        <div className="contact-picture pointer-events-none absolute inset-y-0 right-[8vw] z-10 my-auto aspect-1046/1174 h-[68svh] [--image-travel:24] will-change-transform">
          <Image
            src={machine}
            alt={machineAlt}
            width={content?.image?.width || MACHINE.width}
            height={content?.image?.height || MACHINE.height}
            sizes="40vw"
            className="h-full w-full object-contain"
          />
        </div>

        <div
          className={`contact-copy z-20 max-w-[34vw] px-6 md:px-12 ${animated
            ? "absolute left-0 top-[64%] -translate-y-1/2"
            : "relative mt-16 max-w-160"
            }`}
        >
          <h2
            id="contact-heading"
            className="contact-title font-display text-[clamp(1rem,1.5vw,1.9rem)] font-medium uppercase leading-[1.15] tracking-[-0.01em]"
          >
            {heading}
          </h2>

          <p className="contact-lead mt-5 text-[clamp(0.95rem,1.25vw,1.5rem)] font-medium uppercase leading-[1.35] tracking-[0.01em] text-black/70">
            {lead}
          </p>

          <div className="contact-actions mt-8 flex flex-col items-start gap-3">
            {actions.map((action) => (
              <ActionButton key={action.label} href={action.href}>
                {action.label}
              </ActionButton>
            ))}
          </div>
        </div>
      </div>

      <ContactChannels />
    </section>
  );
}
