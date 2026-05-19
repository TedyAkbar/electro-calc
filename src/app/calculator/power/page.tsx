"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Power, RotateCcw } from "lucide-react";

import { useHistory } from "@/hooks/useHistory";

export default function PowerCalculator() {
  const [power, setPower] = useState("");
  const [voltage, setVoltage] = useState("");
  const [current, setCurrent] = useState("");
  const [lastEdited, setLastEdited] = useState<string[]>([]);
  const { addHistory } = useHistory();

  const handleEdit = (field: "p" | "v" | "i", value: string) => {
    if (field === "p") setPower(value);
    if (field === "v") setVoltage(value);
    if (field === "i") setCurrent(value);

    setLastEdited((prev) => {
      const filtered = prev.filter((item) => item !== field);
      return [field, ...filtered].slice(0, 2);
    });
  };

  const calculate = () => {
    const p = parseFloat(power);
    const v = parseFloat(voltage);
    const i = parseFloat(current);

    const isMissingP = isNaN(p) || (!lastEdited.includes("p") && lastEdited.length >= 2);
    const isMissingV = isNaN(v) || (!lastEdited.includes("v") && lastEdited.length >= 2);
    const isMissingI = isNaN(i) || (!lastEdited.includes("i") && lastEdited.length >= 2);

    if (!isNaN(v) && !isNaN(i) && isMissingP) {
      const res = (v * i).toFixed(2);
      setPower(res);
      addHistory({ type: "Power", formula: `V=${v}V, I=${i}A`, result: `P = ${res} W` });
    } else if (!isNaN(p) && !isNaN(v) && isMissingI) {
      const res = (p / v).toFixed(2);
      setCurrent(res);
      addHistory({ type: "Power", formula: `P=${p}W, V=${v}V`, result: `I = ${res} A` });
    } else if (!isNaN(p) && !isNaN(i) && isMissingV) {
      const res = (p / i).toFixed(2);
      setVoltage(res);
      addHistory({ type: "Power", formula: `P=${p}W, I=${i}A`, result: `V = ${res} V` });
    }
  };

  const reset = () => {
    setPower("");
    setVoltage("");
    setCurrent("");
    setLastEdited([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-md mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
          <Power className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold">Power Calculator</h1>
      </div>

      <Card>
        <p className="text-sm text-gray-400 mb-6">
          Enter any two values to calculate the third.
          Formula: <span className="text-cyan-400 font-mono bg-cyan-400/10 px-2 py-0.5 rounded">P = V × I</span>
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Power (P)</label>
            <div className="relative">
              <input
                type="number"
                value={power}
                onChange={(e) => handleEdit("p", e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Watts"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">W</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Voltage (V)</label>
            <div className="relative">
              <input
                type="number"
                value={voltage}
                onChange={(e) => handleEdit("v", e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Amperes"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">A</span>
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
