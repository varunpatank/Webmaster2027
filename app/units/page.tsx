import type { Metadata } from "next";
import UnitTable from "@/components/UnitTable";

export const metadata: Metadata = { title: "Units" };

export default function UnitsPage() {
  return (
    <>
      <p className="eyebrow">Course</p>
      <h1>Units</h1>
      <p className="lede">
        Work through them in order or jump to the one your class needs. Units 1 and 2 suit grades 9 and 10; units 4 and 5
        assume some algebra and are aimed at grades 11 and 12.
      </p>
      <div className="section" style={{ marginTop: 24 }}>
        <UnitTable showReset />
      </div>
    </>
  );
}
