import React, { useRef, useEffect } from "react";

export const FormulaInput: React.FC<{
  formula: string;
  setFormula: (value: string) => void;
}> = ({ formula, setFormula }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // To store the colors assigned to variables
  const variableColorMap: { [key: string]: string } = {};
  const colorPalette = [
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-yellow-500",
    "text-purple-500",
    "text-orange-500",
    "text-pink-500",
    "text-teal-500",
  ];
  let colorIndex = 0;

  // Resize the textarea as the content changes
  const handleResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to auto
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on content
    }
  };

  useEffect(() => {
    handleResize(); // Resize the textarea on mount and content change
  }, [formula]);

  const highlightFormula = (text: string) => {
    const operatorRegex = /(\+|-|\*|\/|\^)/g; // Operators
    const functionRegex = /\b(sin|cos|tan|log|sqrt|abs)\b/gi; // Functions
    const numberRegex = /\b\d+(\.\d+)?\b/g; // Numbers
    const variableRegex = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g; // Variables

    const tokens: React.JSX.Element[] = [];
    let match: RegExpExecArray | [string] | null;
    let lastIndex = 0;

    // Combined regex to tokenize
    const combinedRegex = new RegExp(
      `${functionRegex.source}|${operatorRegex.source}|${numberRegex.source}|${variableRegex.source}`,
      "gi"
    );

    while ((match = combinedRegex.exec(text)) !== null) {
      // Add unmatched text as plain text (default to black)
      if (match.index > lastIndex) {
        tokens.push(
          <span key={`plain-${lastIndex}`} className="text-black">
            {text.slice(lastIndex, match.index)}
          </span>
        );
      }

      const [matchedText] = match;

      // Highlight based on the matched group
      if (operatorRegex.test(matchedText)) {
        tokens.push(
          <span
            key={`operator-${match.index}`}
            className="text-blue-500 font-bold"
          >
            {matchedText}
          </span>
        );
      } else if (functionRegex.test(matchedText)) {
        tokens.push(
          <span
            key={`function-${match.index}`}
            className="text-green-500 font-semibold"
          >
            {matchedText}
          </span>
        );
      } else if (numberRegex.test(matchedText)) {
        tokens.push(
          <span key={`number-${match.index}`} className="text-purple-500">
            {matchedText}
          </span>
        );
      } else {
        // If variable is already assigned a color, reuse that color
        if (!variableColorMap[matchedText]) {
          // Assign a new color if not yet assigned
          variableColorMap[matchedText] =
            colorPalette[colorIndex % colorPalette.length];
          colorIndex++;
        }

        tokens.push(
          <span
            key={`variable-${match.index}`}
            className={variableColorMap[matchedText]}
          >
            {matchedText}
          </span>
        );
      }

      lastIndex = match.index + matchedText.length;
    }

    // Add remaining unmatched text as plain text
    if (lastIndex < text.length) {
      tokens.push(
        <span key={`plain-${lastIndex}`} className="text-black">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return tokens;
  };

  return (
    <div className="relative w-full">
      {/* Highlighted Formula Overlay */}
      <div className="absolute inset-0 pointer-events-none font-mono text-left whitespace-pre-wrap break-words p-2 overflow-hidden">
        {highlightFormula(formula)}
      </div>

      {/* Transparent Textarea Field */}
      <textarea
        ref={textareaRef}
        value={formula}
        onChange={(e: { target: { value: string } }) => {
          setFormula(e.target.value);
          handleResize(); // Resize on change
        }}
        className="w-full border-2 border-solid border-blue-200 shadow-sm inner-shadow rounded p-2 text-transparent bg-gray-100 caret-black font-mono focus:outline-none focus:ring-0 relative resize-none overflow-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700"
        placeholder="Enter formula here (e.g., a + sin(b) * c)"
        spellCheck={false}
        style={{
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
};
