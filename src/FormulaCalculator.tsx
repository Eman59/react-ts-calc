import React, { useState, useCallback, useMemo, useEffect } from "react";
import katex from "katex";
import { config } from "./config.ts";
import { VariableInput } from "./components/VariableInput.tsx";
import { ResultDisplay } from "./components/ResultDisplay.tsx";
import { FormulaInput } from "./components/FormulaInput.tsx";
import "katex/dist/katex.min.css";
import { MathEvaluator } from "./components/MathEvaluator.tsx";

const FormulaCalculator: React.FC = () => {
  const [formula, setFormula] = useState<string>("");
  const [variables, setVariables] = useState<Record<string, number>>({});
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [latexFormula, setLatexFormula] = useState<string>("");
  const [savedFormulas, setSavedFormulas] = useState<{ formula: string; latex: string }[]>(() => {
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
      alert("Formula already saved.");
      return; // Do not save if the formula is already in the list
    }

    // Add formula and its LaTeX version to the saved list
    const updated = [...savedFormulas, { formula, latex: latexFormula }];
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

  const cleanFormula = (formula: string): string => {
    // Replace '\\' with '' to remove LaTeX backslashes
    return formula.replace(/\\(?!\\)/g, '');  // Remove single backslashes that are used in LaTeX
  };


  return (
    <div className="container mx-auto p-4">
      <div className="max-w-lg mx-auto bg-gradient-to-b from-gray-100 to-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-extrabold text-center text-gray-800 mb-4">Advanced Formula Calculator</h1>

        {/* Display LaTeX or Syntax Highlighting */}
        <div className="relative h-32 transition-all">
          <div
            className={'absolute inset-0 p-4 bg-gray-50 border rounded shadow-inner opacity-100 scale-100 transition-opacity transition-transform duration-300 opacity-100 scale-100'}
            dangerouslySetInnerHTML={{ __html: renderLatex() }}
          />
        </div>

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
        <div className="w-full max-w-md mx-auto bg-white shadow-lg p-4 rounded mt-6">
          <h2 className="text-lg font-bold text-gray-800">Saved Formulas</h2>
          {savedFormulas.length > 0 ? (
            <ul className="space-y-2 mt-4 transition-all">
              {savedFormulas.map((savedFormula, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-2 bg-gray-100 hover:bg-gray-200 rounded shadow transition-all"
                >
                  <div>
                    <span className="text-gray-700 font-medium" dangerouslySetInnerHTML={{
                      __html: cleanFormula(savedFormula.latex
                      )
                    }} />
                  </div>
                  <button
                    onClick={() => removeFormula(index)}
                    className="text-red-500 font-semibold underline hover:text-red-600 transition"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-4 text-center italic">
              No saved formulas available.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FormulaCalculator;
