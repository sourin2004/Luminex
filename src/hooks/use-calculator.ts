'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

type Mode = 'deg' | 'rad';

// A safe, custom evaluation function for mathematical expressions
const evaluateExpression = (expression: string, mode: Mode): number => {
  try {
    // Sanitize and prepare expression
    let expr = expression
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/pi/g, String(Math.PI))
      .replace(/e/g, String(Math.E));

    // Shunting-yard Algorithm Implementation
    const precedence: { [key: string]: number } = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3, 'negate': 4 };
    const functions = new Set(['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'negate']);
    
    const toRadians = (deg: number) => (deg * Math.PI) / 180;

    const applyOp = (op: string, b: number, a?: number): number => {
      switch (op) {
        case '+': return a! + b;
        case '-': return a! - b;
        case '*': return a! * b;
        case '/': 
          if (b === 0) throw new Error("Division by zero");
          return a! / b;
        case '^': return Math.pow(a!, b);
        case 'negate': return -b;
        case 'sin': return Math.sin(mode === 'deg' ? toRadians(b) : b);
        case 'cos': return Math.cos(mode === 'deg' ? toRadians(b) : b);
        case 'tan': return Math.tan(mode === 'deg' ? toRadians(b) : b);
        case 'log': return Math.log10(b);
        case 'ln': return Math.log(b);
        case 'sqrt': return Math.sqrt(b);
        default: throw new Error(`Unknown operator: ${op}`);
      }
    };
    
    // Regex to tokenize numbers, operators, functions, and parentheses
    const tokens = expr.match(/(\b\w+\b|[+\-*/^()!]|\d+\.?\d*)/g) || [];
    const values: number[] = [];
    const ops: string[] = [];
    
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        if (!isNaN(parseFloat(token))) {
            values.push(parseFloat(token));
        } else if (token ==='(') {
            ops.push(token);
        } else if (functions.has(token)) {
            ops.push(token);
        } else if (token === ')') {
            while (ops[ops.length-1] !== '(') {
                const op = ops.pop()!;
                if (functions.has(op)) {
                  values.push(applyOp(op, values.pop()!));
                } else {
                  const val2 = values.pop()!;
                  const val1 = values.pop()!;
                  values.push(applyOp(op, val2, val1));
                }
            }
            ops.pop(); // Pop '('
        } else if (token === '!') { // Factorial
            const n = values.pop()!;
            if (n < 0 || n % 1 !== 0) throw new Error("Factorial is only for non-negative integers");
            let result = 1;
            for (let j = 2; j <= n; j++) result *= j;
            values.push(result);
        } else if (token === '%') { // Percentage
            const n = values.pop()!;
            values.push(n / 100);
        } else { // Operator
            // Handle unary minus
            if (token === '-' && (i === 0 || ['(','+','-','*','/','^'].includes(tokens[i - 1]))) {
              token = 'negate';
            }
            while (ops.length && precedence[ops[ops.length - 1]] >= precedence[token]) {
                const op = ops.pop()!;
                if (functions.has(op)) {
                  values.push(applyOp(op, values.pop()!));
                } else {
                  const val2 = values.pop()!;
                  const val1 = values.pop()!;
                  values.push(applyOp(op, val2, val1));
                }
            }
            ops.push(token);
        }
    }

    while (ops.length) {
        const op = ops.pop()!;
        if (functions.has(op)) {
          values.push(applyOp(op, values.pop()!));
        } else {
          const val2 = values.pop()!;
          const val1 = values.pop()!;
          values.push(applyOp(op, val2, val1));
        }
    }

    if (values.length !== 1 || ops.length !== 0) throw new Error("Invalid expression");
    const finalResult = values[0];
    if (isNaN(finalResult) || !isFinite(finalResult)) throw new Error("Invalid calculation");
    
    return finalResult;

  } catch (error: any) {
    console.error("Evaluation Error:", error);
    throw error;
  }
};


export const useCalculator = () => {
  const [displayValue, setDisplayValue] = useState('');
  const [history, setHistory] = useState('');
  const [isResult, setIsResult] = useState(false);
  const [memory, setMemory] = useState(0);
  const [mode, setMode] = useState<Mode>('deg');
  const [isScientific, setIsScientific] = useState(false);
  const { toast } = useToast();

  const clear = useCallback(() => {
    setDisplayValue('');
    setHistory('');
    setIsResult(false);
  }, []);

  const input = useCallback((char: string) => {
    if (isResult) {
      // If previous was a result, start new calculation
      // unless an operator is pressed
      if ([' + ', ' - ', ' * ', ' / ', ' ^ '].includes(char)) {
        setDisplayValue(displayValue + char);
      } else {
        setDisplayValue(char);
      }
      setIsResult(false);
    } else {
      setDisplayValue(prev => prev + char);
    }
  }, [isResult, displayValue]);
  
  const backspace = useCallback(() => {
    if (isResult) {
      clear();
      return;
    }
    setDisplayValue(prev => {
        if (prev.endsWith(' ')) return prev.slice(0, -3);
        if (prev.endsWith('(')) {
            const funcMatch = prev.match(/(sin|cos|tan|log|ln|sqrt)\($/);
            if(funcMatch) return prev.slice(0, -funcMatch[0].length);
        }
        return prev.slice(0, -1)
    });
  }, [isResult, clear]);

  const calculate = useCallback(() => {
    if (!displayValue || isResult) return;
    try {
        const result = evaluateExpression(displayValue, mode);
        const resultString = String(result);
        setHistory(`${displayValue} =`);
        setDisplayValue(resultString.length > 15 ? result.toExponential(9) : resultString);
        setIsResult(true);
    } catch(error: any) {
        toast({
            title: "Calculation Error",
            description: error.message || "Invalid expression",
            variant: "destructive"
        });
    }
  }, [displayValue, mode, isResult, toast]);

  const toggleSign = useCallback(() => {
    if (isResult) {
        setDisplayValue(prev => String(parseFloat(prev) * -1));
        return;
    }
    // A simple implementation: wrap the whole expression in negate()
    // A more complex one would find the last number and negate it.
    // For now, we'll use a simplified approach that adds 'negate('
    setDisplayValue(prev => `negate(${prev})`);
  }, [isResult]);

  const toggleRadDeg = useCallback(() => setMode(prev => prev === 'deg' ? 'rad' : 'deg'), []);
  const toggleScientificMode = useCallback(() => setIsScientific(prev => !prev), []);

  const memoryClear = useCallback(() => setMemory(0), []);
  const memoryRecall = useCallback(() => {
    input(String(memory));
    setIsResult(false);
  }, [memory, input]);
  const memoryAdd = useCallback(() => {
    const currentVal = parseFloat(isResult ? displayValue : '0');
    setMemory(prev => prev + currentVal);
  }, [displayValue, isResult]);
  const memorySubtract = useCallback(() => {
    const currentVal = parseFloat(isResult ? displayValue : '0');
    setMemory(prev => prev - currentVal);
  }, [displayValue, isResult]);

  return {
    displayValue,
    history,
    mode,
    isScientific,
    input,
    clear,
    backspace,
    calculate,
    toggleSign,
    toggleRadDeg,
    toggleScientificMode,
    memoryAdd,
    memorySubtract,
    memoryRecall,
    memoryClear,
  };
};
