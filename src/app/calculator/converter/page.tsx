"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeftRight, RotateCcw } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";

type ConversionType = "voltage" | "current" | "power" | "resistance" | "length" | "temperature" | "frequency" | "capacitance" | "inductance" | "energy" | "angle" | "awg";

// AWG lookup table: [awg_label, diameter_mm, area_mm2, max_current_A, resistance_ohm_per_km]
// Current values: copper wire, free air, chassis wiring reference (Powerstream / NEC)
const AWG_TABLE: [string, number, number, number, number][] = [
  ["4/0 (0000)", 11.684, 107.2,   230,    0.1608],
  ["3/0 (000)",  10.405,  85.01,  200,    0.2028],
  ["2/0 (00)",    9.266,  67.43,  175,    0.2557],
  ["1/0 (0)",     8.251,  53.49,  150,    0.3224],
  ["1",           7.348,  42.41,  130,    0.4066],
  ["2",           6.544,  33.63,  115,    0.5127],
  ["3",           5.827,  26.67,  100,    0.6465],
  ["4",           5.189,  21.15,   85,    0.8152],
  ["5",           4.621,  16.77,   47,    1.028 ],
  ["6",           4.115,  13.30,   65,    1.296 ],
  ["7",           3.665,  10.55,   30,    1.634 ],
  ["8",           3.264,   8.366,  50,    2.061 ],
  ["9",           2.906,   6.634,  19,    2.599 ],
  ["10",          2.588,   5.261,  35,    3.277 ],
  ["11",          2.305,   4.172,  12,    4.132 ],
  ["12",          2.053,   3.309,  20,    5.211 ],
  ["13",          1.828,   2.624,   7.4,  6.571 ],
  ["14",          1.628,   2.081,  15,    8.286 ],
  ["15",          1.450,   1.650,   4.7, 10.45  ],
  ["16",          1.291,   1.309,  13,   13.17  ],
  ["17",          1.150,   1.039,   2.9, 16.61  ],
  ["18",          1.024,   0.8231, 10,   20.95  ],
  ["19",          0.912,   0.6527,  1.8, 26.42  ],
  ["20",          0.812,   0.5176,  7.5, 33.31  ],
  ["21",          0.723,   0.4105,  1.2, 42.00  ],
  ["22",          0.644,   0.3255,  5.0, 52.96  ],
  ["23",          0.573,   0.2582,  0.73,66.79  ],
  ["24",          0.511,   0.2047,  3.5, 84.22  ],
  ["25",          0.455,   0.1624,  0.46,106.2  ],
  ["26",          0.405,   0.1288,  2.2, 133.9  ],
  ["27",          0.361,   0.1021,  0.29,168.9  ],
  ["28",          0.321,   0.08098, 0.83,212.9  ],
  ["30",          0.255,   0.05093, 0.52,338.6  ],
  ["32",          0.202,   0.03205, 0.09,538.3  ],
  ["34",          0.160,   0.02011, 0.06,856.0  ],
  ["36",          0.127,   0.01267, 0.04,1361   ],
  ["38",          0.101,   0.007967,0.02,2164   ],
  ["40",          0.0799,  0.004869,0.01,3441   ],
];

const units = {
  voltage:     [{ v: "V", f: 1 }, { v: "mV", f: 1e3 }, { v: "µV", f: 1e6 }, { v: "kV", f: 1e-3 }, { v: "MV", f: 1e-6 }],
  current:     [{ v: "A", f: 1 }, { v: "mA", f: 1e3 }, { v: "µA", f: 1e6 }, { v: "nA", f: 1e9 }, { v: "kA", f: 1e-3 }],
  power:       [{ v: "W", f: 1 }, { v: "mW", f: 1e3 }, { v: "kW", f: 1e-3 }, { v: "MW", f: 1e-6 }, { v: "dBm", f: null }, { v: "hp", f: 1/745.7 }],
  resistance:  [{ v: "Ω", f: 1 }, { v: "mΩ", f: 1e3 }, { v: "kΩ", f: 1e-3 }, { v: "MΩ", f: 1e-6 }, { v: "GΩ", f: 1e-9 }],
  frequency:   [{ v: "Hz", f: 1 }, { v: "kHz", f: 1e-3 }, { v: "MHz", f: 1e-6 }, { v: "GHz", f: 1e-9 }, { v: "THz", f: 1e-12 }, { v: "rpm", f: 60 }],
  capacitance: [{ v: "F", f: 1 }, { v: "mF", f: 1e3 }, { v: "µF", f: 1e6 }, { v: "nF", f: 1e9 }, { v: "pF", f: 1e12 }],
  inductance:  [{ v: "H", f: 1 }, { v: "mH", f: 1e3 }, { v: "µH", f: 1e6 }, { v: "nH", f: 1e9 }],
  energy:      [{ v: "J", f: 1 }, { v: "kJ", f: 1e-3 }, { v: "MJ", f: 1e-6 }, { v: "Wh", f: 1/3600 }, { v: "kWh", f: 1/3.6e6 }, { v: "cal", f: 1/4.184 }, { v: "kcal", f: 1/4184 }, { v: "eV", f: 6.242e18 }],
  length:      [{ v: "m", f: 1 }, { v: "cm", f: 100 }, { v: "mm", f: 1000 }, { v: "µm", f: 1e6 }, { v: "km", f: 1e-3 }, { v: "in", f: 39.3701 }, { v: "ft", f: 3.28084 }, { v: "yd", f: 1.09361 }, { v: "mi", f: 1/1609.34 }],
  temperature: [{ v: "°C", f: null }, { v: "°F", f: null }, { v: "K", f: null }],
  angle:       [{ v: "°", f: 1 }, { v: "rad", f: Math.PI/180 }, { v: "grad", f: 10/9 }, { v: "mrad", f: Math.PI/0.18 }],
  awg:         [],
};

const typeDesc: Record<ConversionType, { title: string; desc: string; ctx: string }> = {
  voltage:     { title: "Tegangan (Voltage)", desc: "Beda potensial listrik antara dua titik.", ctx: "V = I × R" },
  current:     { title: "Arus (Current)", desc: "Laju aliran muatan listrik melalui konduktor.", ctx: "I = V / R" },
  power:       { title: "Daya (Power)", desc: "Laju energi yang ditransfer atau dikonversi.", ctx: "P = V × I" },
  resistance:  { title: "Hambatan (Resistance)", desc: "Kemampuan material menghambat aliran arus.", ctx: "R = V / I" },
  frequency:   { title: "Frekuensi (Frequency)", desc: "Jumlah siklus per detik dari sinyal periodik.", ctx: "f = 1/T | ω = 2πf" },
  capacitance: { title: "Kapasitansi (Capacitance)", desc: "Kemampuan menyimpan muatan listrik.", ctx: "Q = C × V" },
  inductance:  { title: "Induktansi (Inductance)", desc: "Kemampuan menghambat perubahan arus.", ctx: "XL = 2π × f × L" },
  energy:      { title: "Energi (Energy)", desc: "Kapasitas untuk melakukan kerja.", ctx: "E = P × t | 1 kWh = 3.6 MJ" },
  length:      { title: "Panjang (Length)", desc: "Jarak fisik, digunakan dalam desain PCB dan kabel.", ctx: "1 m = 100 cm = 1000 mm" },
  temperature: { title: "Suhu (Temperature)", desc: "Digunakan untuk rating komponen dan analisis termal.", ctx: "°F = (°C × 9/5) + 32 | K = °C + 273.15" },
  angle:       { title: "Sudut (Angle)", desc: "Digunakan dalam analisis phasor dan AC circuit.", ctx: "π rad = 180° | 1° = π/180 rad" },
  awg:         { title: "AWG Wire Gauge", desc: "Standar ukuran kawat Amerika. Makin kecil angka AWG, makin besar kawat.", ctx: "d(mm) = 0.127 × 92^((36-AWG)/39)" },
};

const tabGroups = [
  { label: "Electrical", items: ["voltage","current","power","resistance","frequency","capacitance","inductance","energy"] as ConversionType[] },
  { label: "Physical", items: ["length","temperature","angle"] as ConversionType[] },
  { label: "Wire", items: ["awg"] as ConversionType[] },
];

function convertTemp(val: number, from: string, to: string): number {
  let celsius = from === "°C" ? val : from === "°F" ? (val - 32) * 5/9 : val - 273.15;
  return to === "°C" ? celsius : to === "°F" ? celsius * 9/5 + 32 : celsius + 273.15;
}

function convertPower(val: number, from: string, to: string): number {
  // convert to Watts first
  let w = from === "dBm" ? Math.pow(10, (val - 30) / 10) : val / (units.power.find(u => u.v === from)?.f || 1);
  return to === "dBm" ? 10 * Math.log10(w) + 30 : w * (units.power.find(u => u.v === to)?.f || 1);
}

export default function Converter() {
  const [type, setType] = useState<ConversionType>("voltage");
  const [group, setGroup] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("V");
  const [toUnit, setToUnit] = useState("mV");
  const [result, setResult] = useState<string | null>(null);
  const [awgSearch, setAwgSearch] = useState("");
  const { addHistory } = useHistory();

  const handleTypeChange = (newType: ConversionType) => {
    setType(newType);
    const u = units[newType];
    setFromUnit(u[0]?.v || "");
    setToUnit(u[1]?.v || "");
    setResult(null);
    setInputValue("");
    setAwgSearch("");
  };

  const calculate = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return;
    let finalRes = "";

    if (type === "temperature") {
      finalRes = convertTemp(val, fromUnit, toUnit).toFixed(4).replace(/\.?0+$/, "");
    } else if (type === "power" && (fromUnit === "dBm" || toUnit === "dBm")) {
      finalRes = convertPower(val, fromUnit, toUnit).toFixed(4);
    } else {
      const typeUnits = units[type] as { v: string; f: number | null }[];
      const ff = typeUnits.find(u => u.v === fromUnit)?.f;
      const tf = typeUnits.find(u => u.v === toUnit)?.f;
      if (!ff || !tf) return;
      finalRes = (val / ff * tf).toFixed(6).replace(/\.?0+$/, "");
    }

    setResult(finalRes);
    addHistory({ type: "Converter", formula: `${val} ${fromUnit} → ${toUnit}`, result: `${finalRes} ${toUnit}` });
  };

  const swap = () => { const t = fromUnit; setFromUnit(toUnit); setToUnit(t); setResult(null); };

  const filteredAWG = AWG_TABLE.filter(([awg]) =>
    awgSearch === "" || awg.toLowerCase().includes(awgSearch.toLowerCase())
  );

  const typeUnits = units[type] as { v: string; f: number | null }[];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-md mx-auto">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
          <ArrowLeftRight className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Unit Converter</h1>
          <p className="text-xs text-gray-400">12 kategori · AWG Wire Gauge</p>
        </div>
      </div>

      {/* Group tabs */}
      <div className="flex gap-2">
        {tabGroups.map((g, idx) => (
          <button key={g.label} onClick={() => { setGroup(idx); handleTypeChange(g.items[0]); }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${group === idx ? "bg-purple-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
            {g.label}
          </button>
        ))}
      </div>

      {/* Type scroll tabs */}
      <div className="relative -mx-4">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="overflow-x-auto pb-2 px-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#374151 transparent' }}>
          <div className="flex gap-2 w-max">
            {tabGroups[group].items.map(t => (
              <button key={t} onClick={() => handleTypeChange(t)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  type === t
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20"
                    : "bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700"
                }`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {/* Scroll hint */}
        <p className="text-center text-[10px] text-gray-600 mt-1">← geser untuk lebih banyak →</p>
      </div>

      {/* AWG Table Mode */}
      {type === "awg" ? (
        <Card>
          <p className="text-xs text-cyan-400 font-mono mb-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg px-3 py-2">d(mm) = 0.127 × 92^((36−AWG)/39)</p>
          <input
            type="text"
            value={awgSearch}
            onChange={e => setAwgSearch(e.target.value)}
            placeholder="Cari AWG (contoh: 22, 14, 4/0)..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
          />
          <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-2 text-gray-500 font-medium">AWG</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Ø (mm)</th>
                  <th className="text-right py-2 text-gray-500 font-medium">mm²</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Max A</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Ω/km</th>
                </tr>
              </thead>
              <tbody>
                {filteredAWG.map(([awg, diam, area, curr, res]) => (
                  <tr key={awg} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-2 font-mono font-bold text-cyan-400">{awg}</td>
                    <td className="py-2 text-right text-gray-300 font-mono">{diam.toFixed(3)}</td>
                    <td className="py-2 text-right text-gray-300 font-mono">{area < 1 ? area.toFixed(4) : area.toFixed(2)}</td>
                    <td className={`py-2.5 px-1 text-right font-mono font-semibold ${curr > 0 ? "text-green-400" : "text-gray-600"}`}>
                      {curr > 0 ? `${curr} A` : "—"}
                    </td>
                    <td className="py-2 text-right text-gray-400 font-mono">{res >= 1000 ? `${(res/1000).toFixed(2)}k` : res.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <div className="space-y-4">
              {/* From */}
              <div>
                <label className="text-sm font-medium text-gray-400 mb-1 block">From</label>
                <div className="flex gap-2">
                  <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)}
                    className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                    placeholder="Value" />
                  <select value={fromUnit} onChange={e => setFromUnit(e.target.value)}
                    className="w-1/3 bg-gray-800 border border-gray-700 rounded-xl px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer text-sm">
                    {typeUnits.map(u => <option key={u.v} value={u.v}>{u.v}</option>)}
                  </select>
                </div>
              </div>

              {/* Swap */}
              <div className="flex justify-center relative">
                <div className="absolute inset-x-0 top-1/2 h-px bg-gray-800 -z-10" />
                <button onClick={swap} className="p-2.5 bg-gray-900 border border-gray-700 rounded-full hover:bg-gray-800 text-cyan-400 transition-all hover:scale-110 shadow-sm">
                  <ArrowLeftRight className="w-5 h-5" />
                </button>
              </div>

              {/* To */}
              <div>
                <label className="text-sm font-medium text-gray-400 mb-1 block">To</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white font-mono flex items-center min-h-[50px] text-lg font-semibold">
                    {result ?? ""}
                  </div>
                  <select value={toUnit} onChange={e => setToUnit(e.target.value)}
                    className="w-1/3 bg-gray-800 border border-gray-700 rounded-xl px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer text-sm">
                    {typeUnits.map(u => <option key={u.v} value={u.v}>{u.v}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Result summary */}
            {result !== null && (
              <div className="mt-4 p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                <p className="text-xs text-cyan-400 mb-1">✓ Hasil Konversi</p>
                <p className="text-sm text-white font-mono font-bold">{inputValue} {fromUnit} = {result} {toUnit}</p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button variant="secondary" className="flex-1" onClick={() => { setInputValue(""); setResult(null); }}>
                <RotateCcw className="w-5 h-5 mr-2" /> Reset
              </Button>
              <Button variant="primary" className="flex-1" onClick={calculate}>Convert</Button>
            </div>
          </Card>

          {/* Description card */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 space-y-1.5">
            <h3 className="text-sm font-semibold text-gray-300">{typeDesc[type].title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{typeDesc[type].desc}</p>
            <p className="text-xs text-cyan-500 font-mono">{typeDesc[type].ctx}</p>
          </div>
        </>
      )}
    </div>
  );
}
