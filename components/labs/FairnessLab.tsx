"use client";

import { useMemo, useState } from "react";

type Person = { score: number; qualified: boolean };
type GroupKey = "A" | "B";

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeGroup(seed: number, nQual: number, nUnqual: number, qMean: number, uMean: number): Person[] {
  const r = rng(seed);
  const normal = (m: number, s: number) => {
    const u = Math.max(1e-9, r());
    const v = r();
    return m + s * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const clamp = (x: number) => Math.min(99, Math.max(0, Math.round(x)));
  const out: Person[] = [];
  for (let i = 0; i < nQual; i++) out.push({ score: clamp(normal(qMean, 11)), qualified: true });
  for (let i = 0; i < nUnqual; i++) out.push({ score: clamp(normal(uMean, 11)), qualified: false });
  return out;
}

const DATA: Record<GroupKey, Person[]> = {
  A: makeGroup(11, 100, 100, 66, 44),
  B: makeGroup(29, 80, 120, 56, 40),
};

function metrics(people: Person[], t: number) {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  for (const p of people) {
    const yes = p.score >= t;
    if (p.qualified && yes) tp++;
    else if (p.qualified) fn++;
    else if (yes) fp++;
    else tn++;
  }
  return {
    tpr: tp / (tp + fn),
    fpr: fp / (fp + tn),
    approval: (tp + fp) / people.length,
    accuracy: (tp + tn) / people.length,
  };
}

const BIN = 2;
const BINS = 100 / BIN;
const CW = 640;
const HALF = 62;
const CH = HALF * 2 + 22;

function bins(people: Person[]) {
  const q = new Array(BINS).fill(0);
  const u = new Array(BINS).fill(0);
  for (const p of people) {
    const b = Math.min(BINS - 1, Math.floor(p.score / BIN));
    if (p.qualified) q[b]++;
    else u[b]++;
  }
  return { q, u };
}

const MAX = Math.max(
  ...(["A", "B"] as GroupKey[]).flatMap((g) => {
    const b = bins(DATA[g]);
    return [...b.q, ...b.u];
  })
);

function Chart({ group, t }: { group: GroupKey; t: number }) {
  const { q, u } = useMemo(() => bins(DATA[group]), [group]);
  const [hover, setHover] = useState<number | null>(null);
  const bw = CW / BINS;
  const scale = (HALF - 4) / MAX;
  const tx = (t / 100) * CW;

  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox={`0 0 ${CW} ${CH}`}
        width="100%"
        role="img"
        aria-label={`Group ${group} score distribution. Qualified applicants above the axis, not qualified below. Threshold at ${t}.`}
        onMouseLeave={() => setHover(null)}
      >
        <rect x={0} y={0} width={CW} height={HALF * 2} fill="#0f1318" />
        {q.map((n, i) => {
          const on = i * BIN >= t;
          const h = n * scale;
          return (
            <g key={i} onMouseEnter={() => setHover(i)}>
              <rect x={i * bw} y={0} width={bw} height={HALF * 2} fill="transparent" />
              {n > 0 && (
                <rect x={i * bw + 1} y={HALF - h} width={bw - 2} height={h} rx={2} fill="#4a86d6" opacity={on ? 1 : 0.32} />
              )}
              {u[i] > 0 && (
                <rect
                  x={i * bw + 1}
                  y={HALF}
                  width={bw - 2}
                  height={u[i] * scale}
                  rx={2}
                  fill="#b9873e"
                  opacity={on ? 1 : 0.32}
                />
              )}
            </g>
          );
        })}
        <line x1={0} x2={CW} y1={HALF} y2={HALF} stroke="#3a4452" strokeWidth={1} />
        {hover !== null && (
          <rect x={hover * bw} y={0} width={bw} height={HALF * 2} fill="none" stroke="#8d97a5" strokeWidth={1} />
        )}
        <line x1={tx} x2={tx} y1={0} y2={HALF * 2} stroke="#e2e6eb" strokeWidth={2} />
        {[0, 20, 40, 60, 80, 100].map((v) => (
          <text
            key={v}
            x={(v / 100) * CW}
            y={CH - 6}
            fill="#8d97a5"
            fontSize={11}
            textAnchor={v === 0 ? "start" : v === 100 ? "end" : "middle"}
            fontFamily="var(--font-mono)"
          >
            {v}
          </text>
        ))}
      </svg>
      {hover !== null && (
        <div
          className="tooltip"
          style={{
            left: `${Math.min(78, Math.max(0, ((hover * BIN) / 100) * 100 - 6))}%`,
            top: 4,
          }}
        >
          Scores {hover * BIN} to {hover * BIN + BIN - 1}: {q[hover]} qualified, {u[hover]} not qualified
          <br />
          {hover * BIN >= t ? "Approved" : "Denied"}
        </div>
      )}
    </div>
  );
}

const pct = (x: number) => `${(x * 100).toFixed(0)}%`;
const pp = (x: number) => `${(Math.abs(x) * 100).toFixed(0)} pts`;

export default function FairnessLab() {
  const [t, setT] = useState<Record<GroupKey, number>>({ A: 54, B: 54 });
  const m = { A: metrics(DATA.A, t.A), B: metrics(DATA.B, t.B) };

  function equalizeTpr() {
    let best = t.B;
    let gap = Infinity;
    for (let x = 0; x <= 100; x += BIN) {
      const g = Math.abs(metrics(DATA.B, x).tpr - m.A.tpr);
      if (g < gap) {
        gap = g;
        best = x;
      }
    }
    setT({ ...t, B: best });
  }

  return (
    <div>
      <div className="lab-controls">
        <button className="btn" onClick={() => setT({ A: t.A, B: t.A })}>
          Use one threshold
        </button>
        <button className="btn" onClick={equalizeTpr}>
          Equalize TPR
        </button>
        <span className="spacer" />
        <span className="key">
          <span className="swatch" style={{ background: "#4a86d6" }} /> Qualified (above line)
        </span>
        <span className="key">
          <span className="swatch" style={{ background: "#b9873e" }} /> Not qualified (below line)
        </span>
      </div>

      {(["A", "B"] as GroupKey[]).map((g) => (
        <div key={g} style={{ marginBottom: 16 }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
            <h3>
              Group {g}{" "}
              <span className="small muted" style={{ fontWeight: 400 }}>
                {DATA[g].length} applicants, {DATA[g].filter((p) => p.qualified).length} qualified
              </span>
            </h3>
            <label className="field">
              Threshold <b className="mono" style={{ color: "var(--text)", width: 22 }}>{t[g]}</b>
              <input
                type="range"
                min={0}
                max={100}
                step={BIN}
                value={t[g]}
                onChange={(e) => setT({ ...t, [g]: +e.target.value })}
                aria-label={`Group ${g} threshold`}
              />
            </label>
          </div>
          <Chart group={g} t={t[g]} />
        </div>
      ))}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Group</th>
              <th className="num">Threshold</th>
              <th className="num">Approval rate</th>
              <th className="num">TPR</th>
              <th className="num">FPR</th>
              <th className="num">Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {(["A", "B"] as GroupKey[]).map((g) => (
              <tr key={g}>
                <td>Group {g}</td>
                <td className="num">{t[g]}</td>
                <td className="num">{pct(m[g].approval)}</td>
                <td className="num">{pct(m[g].tpr)}</td>
                <td className="num">{pct(m[g].fpr)}</td>
                <td className="num">{pct(m[g].accuracy)}</td>
              </tr>
            ))}
            <tr>
              <td className="muted">Gap</td>
              <td className="num muted">{Math.abs(t.A - t.B)}</td>
              <td className="num muted">{pp(m.A.approval - m.B.approval)}</td>
              <td className="num muted">{pp(m.A.tpr - m.B.tpr)}</td>
              <td className="num muted">{pp(m.A.fpr - m.B.fpr)}</td>
              <td className="num muted">{pp(m.A.accuracy - m.B.accuracy)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="small muted" style={{ marginTop: 8, maxWidth: "72ch" }}>
        Applicants at or above the threshold are approved; faded bars are denied. All data on this page is simulated with a
        fixed random seed so every class sees the same numbers.
      </p>
    </div>
  );
}
