import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { lookupVehicle, DVLAVehicleData } from '../services/dvla';
import SEO from '../components/SEO';
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight,
  CheckCircle, Info, TrendingUp,
} from 'lucide-react';

interface RemapRow {
  manufacturer: string;
  model: string;
  year: string;
  engine_dropdown: string;
  engine_name: string;
  stock_bhp: string;
  stage1_bhp: string;
  bhp_gain: string;
  stock_torque: string;
  stage1_torque: string;
  torque_gain: string;
  options_available: string;
  ecus: string;
  tools: string;
}

interface ScoredRow extends RemapRow {
  score: number;
}

interface ModelGroup {
  manufacturer: string;
  model: string;
  bestScore: number;
  engines: ScoredRow[];
  topEngine: ScoredRow;
  displayYear: string;
}

// Extract the 4-digit year from strings like "B9 Mk1 - 2015" or "2015"
const extractYear = (s: string): number => {
  const m = s.match(/\d{4}/g);
  return m ? parseInt(m[m.length - 1]) : NaN;
};

const parseYearRange = (yearField: string): { start: number; end: number } => {
  const [left, right] = yearField.split('->').map(s => s.trim());
  const start = extractYear(left);
  const end = right === '...' || right === undefined ? 2035 : extractYear(right);
  return { start, end };
};

const ccToLitre = (cc: number) => Math.round(cc / 100) / 10;

const inferFuel = (text: string): 'petrol' | 'diesel' | '' => {
  const t = text.toLowerCase();
  if (/\btdi\b|\btdci\b|\btddi\b|\bddi\b|\bdiesel\b|\bdci\b|\bcdti\b|\bhdi\b|\bjtd\b|\bcdi\b|\bcrdi\b|\becoblue\b|\bbluehdi\b|\btdv\b|\bsdv\b|\bd4d\b|\bd5\b/.test(t)) return 'diesel';
  if (/\btfsi\b|\btsi\b|\bvtec\b|\bfsi\b|\bpetrol\b|\bgdi\b|\becoboost\b|\bgtdi\b/.test(t)) return 'petrol';
  if (/\b\d+\.\d+t\b/i.test(t)) return 'petrol';
  return '';
};

const PERF_VARIANTS = ['s3', 's4', 's5', 's6', 's7', 's8', 'sq5', 'sq7', 'sq8', 'rs3', 'rs4', 'rs5', 'rs6', 'rs7'];

const parseOptions = (raw: string): string[] => {
  if (!raw || raw.trim() === '') return [];
  return raw.replace(/[\[\]'"]/g, '').split(',').map(s => s.trim()).filter(Boolean);
};

// ─────────────────────────────────────────────────────────────────────────────

const DiagnosticMatcher = () => {
  const [registration, setRegistration] = useState('');
  const [dvlaData, setDvlaData] = useState<DVLAVehicleData | null>(null);
  const [csvData, setCsvData] = useState<RemapRow[]>([]);
  const [csvReady, setCsvReady] = useState(false);
  const [modelGroups, setModelGroups] = useState<ModelGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ModelGroup | null>(null);
  const [step, setStep] = useState<'input' | 'models' | 'specs'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load full CSV on mount — use response.text() not a streaming reader
  useEffect(() => {
    fetch('/data/remap-data.csv')
      .then(r => r.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: results => {
            setCsvData(results.data as RemapRow[]);
            setCsvReady(true);
          },
        });
      })
      .catch(() => setError('Failed to load remap database.'));
  }, []);

  const runDiagnostic = async () => {
    if (!registration.trim() || !csvReady) return;
    setIsLoading(true);
    setError(null);
    setModelGroups([]);
    setSelectedGroup(null);

    try {
      const dvla = await lookupVehicle(registration.trim().toUpperCase());
      setDvlaData(dvla);

      const dvlaMake  = dvla.make.toLowerCase().trim();
      const dvlaYear  = dvla.yearOfManufacture;
      const dvlaFuel  = dvla.fuelType.toLowerCase().trim();
      const dvlaLitre = ccToLitre(dvla.engineCapacity);
      const isLargePetrol = dvlaFuel === 'petrol' && dvlaLitre >= 2.9;

      const scored: ScoredRow[] = csvData
        .filter(row => row.manufacturer.toLowerCase().trim() === dvlaMake)
        .map(row => {
          const text = `${row.engine_dropdown} ${row.engine_name}`;

          // Hard year filter — exclude rows clearly from a different generation
          const { start, end } = parseYearRange(row.year);
          if (!isNaN(start) && !isNaN(end) && (dvlaYear < start - 1 || dvlaYear > end + 1)) return null;

          // Hard fuel filter — if fuel is determinable and wrong, skip
          const rowFuel = inferFuel(text);
          if (rowFuel !== '' && rowFuel !== dvlaFuel) return null;

          let score = 40; // Manufacturer baseline

          // Year bonus (+20) + precision bonus (+10) for recently-started ranges
          if (!isNaN(start) && dvlaYear >= start && dvlaYear <= end) {
            score += 20;
            if (dvlaYear - start <= 5) score += 10;
          }

          // Confirmed fuel match (+20)
          if (rowFuel === dvlaFuel) score += 20;

          // Engine capacity match
          const litreMatch = text.match(/(\d\.\d)/);
          if (litreMatch) {
            const diff = Math.abs(parseFloat(litreMatch[1]) - dvlaLitre);
            if (diff < 0.05)       score += 30; // Exact
            else if (diff <= 0.15) score += 15; // Close (e.g. 2.9 vs 3.0)
          }

          // Performance-variant bias: 3.0L+ petrol → S4/S5/RS more likely
          if (isLargePetrol) {
            const lower = `${row.model} ${row.engine_name}`.toLowerCase();
            if (PERF_VARIANTS.some(v => lower.includes(v))) score += 15;
          }

          return { ...row, score };
        })
        .filter((r): r is ScoredRow => r !== null && r.score > 50);

      // Group by manufacturer + model
      const groupMap = new Map<string, ModelGroup>();
      for (const row of scored) {
        const key = `${row.manufacturer}::${row.model}`;
        if (!groupMap.has(key)) {
          const { start, end } = parseYearRange(row.year);
          const yearLabel = isNaN(start) ? '' : end >= 2030 ? `${start}+` : `${start}–${end}`;
          groupMap.set(key, {
            manufacturer: row.manufacturer,
            model: row.model,
            bestScore: row.score,
            engines: [row],
            topEngine: row,
            displayYear: yearLabel,
          });
        } else {
          const g = groupMap.get(key)!;
          g.engines.push(row);
          if (row.score > g.bestScore) {
            g.bestScore = row.score;
            g.topEngine = row;
          }
        }
      }

      const groups = Array.from(groupMap.values())
        .sort((a, b) => b.bestScore - a.bestScore)
        .slice(0, 6);

      setModelGroups(groups);
      setStep('models');
    } catch (err: any) {
      setError(err.message || 'Lookup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectModel = (group: ModelGroup) => {
    setSelectedGroup(group);
    setStep('specs');
  };

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="Vehicle Remap Lookup | Auto Cleanse"
        description="Enter your reg to discover your vehicle's ECU remap potential."
        path="/remap-lookup"
      />
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Page heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Remap <span className="text-[#FF7A00]">Lookup</span>
          </h1>
          <p className="text-white/50 text-xl max-w-2xl mx-auto">
            Enter your plate to discover your vehicle's tuning potential.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="ENTER REG (e.g. AB12 CDE)"
              value={registration}
              onChange={e => setRegistration(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && runDiagnostic()}
              className="w-full bg-[#1A1D22] border-2 border-white/10 rounded-2xl px-6 py-5 text-2xl font-black tracking-widest text-white focus:outline-none focus:border-[#FF7A00] transition-all placeholder:text-white/20"
            />
            <button
              onClick={runDiagnostic}
              disabled={isLoading || !registration.trim() || !csvReady}
              className="absolute right-2 top-2 bottom-2 bg-[#FF7A00] hover:bg-[#FF9500] text-black px-8 rounded-xl font-bold transition-all flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? <Activity className="animate-spin" size={20} /> : 'RUN'}
            </button>
          </div>
          {!csvReady && !error && (
            <p className="text-white/30 text-sm mt-2 text-center">Loading vehicle database…</p>
          )}
          {error && <p className="text-red-400 mt-3 text-center font-bold">{error}</p>}
        </div>

        {/* DVLA data strip */}
        {dvlaData && step !== 'input' && (
          <div className="max-w-3xl mx-auto mb-10">
            <div className="bg-[#1A1D22] border border-white/5 rounded-2xl px-6 py-4 flex flex-wrap items-center gap-3 text-sm">
              <Info size={16} className="text-blue-400 shrink-0" />
              <span className="text-white/40 font-bold uppercase tracking-wider">DVLA</span>
              {[
                dvlaData.make,
                String(dvlaData.yearOfManufacture),
                dvlaData.fuelType,
                `${dvlaData.engineCapacity}cc (${ccToLitre(dvlaData.engineCapacity)}L)`,
                dvlaData.model || null,
              ].filter(Boolean).map((val, i, arr) => (
                <React.Fragment key={i}>
                  <span className="text-white font-bold">{val}</span>
                  {i < arr.length - 1 && <span className="text-white/20">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 1: Model selection ─────────────────────────────────────── */}
        {step === 'models' && (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <TrendingUp className="text-[#FF7A00]" size={22} />
                Select Your Model
              </h2>
              <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-white/40 text-sm">
                {modelGroups.length} match{modelGroups.length !== 1 ? 'es' : ''} found
              </span>
            </div>

            {modelGroups.length === 0 ? (
              <div className="bg-[#1A1D22] border border-dashed border-white/10 rounded-3xl p-20 text-center">
                <AlertTriangle className="text-yellow-500 mx-auto mb-4" size={48} />
                <p className="text-white text-xl font-bold mb-2">No Matches Found</p>
                <p className="text-white/40">
                  Try a different registration or <a href="/contact" className="text-[#FF7A00] hover:underline">contact us</a> for a manual lookup.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {modelGroups.map((group, i) => (
                  <button
                    key={i}
                    onClick={() => selectModel(group)}
                    className="bg-[#1A1D22] border border-white/5 rounded-2xl p-5 hover:border-[#FF7A00]/40 hover:bg-[#1f2228] transition-all group text-left w-full"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center shrink-0">
                        <span className="text-[#FF7A00] font-black text-sm">{i + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-black text-lg group-hover:text-[#FF7A00] transition-colors leading-none mb-1">
                          {group.manufacturer} {group.model}
                        </p>
                        <p className="text-white/40 text-sm truncate">
                          {group.topEngine.engine_name}
                          {group.displayYear && <> · <span className="text-white/30">{group.displayYear}</span></>}
                        </p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <span className="text-[10px] font-bold bg-white/5 text-white/40 px-2 py-0.5 rounded-full">
                            {group.engines.length} engine variant{group.engines.length !== 1 ? 's' : ''}
                          </span>
                          {parseInt(group.topEngine.bhp_gain) > 0 && (
                            <span className="text-[10px] font-bold bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">
                              +{group.topEngine.bhp_gain} BHP potential
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="text-white/20 group-hover:text-[#FF7A00] transition-colors shrink-0" size={18} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Engine spec view ────────────────────────────────────── */}
        {step === 'specs' && selectedGroup && (
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setStep('models')}
              className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors font-bold text-sm"
            >
              <ArrowLeft size={15} /> Back to models
            </button>

            <h2 className="text-3xl font-black text-white mb-1">
              {selectedGroup.manufacturer}{' '}
              <span className="text-[#FF7A00]">{selectedGroup.model}</span>
            </h2>
            <p className="text-white/40 text-sm mb-8">
              {selectedGroup.engines.length} matching engine variant{selectedGroup.engines.length !== 1 ? 's' : ''} — pick the closest to your car
            </p>

            <div className="space-y-4">
              {selectedGroup.engines
                .sort((a, b) => b.score - a.score)
                .map((engine, i) => {
                  const options = parseOptions(engine.options_available);
                  return (
                    <div
                      key={i}
                      className="bg-[#1A1D22] border border-white/5 rounded-2xl p-6 hover:border-[#FF7A00]/20 transition-all"
                    >
                      {/* Engine header row */}
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                        <div>
                          <h3 className="text-xl font-black text-white leading-none mb-1">
                            {engine.engine_name}
                          </h3>
                          <p className="text-white/30 text-xs">{engine.year}</p>
                        </div>

                        {/* BHP figures */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-center">
                            <p className="text-white/30 text-[10px] uppercase font-bold mb-0.5">Stock</p>
                            <p className="text-white text-2xl font-black leading-none">{engine.stock_bhp}</p>
                            <p className="text-white/30 text-xs">BHP</p>
                          </div>
                          <ArrowRight className="text-[#FF7A00]" size={18} />
                          <div className="text-center">
                            <p className="text-green-400/50 text-[10px] uppercase font-bold mb-0.5">Stage 1</p>
                            <p className="text-green-400 text-2xl font-black leading-none">{engine.stage1_bhp}</p>
                            <p className="text-green-400/50 text-xs">BHP</p>
                          </div>
                          <div className="ml-1 bg-[#FF7A00]/10 border border-[#FF7A00]/20 rounded-xl px-3 py-2 text-center">
                            <p className="text-[#FF7A00]/60 text-[10px] uppercase font-bold">Gain</p>
                            <p className="text-[#FF7A00] text-xl font-black leading-none">+{engine.bhp_gain}</p>
                            <p className="text-[#FF7A00]/40 text-xs">BHP</p>
                          </div>
                        </div>
                      </div>

                      {/* Torque row */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-[#0A0A0A] p-3 rounded-xl text-center">
                          <p className="text-white/30 text-[10px] uppercase font-bold mb-1">Stock Torque</p>
                          <p className="text-white font-bold">
                            {engine.stock_torque} <span className="text-white/30 text-sm font-normal">Nm</span>
                          </p>
                        </div>
                        <div className="bg-[#0A0A0A] p-3 rounded-xl text-center border border-green-500/10">
                          <p className="text-green-400/50 text-[10px] uppercase font-bold mb-1">Stage 1 Torque</p>
                          <p className="text-green-400 font-bold">
                            {engine.stage1_torque} <span className="text-green-400/40 text-sm font-normal">Nm</span>
                          </p>
                        </div>
                        <div className="bg-[#0A0A0A] p-3 rounded-xl text-center border border-[#FF7A00]/10">
                          <p className="text-[#FF7A00]/50 text-[10px] uppercase font-bold mb-1">Torque Gain</p>
                          <p className="text-[#FF7A00] font-bold">
                            +{engine.torque_gain} <span className="text-[#FF7A00]/40 text-sm font-normal">Nm</span>
                          </p>
                        </div>
                      </div>

                      {/* Available options */}
                      {options.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {options.map((opt, oIdx) => (
                            <span
                              key={oIdx}
                              className="flex items-center gap-1 text-[10px] font-bold bg-white/5 text-white/50 px-2 py-1 rounded-full"
                            >
                              <CheckCircle size={10} className="text-green-400 shrink-0" />
                              {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* CTA */}
            <div className="mt-10 bg-gradient-to-r from-[#FF7A00]/10 to-transparent border border-[#FF7A00]/20 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-white font-black text-xl">
                  Ready to remap your {selectedGroup.manufacturer} {selectedGroup.model}?
                </h3>
                <p className="text-white/40 mt-1 text-sm">Book your session and unlock your car's full potential.</p>
              </div>
              <a
                href="/booking"
                className="bg-[#FF7A00] hover:bg-[#FF9500] text-black font-black px-8 py-4 rounded-xl transition-all flex items-center gap-2 shrink-0"
              >
                Book Now <ArrowRight size={18} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticMatcher;
