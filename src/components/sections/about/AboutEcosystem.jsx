
const HEADING_EYEBROW = "Three companies";
const HEADING = "Industrial ecosystem";

const COMPANIES = [
  {
    name: "Figlmueller Industrial",
    body: "Machinery, automation, software-controlled equipment",
  },
  {
    name: "FillWaves Contracting",
    body: "Advanced material production",
  },
  {
    name: "Windle Engineering",
    body: "Construction and project execution",
  },
];

export default function AboutEcosystem() {
  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-heading"
      className="relative z-10 flex min-h-svh flex-col justify-center bg-black px-[4vw] py-[10svh] text-white"
    >
      <h2
        id="ecosystem-heading"
        className="text-center font-display uppercase leading-[1.1] tracking-[-0.01em]"
      >
        <span className="block text-[clamp(0.8rem,1.15vw,1.35rem)] font-normal tracking-[0.06em]">
          {HEADING_EYEBROW}
        </span>

        <span className="block text-[clamp(1.5rem,3.2vw,4rem)] font-medium">
          {HEADING}
        </span>
      </h2>

      <ul className="mt-[7svh] grid grid-cols-1 gap-[2.5vw] md:grid-cols-3">
        {COMPANIES.map((company, index) => (
          <li key={company.name}>

            <div
              className="flex h-[38svh] w-full items-center justify-center border border-white/10 bg-white/6"
              aria-hidden="true"
            >
              <span className="font-display text-[clamp(0.7rem,0.9vw,1rem)] font-normal uppercase tracking-[0.24em] text-white/35">
                Placeholder {index + 1}
              </span>
            </div>

            <h3 className="mt-6 font-display text-[clamp(0.95rem,1.35vw,1.6rem)] font-medium uppercase tracking-[0.02em]">
              {company.name}
            </h3>

            <p className="mt-2 text-[clamp(0.78rem,0.92vw,1.05rem)] leading-[1.5] text-white/60">
              {company.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
