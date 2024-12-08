export const config = {
  advancedFunctions: {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    log: Math.log,
    log10: Math.log10,
    exp: Math.exp,
    sqrt: Math.sqrt,
    abs: Math.abs,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
  },
  operators: ["+", "-", "*", "/", "^"],
  featureFlags: {
    allowFormulaSaving: true, // Controls if the "Save Formula" feature is enabled
    allowResultCopying: true, // Allow users to copy result to clipboard
    allowVariableEditing: true, // Whether variables can be edited dynamically
    allowLatexRendering: true, // Toggle the rendering of LaTeX formulas
    showAdvancedFunctions: false, // Hide or show advanced functions like sin, cos, etc.
    enableFormulaHistory: true, // Optionally enable formula history
    enableFormulaValidation: true, // Enable stricter validation for formulas
  },
  permissions: {
    canEditFormula: true, // Whether the user can edit the formula directly
    canViewSavedFormulas: true, // Whether the user can see saved formulas
    canDeleteSavedFormulas: true, // Whether the user can delete saved formulas
    canCopyFormula: true, // Permission for copying formulas to clipboard
    canSaveFormulas: true, // Control if the formula saving button is enabled
    canManageVariables: true, // Allow the user to manage (edit) variables
  },
  uiSettings: {
    theme: "light", // Set default theme (light or dark)
    enableSyntaxHighlighting: true, // Toggle syntax highlighting for formula input
    defaultFontSize: 16, // Set default font size for formula display
  },
  validation: {
    allowNonNumericVariables: false, // Whether to allow non-numeric variables
    checkFormulaBrackets: true, // Check if the formula has balanced brackets
  },
  logging: {
    enableDebugLogs: false, // Enable or disable debug logging for dev purposes
  },
};
