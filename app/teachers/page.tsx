import type { Metadata } from "next";
import Link from "next/link";
import { units } from "@/lib/units";

export const metadata: Metadata = { title: "For teachers" };

const bigIdeas = [
  ["1. Perception", "Computers perceive the world using sensors."],
  ["2. Representation & Reasoning", "Agents maintain representations of the world and use them for reasoning."],
  ["3. Learning", "Computers can learn from data."],
  ["4. Natural Interaction", "Intelligent agents require many kinds of knowledge to interact naturally with humans."],
  ["5. Societal Impact", "AI can impact society in both positive and negative ways."],
];

const csta = [
  ["3A-DA-12", "Create computational models that represent the relationships among different elements of data collected from a phenomenon or process."],
  ["3A-IC-24", "Evaluate the ways computing impacts personal, ethical, social, economic, and cultural practices."],
  ["3B-AP-08", "Describe how artificial intelligence drives many software and physical systems."],
  ["3B-AP-09", "Implement an artificial intelligence algorithm to play a game against a human opponent or solve a problem."],
  ["3B-IC-25", "Evaluate computational artifacts to maximize their beneficial effects and minimize harmful effects on society."],
];

export default function TeachersPage() {
  return (
    <>
      <p className="eyebrow">For teachers</p>
      <h1>Teaching with Groundwork</h1>
      <p className="lede">
        Five units, one class period each, plus time for discussion. Everything runs in the browser on school Chromebooks.
        Students do not sign in, and nothing they enter leaves their device.
      </p>

      <section className="section">
        <h2 style={{ marginBottom: 12 }}>Pacing</h2>
        <div className="panel table-wrap">
          <table>
            <thead>
              <tr>
                <th>Unit</th>
                <th>Grades</th>
                <th className="num">Minutes</th>
                <th>Standards</th>
                <th className="hide-sm">Discussion prompt</th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => (
                <tr key={u.slug}>
                  <td>
                    <Link href={`/units/${u.slug}`}>
                      {u.number}. {u.title}
                    </Link>
                  </td>
                  <td className="mono">{u.grades}</td>
                  <td className="num">{u.minutes}</td>
                  <td className="small">{u.standards.join(", ")}</td>
                  <td className="small muted hide-sm">{u.discussion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2 style={{ marginBottom: 12 }}>Running a class period</h2>
        <div className="panel panel-pad prose stack">
          <p>
            <b>First 10 minutes.</b> Students read the unit on their own. Ask them to write down one term they could not
            explain and look it up in the <Link href="/glossary">glossary</Link>.
          </p>
          <p>
            <b>Next 25 minutes.</b> Pairs work through the lab steps. One student drives, the other records numbers from the
            lab table. Switch halfway.
          </p>
          <p>
            <b>Last 15 minutes.</b> Students answer the check questions alone, then discuss the prompt as a class. Use the{" "}
            <Link href="/practice">practice quiz</Link> as an exit ticket at the end of the course.
          </p>
          <p className="muted">
            Progress is stored in each browser with localStorage. A shared computer will show the last student&apos;s
            progress; use Clear progress on the Units page between students.
          </p>
        </div>
      </section>

      <section className="section">
        <h2 style={{ marginBottom: 12 }}>Standards alignment</h2>
        <div className="grid-pair" style={{ alignItems: "start" }}>
          <div className="panel">
            <div className="panel-head">
              <h3>AI4K12 Five Big Ideas</h3>
            </div>
            <table>
              <tbody>
                {bigIdeas.map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ whiteSpace: "nowrap" }}>{k}</td>
                    <td className="small muted">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel">
            <div className="panel-head">
              <h3>CSTA K-12 CS Standards, Level 3</h3>
            </div>
            <table>
              <tbody>
                {csta.map(([k, v]) => (
                  <tr key={k}>
                    <td className="mono" style={{ whiteSpace: "nowrap" }}>
                      {k}
                    </td>
                    <td className="small muted">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 style={{ marginBottom: 12 }}>Adjusting for your class</h2>
        <div className="panel panel-pad prose stack">
          <p>
            <b>Grade 9 classes</b> can stop Unit 3 after the k slider task and skip leave-one-out accuracy.
          </p>
          <p>
            <b>Advanced classes</b> can compute one feature map cell in Unit 1 by hand, then check it by hovering the
            output grid. In Unit 4, have students paste a paragraph from a novel into the training text and compare output.
          </p>
          <p>
            <b>Unit 5</b> touches lending and discrimination. Tell students in advance that the data is simulated, and give
            them the option to discuss in writing.
          </p>
        </div>
      </section>
    </>
  );
}
