"use client";

import Link from "next/link";

export default function NavLink({
  href,
  label,
  onClick,
  className = "",
  ...rest
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      {...rest}
      className={`group relative block overflow-hidden opacity-75 transition-opacity duration-500 hover:opacity-100 ${className}`}
    >
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
        {label}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
      >
        {label}
      </span>
    </Link>
  );
}
