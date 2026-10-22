/*
 * The four as the page ships with them, in the order they are read across the
 * screen: the first on the left, the two after it in the middle, the last on
 * the right. The studio holds the same one list.
 */
const SHIPPED = [
  { label: "Machinery & sales:", email: "sales@figlmueller.com" },
  { label: "General enquiries:", email: "info@figlmueller.com" },
  { label: "Technical support:", email: "engineering@figlmueller.com" },
  { label: "Project partnerships:", email: "partners@figlmueller.com" },
];

function Address({ label, email }) {
  return (
    <div>
      <h2 className="address-label font-display text-[clamp(0.7rem,0.85vw,1rem)] font-medium uppercase tracking-[0.06em] text-black/65">
        {label}
      </h2>

      <a
        href={`mailto:${email}`}
        className="address-email group relative mt-3 inline-block font-display text-[clamp(1.05rem,1.9vw,2.35rem)] leading-[1.15] tracking-[-0.01em]"
      >
        {email}

        <span
          aria-hidden="true"
          className="rule-swap absolute inset-x-0 -bottom-[0.14em] block h-[0.05em] bg-current"
        />
      </a>
    </div>
  );
}

export default function ContactAddresses({ addresses }) {
  const list = addresses?.length ? addresses : SHIPPED;
  const left = list[0];
  const centre = list.slice(1, -1);
  const right = list.length > 1 ? list[list.length - 1] : null;

  return (
    <section
      aria-label="Contact addresses"
      className="contact-addresses relative flex min-h-[calc(100svh-var(--footer-height,420px))] items-center px-6 py-[8vh] md:px-12"
    >
      <div className="addresses-grid grid w-full grid-cols-1 items-center gap-[7vh] text-center md:grid-cols-3 md:gap-[4vw]">
        <Address {...left} />

        <div className="addresses-centre flex flex-col gap-[9vh]">
          {centre.map((entry) => (
            <Address key={entry.email} {...entry} />
          ))}
        </div>

        {right ? <Address {...right} /> : null}
      </div>
    </section>
  );
}
