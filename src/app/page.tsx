"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calculator, Zap, Power, CircuitBoard, ArrowLeftRight,
  Sigma, ChevronDown, ChevronUp,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

const tools = [
  // Row 1 – Basic
  { name: "Standard", icon: Calculator, href: "/calculator/standard", color: "text-blue-500", bg: "bg-blue-500/10", formula: "＋ － × ÷" },
  { name: "Ohm's Law", icon: Zap, href: "/calculator/ohm", color: "text-yellow-500", bg: "bg-yellow-500/10", formula: "V = I × R" },
  { name: "Power", icon: Power, href: "/calculator/power", color: "text-red-500", bg: "bg-red-500/10", formula: "P = V × I" },
  { name: "Resistor", icon: CircuitBoard, href: "/calculator/resistor", color: "text-green-500", bg: "bg-green-500/10", formula: "R₁ + R₂ + ..." },
  { name: "Converter", icon: ArrowLeftRight, href: "/calculator/converter", color: "text-purple-500", bg: "bg-purple-500/10", formula: "Unit ⇄ Unit" },
  // Row 2 – Advanced (text icons)
  { name: "Capacitor", textIcon: "C", href: "/calculator/capacitor", color: "text-blue-400", bg: "bg-blue-400/10", formula: "Q = C × V" },
  { name: "Inductor", textIcon: "L", href: "/calculator/inductor", color: "text-purple-400", bg: "bg-purple-400/10", formula: "XL = 2πfL" },
  { name: "AC Circuit", textIcon: "AC", href: "/calculator/ac", color: "text-cyan-400", bg: "bg-cyan-400/10", formula: "Z = √(R²+X²)" },
  { name: "Semicond.", textIcon: "SC", href: "/calculator/semiconductor", color: "text-pink-400", bg: "bg-pink-400/10", formula: "IC = β × IB" },
  { name: "Op-Amp", textIcon: "OP", href: "/calculator/opamp", color: "text-teal-400", bg: "bg-teal-400/10", formula: "Av = -Rf/Rin" },
];

const formulaGroups = [
  {
    label: "Basic",
    color: "text-yellow-400",
    formulas: [
      { name: "Ohm's Law", eq: "V = I × R" },
      { name: "Power", eq: "P = V × I" },
      { name: "Power (R)", eq: "P = I² × R" },
    ],
  },
  {
    label: "Resistor",
    color: "text-green-400",
    formulas: [
      { name: "Series", eq: "R = R₁ + R₂ + ..." },
      { name: "Parallel", eq: "1/R = 1/R₁ + 1/R₂" },
    ],
  },
  {
    label: "Capacitor",
    color: "text-blue-400",
    formulas: [
      { name: "Charge", eq: "Q = C × V" },
      { name: "Energy", eq: "E = ½ × C × V²" },
      { name: "Reactance", eq: "Xc = 1/(2πfC)" },
    ],
  },
  {
    label: "Inductor",
    color: "text-purple-400",
    formulas: [
      { name: "Reactance", eq: "XL = 2π × f × L" },
      { name: "Energy", eq: "E = ½ × L × I²" },
    ],
  },
  {
    label: "AC Circuit",
    color: "text-cyan-400",
    formulas: [
      { name: "Impedance", eq: "Z = √(R² + (XL-Xc)²)" },
      { name: "Resonance", eq: "fr = 1/(2π√(LC))" },
      { name: "Power Factor", eq: "PF = cos(φ)" },
    ],
  },
  {
    label: "Kirchhoff",
    color: "text-orange-400",
    formulas: [
      { name: "KCL", eq: "ΣI_in = ΣI_out" },
      { name: "KVL", eq: "ΣV = 0 (loop)" },
    ],
  },
  {
    label: "Semiconductor",
    color: "text-pink-400",
    formulas: [
      { name: "BJT Gain", eq: "IC = β × IB" },
      { name: "VCE", eq: "VCE = VCC - IC×RC" },
      { name: "Si Diode", eq: "VD ≈ 0.7 V" },
    ],
  },
  {
    label: "Op-Amp",
    color: "text-teal-400",
    formulas: [
      { name: "Inverting", eq: "Av = -Rf / Rin" },
      { name: "Non-Inv.", eq: "Av = 1 + Rf/Rin" },
      { name: "RC Filter", eq: "fc = 1/(2πRC)" },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = { hidden: { y: 16, opacity: 0 }, visible: { y: 0, opacity: 1 } };

function FormulaSection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Sigma className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold text-gray-300">Formula Reference</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/formulas" onClick={e => e.stopPropagation()} className="text-xs text-cyan-400 hover:underline">See all</Link>
          {open ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-800 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {formulaGroups.map((group) => (
            <div key={group.label}>
              <p className={`text-xs font-bold mb-2 ${group.color}`}>{group.label}</p>
              <div className="space-y-1.5">
                {group.formulas.map((f) => (
                  <div key={f.name} className="flex justify-between items-center bg-gray-800/50 rounded-lg px-3 py-1.5">
                    <span className="text-[11px] text-gray-400">{f.name}</span>
                    <span className="font-mono text-[11px] text-cyan-300">{f.eq}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          ElectroCalc
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Engineering Calculator & Reference</p>
      </header>

      {/* Formula Reference (collapsible) */}
      <FormulaSection />

      {/* Calculators Grid */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Calculators</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
        >
          {tools.map((tool) => {
            const Icon = (tool as { icon?: React.ComponentType<{ className?: string }> }).icon;
            const textIcon = (tool as { textIcon?: string }).textIcon;
            return (
              <motion.div key={tool.name} variants={itemVariants}>
                <Link href={tool.href}>
                  <Card className="h-full flex flex-col items-center justify-center p-4 hover:bg-gray-800/50 transition-all cursor-pointer text-center group border border-transparent hover:border-gray-700">
                    <div className={`p-3 rounded-2xl mb-2.5 ${tool.bg} group-hover:scale-110 transition-transform flex items-center justify-center w-12 h-12`}>
                      {Icon ? (
                        <Icon className={`w-6 h-6 ${tool.color}`} />
                      ) : (
                        <span className={`text-sm font-bold ${tool.color}`}>{textIcon}</span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors leading-tight mb-1">
                      {tool.name}
                    </span>
                    <span className={`text-[10px] font-mono ${tool.color} opacity-60`}>
                      {tool.formula}
                    </span>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
