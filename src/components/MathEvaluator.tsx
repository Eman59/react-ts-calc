import { config } from "../config/config.ts";

export class MathEvaluator {
  public static advancedFunctions = config.advancedFunctions;

  public static isOperator(token: string): boolean {
    return config.operators.includes(token);
  }
  public static isAdvancedFunction(token: string): boolean {
    return Object.keys(this.advancedFunctions).includes(token);
  }

  // Evaluate the formula with provided variables
  static evaluate(
    tokens: string[],
    variables: Record<string, number>
  ): number | null {
    const values: number[] = [];
    const ops: string[] = [];

    const precedence = (operator: string): number => {
      if (this.isAdvancedFunction(operator)) return 4;
      switch (operator) {
        case "+":
        case "-":
          return 1;
        case "*":
        case "/":
          return 2;
        case "^":
          return 3;
        default:
          return 0;
      }
    };

    const applyOperator = (a: number, b: number, operator: string): number => {
      switch (operator) {
        case "+":
          return a + b;
        case "-":
          return a - b;
        case "*":
          return a * b;
        case "/":
          if (b === 0) throw new Error("Division by zero");
          return a / b;
        case "^":
          return Math.pow(a, b);
        default:
          throw new Error("Invalid operator");
      }
    };

    const precedenceCompare = (op1: string, op2: string) =>
      precedence(op1) >= precedence(op2);

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (!isNaN(Number(token))) {
        values.push(Number(token));
      } else if (variables[token] !== undefined) {
        values.push(variables[token]);
      } else if (this.isAdvancedFunction(token)) {
        if (tokens[i + 1] === "(") {
          const closingIndex = tokens.indexOf(")", i + 1);
          if (closingIndex === -1) {
            throw new Error("Mismatched parentheses");
          }

          const argTokens = tokens.slice(i + 2, closingIndex);
          const argValue = this.evaluate(argTokens, variables);
          if (argValue !== null) {
            values.push(this.advancedFunctions[token](argValue));
          }
          i = closingIndex;
        } else {
          throw new Error("Function argument must be enclosed in parentheses");
        }
      } else if (this.isOperator(token)) {
        while (
          ops.length > 0 &&
          precedenceCompare(ops[ops.length - 1], token)
        ) {
          const op = ops.pop()!;
          const b = values.pop()!;
          const a = values.pop()!;
          values.push(applyOperator(a, b, op));
        }
        ops.push(token);
      } else if (token === "(") {
        ops.push(token);
      } else if (token === ")") {
        while (ops.length > 0 && ops[ops.length - 1] !== "(") {
          const op = ops.pop()!;
          const b = values.pop()!;
          const a = values.pop()!;
          values.push(applyOperator(a, b, op));
        }
        if (ops.length > 0 && ops[ops.length - 1] === "(") {
          ops.pop();
        }
      }
    }

    while (ops.length > 0) {
      const op = ops.pop()!;
      const b = values.pop()!;
      const a = values.pop()!;
      values.push(applyOperator(a, b, op));
    }

    return values.length > 0 ? values[0] : null;
  }

  // Tokenize the input formula to break it into components
  static tokenize(formula: string): string[] {
    const tokens: string[] = [];
    let currentToken = "";
  
    const advancedFunctions = Object.keys(this.advancedFunctions);
  
    for (let i = 0; i < formula.length; i++) {
      const char = formula[i];
      const remainingFormula = formula.slice(i);
  
      // Check for advanced functions
      const foundFunction = advancedFunctions.find((func) =>
        remainingFormula.startsWith(func)
      );
      if (foundFunction) {
        if (currentToken) {
          tokens.push(currentToken);
          currentToken = "";
        }
        tokens.push(foundFunction);
        i += foundFunction.length - 1;
        continue;
      }
  
      // Check for operators or parentheses
      if (["+", "-", "*", "/", "^", "(", ")"].includes(char)) {
        if (currentToken) {
          tokens.push(currentToken);
          currentToken = "";
        }
        tokens.push(char);
        continue;
      }
  
      // Handle whitespace
      if (char.match(/\s/)) {
        if (currentToken) {
          tokens.push(currentToken);
          currentToken = "";
        }
        continue;
      }
  
      // Build tokens for numbers and variables
      if (char.match(/\d/)) {
        if (currentToken.match(/[a-zA-Z]/)) {
          // Number following a variable (e.g., "a1" -> "a * 1")
          tokens.push(currentToken);
          tokens.push("*");
          currentToken = char;
        } else {
          // Append digit to current token
          currentToken += char;
        }
      } else if (char.match(/[a-zA-Z]/)) {
        if (currentToken.match(/\d/)) {
          // Variable following a number (e.g., "90a" -> "90 * a")
          tokens.push(currentToken);
          tokens.push("*");
          currentToken = char;
        } else if (currentToken.match(/[a-zA-Z]/)) {
          // Adjacent variables (e.g., "aa" -> "a * a")
          tokens.push(currentToken);
          tokens.push("*");
          currentToken = char;
        } else {
          // Append variable to current token
          currentToken += char;
        }
      }
    }
  
    // Push any remaining token
    if (currentToken) {
      tokens.push(currentToken);
    }
  
    return tokens;
  }

  static convertToLatex(formula: string): string {
    const tokens = this.tokenize(formula);
    let latex = "";
    tokens.forEach((token) => {
      if (this.isOperator(token)) {
        latex += ` ${token} `;
      } else if (this.isAdvancedFunction(token)) {
        latex += `\\${token}`;
      } else {
        latex += token;
      }
    });
    return latex;
  }
}
