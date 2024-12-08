import React, { useState, useMemo, useCallback, useEffect } from "react";
import katex from "katex";
import { config } from "./config/config.ts";
import { MathEvaluator } from "./components/MathEvaluator.tsx";
import { FormulaInput } from "./components/FormulaInput.tsx";
import { VariableInput } from "./components/VariableInput.tsx";
import { ResultDisplay } from "./components/ResultDisplay.tsx";
import SavedFormulas from "./components/SavedFormulas.tsx";
import "katex/dist/katex.min.css";

function App() {
  const [formula, setFormula] = useState<string>("");
  const [variables, setVariables] = useState<Record<string, number>>({});
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [latexFormula, setLatexFormula] = useState<string>("");
  const [savedFormulas, setSavedFormulas] = useState<
    { formula: string; latex: string }[]
  >(() => {
    const saved = localStorage.getItem("savedFormulas");
    return saved ? JSON.parse(saved) : [];
  });
  const [variableInput] = useState<string>("");

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
    // Check if the formula already exists in the saved formulas
    if (savedFormulas.some((saved) => saved.formula === formula)) {
      return; // Do not save if the formula is already in the list
    }

    // Add formula and its LaTeX version to the saved list
    const updated = [...savedFormulas, { formula, latex: latexFormula }];
    setSavedFormulas(updated);
    localStorage.setItem("savedFormulas", JSON.stringify(updated));
  };

  const filteredVariables = useMemo(() => {
    return extractVariables.filter((variable) =>
      variable.toLowerCase().includes(variableInput.toLowerCase())
    );
  }, [variableInput, extractVariables]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-montserrat">
      <div className="container mx-auto p-4">
        <div className="max-w-lg mx-auto bg-gradient-to-b from-gray-100 to-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-extrabold text-center text-gray-800 mb-4">
            Formula Calculator
          </h1>

          {/* Display LaTeX or Syntax Highlighting */}
          {config.featureFlags.allowLatexRendering && (
            <div
              className="p-4 bg-gray-50 border rounded shadow-inner whitespace-pre-wrap word-wrap break-word min-h-[80px] text-lg"
              dangerouslySetInnerHTML={{ __html: renderLatex() }}
            />
          )}

          {/* Formula Input with Syntax Highlighting */}
          <FormulaInput formula={formula} setFormula={setFormula} />

          {/* Variable Inputs */}
          <div className="mt-4 space-y-2">
            {filteredVariables.map((variable) => (
              <VariableInput
                key={variable}
                variable={variable}
                value={variables[variable] || 0}
                onChange={(value) => handleVariableChange(variable, value)}
              />
            ))}
          </div>

          <div className="mt-6">
            <ResultDisplay result={result} error={error} />
          </div>

          {config.featureFlags.allowFormulaSaving && (
            <button
              onClick={saveFormula}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold py-2 rounded mt-4 hover:shadow-md hover:opacity-90 transition"
              disabled={!formula}
            >
              Save Formula
            </button>
          )}
        </div>

        {/* Saved Formulas Section */}
        {config.permissions.canViewSavedFormulas && (
          <SavedFormulas savedFormulas={savedFormulas} setSavedFormulas={setSavedFormulas} />
        )}
      </div>
    </div>
  );
}

export default App;
