"use client";

import { useMemo, useState } from "react";

const DEFAULT_TEXT = `the river runs past the school . the school sits on a hill above the river .
in spring the hill is green and the river is high . in winter the hill is white and the river is slow .
students walk to the school by the river . some students run up the hill after school .
the bus stops at the bottom of the hill . the bus is late in winter .`;

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/([.,!?;:])/g, " $1 ")
    .split(/\s+/)
    .filter(Boolean);
}

function buildCounts(tokens: string[]) {
  const counts = new Map<string, Map<string, number>>();
  for (let i = 0; i < tokens.length - 1; i++) {
    const a = tokens[i];
    const b = tokens[i + 1];
    if (!counts.has(a)) counts.set(a, new Map());
    const m = counts.get(a)!;
    m.set(b, (m.get(b) ?? 0) + 1);
  }
  return counts;
}

export default function BigramLab() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [words, setWords] = useState<string[]>(["the"]);
  const [temp, setTemp] = useState(1);

  const tokens = useMemo(() => tokenize(text), [text]);
  const counts = useMemo(() => buildCounts(tokens), [tokens]);
  const vocab = useMemo(() => Array.from(new Set(tokens.filter((t) => /\w/.test(t)))).sort(), [tokens]);

  const last = words[words.length - 1];
  const next = counts.get(last);

  const rows = useMemo(() => {
    if (!next) return [];
    const entries = Array.from(next.entries());
    const total = entries.reduce((s, [, c]) => s + c, 0);
    const weights = entries.map(([, c]) => Math.pow(c, 1 / temp));
    const wsum = weights.reduce((s, w) => s + w, 0);
    return entries
      .map(([w, c], i) => ({ w, c, raw: c / total, p: weights[i] / wsum }))
      .sort((a, b) => b.c - a.c || a.w.localeCompare(b.w));
  }, [next, temp]);

  function add(w: string) {
    setWords((ws) => [...ws, w]);
  }

  function sample() {
    if (!rows.length) return;
    let r = Math.random();
    for (const row of rows) {
      r -= row.p;
      if (r <= 0) return add(row.w);
    }
    add(rows[rows.length - 1].w);
  }

  function generate(n: number) {
    let ws = [...words];
    for (let s = 0; s < n; s++) {
      const m = counts.get(ws[ws.length - 1]);
      if (!m) break;
      const entries = Array.from(m.entries());
      const weights = entries.map(([, c]) => Math.pow(c, 1 / temp));
      let r = Math.random() * weights.reduce((a, b) => a + b, 0);
      let pick = entries[entries.length - 1][0];
      for (let i = 0; i < entries.length; i++) {
        r -= weights[i];
        if (r <= 0) {
          pick = entries[i][0];
          break;
        }
      }
      ws = [...ws, pick];
    }
    setWords(ws);
  }

  return (
    <div>
      <details>
        <summary className="small muted" style={{ cursor: "pointer", marginBottom: 8 }}>
          Training text: {tokens.length} tokens, {vocab.length} distinct words. Click to edit.
        </summary>
        <textarea
          rows={6}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setWords([tokenize(e.target.value)[0] ?? ""]);
          }}
          aria-label="Training text"
        />
        <div className="row" style={{ marginTop: 6, marginBottom: 12 }}>
          <button className="btn btn-quiet" onClick={() => { setText(DEFAULT_TEXT); setWords(["the"]); }}>
            Restore original text
          </button>
        </div>
      </details>

      <div className="lab-controls" style={{ marginTop: 8 }}>
        <label className="field">
          Start word
          <select
            value={words[0]}
            onChange={(e) => setWords([e.target.value])}
          >
            {vocab.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Temperature <b className="mono" style={{ color: "var(--text)", width: 28 }}>{temp.toFixed(1)}</b>
          <input type="range" min={0.1} max={3} step={0.1} value={temp} onChange={(e) => setTemp(+e.target.value)} />
        </label>
        <span className="spacer" />
        <button className="btn btn-primary" onClick={sample} disabled={!rows.length}>
          Sample next word
        </button>
        <button className="btn" onClick={() => generate(10)} disabled={!rows.length}>
          Generate 10
        </button>
        <button className="btn btn-quiet" onClick={() => setWords(words.length > 1 ? words.slice(0, -1) : words)}>
          Undo
        </button>
        <button className="btn btn-quiet" onClick={() => setWords([words[0]])}>
          Reset
        </button>
      </div>

      <div className="sentence" aria-live="polite">
        {words.map((w, i) => (
          <span key={i}>
            {i > 0 && !/^[.,!?;:]$/.test(w) ? " " : ""}
            <span className={i === words.length - 1 ? "last" : undefined}>{w}</span>
          </span>
        ))}
      </div>

      <div className="table-wrap" style={{ marginTop: 14 }}>
        <table>
          <thead>
            <tr>
              <th>Next word after &quot;{last}&quot;</th>
              <th className="num">Count</th>
              <th className="num">P (raw)</th>
              <th className="num">P at temp {temp.toFixed(1)}</th>
              <th style={{ width: "34%" }} className="hide-sm">
                <span className="sr-only">Bar</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="muted">
                  No word ever follows &quot;{last}&quot; in the training text, so the model has nothing to predict. Undo or
                  pick a new start word.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.w} className="clickable" onClick={() => add(r.w)} title={`Add "${r.w}"`}>
                <td className="mono">{r.w}</td>
                <td className="num">{r.c}</td>
                <td className="num">{r.raw.toFixed(2)}</td>
                <td className="num">{r.p.toFixed(2)}</td>
                <td className="hide-sm" style={{ verticalAlign: "middle" }}>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${Math.max(2, r.p * 100)}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small muted" style={{ marginTop: 8 }}>
        Click a row to add that word. P (raw) is count divided by total. Temperature raises each count to the power 1/T before
        dividing.
      </p>
    </div>
  );
}
