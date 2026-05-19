"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calculator } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";

export default function StandardCalculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const { addHistory } = useHistory();

  const handleNumber = (num: string) => {
    if (display === "0" || display === "Error") {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    if (op === "%") {
      try {
        const val = parseFloat(display);
        setDisplay(String(val / 100));
      } catch {
        setDisplay("Error");
      }
      return;
    }

    if (equation) {
      try {
        // If they just typed an operator after another, replace the operator
        if (display === "0" && equation.trim().match(/[\+\-\*\/]$/)) {
          setEquation(equation.slice(0, -2) + op + " ");
          return;
        }
        
        const result = new Function("return " + equation + display)();
        setEquation(result + " " + op + " ");
        setDisplay("0");
      } catch {
        setDisplay("Error");
      }
    } else {
      setEquation(display + " " + op + " ");
      setDisplay("0");
    }
  };

  const calculate = () => {
    try {
      if (!equation) return;
      // Evaluate the expression safely
      // eslint-disable-next-line no-new-func
      const result = new Function("return " + equation + display)();
      const resultStr = String(result);
      
      addHistory({ type: "Standard", formula: equation + display, result: resultStr });
      
      setDisplay(resultStr);
      setEquation("");
    } catch {
      setDisplay("Error");
    }
  };

  const clear = () => {
    setDisplay("0");
    setEquation("");
  };

  const del = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const buttons = [
    { label: "C", onClick: clear, variant: "danger" as const },
    { label: "DEL", onClick: del, variant: "secondary" as const },
    { label: "%", onClick: () => handleOperator("%"), variant: "secondary" as const },
    { label: "/", onClick: () => handleOperator("/"), variant: "operator" as const },
    { label: "7", onClick: () => handleNumber("7"), variant: "ghost" as const },
    { label: "8", onClick: () => handleNumber("8"), variant: "ghost" as const },
    { label: "9", onClick: () => handleNumber("9"), variant: "ghost" as const },
    { label: "*", onClick: () => handleOperator("*"), variant: "operator" as const },
    { label: "4", onClick: () => handleNumber("4"), variant: "ghost" as const },
    { label: "5", onClick: () => handleNumber("5"), variant: "ghost" as const },
    { label: "6", onClick: () => handleNumber("6"), variant: "ghost" as const },
    { label: "-", onClick: () => handleOperator("-"), variant: "operator" as const },
    { label: "1", onClick: () => handleNumber("1"), variant: "ghost" as const },
    { label: "2", onClick: () => handleNumber("2"), variant: "ghost" as const },
    { label: "3", onClick: () => handleNumber("3"), variant: "ghost" as const },
    { label: "+", onClick: () => handleOperator("+"), variant: "operator" as const },
    { label: "0", onClick: () => handleNumber("0"), variant: "ghost" as const, className: "col-span-2" },
    { label: ".", onClick: () => handleNumber("."), variant: "ghost" as const },
    { label: "=", onClick: calculate, variant: "primary" as const },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-md mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
          <Calculator className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold">Standard Calculator</h1>
      </div>

      <Card className="p-6">
        <div className="bg-gray-900 rounded-xl p-4 mb-6 text-right flex flex-col justify-end min-h-[120px] shadow-inner border border-gray-800">
          <div className="text-gray-400 text-sm h-6 font-mono">{equation}</div>
          <div className="text-4xl font-bold text-white tracking-wider font-mono truncate">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn, idx) => (
            <Button
              key={idx}
              variant={btn.variant}
              onClick={btn.onClick}
              className={`text-xl h-14 ${btn.className || ""}`}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
