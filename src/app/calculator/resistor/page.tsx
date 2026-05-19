"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CircuitBoard, Plus, Trash2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useHistory } from "@/hooks/useHistory";

export default function ResistorCalculator() {
  const [mode, setMode] = useState<"series" | "parallel">("series");
  const [resistors, setResistors] = useState<string[]>(["", ""]);
  const [result, setResult] = useState<string | null>(null);
  const { addHistory } = useHistory();

  const addResistor = () => {
    setResistors([...resistors, ""]);
  };

  const removeResistor = (index: number) => {
    if (resistors.length <= 2) return;
    const newResistors = resistors.filter((_, i) => i !== index);
    setResistors(newResistors);
  };

  const updateResistor = (index: number, value: string) => {
    const newResistors = [...resistors];
    newResistors[index] = value;
    setResistors(newResistors);
  };

  const calculate = () => {
    const values = resistors.map((r) => parseFloat(r)).filter((r) => !isNaN(r) && r > 0);
    
    if (values.length === 0) {
      setResult("0");
      return;
    }

    let res = "";
    if (mode === "series") {
      const total = values.reduce((acc, curr) => acc + curr, 0);
      res = total.toFixed(2);
      setResult(res);
    } else {
      const totalInverse = values.reduce((acc, curr) => acc + (1 / curr), 0);
      res = (1 / totalInverse).toFixed(2);
      setResult(res);
    }

    addHistory({ 
      type: `Resistor (${mode})`, 
      formula: values.map(v => `${v}Ω`).join(mode === 'series' ? ' + ' : ' || '), 
      result: `${res} Ω` 
    });
  };

  const reset = () => {
    setResistors(["", ""]);
    setResult(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-md mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
          <CircuitBoard className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold">Resistor Calculator</h1>
      </div>

      <div className="flex p-1 bg-gray-800 rounded-xl mb-6">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === "series" ? "bg-cyan-500 text-white shadow-md" : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setMode("series")}
        >
          Series
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === "parallel" ? "bg-cyan-500 text-white shadow-md" : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setMode("parallel")}
        >
          Parallel
        </button>
      </div>

      <Card>
        <div className="space-y-3 mb-6">
          <AnimatePresence>
            {resistors.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3"
              >
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">
                    R{idx + 1}
                  </span>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => updateResistor(idx, e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Resistance"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">Ω</span>
                </div>
                {resistors.length > 2 && (
                  <button
                    onClick={() => removeResistor(idx)}
                    className="p-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Button variant="ghost" className="w-full mb-8 border border-dashed border-gray-600" onClick={addResistor}>
          <Plus className="w-5 h-5 mr-2" /> Add Resistor
        </Button>

        {result !== null && (
          <div className="bg-gray-900 rounded-xl p-6 text-center border border-cyan-500/30 mb-8 shadow-inner shadow-cyan-500/5">
            <p className="text-gray-400 text-sm mb-1">Total Resistance</p>
            <p className="text-3xl font-bold text-white font-mono">{result} <span className="text-cyan-500">Ω</span></p>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={reset}>
            <RotateCcw className="w-5 h-5 mr-2" /> Reset
          </Button>
          <Button variant="primary" className="flex-1" onClick={calculate}>
            Calculate
          </Button>
        </div>
      </Card>
    </div>
  );
}
