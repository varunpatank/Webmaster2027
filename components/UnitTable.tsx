"use client";

import Link from "next/link";
import { units } from "@/lib/units";
import { useProgress } from "@/lib/progress";

export default function UnitTable({ showReset = false }: { showReset?: boolean }) {
  const { done, reset } = useProgress();
  const count = units.filter((u) => done.includes(u.slug)).length;

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="small muted">
          {count} of {units.length} units complete
        </span>
        {showReset && count > 0 && (
          <button className="btn btn-quiet" onClick={reset}>
            Clear progress
          </button>
        )}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Unit</th>
              <th className="hide-sm">Big idea</th>
              <th>Grades</th>
              <th className="num hide-sm">Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => {
              const isDone = done.includes(u.slug);
              return (
                <tr key={u.slug}>
                  <td className="mono muted">{u.number}</td>
                  <td>
                    <Link href={`/units/${u.slug}`}>{u.title}</Link>
                    <div className="small muted hide-sm" style={{ marginTop: 2 }}>
                      {u.summary}
                    </div>
                  </td>
                  <td className="hide-sm">{u.bigIdea}</td>
                  <td className="mono">{u.grades}</td>
                  <td className="num hide-sm">{u.minutes} min</td>
                  <td>
                    <span className={isDone ? "status done" : "status"}>{isDone ? "Done" : "Not started"}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
