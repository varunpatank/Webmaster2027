"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const W = 640;
const H = 380;
const CELL = 8;
const COLORS = ["#b9873e", "#4a86d6"];
const FILLS = ["rgba(185,135,62,0.17)", "rgba(74,134,214,0.17)"];
const NAMES = ["A", "B"];

type Pt = { x: number; y: number; c: 0 | 1 };

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function samplePoints(): Pt[] {
  const r = rng(7);
  const pts: Pt[] = [];
  const blob = (cx: number, cy: number, n: number, c: 0 | 1, spread: number) => {
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * spread;
      pts.push({ x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d * 1.3, c });
    }
  };
  blob(0.3, 0.38, 14, 0, 0.17);
  blob(0.68, 0.62, 14, 1, 0.17);
  blob(0.78, 0.22, 5, 0, 0.08);
  pts.push({ x: 0.34, y: 0.4, c: 1 });
  return pts;
}

function nearest(pts: Pt[], x: number, y: number, k: number, skip = -1) {
  const d: { i: number; d: number }[] = [];
  pts.forEach((p, i) => {
    if (i === skip) return;
    const dx = p.x - x;
    const dy = (p.y - y) * (H / W);
    d.push({ i, d: dx * dx + dy * dy });
  });
  d.sort((a, b) => a.d - b.d);
  return d.slice(0, k).map((o) => o.i);
}

function vote(pts: Pt[], idx: number[]) {
  let b = 0;
  for (const i of idx) b += pts[i].c;
  return { b, a: idx.length - b, cls: (b * 2 > idx.length ? 1 : 0) as 0 | 1 };
}

export default function KnnLab({ compact = false }: { compact?: boolean }) {
  const [pts, setPts] = useState<Pt[]>(samplePoints);
  const [k, setK] = useState(1);
  const [cls, setCls] = useState<0 | 1>(0);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLCanvasElement>(null);

  const kk = Math.min(k, Math.max(1, pts.length));

  const loo = useMemo(() => {
    if (pts.length < 2) return null;
    let right = 0;
    pts.forEach((p, i) => {
      const v = vote(pts, nearest(pts, p.x, p.y, Math.min(kk, pts.length - 1), i));
      if (v.cls === p.c) right++;
    });
    return right / pts.length;
  }, [pts, kk]);

  const hoverInfo = useMemo(() => {
    if (!cursor || pts.length === 0) return null;
    const idx = nearest(pts, cursor.x, cursor.y, kk);
    return { idx, ...vote(pts, idx) };
  }, [cursor, pts, kk]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr;
    cv.height = H * dpr;
    const ctx = cv.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#0f1318";
    ctx.fillRect(0, 0, W, H);

    if (pts.length) {
      for (let y = 0; y < H; y += CELL) {
        for (let x = 0; x < W; x += CELL) {
          const v = vote(pts, nearest(pts, (x + CELL / 2) / W, (y + CELL / 2) / H, kk));
          ctx.fillStyle = FILLS[v.cls];
          ctx.fillRect(x, y, CELL, CELL);
        }
      }
    }

    if (hoverInfo && cursor) {
      ctx.strokeStyle = "rgba(226,230,235,0.55)";
      ctx.lineWidth = 1;
      for (const i of hoverInfo.idx) {
        ctx.beginPath();
        ctx.moveTo(cursor.x * W, cursor.y * H);
        ctx.lineTo(pts[i].x * W, pts[i].y * H);
        ctx.stroke();
      }
    }

    for (const p of pts) {
      const px = p.x * W;
      const py = p.y * H;
      ctx.fillStyle = COLORS[p.c];
      ctx.strokeStyle = "#0f1318";
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (p.c === 0) ctx.arc(px, py, 6, 0, Math.PI * 2);
      else ctx.rect(px - 5.5, py - 5.5, 11, 11);
      ctx.fill();
      ctx.stroke();
    }
  }, [pts, kk, hoverInfo, cursor]);

  function pos(e: React.MouseEvent<HTMLCanvasElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  }

  const countA = pts.filter((p) => p.c === 0).length;

  return (
    <div>
      <div className="lab-controls">
        <div className="seg" role="group" aria-label="Class to add">
          <button aria-pressed={cls === 0} onClick={() => setCls(0)}>
            Add class A
          </button>
          <button aria-pressed={cls === 1} onClick={() => setCls(1)}>
            Add class B
          </button>
        </div>
        <label className="field">
          k = <b className="mono" style={{ color: "var(--text)", width: 18 }}>{k}</b>
          <input type="range" min={1} max={15} step={2} value={k} onChange={(e) => setK(+e.target.value)} />
        </label>
        <span className="spacer" />
        <button className="btn btn-quiet" onClick={() => setPts((p) => p.slice(0, -1))} disabled={!pts.length}>
          Undo
        </button>
        <button className="btn btn-quiet" onClick={() => setPts(samplePoints())}>
          Load sample
        </button>
        {!compact && (
          <button className="btn btn-quiet" onClick={() => setPts([])}>
            Clear
          </button>
        )}
      </div>

      <canvas
        ref={ref}
        className="plot"
        style={{ aspectRatio: `${W} / ${H}` }}
        onClick={(e) => {
          const p = pos(e);
          setPts((prev) => [...prev, { ...p, c: cls }]);
        }}
        onMouseMove={(e) => setCursor(pos(e))}
        onMouseLeave={() => setCursor(null)}
        aria-label="Scatter plot of training points. Click to add a point of the selected class."
        role="img"
      />

      <div className="caption">
        <span className="row" style={{ gap: 14 }}>
          <span className="key">
            <span className="swatch" style={{ background: COLORS[0], borderRadius: 5 }} /> Class A ({countA})
          </span>
          <span className="key">
            <span className="swatch" style={{ background: COLORS[1] }} /> Class B ({pts.length - countA})
          </span>
        </span>
        <span>
          {hoverInfo
            ? `Cursor: ${hoverInfo.a} A, ${hoverInfo.b} B. Predicts ${NAMES[hoverInfo.cls]}`
            : "Hover the plot to see the k nearest points"}
        </span>
      </div>

      <div className="stats">
        <span>
          Leave-one-out accuracy <b>{loo === null ? "Need 2 points" : `${Math.round(loo * 100)}%`}</b>
        </span>
        <span>
          Training points <b>{pts.length}</b>
        </span>
      </div>
      {!compact && (
        <p className="small muted" style={{ marginTop: 8, maxWidth: "70ch" }}>
          Leave-one-out accuracy hides each point in turn, classifies it with the rest, and reports the share it got right.
          It is a simple way to estimate how the model does on points it has not seen.
        </p>
      )}
    </div>
  );
}
