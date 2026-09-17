"use client";

import useMediaQuery from "@/hooks/useMediaQuery";

export default function useIsPhone() {
  return useMediaQuery("(max-width: 767px)");
}
