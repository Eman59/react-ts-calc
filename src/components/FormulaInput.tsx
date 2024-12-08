import React, { useEffect, useState, useRef } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { config } from "../config.ts";

export const FormulaInput: React.FC<{
  formula: string;
  setFormula: (value: string) => void;
}> = ({ formula, setFormula }) => {
  const [highlightedFormula, setHighlightedFormula] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHighlightedFormula(formula);
    // Update cursor position after formula is updated
    if (inputRef.current) {
      const cursorPosition = inputRef.current.selectionStart;
      inputRef.current.selectionStart = inputRef.current.selectionEnd =
        cursorPosition;
    }
  }, [formula]);

  return (
    <div className="relative">
      {/* Syntax Highlighted Output */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none whitespace-pre-wrap break-words font-mono p-2 overflow-wrap break-word z-index-[-1]">
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
        className="w-full border rounded p-2 text-black bg-gray-100 focus:outline-none focus:ring-0 z-10 relative text-md sm:text-sm md:text-base lg:text-base xl:text-base placeholder:text-base sm:placeholder:text-base md:placeholder:text-sm lg:placeholder:text-base xl:placeholder:text-base"
        placeholder="Enter formula (e.g., a + sin(b) * c)"
        disabled={!config.permissions.canEditFormula}
      />
    </div>
  );
};
