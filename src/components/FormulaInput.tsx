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
    const numberRegex = /\b\d+(\.\d+)?\b|\d+(?=[a-zA-Z])/g; // Numbers, including cases like 2 in 2ab
    const variableRegex = /[a-zA-Z_][a-zA-Z0-9_]*/g; // Variables
    const bracketsRegex = /[\u0028\u0029\u007B\u007D\u005B\u005D]/g; // All types of brackets

    const tokens: React.JSX.Element[] = [];
    let lastIndex = 0;

    // Combined regex to tokenize
    const combinedRegex = new RegExp(
      `${bracketsRegex.source}|${functionRegex.source}|${operatorRegex.source}|${numberRegex.source}|${variableRegex.source}`,
      "gi"
    );

    let match;
    while ((match = combinedRegex.exec(text)) !== null) {
      // Add unmatched text as plain text
      if (match.index > lastIndex) {
        tokens.push(
          <span key={`plain-${lastIndex}`} className="text-black">
            {text.slice(lastIndex, match.index)}
          </span>
        );
      }

      const [matchedText] = match;

      if (bracketsRegex.test(matchedText)) {
        tokens.push(
          <span key={`brackets-${match.index}`} className="text-gray-500">
            {matchedText}
          </span>
        );
      } else if (functionRegex.test(matchedText)) {
        tokens.push(
          <span key={`function-${match.index}`} className="text-green-500 font-semibold">
            {matchedText}
          </span>
        );
      } else if (operatorRegex.test(matchedText)) {
        tokens.push(
          <span key={`operator-${match.index}`} className="text-blue-500 font-bold">
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
        // Variable
        if (!variableColorMap[matchedText]) {
          variableColorMap[matchedText] = colorPalette[colorIndex % colorPalette.length];
          colorIndex++;
        }

        tokens.push(
          <span key={`variable-${match.index}`} className={variableColorMap[matchedText]}>
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
