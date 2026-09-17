import Image from "next/image";

export const LOGO_RATIO = 1682 / 543;

const PARTS = [
  {
    key: "icon",
    file: "logo-icon",
    hook: "logo-icon",
    stagedClass: "invisible",
    left: 5.7669,
    top: 8.2873,
    width: 23.4245,
    w: 394,
    h: 453,
  },
  {
    key: "line-one",
    file: "logo-line-1",
    hook: "logo-line",
    stagedClass: "logo-wipe",
    left: 33.3532,
    top: 10.8656,
    width: 60.8799,
    w: 1024,
    h: 204,
  },
  {
    key: "line-two",
    file: "logo-line-2",
    hook: "logo-line",
    stagedClass: "logo-wipe",
    left: 33.3532,
    top: 55.9853,
    width: 60.8799,
    w: 1024,
    h: 180,
  },
];

/**
 * @param {object} props
 * @param {"white" | "color"} [props.variant]
 * @param {string} [props.className]
 * @param {boolean} [props.staged] - start hidden, waiting to be revealed by an
 *   animation: the icon is invisible and the text lines keep their mask closed.
 * @param {boolean} [props.priority] - preload the part images.
 */
export default function LogoLockup({
  variant = "white",
  className = "",
  staged = false,
  priority = false,
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{ aspectRatio: LOGO_RATIO }}
      role="img"
      aria-label="Figlmueller Ind"
    >
      {PARTS.map((part) => (
        <div
          key={part.key}
          className={`absolute ${part.hook} ${staged ? part.stagedClass : ""}`}
          style={{
            left: `${part.left}%`,
            top: `${part.top}%`,
            width: `${part.width}%`,
          }}
        >
          <Image
            src={`/logo/parts/${part.file}-${variant}.png`}
            alt=""
            width={part.w}
            height={part.h}
            priority={priority}
            className="h-auto w-full"
          />
        </div>
      ))}
    </div>
  );
}
