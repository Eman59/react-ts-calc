import React from "react";
import { config } from "../config/config.ts";
import { cleanFormula, copyToClipboard, removeFormula } from "../utils/index.tsx";
import CopyIcon from "../assets/copy.tsx";
import DeleteIcon from "../assets/delete.tsx";

export interface SavedFormula {
  formula: string;
  latex: string;
}

interface SavedFormulasProps {
  savedFormulas: SavedFormula[];
  setSavedFormulas: React.Dispatch<React.SetStateAction<SavedFormula[]>>;
}

const SavedFormulas: React.FC<SavedFormulasProps> = ({ savedFormulas, setSavedFormulas }) => {
  return (
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
                <span
                  className="text-gray-700 font-medium"
                  dangerouslySetInnerHTML={{
                    __html: cleanFormula(savedFormula.latex),
                  }}
                />
              </div>
              <div className="flex space-x-2">
                {config.permissions.canCopyFormula && (
                  <button
                    onClick={() => copyToClipboard(savedFormula.latex)}
                    className="text-blue-500 font-semibold hover:text-blue-600 transition"
                  >
                    <CopyIcon />
                  </button>
                )}
                {config.permissions.canDeleteSavedFormulas && (
                  <button
                    onClick={() => removeFormula(index, savedFormulas, setSavedFormulas)}
                    className="text-red-500 font-semibold underline hover:text-red-600 transition"
                  >
                    <DeleteIcon />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-4 text-center italic">
          No saved formulas available.
        </p>
      )}
    </div>
  );
};

export default SavedFormulas;
