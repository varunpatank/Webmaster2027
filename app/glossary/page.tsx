import type { Metadata } from "next";
import GlossaryList from "@/components/GlossaryList";

export const metadata: Metadata = { title: "Glossary" };

export default function GlossaryPage() {
  return (
    <>
      <p className="eyebrow">Reference</p>
      <h1>Glossary</h1>
      <p className="lede">Every term used in the units, with a link to where it is taught.</p>
      <div className="section" style={{ marginTop: 24 }}>
        <GlossaryList />
      </div>
    </>
  );
}
