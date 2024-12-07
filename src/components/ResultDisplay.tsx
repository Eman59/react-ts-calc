import React from "react";
import { ErrorDisplay } from "./ErrorDisplay.tsx";

export const ResultDisplay: React.FC<{
  result: number | null;
  error: string | null;
}> = ({ result, error }) => {
  if (error) return <ErrorDisplay error={error} />;
  if (result === null) return null;
  return <div className="text-green-600">Result: {result.toFixed(4)}</div>;
};
