"use client";

import { useState } from "react";
import type { Question } from "@/lib/units";

export default function CheckQuestions({ questions }: { questions: Question[] }) {
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  return (
    <div className="panel">
      {questions.map((q, i) => {
        const isChecked = checked[q.id];
        const choice = picked[q.id];
        const right = choice === q.answer;
        return (
          <fieldset key={q.id} className="q" style={{ border: 0, margin: 0 }}>
            <legend className="q-prompt" style={{ padding: 0, float: "left", width: "100%" }}>
              <span className="mono muted">{i + 1}. </span>
              {q.prompt}
            </legend>
            <div className="choices" style={{ clear: "both" }}>
              {q.choices.map((c, ci) => {
                let cls = "choice";
                if (isChecked && ci === q.answer) cls += " is-right";
                else if (isChecked && ci === choice) cls += " is-wrong";
                return (
                  <label key={ci} className={cls}>
                    <input
                      type="radio"
                      name={q.id}
                      checked={choice === ci}
                      onChange={() => {
                        setPicked({ ...picked, [q.id]: ci });
                        setChecked({ ...checked, [q.id]: false });
                      }}
                    />
                    <span>{c}</span>
                  </label>
                );
              })}
            </div>
            <div className="row" style={{ marginTop: 10 }}>
              <button
                className="btn"
                disabled={choice === undefined}
                onClick={() => setChecked({ ...checked, [q.id]: true })}
              >
                Check answer
              </button>
            </div>
            {isChecked && (
              <p className="feedback" role="status">
                <strong className={right ? "right" : "wrong"}>{right ? "Correct." : "Not quite."}</strong>{" "}
                {q.explain}
              </p>
            )}
          </fieldset>
        );
      })}
    </div>
  );
}
