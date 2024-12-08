import React, { useState, useMemo, useCallback, useEffect, memo } from "react";
import katex from "katex";
import { config } from "./config/config.ts";
import { MathEvaluator } from "./components/MathEvaluator.tsx";
import { FormulaInput } from "./components/FormulaInput.tsx";
import { VariableInput } from "./components/VariableInput.tsx";
import { ResultDisplay } from "./components/ResultDisplay.tsx";
import SavedFormulas from "./components/SavedFormulas.tsx";
import "katex/dist/katex.min.css";

// Memoized child components to prevent unnecessary re-renders
const MemoizedFormulaInput = memo(FormulaInput);
const MemoizedVariableInput = memo(VariableInput);
const MemoizedResultDisplay = memo(ResultDisplay);
const MemoizedSavedFormulas = memo(SavedFormulas);

function Calc() {
  // Optimize initial state for savedFormulas
  const [savedFormulas, setSavedFormulas] = useState<
    { formula: string; latex: string }[]
  >(() => {
    const saved = localStorage.getItem("savedFormulas");
    return saved ? JSON.parse(saved) : [];
  });

  // State management with performance in mind
  const [formula, setFormula] = useState<string>("");
  const [variables, setVariables] = useState<Record<string, number>>({});
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [latexFormula, setLatexFormula] = useState<string>("");
  const [variableInput] = useState<string>("");

  // Optimized variable extraction
  const extractVariables = useMemo(() => {
    return MathEvaluator.tokenize(formula).filter(
      (token) =>
        token.match(/^[a-zA-Z]+$/) &&
        !MathEvaluator.isOperator(token) &&
        !MathEvaluator.isAdvancedFunction(token)
    );
  }, [formula]);

  // Memoized variable change handler
  const handleVariableChange = useCallback(
    (variable: string, value: number) => {
      setVariables((prev) => {
        const updatedVariables = { ...prev };
        updatedVariables[variable] = value; // Update only the specific variable
        return updatedVariables;
      });
    },
    []
  );

  // Performance-optimized result calculation
  const calculateResult = useCallback(() => {
    // Early return for incomplete variable definition
    if (
      !extractVariables.every((variable) => variables[variable] !== undefined)
    ) {
      setError("Please define all variables");
      setResult(null);
      return;
    }

    try {
      const tokens = MathEvaluator.tokenize(formula);
      const calculatedResult = MathEvaluator.evaluate(tokens, variables);
      setResult(calculatedResult);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation error");
      setResult(null);
    }
  }, [formula, variables, extractVariables]);

  // LaTeX conversion effect
  useEffect(() => {
    try {
      let latex = MathEvaluator.convertToLatex(formula);

      // Remove multiplication sign (\cdot) only between variables (e.g., 2*a*b -> 2ab)
      latex = latex.replace(/([a-zA-Z0-9])\s?\*/g, "$1"); // Matches variable and removes multiplication sign

      // Handle other special cases (like cos(x)) that shouldn't be altered
      latex = latex.replace(/cos\(([^)]+)\)/g, "cos($1)"); // Keep 'cos(x)' intact (or similar functions)

      // Now set the latex formula
      setLatexFormula(latex);
    } catch {
      setLatexFormula("");
    }
  }, [formula]);

  // Trigger calculation on variable or formula changes
  useEffect(() => {
    calculateResult();
  }, [calculateResult]);

  // Memoized LaTeX rendering
  const renderLatex = useCallback(() => {
    if (!latexFormula) return "";
    try {
      return katex.renderToString(latexFormula, {
        throwOnError: false,
        displayMode: false,
      });
    } catch {
      return "";
    }
  }, [latexFormula]);

  // Optimized formula saving
  const saveFormula = useCallback(() => {
    setSavedFormulas((prev) => {
      if (prev.some((saved) => saved.formula === formula)) return prev;

      const updated = [...prev, { formula, latex: latexFormula }];
      localStorage.setItem("savedFormulas", JSON.stringify(updated));
      return updated;
    });
  }, [formula, latexFormula]);

  // Memoized variable filtering
  const filteredVariables = useMemo(() => {
    // Remove duplicates and ensure unique variables
    return [
      ...new Set(
        extractVariables.filter((variable) =>
          variable.toLowerCase().includes(variableInput.toLowerCase())
        )
      ),
    ];
  }, [variableInput, extractVariables]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-montserrat">
      {React.useMemo(
        () => (
          <div className="container mx-auto p-4">
            <div className="max-w-lg mx-auto bg-gradient-to-b from-gray-100 to-white shadow-lg rounded-lg p-6">
              <h1 className="text-3xl font-semibold text-center text-gray-800 mb-5">
                Formula Calculator
              </h1>

              {/* LaTeX Rendering */}
              {config.featureFlags.allowLatexRendering && (
                <div
                  className="p-4 bg-gray-50 border rounded whitespace-pre-wrap word-wrap break-word min-h-[80px] text-lg mb-4"
                  dangerouslySetInnerHTML={{ __html: renderLatex() }}
                />
              )}

              {/* Formula Input */}
              <MemoizedFormulaInput formula={formula} setFormula={setFormula} />

              {/* Variable Inputs */}
              <div className="mt-4 space-y-2">
                {filteredVariables.map((variable) => (
                  <MemoizedVariableInput
                    key={variable}
                    variable={variable}
                    value={variables[variable] || 0}
                    onChange={(value) => handleVariableChange(variable, value)}
                  />
                ))}
              </div>

              {/* Result Display */}
              <div className="mt-6">
                <MemoizedResultDisplay result={result} error={error} />
              </div>

              {/* Save Formula Button */}
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
              <MemoizedSavedFormulas
                savedFormulas={savedFormulas}
                setSavedFormulas={setSavedFormulas}
              />
            )}
          </div>
        ),
        [
          renderLatex,
          formula,
          filteredVariables,
          result,
          error,
          saveFormula,
          savedFormulas,
          variables,
          handleVariableChange,
        ]
      )}
    </div>
  );
}

export default Calc;
