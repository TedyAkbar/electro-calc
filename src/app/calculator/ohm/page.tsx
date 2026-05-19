"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Zap, RotateCcw } from "lucide-react";

import { useHistory } from "@/hooks/useHistory";

export default function OhmLawCalculator() {
  const [voltage, setVoltage] = useState("");
  const [current, setCurrent] = useState("");
  const [resistance, setResistance] = useState("");
  const [lastEdited, setLastEdited] = useState<string[]>([]);
  const { addHistory } = useHistory();

  const handleEdit = (field: "v" | "i" | "r", value: string) => {
    if (field === "v") setVoltage(value);
    if (field === "i") setCurrent(value);
    if (field === "r") setResistance(value);

    setLastEdited((prev) => {
      const filtered = prev.filter((p) => p !== field);
      return [field, ...filtered].slice(0, 2);
    });
  };

  const calculate = () => {
    const v = parseFloat(voltage);
    const i = parseFloat(current);
    const r = parseFloat(resistance);

    const isMissingV = isNaN(v) || (!lastEdited.includes("v") && lastEdited.length >= 2);
    const isMissingI = isNaN(i) || (!lastEdited.includes("i") && lastEdited.length >= 2);
    const isMissingR = isNaN(r) || (!lastEdited.includes("r") && lastEdited.length >= 2);

    if (!isNaN(i) && !isNaN(r) && isMissingV) {
      const res = (i * r).toFixed(2);
      setVoltage(res);
      addHistory({ type: "Ohm's Law", formula: `I=${i}A, R=${r}Ω`, result: `V = ${res} V` });
    } else if (!isNaN(v) && !isNaN(r) && isMissingI) {
      const res = (v / r).toFixed(2);
      setCurrent(res);
      addHistory({ type: "Ohm's Law", formula: `V=${v}V, R=${r}Ω`, result: `I = ${res} A` });
    } else if (!isNaN(v) && !isNaN(i) && isMissingR) {
      const res = (v / i).toFixed(2);
      setResistance(res);
      addHistory({ type: "Ohm's Law", formula: `V=${v}V, I=${i}A`, result: `R = ${res} Ω` });
    }
  };

  const reset = () => {
    setVoltage("");
    setCurrent("");
    setResistance("");
    setLastEdited([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
          <Zap className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold">Ohm's Law</h1>
      </div>

      <Card>
        <p className="text-sm text-gray-400 mb-6">
          Enter any two values to calculate the third.
          Formula: <span className="text-cyan-400 font-mono bg-cyan-400/10 px-2 py-0.5 rounded">V = I × R</span>
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Voltage (V)</label>
            <div className="relative">
              <input
                type="number"
                value={voltage}
                onChange={(e) => handleEdit("v", e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                placeholder="Volts"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">V</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Current (I)</label>
            <div className="relative">
              <input
                type="number"
                value={current}
                onChange={(e) => handleEdit("i", e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                placeholder="Amperes"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">A</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Resistance (R)</label>
            <div className="relative">
              <input
                type="number"
                value={resistance}
                onChange={(e) => handleEdit("r", e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                placeholder="Ohms"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">Ω</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
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
