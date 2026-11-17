import type { Metadata } from "next";
import PracticeQuiz from "@/components/PracticeQuiz";

export const metadata: Metadata = { title: "Practice" };

export default function PracticePage() {
  return (
    <>
      <p className="eyebrow">Practice</p>
      <h1>Practice quiz</h1>
      <p className="lede">
        Answer the questions, then score them all at once. Missed questions point you back to the unit that covers them.
      </p>
      <div className="section" style={{ marginTop: 24 }}>
        <PracticeQuiz />
      </div>
    </>
  );
}
