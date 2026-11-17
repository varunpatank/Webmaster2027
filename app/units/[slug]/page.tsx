import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { units, getUnit } from "@/lib/units";
import UnitLab from "@/components/UnitLab";
import CheckQuestions from "@/components/CheckQuestions";
import CompleteButton from "@/components/CompleteButton";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return units.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const u = getUnit(slug);
  return { title: u ? `Unit ${u.number}: ${u.title}` : "Unit not found", description: u?.summary };
}

export default async function UnitPage({ params }: Props) {
  const { slug } = await params;
  const unit = getUnit(slug);
  if (!unit) notFound();

  const prev = units.find((u) => u.number === unit.number - 1);
  const next = units.find((u) => u.number === unit.number + 1);

  return (
    <>
      <p className="eyebrow">
        <Link href="/units">Units</Link> / Unit {unit.number} of {units.length}
      </p>
      <h1>{unit.title}</h1>
      <p className="lede">{unit.summary}</p>

      <div className="unit-layout">
        <div>
          <article className="reading prose">
            {unit.reading.map((s) => (
              <section key={s.heading}>
                <h2>{s.heading}</h2>
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </section>
            ))}
          </article>

          <section className="section" id="lab">
            <div className="panel">
              <div className="panel-head">
                <h2>Lab: {unit.lab.title}</h2>
              </div>
              <div className="lab-body">
                <ol className="lab-steps" style={{ marginBottom: 16 }}>
                  {unit.lab.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                <UnitLab slug={unit.slug} />
              </div>
            </div>
          </section>

          <section className="section" id="check">
            <div className="section-head">
              <h2>Check your understanding</h2>
              <span className="small muted">{unit.questions.length} questions</span>
            </div>
            <CheckQuestions questions={unit.questions} />
          </section>

          <section className="section">
            <h2 style={{ marginBottom: 8 }}>Discuss</h2>
            <p className="prose muted">{unit.discussion}</p>
          </section>

          <div className="section">
            <CompleteButton slug={unit.slug} />
          </div>

          <nav className="unit-nav" aria-label="Unit navigation">
            <span>{prev && <Link href={`/units/${prev.slug}`}>Previous: {prev.title}</Link>}</span>
            <span>
              {next ? (
                <Link href={`/units/${next.slug}`}>Next: {next.title}</Link>
              ) : (
                <Link href="/practice">Take the practice quiz</Link>
              )}
            </span>
          </nav>
        </div>

        <aside className="aside">
          <div className="panel panel-pad" style={{ position: "sticky", top: 16 }}>
            <dl>
              <dt>Big idea</dt>
              <dd>{unit.bigIdea}</dd>
              <dt>Grades</dt>
              <dd>{unit.grades}</dd>
              <dt>Time</dt>
              <dd>{unit.minutes} min</dd>
              <dt>Standards</dt>
              <dd>{unit.standards.join(", ")}</dd>
            </dl>
            <h3 style={{ marginTop: 16 }}>You will be able to</h3>
            <ol>
              {unit.objectives.map((o) => (
                <li key={o} className="muted">
                  {o}
                </li>
              ))}
            </ol>
            <div className="row" style={{ marginTop: 16 }}>
              <a href="#lab" className="small">
                Jump to lab
              </a>
              <a href="#check" className="small">
                Jump to questions
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
