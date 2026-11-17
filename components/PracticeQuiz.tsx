"use client";

import { useState } from "react";
import Link from "next/link";
import { allQuestions, units } from "@/lib/units";

export default function PracticeQuiz() {
  const [unit, setUnit] = useState<number | "all">("all");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const qs = allQuestions.filter((q) => unit === "all" || q.unit === unit);
  const answered = qs.filter((q) => answers[q.id] !== undefined).length;
  const score = qs.filter((q) => answers[q.id] === q.answer).length;
  const missedUnits = Array.from(new Set(qs.filter((q) => answers[q.id] !== q.answer).map((q) => q.unit)));

  function restart(u: number | "all" = unit) {
    setUnit(u);
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <>
      <div className="lab-controls">
        <label className="field">
          Questions from
          <select
            value={unit}
            onChange={(e) => restart(e.target.value === "all" ? "all" : +e.target.value)}
          >
            <option value="all">All units ({allQuestions.length})</option>
            {units.map((u) => (
              <option key={u.number} value={u.number}>
                Unit {u.number}: {u.title}
              </option>
            ))}
          </select>
        </label>
        <span className="spacer" />
        <span className="small muted">
          {answered} of {qs.length} answered
        </span>
      </div>

      {submitted && (
        <div className="panel panel-pad" style={{ marginBottom: 16 }} role="status">
          <h2>
            {score} of {qs.length} correct
          </h2>
          <p className="muted" style={{ marginTop: 6 }}>
            {missedUnits.length === 0 ? (
              "Every answer is right."
            ) : (
              <>
                Review{" "}
                {missedUnits.map((n, i) => {
                  const u = units[n - 1];
                  return (
                    <span key={n}>
                      {i > 0 && (i === missedUnits.length - 1 ? " and " : ", ")}
                      <Link href={`/units/${u.slug}`}>Unit {n}</Link>
                    </span>
                  );
                })}{" "}
                before trying again.
              </>
            )}
          </p>
        </div>
      )}

      <div className="panel">
        {qs.map((q, i) => {
          const choice = answers[q.id];
          return (
            <fieldset key={q.id} className="q" style={{ border: 0, margin: 0 }}>
              <legend className="q-prompt" style={{ padding: 0, float: "left", width: "100%" }}>
                <span className="mono muted">{i + 1}. </span>
                {q.prompt}
                <span className="small muted" style={{ fontWeight: 400 }}>
                  {" "}
                  (Unit {q.unit})
                </span>
              </legend>
              <div className="choices" style={{ clear: "both" }}>
                {q.choices.map((c, ci) => {
                  let cls = "choice";
                  if (submitted && ci === q.answer) cls += " is-right";
                  else if (submitted && ci === choice) cls += " is-wrong";
                  return (
                    <label key={ci} className={cls}>
                      <input
                        type="radio"
                        name={q.id}
                        disabled={submitted}
                        checked={choice === ci}
                        onChange={() => setAnswers({ ...answers, [q.id]: ci })}
                      />
                      <span>{c}</span>
                    </label>
                  );
                })}
              </div>
              {submitted && (
                <p className="feedback">
                  <strong className={choice === q.answer ? "right" : "wrong"}>
                    {choice === q.answer ? "Correct." : choice === undefined ? "Skipped." : "Not quite."}
                  </strong>{" "}
                  {q.explain}
                </p>
              )}
            </fieldset>
          );
        })}
      </div>

      <div className="row" style={{ marginTop: 16 }}>
        {submitted ? (
          <button className="btn btn-primary" onClick={() => restart()}>
            Try again
          </button>
        ) : (
          <button
            className="btn btn-primary"
            disabled={answered === 0}
            onClick={() => {
              setSubmitted(true);
              window.scrollTo({ top: 0 });
            }}
          >
            Score my answers
          </button>
        )}
      </div>
    </>
  );
}
