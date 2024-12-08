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
    cot: (x: number) => 1 / Math.tan(x),  // cot(x) = 1/tan(x)
    sec: (x: number) => 1 / Math.cos(x),  // sec(x) = 1/cos(x)
    csc: (x: number) => 1 / Math.sin(x),  // csc(x) = 1/sin(x)
    sinh: Math.sinh,   // Hyperbolic sine
    cosh: Math.cosh,   // Hyperbolic cosine
    tanh: Math.tanh,   // Hyperbolic tangent
    asinh: Math.asinh, // Inverse hyperbolic sine
    acosh: Math.acosh, // Inverse hyperbolic cosine
    atanh: Math.atanh, // Inverse hyperbolic tangent
  },
  operators: ["+", "-", "*", "/", "^", "%"], // Added modulus operator (%)
  featureFlags: {
    allowFormulaSaving: true,
    allowLatexRendering: true,
  },
  permissions: {
    canViewSavedFormulas: true,
    canManageVariables: true,
    canCopyFormula: true,
    canDeleteSavedFormulas: true,
  },
};
