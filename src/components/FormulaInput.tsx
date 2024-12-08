import React, { useEffect, useState, useRef } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { config } from "../config.ts";

export const FormulaInput: React.FC<{ formula: string; setFormula: (value: string) => void; }> = ({ formula, setFormula }) => {
  const [highlightedFormula, setHighlightedFormula] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHighlightedFormula(formula);

    if (inputRef.current) {
      inputRef.current.selectionStart = inputRef.current.selectionEnd = formula.length;
    }
  }, [formula]);

  return (
    <div className="relative">
      {/* Syntax Highlighted Output */}
      <div
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          fontFamily: 'monospace',
          padding: '10px',
          margin: 0,
          lineHeight: '1.5',
          overflowWrap: 'break-word',
          zIndex: -1,  // Ensure the highlighted formula is behind the input field
        }}
      >
        <SyntaxHighlighter language="javascript" style={docco}>
          {highlightedFormula}
        </SyntaxHighlighter>
      </div>

      {/* Formula Input (Editable) */}
      <input
        ref={inputRef}
        type="text"
        value={formula}
        onChange={(e) => setFormula(e.target.value)}
        className="w-full border rounded p-2 text-black bg-transparent z-10 relative"
        placeholder="Enter formula (e.g., a + sin(b) * c)"
        disabled={!config.permissions.canEditFormula}
      />
    </div>
  );
};

