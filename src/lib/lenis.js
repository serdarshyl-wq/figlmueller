import Lenis from "lenis";

let instance = null;

export function getLenis() {
  if (typeof window === "undefined") return null;

  if (!instance) {
    instance = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
  }

  return instance;
}
