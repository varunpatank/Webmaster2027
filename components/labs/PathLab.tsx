"use client";

import { useEffect, useRef, useState } from "react";

const COLS = 24;
const ROWS = 14;
const START = 7 * COLS + 2;
const GOAL = 6 * COLS + 21;

type Algo = "bfs" | "astar";
type Result = { visited: number[]; path: number[] };

function defaultWalls(): boolean[] {
  const w = new Array(COLS * ROWS).fill(false);
  for (let r = 0; r <= 9; r++) w[r * COLS + 8] = true;
  for (let r = 4; r < ROWS; r++) w[r * COLS + 15] = true;
  for (let c = 9; c <= 12; c++) w[11 * COLS + c] = true;
  return w;
}

function neighbors(i: number) {
  const r = Math.floor(i / COLS);
  const c = i % COLS;
  const out: number[] = [];
  if (r > 0) out.push(i - COLS);
  if (c < COLS - 1) out.push(i + 1);
  if (r < ROWS - 1) out.push(i + COLS);
  if (c > 0) out.push(i - 1);
  return out;
}

function manhattan(a: number, b: number) {
  return Math.abs(Math.floor(a / COLS) - Math.floor(b / COLS)) + Math.abs((a % COLS) - (b % COLS));
}

function tracePath(prev: Map<number, number>) {
  if (!prev.has(GOAL)) return [];
  const path = [GOAL];
  let cur = GOAL;
  while (cur !== START) {
    cur = prev.get(cur)!;
    path.push(cur);
  }
  return path.reverse();
}

function bfs(walls: boolean[]): Result {
  const prev = new Map<number, number>();
  const seen = new Set([START]);
  const queue = [START];
  const visited: number[] = [];
  while (queue.length) {
    const cur = queue.shift()!;
    visited.push(cur);
    if (cur === GOAL) break;
    for (const n of neighbors(cur)) {
      if (walls[n] || seen.has(n)) continue;
      seen.add(n);
      prev.set(n, cur);
      queue.push(n);
    }
  }
  return { visited, path: tracePath(prev) };
}

function astar(walls: boolean[]): Result {
  const prev = new Map<number, number>();
  const g = new Map<number, number>([[START, 0]]);
  const open = new Set([START]);
  const closed = new Set<number>();
  const visited: number[] = [];
  while (open.size) {
    let best = -1;
    let bestF = Infinity;
    let bestH = Infinity;
    for (const i of open) {
      const h = manhattan(i, GOAL);
      const f = g.get(i)! + h;
      if (f < bestF || (f === bestF && h < bestH)) {
        best = i;
        bestF = f;
        bestH = h;
      }
    }
    open.delete(best);
    closed.add(best);
    visited.push(best);
    if (best === GOAL) break;
    for (const n of neighbors(best)) {
      if (walls[n] || closed.has(n)) continue;
      const ng = g.get(best)! + 1;
      if (ng < (g.get(n) ?? Infinity)) {
        g.set(n, ng);
        prev.set(n, best);
        open.add(n);
      }
    }
  }
  return { visited, path: tracePath(prev) };
}

const NAMES: Record<Algo, string> = { bfs: "Breadth-first search", astar: "A* (Manhattan)" };

export default function PathLab() {
  const [walls, setWalls] = useState<boolean[]>(defaultWalls);
  const [run, setRun] = useState<{ algo: Algo; result: Result } | null>(null);
  const [shown, setShown] = useState(0);
  const [scores, setScores] = useState<Partial<Record<Algo, { explored: number; length: number | null }>>>({});
  const paintValue = useRef<boolean | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!run) return;
    const total = run.result.visited.length;
    if (shown >= total) return;
    const t = setTimeout(() => setShown((s) => Math.min(total, s + 3)), 16);
    return () => clearTimeout(t);
  }, [run, shown]);

  function start(algo: Algo) {
    const result = algo === "bfs" ? bfs(walls) : astar(walls);
    setRun({ algo, result });
    setShown(0);
    setScores((s) => ({
      ...s,
      [algo]: { explored: result.visited.length, length: result.path.length ? result.path.length - 1 : null },
    }));
  }

  function cellAt(e: React.PointerEvent) {
    const el = gridRef.current!;
    const rect = el.getBoundingClientRect();
    const c = Math.floor(((e.clientX - rect.left) / rect.width) * COLS);
    const r = Math.floor(((e.clientY - rect.top) / rect.height) * ROWS);
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return -1;
    return r * COLS + c;
  }

  function edit(i: number) {
    if (i < 0 || i === START || i === GOAL || paintValue.current === null) return;
    if (walls[i] === paintValue.current) return;
    const v = paintValue.current;
    setWalls((w) => {
      const next = w.slice();
      next[i] = v;
      return next;
    });
    setRun(null);
    setScores({});
  }

  const done = run !== null && shown >= run.result.visited.length;
  const visitedSet = new Set(run ? run.result.visited.slice(0, shown) : []);
  const pathSet = new Set(done && run ? run.result.path : []);

  return (
    <div>
      <div className="lab-controls">
        <button className="btn btn-primary" onClick={() => start("bfs")}>
          Run BFS
        </button>
        <button className="btn btn-primary" onClick={() => start("astar")}>
          Run A*
        </button>
        <span className="spacer" />
        <button
          className="btn btn-quiet"
          onClick={() => {
            setWalls(defaultWalls());
            setRun(null);
            setScores({});
          }}
        >
          Reset map
        </button>
        <button
          className="btn btn-quiet"
          onClick={() => {
            setWalls(new Array(COLS * ROWS).fill(false));
            setRun(null);
            setScores({});
          }}
        >
          Clear walls
        </button>
      </div>

      <div
        ref={gridRef}
        className="cellgrid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, cursor: "pointer" }}
        onPointerDown={(e) => {
          const i = cellAt(e);
          if (i < 0) return;
          (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
          paintValue.current = !walls[i];
          edit(i);
        }}
        onPointerMove={(e) => paintValue.current !== null && edit(cellAt(e))}
        onPointerUp={() => (paintValue.current = null)}
        onPointerLeave={() => (paintValue.current = null)}
        role="img"
        aria-label="Grid map. Click cells to toggle walls."
      >
        {walls.map((w, i) => {
          let bg = "#0f1318";
          if (w) bg = "#5f6977";
          else if (pathSet.has(i)) bg = "var(--series-a)";
          else if (visitedSet.has(i)) bg = "rgba(74,134,214,0.38)";
          const label = i === START ? "S" : i === GOAL ? "G" : "";
          return (
            <div
              key={i}
              style={{
                background: label ? "var(--text)" : bg,
                color: "#0e1218",
                fontSize: 10,
                fontWeight: 600,
                display: "grid",
                placeItems: "center",
              }}
            >
              {label}
            </div>
          );
        })}
      </div>

      <div className="caption">
        <span className="row" style={{ gap: 14 }}>
          <span className="key">
            <span className="swatch" style={{ background: "rgba(74,134,214,0.6)" }} /> explored
          </span>
          <span className="key">
            <span className="swatch" style={{ background: "var(--series-a)" }} /> path
          </span>
          <span className="key">
            <span className="swatch" style={{ background: "#5f6977" }} /> wall
          </span>
        </span>
        <span>{run ? `${NAMES[run.algo]}: ${Math.min(shown, run.result.visited.length)} cells` : "S is start, G is goal"}</span>
      </div>

      <div className="table-wrap" style={{ marginTop: 14 }}>
        <table>
          <thead>
            <tr>
              <th>Algorithm</th>
              <th className="num">Cells explored</th>
              <th className="num">Path length</th>
            </tr>
          </thead>
          <tbody>
            {(["bfs", "astar"] as Algo[]).map((a) => {
              const s = scores[a];
              return (
                <tr key={a}>
                  <td>{NAMES[a]}</td>
                  <td className="num">{s ? s.explored : "Not run"}</td>
                  <td className="num">{s ? (s.length === null ? "No path" : `${s.length} steps`) : "Not run"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
