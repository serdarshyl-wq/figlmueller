"use client";

import useMediaQuery from "@/hooks/useMediaQuery";

export default function useIsCompact() {
  return useMediaQuery("(max-width: 1279px)");
}
