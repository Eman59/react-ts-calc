import React from "react";

export const VariableInput: React.FC<{
  variable: string;
  value: number;
  onChange: (value: number) => void;
}> = ({ variable, value, onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow only valid numeric input
    if (newValue === "" || /^\d*\.?\d*$/.test(newValue)) {
      onChange(Number(newValue)); // Convert to number before calling onChange
    }
  };

  return (
    <div className="flex items-center space-x-2 mt-2">
      <label>{variable}:</label>
      <input
        type="text"
        value={value || ""}
        onChange={handleInputChange}
        className="flex-grow border rounded px-2 py-1"
        placeholder="Enter number"
      />
    </div>
  );
};
