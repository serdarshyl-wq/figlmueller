import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/lib/lenis";


let locks = 0;

export function lockScroll() {
  locks += 1;
  if (locks > 1) return;

  getLenis()?.stop();
  document.documentElement.classList.add("is-scroll-locked");
}

export function unlockScroll() {
  if (locks === 0) return;

  locks -= 1;
  if (locks > 0) return;

  getLenis()?.start();
  document.documentElement.classList.remove("is-scroll-locked");

  requestAnimationFrame(() => ScrollTrigger.refresh());
}
