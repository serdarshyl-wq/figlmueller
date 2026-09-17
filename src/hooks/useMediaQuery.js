"use client";

import { useSyncExternalStore } from "react";

const stores = new Map();

function storeFor(query) {
  let store = stores.get(query);
  if (store) return store;

  store = {
    subscribe(callback) {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    getSnapshot: () => window.matchMedia(query).matches,
  };

  stores.set(query, store);
  return store;
}

const getServerSnapshot = () => false;

export default function useMediaQuery(query) {
  const store = storeFor(query);
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    getServerSnapshot
  );
}
