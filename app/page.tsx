import Link from "next/link";
import UnitTable from "@/components/UnitTable";
import KnnLab from "@/components/labs/KnnLab";
import { units } from "@/lib/units";

export default function Home() {
  const totalMin = units.reduce((s, u) => s + u.minutes, 0);
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">For grades 9-12 &middot; {units.length} units &middot; about {Math.round(totalMin / 50)} class periods</p>
          <h1>Learn how AI works by running it.</h1>
          <p className="lede">
            Each unit pairs a short reading with a working model you control in the browser: an edge detector, a route
            planner, a classifier, a text generator, and a fairness audit. No account and no install.
          </p>
          <div className="row">
            <Link href={`/units/${units[0].slug}`} className="btn btn-primary">
              Start Unit 1
            </Link>
            <Link href="/units" className="btn">
              See all units
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Course map</h2>
          <span className="small muted">Organized by the AI4K12 Five Big Ideas</span>
        </div>
        <UnitTable />
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Try a lab now</h2>
          <Link href="/units/learning-from-examples" className="small">
            Open Unit 3
          </Link>
        </div>
        <div className="panel">
          <div className="panel-head">
            <span>k-nearest neighbors classifier</span>
            <span className="small muted">Click to add points. Move k.</span>
          </div>
          <div className="lab-body">
            <KnnLab compact />
          </div>
        </div>
      </section>

      <section className="section">
        <h2 style={{ marginBottom: 12 }}>How a unit works</h2>
        <div className="steps">
          <div>
            <div className="n">01 Read</div>
            <p className="small muted">Three short sections, about 8 minutes. Key terms link to the glossary.</p>
          </div>
          <div>
            <div className="n">02 Run the lab</div>
            <p className="small muted">Change the inputs and watch the model respond. Each lab has a guided task.</p>
          </div>
          <div>
            <div className="n">03 Check</div>
            <p className="small muted">Three questions with explanations. Mark the unit complete when you are ready.</p>
          </div>
        </div>
      </section>
    </>
  );
}
