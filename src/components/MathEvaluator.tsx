import { config } from "../config.ts";

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
      } else if (["+", "-", "*", "/", "^", "(", ")"].includes(char)) {
        if (currentToken) {
          tokens.push(currentToken);
          currentToken = "";
        }
        tokens.push(char);
      } else if (char.match(/\s/)) {
        if (currentToken) {
          tokens.push(currentToken);
          currentToken = "";
        }
      } else {
        // Handle number followed by variable (e.g., "n1" -> "n * 1")
        if (char.match(/\d/) && currentToken.match(/[a-zA-Z]/)) {
          tokens.push(currentToken); // Push the previous variable (e.g., "n")
          tokens.push("*"); // Insert multiplication symbol
          currentToken = char; // Start the number (e.g., "1")
        } else if (
          char.match(/\d/) &&
          (i + 1 < formula.length && formula[i + 1].match(/[a-zA-Z]/))
        ) {
          // Case when a number is followed by a variable (e.g., "1n" -> "1 * n")
          if (currentToken) {
            tokens.push(currentToken);
          }
          tokens.push(char); // Push the number (e.g., "1")
          tokens.push("*"); // Insert multiplication symbol
        } else if (
          char.match(/[a-zA-Z]/) &&
          currentToken.match(/[a-zA-Z]/)
        ) {
          // Handle adjacent variables (e.g., "aa" -> "a * a")
          tokens.push(currentToken); // Push the previous variable (e.g., "a")
          tokens.push("*"); // Insert multiplication symbol
          currentToken = char; // Start new variable (e.g., "a")
        } else {
          currentToken += char;
        }
      }
    }
  
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
