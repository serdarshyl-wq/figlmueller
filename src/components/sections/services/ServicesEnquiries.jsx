import LetsTalkButton from "@/components/layout/LetsTalkButton";

const ASIDE =
  "font-display text-[16vw] font-bold uppercase leading-[0.8] tracking-[0.01em]";

const LEFT_OVERHANG = "translate-x-[-0.55em]";
const RIGHT_OVERHANG = "translate-x-[0.15em]";

export default function ServicesEnquiries() {
  return (
    <section
      aria-labelledby="services-enquiries-heading"
      className="services-enquiries relative flex min-h-[78vh] items-center overflow-hidden bg-bone px-6 py-[12vh] text-black"
    >

      <span
        aria-hidden="true"
        className="enquiries-aside pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between text-black/12"
      >
        <span className={`block whitespace-nowrap ${LEFT_OVERHANG} ${ASIDE}`}>
          Tech
        </span>
        <span className={`block whitespace-nowrap ${RIGHT_OVERHANG} ${ASIDE}`}>
          Talk
        </span>
      </span>

      <div className="enquiries-copy relative z-10 mx-auto mt-[10vh] flex flex-col items-center gap-[5vh] text-center">
        <h2
          id="services-enquiries-heading"
          className="enquiries-title font-display text-[clamp(2rem,5.2vw,5rem)] font-medium uppercase leading-[0.95] tracking-[-0.02em]"
        >
          Machinery
          <br />
          Enquiries
        </h2>

        <LetsTalkButton tone="dark" />
      </div>
    </section>
  );
}
