"use client";

import { useSyncExternalStore } from "react";

const KEY = "groundwork-progress";
const EVENT = "groundwork-progress-change";

function read(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useProgress() {
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  let done: string[] = [];
  try {
    done = JSON.parse(raw);
  } catch {
    done = [];
  }

  function toggle(slug: string) {
    const next = done.includes(slug) ? done.filter((s) => s !== slug) : [...done, slug];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event(EVENT));
  }

  function reset() {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event(EVENT));
  }

  return { done, toggle, reset };
}
