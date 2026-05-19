"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Sigma, ChevronDown, ChevronUp } from "lucide-react";

interface FormulaItem {
  equation: string;
  desc: string;
}

interface FormulaCategory {
  title: string;
  color: string;
  formulas: FormulaItem[];
}

const categories: FormulaCategory[] = [
  {
    title: "Ohm's Law & Power",
    color: "text-yellow-400",
    formulas: [
      { equation: "V = I × R", desc: "Voltage = Current × Resistance" },
      { equation: "I = V / R", desc: "Current = Voltage / Resistance" },
      { equation: "R = V / I", desc: "Resistance = Voltage / Current" },
      { equation: "P = V × I", desc: "Power = Voltage × Current" },
      { equation: "P = I² × R", desc: "Power = Current² × Resistance" },
      { equation: "P = V² / R", desc: "Power = Voltage² / Resistance" },
    ],
  },
  {
    title: "Resistor",
    color: "text-green-400",
    formulas: [
      { equation: "R_s = R1 + R2 + R3 + ...", desc: "Series: total resistance is the sum of all" },
      { equation: "1/R_p = 1/R1 + 1/R2 + ...", desc: "Parallel: reciprocal of total resistance" },
      { equation: "R_p = (R1 × R2) / (R1 + R2)", desc: "Parallel of two resistors simplified" },
    ],
  },
  {
    title: "Capacitor",
    color: "text-blue-400",
    formulas: [
      { equation: "Q = C × V", desc: "Charge = Capacitance × Voltage" },
      { equation: "E = ½ × C × V²", desc: "Energy stored in a capacitor" },
      { equation: "C_s = (C1 × C2) / (C1 + C2)", desc: "Series capacitance (two caps)" },
      { equation: "C_p = C1 + C2 + ...", desc: "Parallel capacitance (sum of all)" },
      { equation: "Xc = 1 / (2π × f × C)", desc: "Capacitive reactance" },
    ],
  },
  {
    title: "Inductor",
    color: "text-purple-400",
    formulas: [
      { equation: "E = ½ × L × I²", desc: "Energy stored in an inductor" },
      { equation: "V = L × (dI/dt)", desc: "Voltage across inductor" },
      { equation: "L_s = L1 + L2 + ...", desc: "Series inductance (sum of all)" },
      { equation: "1/L_p = 1/L1 + 1/L2 + ...", desc: "Parallel inductance" },
      { equation: "XL = 2π × f × L", desc: "Inductive reactance" },
    ],
  },
  {
    title: "AC Circuits",
    color: "text-cyan-400",
    formulas: [
      { equation: "Z = √(R² + (XL - Xc)²)", desc: "Impedance of RLC circuit" },
      { equation: "f_r = 1 / (2π × √(LC))", desc: "Resonant frequency" },
      { equation: "P = V × I × cos(φ)", desc: "Real (active) power" },
      { equation: "Q = V × I × sin(φ)", desc: "Reactive power" },
      { equation: "S = V × I", desc: "Apparent power (VA)" },
      { equation: "PF = P / S = cos(φ)", desc: "Power Factor" },
    ],
  },
  {
    title: "Kirchhoff's Laws",
    color: "text-orange-400",
    formulas: [
      { equation: "ΣI_in = ΣI_out", desc: "KCL: Sum of currents at a node = 0" },
      { equation: "ΣV = 0 (closed loop)", desc: "KVL: Sum of voltages in a loop = 0" },
    ],
  },
  {
    title: "Semiconductor & Diode",
    color: "text-pink-400",
    formulas: [
      { equation: "V_D ≈ 0.7V (Si)", desc: "Forward voltage drop of Silicon diode" },
      { equation: "V_D ≈ 0.3V (Ge)", desc: "Forward voltage drop of Germanium diode" },
      { equation: "β = I_C / I_B", desc: "BJT current gain (hFE)" },
      { equation: "I_C = β × I_B", desc: "Collector current" },
      { equation: "V_CE = V_CC - I_C × R_C", desc: "Collector-Emitter voltage" },
    ],
  },
  {
    title: "Op-Amp",
    color: "text-teal-400",
    formulas: [
      { equation: "Av = -R_f / R_in", desc: "Inverting amplifier gain" },
      { equation: "Av = 1 + (R_f / R_in)", desc: "Non-inverting amplifier gain" },
      { equation: "Av = 1 (Unity gain)", desc: "Voltage follower (buffer)" },
      { equation: "f_c = 1 / (2π × R × C)", desc: "Cutoff frequency of RC filter" },
    ],
  },
];

function CategoryCard({ cat }: { cat: FormulaCategory }) {
  const [open, setOpen] = useState(true);

  return (
    <Card className="border border-gray-800 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left"
      >
        <h2 className={`text-lg font-bold ${cat.color}`}>{cat.title}</h2>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          {cat.formulas.map((f, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="bg-gray-900/80 px-4 py-2.5 rounded-lg font-mono text-cyan-300 text-sm border border-gray-800 tracking-wide">
                {f.equation}
              </div>
              <p className="text-xs text-gray-400 px-1">{f.desc}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default function Formulas() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
          <Sigma className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Formula Reference</h1>
          <p className="text-xs text-gray-400">Electrical Engineering Quick Reference</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat, i) => (
          <CategoryCard key={i} cat={cat} />
        ))}
      </div>
    </div>
  );
}
