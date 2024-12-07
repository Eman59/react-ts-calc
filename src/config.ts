// config.ts - Configuration for advanced functions, operators, and feature flags
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
    enableLatexMode: true,
    enableSyntaxHighlighting: true,
    allowFormulaSaving: true,
  },
  permissions: {
    canEditFormula: true,
    canViewSavedFormulas: true,
  }
};