import React, { useState, useCallback, useMemo, useEffect } from "react";
import katex from "katex";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { config } from "./config.ts";
import { VariableInput } from "./components/VariableInput.tsx";
import { ResultDisplay } from "./components/ResultDisplay.tsx";
import { FormulaInput } from "./components/FormulaInput.tsx";
import "katex/dist/katex.min.css";
import { MathEvaluator } from "./components/MathEvaluator.tsx";

// FormulaCalculator Main Component
const FormulaCalculator: React.FC = () => {
  const [formula, setFormula] = useState<string>("");
  const [variables, setVariables] = useState<Record<string, number>>({});
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [latexFormula, setLatexFormula] = useState<string>("");

  const [savedFormulas, setSavedFormulas] = useState<string[]>(() => {
    const saved = localStorage.getItem("savedFormulas");
    return saved ? JSON.parse(saved) : [];
  });
  const [showLatex, setShowLatex] = useState<boolean>(false);
  const [variableInput,] = useState<string>("");

  // Extract variables from the formula
  const extractVariables = useMemo(() => {
    const variableSet = new Set<string>();
    const tokens = MathEvaluator.tokenize(formula);
    tokens.forEach((token) => {
      if (
        token.match(/^[a-zA-Z]+$/) &&
        !MathEvaluator.isOperator(token) &&
        !MathEvaluator.isAdvancedFunction(token)
      ) {
        variableSet.add(token);
      }
    });
    return Array.from(variableSet);
  }, [formula]);

  const handleVariableChange = useCallback(
    (variable: string, value: number) => {
      setVariables((prev) => ({
        ...prev,
        [variable]: value,
      }));
    },
    []
  );

  const calculateResult = useCallback(() => {
    try {
      const tokens = MathEvaluator.tokenize(formula);
      const allVariablesDefined = extractVariables.every(
        (variable) => variables[variable] !== undefined
      );

      if (!allVariablesDefined) {
        setError("Please define all variables");
        setResult(null);
        return;
      }

      const calculatedResult = MathEvaluator.evaluate(tokens, variables);
      setResult(calculatedResult);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid formula");
      setResult(null);
    }
  }, [formula, variables, extractVariables]);

  useEffect(() => {
    try {
      const latex = MathEvaluator.convertToLatex(formula);
      setLatexFormula(latex);
    } catch {
      setLatexFormula("");
    }
  }, [formula]);

  useEffect(() => {
    calculateResult();
  }, [calculateResult]);

  const renderLatex = () => {
    try {
      return katex.renderToString(latexFormula, {
        throwOnError: false,
      });
    } catch {
      return "";
    }
  };

  const saveFormula = () => {
    const updated = [...savedFormulas, formula];
    setSavedFormulas(updated);
    localStorage.setItem("savedFormulas", JSON.stringify(updated));
  };

  const removeFormula = (index: number) => {
    const updated = savedFormulas.filter((_, i) => i !== index);
    setSavedFormulas(updated);
    localStorage.setItem("savedFormulas", JSON.stringify(updated));
  };

  const filteredVariables = useMemo(() => {
    return extractVariables.filter((variable) =>
      variable.toLowerCase().includes(variableInput.toLowerCase())
    );
  }, [variableInput, extractVariables]);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="w-full max-w-md mx-auto bg-white shadow p-4 rounded">
        <h1 className="text-xl font-bold">Advanced Formula Calculator</h1>

        {/* Toggle Button to Switch Between Latex and Syntax Highlighting */}
        {config.featureFlags.enableLatexMode || config.featureFlags.enableSyntaxHighlighting ? (
          <div className="flex justify-between items-center mt-4 mb-4">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={showLatex}
                  onChange={() => setShowLatex(!showLatex)}
                  disabled={!config.featureFlags.enableLatexMode && !config.featureFlags.enableSyntaxHighlighting}
                />
                <div className="w-14 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full shadow-inner transition-all duration-300 ease-in-out"></div>
                <div
                  className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out
                  ${showLatex ? "translate-x-6 bg-blue-600" : "translate-x-0 bg-gray-200"}`}
                ></div>
              </div>
              <span className="ml-4 text-xl text-gray-800 font-semibold">
                {showLatex ? "LaTeX Mode" : "Syntax Highlighting"}
              </span>
            </label>
          </div>
        ) : null}

        {/* Conditionally Render LaTeX or Syntax Highlighting */}
        {showLatex && config.featureFlags.enableLatexMode ? (
          <div
            className="mt-4"
            dangerouslySetInnerHTML={{
              __html: renderLatex(),
            }}
          />
        ) : (
          formula && config.featureFlags.enableSyntaxHighlighting && (
            <SyntaxHighlighter language="javascript" style={docco}>
              {formula || ""}
            </SyntaxHighlighter>
          )
        )}

        {/* Formula Input */}
        <FormulaInput formula={formula} setFormula={setFormula} />

        {/* Variable Inputs */}
        {filteredVariables.map((variable) => (
          <VariableInput
            key={variable}
            variable={variable}
            value={variables[variable] || 0}
            onChange={(value) => handleVariableChange(variable, value)}
          />
        ))}

        <div className="mt-4">
          <ResultDisplay result={result} error={error} />
        </div>

        {/* Save Formula Button - Only Enabled If Feature Flag is On */}
        {config.featureFlags.allowFormulaSaving && (
          <button
            onClick={saveFormula}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            disabled={!formula}
          >
            Save Formula
          </button>
        )}
      </div>

      {/* Saved Formulas Section */}
      {config.permissions.canViewSavedFormulas && (
        <div className="w-full max-w-md mx-auto bg-white shadow p-4 rounded mt-4">
          <h2 className="text-lg font-bold">Saved Formulas</h2>
          {savedFormulas.map((savedFormula, index) => (
            <div key={index} className="flex items-center justify-between mt-2">
              <span>{savedFormula}</span>
              <button
                onClick={() => removeFormula(index)}
                className="text-red-500 underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormulaCalculator;
