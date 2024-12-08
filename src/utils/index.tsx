import React from "react";
import { SavedFormula } from "../components/SavedFormulas";

export const cleanFormula = (formula: string): string => {
  return formula?.replace(/\\(?!\\)/g, ""); // Remove single backslashes that are used in LaTeX
};

export const copyToClipboard = (latex: string) => {
  navigator.clipboard.writeText(cleanFormula(latex)).then(() => {});
};

export const removeFormula = (
  index: number,
  savedFormulas: SavedFormula[],
  setSavedFormulas: React.Dispatch<React.SetStateAction<SavedFormula[]>>
) => {
  const updated = savedFormulas.filter((_, i) => i !== index);
  setSavedFormulas(updated);
  localStorage.setItem("savedFormulas", JSON.stringify(updated));
};
