import LetsTalkButton from "@/components/layout/LetsTalkButton";

const ASIDE =
  "font-display text-[16vw] font-bold uppercase leading-[0.8] tracking-[0.01em]";

const LEFT_OVERHANG = "translate-x-[-0.55em]";
const RIGHT_OVERHANG = "translate-x-[0.15em]";

const TITLE_LINES = ["Machinery", "Enquiries"];
const ASIDE_WORDS = { left: "Tech", right: "Talk" };

export default function ServicesEnquiries({ content }) {
  const titleLines = content?.titleLines?.length
    ? content.titleLines
    : TITLE_LINES;
  const aside = {
    left: content?.asideLeft || ASIDE_WORDS.left,
    right: content?.asideRight || ASIDE_WORDS.right,
  };

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
          {aside.left}
        </span>
        <span className={`block whitespace-nowrap ${RIGHT_OVERHANG} ${ASIDE}`}>
          {aside.right}
        </span>
      </span>

      <div className="enquiries-copy relative z-10 mx-auto mt-[10vh] flex flex-col items-center gap-[5vh] text-center">
        <h2
          id="services-enquiries-heading"
          className="enquiries-title font-display text-[clamp(2rem,5.2vw,5rem)] font-medium uppercase leading-[0.95] tracking-[-0.02em]"
        >
          {titleLines.map((line, index) => (
            <span key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </h2>

        <LetsTalkButton tone="dark" />
      </div>
    </section>
  );
}
