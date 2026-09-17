import Link from "next/link";

export default function ActionButton({
  href,
  onClick,
  className = "",
  children,
  ...rest
}) {
  const classes = `site-pill group relative isolate inline-flex items-center rounded-full bg-white py-3.5 pl-7 pr-16 font-display text-[0.72rem] font-medium uppercase tracking-[0.16em] text-bone transition-colors duration-500 hover:text-black ${className}`;

  const fill = (
    <span
      aria-hidden="true"
      className="pill-fill absolute -inset-px -z-10 rounded-full bg-black"
    />
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {fill}
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} {...rest}>
      {fill}
      {children}
    </button>
  );
}
