"use client";

import { useState } from "react";
import Link from "next/link";
import { glossary } from "@/lib/glossary";
import { units } from "@/lib/units";

export default function GlossaryList() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const items = glossary.filter(
    (t) => !query || t.term.toLowerCase().includes(query) || t.def.toLowerCase().includes(query)
  );

  return (
    <>
      <div className="lab-controls">
        <input
          type="search"
          placeholder="Search terms"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search glossary"
          style={{ width: 280, maxWidth: "100%" }}
        />
        <span className="small muted">
          {items.length} of {glossary.length} terms
        </span>
      </div>
      <div className="panel glossary">
        <dl>
          {items.map((t) => {
            const u = t.unit ? units[t.unit - 1] : undefined;
            return (
              <div className="entry" key={t.term}>
                <dt>{t.term}</dt>
                <dd>
                  {t.def}{" "}
                  {u && (
                    <Link href={`/units/${u.slug}`} className="small">
                      Unit {u.number}
                    </Link>
                  )}
                </dd>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="entry">
              <dd>No terms match &quot;{q}&quot;.</dd>
            </div>
          )}
        </dl>
      </div>
    </>
  );
}
