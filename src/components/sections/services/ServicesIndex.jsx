"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";
import useIsCompact from "@/hooks/useIsCompact";
import driveOnScroll from "@/lib/scrub";

const HEADING = "All Services";

const SERVICES = [
  {
    label: "Automation & Control",
    href: "/services-automation-control",
    image: "/services-assets/services-dummy1.jpeg",
    alt: "Automation and control on a Figlmueller production platform",
  },
  {
    label: "Custom Machinery",
    href: "/services-custom-machinery",
    image: "/services-assets/services-dummy2.jpeg",
    alt: "A Figlmueller custom machine on a construction site",
  },
  {
    label: "Applications",
    href: "/services-app-locations-areas",
    image: "/services-assets/services-dummy3.jpeg",
    alt: "Figlmueller machinery on an infrastructure site",
  },
];

const SCRUB = 0.1;

function ServiceCard({ service }) {
  return (
    <Link
      href={service.href}
      className="service-card group relative isolate block overflow-hidden bg-black"
    >

      <Image
        src={service.image}
        alt={service.alt}
        fill
        priority
        sizes="(min-width: 640px) 50vw, 100vw"
        className="object-cover transition-[scale] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
      />

      <span
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-700 group-hover:opacity-75"
      />

      {/* A card is a service, so its name is a heading rather than a line of
          type that happens to be large. The box around it is a div for the
          same reason: a heading cannot sit inside a span. */}
      <div className="service-caption absolute inset-x-0 bottom-[8%] flex flex-col items-center gap-6 px-[6%] text-white">
        <h2 className="service-name text-center font-display text-[6vw] font-medium uppercase leading-[0.95] tracking-[-0.02em] sm:text-[2.6vw]">
          {service.label}
        </h2>

        <span className="card-pill relative isolate inline-flex items-center rounded-full bg-white py-3 pl-6 pr-14 font-display text-[0.68rem] font-medium uppercase tracking-[0.16em] text-bone transition-colors duration-500 group-hover:text-black">
          <span
            aria-hidden="true"
            className="pill-fill absolute -inset-px -z-10 rounded-full bg-black"
          />
          Learn more
        </span>
      </div>
    </Link>
  );
}

/* Three cards, and the stack is built for three: where each one goes is the
   site's own, and what is written on it is read over the card in its place. */
const cardsFrom = (content) =>
  SERVICES.map((service, index) => ({
    ...service,
    label: content?.cards?.[index]?.label || service.label,
    image: content?.cards?.[index]?.image?.url || service.image,
    alt: content?.cards?.[index]?.alt || service.alt,
  }));

function ServicesStack({ services, heading }) {
  const rootRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;

  useGSAP(
    () => {
      if (!animated) return;

      const root = rootRef.current;
      if (!root) return;

      const cards = root.querySelectorAll(".stack-card");
      if (cards.length < 2) return;

      let tl = null;
      let disposed = false;

      const build = () => {
        tl?.kill();

        gsap.set(cards[0], { yPercent: 0 });
        gsap.set(Array.from(cards).slice(1), { yPercent: 100 });

        tl = gsap.timeline({ paused: true });
        Array.from(cards)
          .slice(1)
          .forEach((card, index) => {
            tl.to(card, { yPercent: 0, duration: 1, ease: "none" }, index);
          });
      };

      build();

      const clamp01 = gsap.utils.clamp(0, 1);

      const scrollProgress = () => {
        const rect = root.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;
        if (travel <= 0) return 0;
        return clamp01(-rect.top / travel);
      };

      const scrub = driveOnScroll({
        root,
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
      ref={rootRef}
      aria-label="Services"
      data-nav-dark=""

      className={`services-stack relative w-full bg-black [--runway:3] ${animated ? "h-[calc(var(--runway)*100vh)]" : ""
        }`}
    >
      <h1 className="sr-only">{heading}</h1>

      <div
        className={`stack-pane relative overflow-hidden ${animated ? "sticky top-0" : ""
          }`}
      >
        {services.map((service, index) => (
          <div
            key={service.href}
            style={{ zIndex: index + 1 }}
            className="stack-card absolute inset-0 will-change-transform"
          >
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ServicesIndex({ content }) {
  const isCompact = useIsCompact();
  const services = cardsFrom(content);

  const heading = content?.heading || HEADING;

  if (isCompact) return <ServicesStack services={services} heading={heading} />;

  return (
    <section
      aria-label="Services"

      className="w-full bg-bone pt-[clamp(8rem,15vh,12rem)] text-black"
    >
      <h1 className="pb-[6vh] text-center font-display text-[clamp(2rem,4.6vw,4.5rem)] font-medium uppercase leading-[0.95] tracking-[-0.02em]">
        {heading}
      </h1>

      <div className="grid auto-rows-[62vh] grid-cols-1 gap-[1vw] px-[1.7vw] pb-[1.7vw] sm:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.href} service={service} />
        ))}
      </div>
    </section>
  );
}
