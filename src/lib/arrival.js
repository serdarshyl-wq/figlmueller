"use client";

let lastPage = null;

export const ARRIVAL_MS = 1600;

export function rememberPage(pathname) {
  lastPage = pathname;
}

export function arrivedByNavigation(pathname) {
  return lastPage !== null && lastPage !== pathname;
}

const SHEET_OUT_MS = 620;
const LEAVING = "sheet";

let leaving = 0;

export function leaveAsSheet() {
  const root = document.documentElement;
  root.dataset.leaving = LEAVING;

  window.clearTimeout(leaving);
  leaving = window.setTimeout(() => {
    if (root.dataset.leaving === LEAVING) delete root.dataset.leaving;
  }, SHEET_OUT_MS + 300);
}
