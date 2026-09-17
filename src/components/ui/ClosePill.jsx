import { X } from "lucide-react";

export default function ClosePill({ className = "", ...rest }) {
  return (
    <button
      type="button"
      aria-label="Close"
      className={`close-pill group relative shrink-0 cursor-pointer overflow-hidden rounded-full bg-[#e3e1dc] py-4 pl-8 pr-11 font-display text-[0.9rem] font-medium uppercase tracking-[0.16em] text-black ${className}`}
      {...rest}
    >
      <span className="close-label inline-block transition-transform duration-300 ease-out group-hover:translate-x-3">
        Close
      </span>

      <X
        aria-hidden="true"
        strokeWidth={1.75}
        className="absolute right-5 top-[calc(50%-1px)] size-5 -translate-y-1/2 transition-[right] duration-300 ease-out group-hover:-right-10"
      />
      <X
        aria-hidden="true"
        strokeWidth={1.75}
        className="absolute -left-10 top-[calc(50%-1px)] size-5 -translate-y-1/2 transition-[left] duration-300 ease-out group-hover:left-5"
      />
    </button>
  );
}
