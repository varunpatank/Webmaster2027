"use client";

import { useMemo, useRef, useState } from "react";

const N = 16;

const KERNELS = {
  vertical: { label: "Vertical edges", w: [-1, 0, 1, -2, 0, 2, -1, 0, 1], scale: 1 },
  horizontal: { label: "Horizontal edges", w: [-1, -2, -1, 0, 0, 0, 1, 2, 1], scale: 1 },
  blur: { label: "Blur", w: [1, 1, 1, 1, 1, 1, 1, 1, 1], scale: 1 / 9 },
  sharpen: { label: "Sharpen", w: [0, -1, 0, -1, 5, -1, 0, -1, 0], scale: 1 },
} as const;

type KernelKey = keyof typeof KERNELS;

function sample(): number[] {
  // A hollow square plus a diagonal stroke: shows vertical, horizontal, and slanted edges.
  const g = new Array(N * N).fill(0);
  for (let i = 3; i <= 9; i++) {
    g[3 * N + i] = 255;
    g[9 * N + i] = 255;
    g[i * N + 3] = 255;
    g[i * N + 9] = 255;
  }
  for (let i = 0; i < 5; i++) g[(8 + i) * N + (14 - i)] = 255;
  return g;
}

function convolve(img: number[], key: KernelKey) {
  const { w, scale } = KERNELS[key];
  const out = new Array(N * N).fill(0);
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      let s = 0;
      for (let kr = -1; kr <= 1; kr++) {
        for (let kc = -1; kc <= 1; kc++) {
          const rr = r + kr;
          const cc = c + kc;
          if (rr < 0 || rr >= N || cc < 0 || cc >= N) continue;
          s += img[rr * N + cc] * w[(kr + 1) * 3 + (kc + 1)];
        }
      }
      out[r * N + c] = Math.round(s * scale);
    }
  }
  return out;
}

export default function PixelLab() {
  const [img, setImg] = useState<number[]>(sample);
  const [kernel, setKernel] = useState<KernelKey>("vertical");
  const [mode, setMode] = useState<"draw" | "erase">("draw");
  const [hover, setHover] = useState<number | null>(null);
  const painting = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const out = useMemo(() => convolve(img, kernel), [img, kernel]);
  const maxAbs = Math.max(1, ...out.map(Math.abs));

  function paintAt(e: React.PointerEvent) {
    const el = gridRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const c = Math.floor(((e.clientX - rect.left) / rect.width) * N);
    const r = Math.floor(((e.clientY - rect.top) / rect.height) * N);
    if (r < 0 || r >= N || c < 0 || c >= N) return;
    const v = mode === "draw" ? 255 : 0;
    if (img[r * N + c] === v) return;
    setImg((prev) => {
      const next = prev.slice();
      next[r * N + c] = v;
      return next;
    });
  }

  const hr = hover === null ? -1 : Math.floor(hover / N);
  const hc = hover === null ? -1 : hover % N;
  const inWindow = (i: number) => hover !== null && Math.abs(Math.floor(i / N) - hr) <= 1 && Math.abs((i % N) - hc) <= 1;

  const k = KERNELS[kernel];

  return (
    <div>
      <div className="lab-controls">
        <div className="seg" role="group" aria-label="Brush">
          <button aria-pressed={mode === "draw"} onClick={() => setMode("draw")}>
            Draw
          </button>
          <button aria-pressed={mode === "erase"} onClick={() => setMode("erase")}>
            Erase
          </button>
        </div>
        <label className="field">
          Kernel
          <select value={kernel} onChange={(e) => setKernel(e.target.value as KernelKey)}>
            {Object.entries(KERNELS).map(([key, v]) => (
              <option key={key} value={key}>
                {v.label}
              </option>
            ))}
          </select>
        </label>
        <span className="spacer" />
        <button className="btn btn-quiet" onClick={() => setImg(sample())}>
          Load sample
        </button>
        <button className="btn btn-quiet" onClick={() => setImg(new Array(N * N).fill(0))}>
          Clear
        </button>
      </div>

      <div className="grid-pair">
        <div>
          <div
            ref={gridRef}
            className="cellgrid"
            style={{ gridTemplateColumns: `repeat(${N}, 1fr)`, cursor: "crosshair" }}
            onPointerDown={(e) => {
              painting.current = true;
              (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
              paintAt(e);
            }}
            onPointerMove={(e) => painting.current && paintAt(e)}
            onPointerUp={() => (painting.current = false)}
            onPointerLeave={() => (painting.current = false)}
            role="img"
            aria-label="Input image, 16 by 16 pixels. Drag to draw."
          >
            {img.map((v, i) => (
              <div
                key={i}
                style={{
                  background: v ? "#e2e6eb" : "#0f1318",
                  outline: inWindow(i) ? "1px solid var(--accent)" : undefined,
                  outlineOffset: -1,
                }}
              />
            ))}
          </div>
          <div className="caption">
            <span>Input: 0 is black, 255 is white</span>
            <span className="mono">16 x 16</span>
          </div>
        </div>

        <div>
          <div
            className="cellgrid"
            style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}
            onPointerLeave={() => setHover(null)}
            role="img"
            aria-label={`Feature map after applying the ${k.label} kernel`}
          >
            {out.map((v, i) => {
              const a = Math.abs(v) / maxAbs;
              const color = v >= 0 ? `rgba(74,134,214,${a})` : `rgba(185,135,62,${a})`;
              return (
                <div
                  key={i}
                  onPointerEnter={() => setHover(i)}
                  style={{
                    background: v === 0 ? "#0f1318" : color,
                    outline: hover === i ? "1px solid var(--text)" : undefined,
                    outlineOffset: -1,
                  }}
                />
              );
            })}
          </div>
          <div className="caption">
            <span>
              {hover === null ? (
                "Hover a cell to see its value"
              ) : (
                <>
                  Row {hr + 1}, col {hc + 1}: <b className="mono" style={{ color: "var(--text)" }}>{out[hover]}</b>
                </>
              )}
            </span>
            <span className="row" style={{ gap: 12 }}>
              <span className="key">
                <span className="swatch" style={{ background: "var(--series-b)" }} /> positive
              </span>
              <span className="key">
                <span className="swatch" style={{ background: "var(--series-a)" }} /> negative
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="row" style={{ marginTop: 16, gap: 16, alignItems: "flex-start" }}>
        <div>
          <div className="small muted" style={{ marginBottom: 6 }}>
            {k.label} kernel{k.scale !== 1 ? ", each weight divided by 9" : ""}
          </div>
          <div className="kernel">
            {k.w.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>
        </div>
        <p className="small muted" style={{ maxWidth: "48ch" }}>
          Each output cell is the sum of the nine input values under the outlined window, each multiplied by the matching
          kernel weight. Pixels past the border count as 0.
        </p>
      </div>
    </div>
  );
}
