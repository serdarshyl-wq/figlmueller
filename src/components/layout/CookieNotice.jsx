"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import ActionButton from "@/components/ui/ActionButton";

const NOTICE =
  "By continue to use this website, you agree to our Privacy policy.";

const EXIT_MS = 600;

const SEEN_KEY = "figlmueller:cookies";

const seen = () => {
  try {
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
};

const remember = () => {
  try {
    window.localStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* Nothing to keep it in - the notice simply shows again. */
  }
};

export default function CookieNotice() {
  const [open, setOpen] = useState(false);
  const [settled, setSettled] = useState(false);
  const exitRef = useRef(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(!seen()));

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(exitRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(() => setSettled(true));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const leave = () => {
    remember();
    setSettled(false);
    window.clearTimeout(exitRef.current);
    exitRef.current = window.setTimeout(() => setOpen(false), EXIT_MS);
  };

  const accept = () => {
    /* The studio's own accept handling goes here. */
    leave();
  };

  const dismiss = () => {
    /* The studio's own close handling goes here. */
    leave();
  };

  if (!open) return null;

  return (
    <aside
      aria-labelledby="cookie-title"
      className={`cookie-notice ${settled ? "is-in" : ""}`}
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Close"
        className="cookie-close"
      >
        <X aria-hidden="true" className="size-4" strokeWidth={1.6} />
      </button>

      <h2 id="cookie-title" className="cookie-title">
        Cookies
      </h2>

      <p className="cookie-copy">
        {NOTICE.split("Privacy policy")[0]}
        <Link href="/privacy-policy" className="cookie-link">
          Privacy policy
        </Link>
        .
      </p>

      <ActionButton onClick={accept} className="cookie-accept cursor-pointer">
        Accept
      </ActionButton>
    </aside>
  );
}
