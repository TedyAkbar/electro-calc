"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RotateCcw } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";

type Mode = "charge" | "energy" | "reactance" | "series" | "parallel";

const tabs: { label: string; value: Mode; formula: string }[] = [
  { label: "Q = C × V", value: "charge", formula: "Q = C × V" },
  { label: "E = ½CV²", value: "energy", formula: "E = ½ × C × V²" },
  { label: "Xc = 1/2πfC", value: "reactance", formula: "Xc = 1 / (2π × f × C)" },
  { label: "Series", value: "series", formula: "1/C_total = 1/C₁ + 1/C₂ + ..." },
  { label: "Parallel", value: "parallel", formula: "C_total = C₁ + C₂ + ..." },
];

function Field({ label, value, onChange, unit }: { label: string; value: string; onChange: (v: string) => void; unit?: string }) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="?"
          className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        {unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">{unit}</span>}
      </div>
    </div>
  );
}

export default function CapacitorCalculator() {
  const [mode, setMode] = useState<Mode>("charge");
  const [q, setQ] = useState(""); const [c, setC] = useState(""); const [v, setV] = useState("");
  const [e, setE] = useState("");
  const [xc, setXc] = useState(""); const [f, setF] = useState("");
  const [caps, setCaps] = useState<string[]>(["", ""]);
  const [result, setResult] = useState<{ label: string; value: string } | null>(null);
  const { addHistory } = useHistory();

  const reset = () => { setQ(""); setC(""); setV(""); setE(""); setXc(""); setF(""); setCaps(["", ""]); setResult(null); };

  const n = (s: string) => parseFloat(s);
  const ok = (s: string) => !isNaN(parseFloat(s)) && parseFloat(s) !== 0;

  const calculate = () => {
    let label = "", val = "";

    if (mode === "charge") {
      if (!ok(q) && ok(c) && ok(v)) { label = "Q"; val = `${(n(c) * n(v)).toFixed(6)} C`; }
      else if (ok(q) && !ok(c) && ok(v)) { label = "C"; val = `${(n(q) / n(v)).toFixed(9)} F`; }
      else if (ok(q) && ok(c) && !ok(v)) { label = "V"; val = `${(n(q) / n(c)).toFixed(4)} V`; }
    } else if (mode === "energy") {
      if (!ok(e) && ok(c) && ok(v)) { label = "E"; val = `${(0.5 * n(c) * n(v) ** 2).toFixed(9)} J`; }
      else if (ok(e) && !ok(c) && ok(v)) { label = "C"; val = `${(2 * n(e) / n(v) ** 2).toFixed(9)} F`; }
      else if (ok(e) && ok(c) && !ok(v)) { label = "V"; val = `${Math.sqrt(2 * n(e) / n(c)).toFixed(4)} V`; }
    } else if (mode === "reactance") {
      if (!ok(xc) && ok(f) && ok(c)) { label = "Xc"; val = `${(1 / (2 * Math.PI * n(f) * n(c))).toFixed(4)} Ω`; }
      else if (ok(xc) && !ok(f) && ok(c)) { label = "f"; val = `${(1 / (2 * Math.PI * n(xc) * n(c))).toFixed(4)} Hz`; }
      else if (ok(xc) && ok(f) && !ok(c)) { label = "C"; val = `${(1 / (2 * Math.PI * n(f) * n(xc))).toFixed(9)} F`; }
    } else if (mode === "series") {
      const vals = caps.map(n).filter(x => !isNaN(x) && x > 0);
      if (vals.length >= 2) { label = "C_total"; val = `${(1 / vals.reduce((a, v) => a + 1 / v, 0)).toFixed(9)} F`; }
    } else if (mode === "parallel") {
      const vals = caps.map(n).filter(x => !isNaN(x) && x > 0);
      if (vals.length >= 2) { label = "C_total"; val = `${vals.reduce((a, v) => a + v, 0).toFixed(9)} F`; }
    }

    if (label && val) {
      setResult({ label, value: val });
      addHistory({ type: "Capacitor", formula: tabs.find(t => t.value === mode)?.formula || mode, result: `${label} = ${val}` });
    }
  };

  const currentTab = tabs.find(t => t.value === mode)!;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-md mx-auto">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 font-bold text-xl w-14 h-14 flex items-center justify-center">C</div>
        <div>
          <h1 className="text-2xl font-bold">Capacitor</h1>
          <p className="text-xs text-gray-400">Isi 2 nilai — yang kosong akan dihitung otomatis</p>
        </div>
      </div>

      <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
        <div className="flex gap-2 w-max">
          {tabs.map(t => (
            <button key={t.value} onClick={() => { setMode(t.value); setResult(null); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${mode === t.value ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <p className="text-xs text-cyan-400 font-mono mb-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg px-3 py-2">{currentTab.formula}</p>
        <p className="text-xs text-gray-500 mb-4">💡 Kosongkan nilai yang ingin dicari. Sistem akan menghitung otomatis.</p>

        <div className="space-y-3">
          {mode === "charge" && (<>
            <Field label="Muatan Q" value={q} onChange={setQ} unit="C" />
            <Field label="Kapasitansi C" value={c} onChange={setC} unit="F" />
            <Field label="Tegangan V" value={v} onChange={setV} unit="V" />
          </>)}
          {mode === "energy" && (<>
            <Field label="Energi E" value={e} onChange={setE} unit="J" />
            <Field label="Kapasitansi C" value={c} onChange={setC} unit="F" />
            <Field label="Tegangan V" value={v} onChange={setV} unit="V" />
          </>)}
          {mode === "reactance" && (<>
            <Field label="Reaktansi Xc" value={xc} onChange={setXc} unit="Ω" />
            <Field label="Frekuensi f" value={f} onChange={setF} unit="Hz" />
            <Field label="Kapasitansi C" value={c} onChange={setC} unit="F" />
          </>)}
          {(mode === "series" || mode === "parallel") && (<>
            {caps.map((val, i) => (
              <Field key={i} label={`C${i + 1}`} value={val} onChange={nv => { const n = [...caps]; n[i] = nv; setCaps(n); }} unit="F" />
            ))}
            <Button variant="secondary" className="w-full text-sm" onClick={() => setCaps([...caps, ""])}>+ Add Capacitor</Button>
          </>)}
        </div>

        {result && (
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-xs text-blue-400 mb-1">✓ Hasil</p>
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
