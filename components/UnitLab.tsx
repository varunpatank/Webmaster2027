"use client";

import PixelLab from "./labs/PixelLab";
import PathLab from "./labs/PathLab";
import KnnLab from "./labs/KnnLab";
import BigramLab from "./labs/BigramLab";
import FairnessLab from "./labs/FairnessLab";

export default function UnitLab({ slug }: { slug: string }) {
  switch (slug) {
    case "images-are-numbers":
      return <PixelLab />;
    case "search-and-planning":
      return <PathLab />;
    case "learning-from-examples":
      return <KnnLab />;
    case "language-models":
      return <BigramLab />;
    case "fairness-audit":
      return <FairnessLab />;
    default:
      return null;
  }
}
