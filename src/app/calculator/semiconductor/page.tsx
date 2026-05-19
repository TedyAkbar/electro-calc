"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RotateCcw } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";

type Mode = "bjt" | "diode" | "mosfet";

function Field({ label, value, onChange, unit, note }: { label: string; value: string; onChange: (v: string) => void; unit?: string; note?: string }) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">
        {label}{note && <span className="text-gray-600 ml-1">({note})</span>}
      </label>
      <div className="relative">
        <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder="?"
          className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors" />
        {unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">{unit}</span>}
      </div>
    </div>
  );
}

export default function SemiconductorCalculator() {
  const [mode, setMode] = useState<Mode>("bjt");

  // BJT
  const [vcc, setVcc] = useState(""); const [rc, setRc] = useState(""); const [rb, setRb] = useState("");
  const [beta, setBeta] = useState(""); const [vbe, setVbe] = useState("0.7");
  const [ic, setIc] = useState(""); const [ib, setIb] = useState(""); const [vce, setVce] = useState("");

  // Diode (LED resistor calculator)
  const [vsupply, setVsupply] = useState(""); const [vled, setVled] = useState("2.0"); const [iled, setIled] = useState("20");
  const [rled, setRled] = useState("");

  // MOSFET
  const [vgs, setVgs] = useState(""); const [vth, setVth] = useState(""); const [kn, setKn] = useState(""); const [vds, setVds] = useState("");
  const [ids, setIds] = useState("");

  const [results, setResults] = useState<{ label: string; value: string; color?: string }[]>([]);
  const { addHistory } = useHistory();

  const n = (s: string) => parseFloat(s);
  const ok = (s: string) => !isNaN(parseFloat(s));

  const reset = () => {
    setVcc(""); setRc(""); setRb(""); setBeta(""); setVbe("0.7"); setIc(""); setIb(""); setVce("");
    setVsupply(""); setVled("2.0"); setIled("20"); setRled("");
    setVgs(""); setVth(""); setKn(""); setVds(""); setIds("");
    setResults([]);
  };

  const calculate = () => {
    const out: { label: string; value: string; color?: string }[] = [];

    if (mode === "bjt") {
      const vccv = ok(vcc) ? n(vcc) : null;
      const rbv = ok(rb) ? n(rb) : null;
      const rcv = ok(rc) ? n(rc) : null;
      const betav = ok(beta) ? n(beta) : null;
      const vbev = ok(vbe) ? n(vbe) : 0.7;
      const icv = ok(ic) ? n(ic) : null;
      const ibv = ok(ib) ? n(ib) : null;
      const vcev = ok(vce) ? n(vce) : null;

      // IB dari VCC dan RB
      if (vccv !== null && rbv !== null) {
        const ibCalc = (vccv - vbev) / rbv;
        out.push({ label: "IB", value: `${(ibCalc * 1000).toFixed(4)} mA` });
        if (betav !== null) {
          const icCalc = betav * ibCalc;
          out.push({ label: "IC", value: `${(icCalc * 1000).toFixed(4)} mA` });
          if (rcv !== null) {
            const vceCalc = vccv - icCalc * rcv;
            out.push({ label: "VCE", value: `${vceCalc.toFixed(4)} V` });
            out.push({ label: "Status", value: vceCalc < 0.2 ? "SATURASI" : "AKTIF", color: vceCalc < 0.2 ? "text-yellow-400" : "text-green-400" });
          }
        }
      } else if (icv !== null && betav !== null) {
        out.push({ label: "IB", value: `${(icv / betav * 1000).toFixed(4)} mA` });
      } else if (icv !== null && ibv !== null) {
        out.push({ label: "β (hFE)", value: (icv / ibv).toFixed(2) });
      }
      if (vcev === null && vccv !== null && icv !== null && rcv !== null) {
        out.push({ label: "VCE", value: `${(vccv - icv * rcv).toFixed(4)} V` });
      }
    } else if (mode === "diode") {
      const vsv = ok(vsupply) ? n(vsupply) : null;
      const vledv = ok(vled) ? n(vled) : null;
      const iledv = ok(iled) ? n(iled) : null;
      const rledv = ok(rled) ? n(rled) : null;

      // R = (Vsupply - VLED) / ILED(mA/1000)
      if (vsv !== null && vledv !== null && iledv !== null && rledv === null) {
        const rCalc = (vsv - vledv) / (iledv / 1000);
        out.push({ label: "R_limit", value: `${rCalc.toFixed(1)} Ω` });
        out.push({ label: "Power R", value: `${((iledv / 1000) ** 2 * rCalc * 1000).toFixed(2)} mW` });
      } else if (vsv !== null && vledv !== null && rledv !== null) {
        const iCalc = (vsv - vledv) / rledv * 1000;
        out.push({ label: "I_LED", value: `${iCalc.toFixed(2)} mA` });
      } else if (vsv !== null && iledv !== null && rledv !== null) {
        const vledCalc = vsv - (iledv / 1000) * rledv;
        out.push({ label: "V_LED", value: `${vledCalc.toFixed(3)} V` });
      }
    } else if (mode === "mosfet") {
      const vgsv = ok(vgs) ? n(vgs) : null;
      const vthv = ok(vth) ? n(vth) : null;
      const knv = ok(kn) ? n(kn) : null;
      const vdsv = ok(vds) ? n(vds) : null;
      const idsv = ok(ids) ? n(ids) : null;

      if (vgsv !== null && vthv !== null) {
        const vov = vgsv - vthv; // overdrive voltage
        out.push({ label: "Vov (VGS - Vth)", value: `${vov.toFixed(4)} V` });

        if (vov <= 0) {
          out.push({ label: "Region", value: "CUTOFF → ID = 0", color: "text-gray-400" });
          out.push({ label: "ID", value: "0 A" });
        } else if (vdsv !== null) {
          if (vdsv < vov) {
            // Linear region
            out.push({ label: "Region", value: "LINEAR (Triode)", color: "text-green-400" });
            if (knv !== null) {
              const idCalc = knv * ((vov * vdsv) - (vdsv ** 2) / 2);
              out.push({ label: "ID", value: `${idCalc.toFixed(4)} A` });
            }
          } else {
            // Saturation
            out.push({ label: "Region", value: "SATURASI (Active)", color: "text-yellow-400" });
            if (knv !== null) {
              const idCalc = 0.5 * knv * vov ** 2;
              out.push({ label: "ID", value: `${idCalc.toFixed(4)} A` });
            }
          }
        } else if (knv !== null) {
          // No VDS, assume saturation
          const idCalc = 0.5 * knv * vov ** 2;
          out.push({ label: "ID (Saturasi)", value: `${idCalc.toFixed(4)} A` });
        }
        // Solve for kn if IDS given
        if (idsv !== null && vdsv === null && vov > 0) {
          out.push({ label: "kn (dari IDS saturation)", value: `${(2 * idsv / vov ** 2).toFixed(6)} A/V²` });
        }
      }
    }

    if (out.length > 0) {
      setResults(out);
      addHistory({ type: "Semiconductor", formula: mode, result: out.map(o => `${o.label} = ${o.value}`).join(", ") });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-md mx-auto">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400 font-bold text-base w-14 h-14 flex items-center justify-center">SC</div>
        <div>
          <h1 className="text-2xl font-bold">Semiconductor</h1>
          <p className="text-xs text-gray-400">Isi nilai yang diketahui — lainnya dihitung otomatis</p>
        </div>
      </div>

      <div className="flex gap-2">
        {(["bjt", "diode", "mosfet"] as Mode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setResults([]); }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase transition-all ${mode === m ? "bg-pink-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
            {m}
          </button>
        ))}
      </div>

      <Card>
        {mode === "bjt" && (<>
          <p className="text-xs text-cyan-400 font-mono mb-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg px-3 py-2">IC = β × IB  |  VCE = VCC − IC × RC</p>
          <p className="text-xs text-gray-500 mb-4">💡 Kosongkan nilai yang ingin dicari.</p>
          <div className="space-y-3">
            <Field label="VCC" value={vcc} onChange={setVcc} unit="V" />
            <Field label="RB (Base Resistor)" value={rb} onChange={setRb} unit="Ω" />
            <Field label="RC (Collector Resistor)" value={rc} onChange={setRc} unit="Ω" />
            <Field label="β (hFE / Current Gain)" value={beta} onChange={setBeta} />
            <Field label="VBE" value={vbe} onChange={setVbe} unit="V" note="default 0.7" />
            <Field label="IB (jika diketahui langsung)" value={ib} onChange={setIb} unit="A" />
            <Field label="IC (jika diketahui langsung)" value={ic} onChange={setIc} unit="A" />
            <Field label="VCE (jika diketahui langsung)" value={vce} onChange={setVce} unit="V" />
          </div>
        </>)}

        {mode === "diode" && (<>
          <p className="text-xs text-cyan-400 font-mono mb-2 bg-cyan-500/5 border border-cyan-500/20 rounded-lg px-3 py-2">
            R_limit = (Vsupply − V_LED) / I_LED
          </p>
          <p className="text-xs text-gray-500 mb-4">💡 Kalkulator resistor pembatas LED. Kosongkan nilai yang ingin dicari.</p>

          {/* Referensi VF */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[["Si Diode", "0.7 V"], ["Ge Diode", "0.3 V"], ["LED Merah", "≈ 2.0 V"], ["LED Hijau", "≈ 2.1 V"], ["LED Biru", "≈ 3.0 V"], ["LED Putih", "≈ 3.2 V"]].map(([name, val]) => (
              <div key={name} className="bg-gray-800/50 rounded-lg px-3 py-1.5 flex justify-between items-center">
                <span className="text-[11px] text-gray-400">{name}</span>
                <span className="text-[11px] font-mono text-cyan-300">{val}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Field label="Tegangan Supply (Vsupply)" value={vsupply} onChange={setVsupply} unit="V" />
            <Field label="Tegangan LED (V_LED)" value={vled} onChange={setVled} unit="V" note="default 2.0V" />
            <Field label="Arus LED (I_LED)" value={iled} onChange={setIled} unit="mA" note="default 20mA" />
            <Field label="Resistor (R_limit)" value={rled} onChange={setRled} unit="Ω" />
          </div>
        </>)}

        {mode === "mosfet" && (<>
          <p className="text-xs text-cyan-400 font-mono mb-2 bg-cyan-500/5 border border-cyan-500/20 rounded-lg px-3 py-2">
            ID = ½ × kn × (VGS − Vth)²  [Saturasi]
          </p>
          <p className="text-xs text-gray-500 mb-4">💡 Masukkan nilai VGS, Vth, dan opsional VDS/kn untuk menghitung ID dan menentukan region operasi.</p>
          <div className="space-y-3">
            <Field label="VGS (Gate-Source Voltage)" value={vgs} onChange={setVgs} unit="V" />
            <Field label="Vth (Threshold Voltage)" value={vth} onChange={setVth} unit="V" />
            <Field label="VDS (Drain-Source Voltage)" value={vds} onChange={setVds} unit="V" />
            <Field label="kn (Process Parameter)" value={kn} onChange={setKn} unit="A/V²" />
            <Field label="ID (jika diketahui)" value={ids} onChange={setIds} unit="A" />
          </div>
        </>)}

        {results.length > 0 && (
          <div className="mt-4 p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl space-y-2">
            <p className="text-xs text-pink-400 mb-2">✓ Hasil</p>
            {results.map((r) => (
              <p key={r.label} className="font-mono text-sm text-white">
                <span className={r.color || "text-pink-400"}>{r.label}</span> = {r.value}
              </p>
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
