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
    allowFormulaSaving: true, // Keep if saving formulas is required
    allowLatexRendering: true, // Keep if LaTeX rendering is required
  },
  permissions: {
    canViewSavedFormulas: true, // Keep if users should view saved formulas
    canManageVariables: true, // Keep if users should manage (edit) variables,
    canCopyFormula: true, // Permission for copying formulas to clipboard
    canDeleteSavedFormulas: true, // Whether the user can delete saved formulas
  },
};
