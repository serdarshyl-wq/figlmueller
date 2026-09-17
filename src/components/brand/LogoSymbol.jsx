import Image from "next/image";

const FILES = {
  color: "/logo/Figlmueller-Logo-Symbol-Color.png",
  white: "/logo/Figlmueller-Logo-Symbol-White.png",
};

/**
 * The mark on its own - the second of the two lockups, for pages that carry the
 * name in their own type rather than in the bar.
 *
 * @param {object} props
 * @param {"white" | "color"} [props.variant]
 * @param {string} [props.className]
 * @param {boolean} [props.priority]
 */
export default function LogoSymbol({
  variant = "white",
  className = "",
  priority = false,
}) {
  return (
    <Image
      src={FILES[variant] ?? FILES.white}
      alt=""
      width={1000}
      height={1000}
      priority={priority}
      className={`w-auto ${className}`}
    />
  );
}
