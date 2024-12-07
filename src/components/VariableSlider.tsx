import React from "react";

export const VariableSlider: React.FC<{
    variable: string;
    value: number;
    onChange: (value: number) => void;
  }> = ({ variable, value, onChange }) => {
    return (
      <div className="flex items-center space-x-2 mt-2">
        <label>{variable}:</label>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-grow"
        />
        <span>{value}</span>
      </div>
    );
  };