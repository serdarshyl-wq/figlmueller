"use client";

import useMediaQuery from "@/hooks/useMediaQuery";

export default function useIsTablet() {
  return useMediaQuery("(min-width: 768px) and (max-width: 1279px)");
}
