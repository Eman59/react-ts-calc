import React from "react";

export const ErrorDisplay: React.FC<{ error: string | null }> = ({ error }) => {
  if (!error) return null;
  return <div className="text-red-500">{error}</div>;
};
