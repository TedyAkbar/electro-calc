"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RotateCcw } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";

type Mode = "reactance" | "energy" | "series" | "parallel";

const tabs: { label: string; value: Mode; formula: string }[] = [
  { label: "XL = 2πfL", value: "reactance", formula: "XL = 2π × f × L" },
  { label: "E = ½LI²", value: "energy", formula: "E = ½ × L × I²" },
  { label: "Series", value: "series", formula: "L_total = L₁ + L₂ + ..." },
  { label: "Parallel", value: "parallel", formula: "1/L_total = 1/L₁ + 1/L₂ + ..." },
];

function Field({ label, value, onChange, unit }: { label: string; value: string; onChange: (v: string) => void; unit?: string }) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <div className="relative">
        <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder="?"
          className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors" />
        {unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">{unit}</span>}
      </div>
    </div>
  );
}

export default function InductorCalculator() {
  const [mode, setMode] = useState<Mode>("reactance");
  const [xl, setXl] = useState(""); const [f, setF] = useState(""); const [l, setL] = useState("");
  const [e, setE] = useState(""); const [i, setI] = useState("");
  const [coils, setCoils] = useState<string[]>(["", ""]);
  const [result, setResult] = useState<{ label: string; value: string } | null>(null);
  const { addHistory } = useHistory();

  const reset = () => { setXl(""); setF(""); setL(""); setE(""); setI(""); setCoils(["", ""]); setResult(null); };
  const n = (s: string) => parseFloat(s);
  const ok = (s: string) => !isNaN(parseFloat(s)) && parseFloat(s) !== 0;

  const calculate = () => {
    let label = "", val = "";

    if (mode === "reactance") {
      if (!ok(xl) && ok(f) && ok(l)) { label = "XL"; val = `${(2 * Math.PI * n(f) * n(l)).toFixed(4)} Ω`; }
      else if (ok(xl) && !ok(f) && ok(l)) { label = "f"; val = `${(n(xl) / (2 * Math.PI * n(l))).toFixed(4)} Hz`; }
      else if (ok(xl) && ok(f) && !ok(l)) { label = "L"; val = `${(n(xl) / (2 * Math.PI * n(f))).toFixed(6)} H`; }
    } else if (mode === "energy") {
      if (!ok(e) && ok(l) && ok(i)) { label = "E"; val = `${(0.5 * n(l) * n(i) ** 2).toFixed(6)} J`; }
      else if (ok(e) && !ok(l) && ok(i)) { label = "L"; val = `${(2 * n(e) / n(i) ** 2).toFixed(6)} H`; }
      else if (ok(e) && ok(l) && !ok(i)) { label = "I"; val = `${Math.sqrt(2 * n(e) / n(l)).toFixed(4)} A`; }
    } else if (mode === "series") {
      const vals = coils.map(n).filter(x => !isNaN(x) && x > 0);
      if (vals.length >= 2) { label = "L_total"; val = `${vals.reduce((a, v) => a + v, 0).toFixed(6)} H`; }
    } else if (mode === "parallel") {
      const vals = coils.map(n).filter(x => !isNaN(x) && x > 0);
      if (vals.length >= 2) { label = "L_total"; val = `${(1 / vals.reduce((a, v) => a + 1 / v, 0)).toFixed(6)} H`; }
    }

    if (label && val) {
      setResult({ label, value: val });
      addHistory({ type: "Inductor", formula: tabs.find(t => t.value === mode)?.formula || mode, result: `${label} = ${val}` });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-md mx-auto">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 font-bold text-xl w-14 h-14 flex items-center justify-center">L</div>
        <div>
          <h1 className="text-2xl font-bold">Inductor</h1>
          <p className="text-xs text-gray-400">Isi 2 nilai — yang kosong akan dihitung otomatis</p>
        </div>
      </div>

      <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
        <div className="flex gap-2 w-max">
          {tabs.map(t => (
            <button key={t.value} onClick={() => { setMode(t.value); setResult(null); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${mode === t.value ? "bg-purple-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <p className="text-xs text-cyan-400 font-mono mb-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg px-3 py-2">{tabs.find(t => t.value === mode)?.formula}</p>
        <p className="text-xs text-gray-500 mb-4">💡 Kosongkan nilai yang ingin dicari. Sistem akan menghitung otomatis.</p>

        <div className="space-y-3">
          {mode === "reactance" && (<>
            <Field label="Reaktansi Induktif XL" value={xl} onChange={setXl} unit="Ω" />
            <Field label="Frekuensi f" value={f} onChange={setF} unit="Hz" />
            <Field label="Induktansi L" value={l} onChange={setL} unit="H" />
          </>)}
          {mode === "energy" && (<>
            <Field label="Energi E" value={e} onChange={setE} unit="J" />
            <Field label="Induktansi L" value={l} onChange={setL} unit="H" />
            <Field label="Arus I" value={i} onChange={setI} unit="A" />
          </>)}
          {(mode === "series" || mode === "parallel") && (<>
            {coils.map((val, idx) => (
              <Field key={idx} label={`L${idx + 1}`} value={val} onChange={nv => { const a = [...coils]; a[idx] = nv; setCoils(a); }} unit="H" />
            ))}
            <Button variant="secondary" className="w-full text-sm" onClick={() => setCoils([...coils, ""])}>+ Add Inductor</Button>
          </>)}
        </div>

        {result && (
          <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <p className="text-xs text-purple-400 mb-1">✓ Hasil</p>
            <p className="font-mono text-lg font-bold text-white">{result.label} = {result.value}</p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" className="flex-1" onClick={reset}><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
          <Button variant="primary" className="flex-1" onClick={calculate}>Calculate</Button>
        </div>
      </Card>
    </div>
  );
}
