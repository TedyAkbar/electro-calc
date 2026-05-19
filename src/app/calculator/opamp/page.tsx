"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RotateCcw } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";

type Mode = "inverting" | "noninverting" | "buffer" | "filter";

const tabs: { label: string; value: Mode; formula: string }[] = [
  { label: "Inverting", value: "inverting", formula: "Av = -Rf / Rin" },
  { label: "Non-Inverting", value: "noninverting", formula: "Av = 1 + (Rf / Rin)" },
  { label: "Buffer", value: "buffer", formula: "Av = 1 → Vout = Vin" },
  { label: "RC Filter", value: "filter", formula: "fc = 1 / (2π × R × C)" },
];

function Field({ label, value, onChange, unit }: { label: string; value: string; onChange: (v: string) => void; unit?: string }) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <div className="relative">
        <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder="?"
          className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors" />
        {unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">{unit}</span>}
      </div>
    </div>
  );
}

export default function OpAmpCalculator() {
  const [mode, setMode] = useState<Mode>("inverting");
  const [av, setAv] = useState(""); const [rf, setRf] = useState(""); const [rin, setRin] = useState("");
  const [r, setR] = useState(""); const [c, setC] = useState(""); const [fc, setFc] = useState("");
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);
  const { addHistory } = useHistory();

  const reset = () => { setAv(""); setRf(""); setRin(""); setR(""); setC(""); setFc(""); setResults([]); };
  const n = (s: string) => parseFloat(s);
  const ok = (s: string) => !isNaN(parseFloat(s)) && parseFloat(s) !== 0;

  const calculate = () => {
    const out: { label: string; value: string }[] = [];

    if (mode === "inverting") {
      // Av = -Rf / Rin → solve for any missing
      const avv = ok(av) ? n(av) : null;
      const rfv = ok(rf) ? n(rf) : null;
      const rinv = ok(rin) ? n(rin) : null;

      if (rfv !== null && rinv !== null) {
        out.push({ label: "Av", value: `${-(rfv / rinv).toFixed(4)}` });
      } else if (avv !== null && rinv !== null) {
        out.push({ label: "Rf", value: `${(-avv * rinv).toFixed(2)} Ω` });
      } else if (avv !== null && rfv !== null) {
        out.push({ label: "Rin", value: `${(-rfv / avv).toFixed(2)} Ω` });
      }
    } else if (mode === "noninverting") {
      // Av = 1 + Rf/Rin
      const avv = ok(av) ? n(av) : null;
      const rfv = ok(rf) ? n(rf) : null;
      const rinv = ok(rin) ? n(rin) : null;

      if (rfv !== null && rinv !== null) {
        out.push({ label: "Av", value: `${(1 + rfv / rinv).toFixed(4)}` });
      } else if (avv !== null && rinv !== null) {
        out.push({ label: "Rf", value: `${((avv - 1) * rinv).toFixed(2)} Ω` });
      } else if (avv !== null && rfv !== null) {
        out.push({ label: "Rin", value: `${(rfv / (avv - 1)).toFixed(2)} Ω` });
      }
    } else if (mode === "filter") {
      // fc = 1/(2πRC)
      const fcv = ok(fc) ? n(fc) : null;
      const rv = ok(r) ? n(r) : null;
      const cv = ok(c) ? n(c) : null;

      if (rv !== null && cv !== null) {
        out.push({ label: "fc", value: `${(1 / (2 * Math.PI * rv * cv)).toFixed(4)} Hz` });
      } else if (fcv !== null && cv !== null) {
        out.push({ label: "R", value: `${(1 / (2 * Math.PI * fcv * cv)).toFixed(2)} Ω` });
      } else if (fcv !== null && rv !== null) {
        out.push({ label: "C", value: `${(1 / (2 * Math.PI * fcv * rv)).toFixed(9)} F` });
      }
    } else if (mode === "buffer") {
      out.push({ label: "Av", value: "1 (Unity Gain)" });
      out.push({ label: "Vout", value: "= Vin" });
      out.push({ label: "Zin", value: "→ ∞ (sangat tinggi)" });
      out.push({ label: "Zout", value: "→ 0 (sangat rendah)" });
    }

    if (out.length > 0) {
      setResults(out);
      addHistory({ type: "Op-Amp", formula: tabs.find(t => t.value === mode)?.formula || mode, result: out.map(o => `${o.label} = ${o.value}`).join(", ") });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-md mx-auto">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400 font-bold text-base w-14 h-14 flex items-center justify-center">OP</div>
        <div>
          <h1 className="text-2xl font-bold">Op-Amp</h1>
          <p className="text-xs text-gray-400">Isi 2 nilai — yang kosong akan dihitung otomatis</p>
        </div>
      </div>

      <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
        <div className="flex gap-2 w-max">
          {tabs.map(t => (
            <button key={t.value} onClick={() => { setMode(t.value); setResults([]); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${mode === t.value ? "bg-teal-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <p className="text-xs text-cyan-400 font-mono mb-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg px-3 py-2">{tabs.find(t => t.value === mode)?.formula}</p>
        {mode !== "buffer" && <p className="text-xs text-gray-500 mb-4">💡 Kosongkan nilai yang ingin dicari. Sistem akan menghitung otomatis.</p>}

        <div className="space-y-3">
          {(mode === "inverting" || mode === "noninverting") && (<>
            <Field label="Gain Av" value={av} onChange={setAv} unit="×" />
            <Field label="Resistor Feedback Rf" value={rf} onChange={setRf} unit="Ω" />
            <Field label="Resistor Input Rin" value={rin} onChange={setRin} unit="Ω" />
          </>)}
          {mode === "filter" && (<>
            <Field label="Cutoff Frequency fc" value={fc} onChange={setFc} unit="Hz" />
            <Field label="Resistansi R" value={r} onChange={setR} unit="Ω" />
            <Field label="Kapasitansi C" value={c} onChange={setC} unit="F" />
          </>)}
          {mode === "buffer" && (
            <div className="space-y-2 text-sm text-gray-300">
              <p className="text-xs text-gray-400">Voltage follower — tidak ada nilai yang perlu diinput:</p>
              <div className="bg-gray-800/50 rounded-xl px-4 py-3 font-mono text-teal-400">Av = 1 → Vout = Vin</div>
              <div className="bg-gray-800/50 rounded-xl px-4 py-3 text-xs text-gray-400">Input impedance: sangat tinggi (≈ ∞)<br />Output impedance: sangat rendah (≈ 0)</div>
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="mt-4 p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl space-y-2">
            <p className="text-xs text-teal-400 mb-2">✓ Hasil</p>
            {results.map((r) => (
              <p key={r.label} className="font-mono text-white"><span className="text-teal-400">{r.label}</span> = {r.value}</p>
            ))}
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
