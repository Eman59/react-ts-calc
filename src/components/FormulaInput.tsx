import React from "react";
import { config } from "../config.ts";

export const FormulaInput: React.FC<{ formula: string; setFormula: (value: string) => void; }> = ({ formula, setFormula }) => {
    return (
      <input
        type="text"
        value={formula}
        onChange={(e) => setFormula(e.target.value)}
        className="w-full border rounded p-2"
        placeholder="Enter formula (e.g., a + sin(b) * c)"
        disabled={!config.permissions.canEditFormula}
      />
    );
  };