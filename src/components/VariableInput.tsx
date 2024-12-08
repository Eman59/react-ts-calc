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
        className="flex-grow border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
        placeholder="Enter a variable value (e.g., n = 10)"
      />
    </div>
  );
};
