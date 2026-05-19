"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RotateCcw } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";

type Mode = "impedance" | "resonance" | "power" | "powerFactor";

const tabs: { label: string; value: Mode; formula: string }[] = [
  { label: "Impedance Z", value: "impedance", formula: "Z = √(R² + (XL - Xc)²)" },
  { label: "Resonance fr", value: "resonance", formula: "fr = 1 / (2π × √(L × C))" },
  { label: "Power P/Q/S", value: "power", formula: "P = V×I×cos(φ)  |  Q = V×I×sin(φ)" },
  { label: "Power Factor", value: "powerFactor", formula: "PF = P / S = cos(φ)" },
];

function Field({ label, value, onChange, unit }: { label: string; value: string; onChange: (v: string) => void; unit?: string }) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <div className="relative">
        <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder="?"
          className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors" />
        {unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">{unit}</span>}
      </div>
    </div>
  );
}

export default function ACCircuitCalculator() {
  const [mode, setMode] = useState<Mode>("impedance");
  const [z, setZ] = useState(""); const [r, setR] = useState(""); const [xl, setXl] = useState(""); const [xc, setXc] = useState("");
  const [fr, setFr] = useState(""); const [l, setL] = useState(""); const [c, setC] = useState("");
  const [p, setP] = useState(""); const [q, setQ] = useState(""); const [s, setS] = useState("");
  const [v, setV] = useState(""); const [i, setI] = useState(""); const [phi, setPhi] = useState("");
  const [pf, setPf] = useState("");
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);
  const { addHistory } = useHistory();

  const reset = () => { setZ(""); setR(""); setXl(""); setXc(""); setFr(""); setL(""); setC(""); setP(""); setQ(""); setS(""); setV(""); setI(""); setPhi(""); setPf(""); setResults([]); };
  const n = (s: string) => parseFloat(s);
  const ok = (s: string) => !isNaN(parseFloat(s));

  const calculate = () => {
    const out: { label: string; value: string }[] = [];

    if (mode === "impedance") {
      const rv = ok(r) ? n(r) : null;
      const xlv = ok(xl) ? n(xl) : null;
      const xcv = ok(xc) ? n(xc) : null;
      const zv = ok(z) ? n(z) : null;

      if (rv !== null && xlv !== null && xcv !== null) {
        const zCalc = Math.sqrt(rv ** 2 + (xlv - xcv) ** 2);
        out.push({ label: "Z", value: `${zCalc.toFixed(4)} Ω` });
        out.push({ label: "θ", value: `${(Math.atan2(xlv - xcv, rv) * 180 / Math.PI).toFixed(2)}°` });
      } else if (zv !== null && rv !== null && xlv !== null) {
        const xcCalc = xlv - Math.sqrt(zv ** 2 - rv ** 2);
        out.push({ label: "Xc", value: `${xcCalc.toFixed(4)} Ω` });
      } else if (zv !== null && rv !== null && xcv !== null) {
        const xlCalc = xcv + Math.sqrt(zv ** 2 - rv ** 2);
        out.push({ label: "XL", value: `${xlCalc.toFixed(4)} Ω` });
      } else if (zv !== null && xlv !== null && xcv !== null) {
        const rCalc = Math.sqrt(zv ** 2 - (xlv - xcv) ** 2);
        out.push({ label: "R", value: `${rCalc.toFixed(4)} Ω` });
      }
    } else if (mode === "resonance") {
      const frv = ok(fr) ? n(fr) : null;
      const lv = ok(l) ? n(l) : null;
      const cv = ok(c) ? n(c) : null;

      if (lv !== null && cv !== null) {
        out.push({ label: "fr", value: `${(1 / (2 * Math.PI * Math.sqrt(lv * cv))).toFixed(4)} Hz` });
      } else if (frv !== null && cv !== null) {
        const lCalc = 1 / (cv * (2 * Math.PI * frv) ** 2);
        out.push({ label: "L", value: `${lCalc.toFixed(6)} H` });
      } else if (frv !== null && lv !== null) {
        const cCalc = 1 / (lv * (2 * Math.PI * frv) ** 2);
        out.push({ label: "C", value: `${cCalc.toFixed(9)} F` });
      }
    } else if (mode === "power") {
      const vv = ok(v) ? n(v) : null;
      const iv = ok(i) ? n(i) : null;
      const phiv = ok(phi) ? n(phi) * Math.PI / 180 : null;
      const sv = ok(s) ? n(s) : null;
      const pv = ok(p) ? n(p) : null;

      if (vv !== null && iv !== null) {
        const sCalc = vv * iv;
        if (phiv !== null) {
          out.push({ label: "S", value: `${sCalc.toFixed(2)} VA` });
          out.push({ label: "P (Real)", value: `${(sCalc * Math.cos(phiv)).toFixed(2)} W` });
          out.push({ label: "Q (Reactive)", value: `${(sCalc * Math.sin(phiv)).toFixed(2)} VAR` });
        } else {
          out.push({ label: "S", value: `${sCalc.toFixed(2)} VA` });
        }
      } else if (sv !== null && phiv !== null) {
        out.push({ label: "P (Real)", value: `${(sv * Math.cos(phiv)).toFixed(2)} W` });
        out.push({ label: "Q (Reactive)", value: `${(sv * Math.sin(phiv)).toFixed(2)} VAR` });
      } else if (pv !== null && sv !== null) {
        out.push({ label: "PF", value: (pv / sv).toFixed(4) });
        out.push({ label: "φ", value: `${(Math.acos(pv / sv) * 180 / Math.PI).toFixed(2)}°` });
      }
    } else if (mode === "powerFactor") {
      const phiv = ok(phi) ? n(phi) : null;
      const pfv = ok(pf) ? n(pf) : null;
      if (phiv !== null) {
        out.push({ label: "PF", value: Math.cos(phiv * Math.PI / 180).toFixed(4) });
      } else if (pfv !== null) {
        out.push({ label: "φ", value: `${(Math.acos(pfv) * 180 / Math.PI).toFixed(2)}°` });
      }
    }

    if (out.length > 0) {
      setResults(out);
      addHistory({ type: "AC Circuit", formula: tabs.find(t => t.value === mode)?.formula || mode, result: out.map(o => `${o.label} = ${o.value}`).join(", ") });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-md mx-auto">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 font-bold text-base w-14 h-14 flex items-center justify-center">AC</div>
        <div>
          <h1 className="text-2xl font-bold">AC Circuit</h1>
          <p className="text-xs text-gray-400">Isi nilai yang diketahui — lainnya dihitung otomatis</p>
        </div>
      </div>

      <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
        <div className="flex gap-2 w-max">
          {tabs.map(t => (
            <button key={t.value} onClick={() => { setMode(t.value); setResults([]); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${mode === t.value ? "bg-cyan-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <p className="text-xs text-cyan-400 font-mono mb-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg px-3 py-2">{tabs.find(t => t.value === mode)?.formula}</p>
        <p className="text-xs text-gray-500 mb-4">💡 Kosongkan nilai yang ingin dicari. Sistem akan menghitung otomatis.</p>

        <div className="space-y-3">
          {mode === "impedance" && (<>
            <Field label="Impedansi Z" value={z} onChange={setZ} unit="Ω" />
            <Field label="Resistansi R" value={r} onChange={setR} unit="Ω" />
            <Field label="Reaktansi Induktif XL" value={xl} onChange={setXl} unit="Ω" />
            <Field label="Reaktansi Kapasitif Xc" value={xc} onChange={setXc} unit="Ω" />
          </>)}
          {mode === "resonance" && (<>
            <Field label="Frekuensi Resonan fr" value={fr} onChange={setFr} unit="Hz" />
            <Field label="Induktansi L" value={l} onChange={setL} unit="H" />
            <Field label="Kapasitansi C" value={c} onChange={setC} unit="F" />
          </>)}
          {mode === "power" && (<>
            <Field label="Tegangan V" value={v} onChange={setV} unit="V" />
            <Field label="Arus I" value={i} onChange={setI} unit="A" />
            <Field label="Sudut Fasa φ" value={phi} onChange={setPhi} unit="°" />
            <Field label="Daya Semu S" value={s} onChange={setS} unit="VA" />
            <Field label="Daya Aktif P" value={p} onChange={setP} unit="W" />
          </>)}
          {mode === "powerFactor" && (<>
            <Field label="Sudut Fasa φ" value={phi} onChange={setPhi} unit="°" />
            <Field label="Power Factor PF" value={pf} onChange={setPf} unit="" />
          </>)}
        </div>

        {results.length > 0 && (
          <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl space-y-2">
            <p className="text-xs text-cyan-400 mb-2">✓ Hasil</p>
            {results.map((r) => (
              <p key={r.label} className="font-mono text-white"><span className="text-cyan-400">{r.label}</span> = {r.value}</p>
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
