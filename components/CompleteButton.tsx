"use client";

import { useProgress } from "@/lib/progress";

export default function CompleteButton({ slug }: { slug: string }) {
  const { done, toggle } = useProgress();
  const isDone = done.includes(slug);
  return (
    <div className="row">
      <button className={isDone ? "btn" : "btn btn-primary"} onClick={() => toggle(slug)}>
        {isDone ? "Mark as not done" : "Mark unit complete"}
      </button>
      {isDone && <span className="status done">Saved in this browser</span>}
    </div>
  );
}
