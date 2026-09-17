"use client";

import { useSyncExternalStore } from "react";

let handedOver = false;
let logoLanded = false;
let navLogoSlot = null;

const entryPath =
  typeof window === "undefined" ? null : window.location.pathname;

const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function markIntroHandedOver() {
  if (handedOver) return;

  handedOver = true;
  emit();
}

export function markLogoLanded() {
  if (logoLanded) return;

  logoLanded = true;
  emit();
}

export function arrivedFromElsewhere(pathname) {
  return entryPath !== null && entryPath !== pathname;
}

export function introAlreadyRan() {
  return handedOver;
}

export function registerNavLogoSlot(element) {
  navLogoSlot = element;
}

export function getNavLogoSlot() {
  return navLogoSlot;
}

const getHandedOver = () => handedOver;
const getLogoLanded = () => logoLanded;
const getFalse = () => false;

export function useIntroHandedOver() {
  return useSyncExternalStore(subscribe, getHandedOver, getFalse);
}

export function useLogoLanded() {
  return useSyncExternalStore(subscribe, getLogoLanded, getFalse);
}
