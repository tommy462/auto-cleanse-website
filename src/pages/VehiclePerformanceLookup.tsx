import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Papa from 'papaparse';
import SEO from '../components/SEO';
import { Activity, AlertTriangle, ArrowLeft, ArrowRight, CheckCircle, ChevronDown, Info, Zap, TrendingUp, Settings, Car, Search, Check } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../components/MagneticButton';
import { lookupVehicle, DVLAVehicleData } from '../services/dvla';
import { VEHICLE_REMAPS } from '../data/vehicle-remapping';
import { getManufacturerLogoPath } from '../data/manufacturer-logos';

gsap.registerPlugin(ScrollTrigger);

// ── Reg lookup types & helpers ────────────────────────────────────────────────

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
}

interface ScoredRow extends RemapRow { score: number; }

interface ModelGroup {
  manufacturer: string;
  model: string;
  bestScore: number;
  engines: ScoredRow[];
  topEngine: ScoredRow;
  displayYear: string;
}

const extractYear = (s: string) => { const m = s.match(/\d{4}/g); return m ? parseInt(m[m.length - 1]) : NaN; };
const parseYearRange = (f: string) => {
  const [left, right] = f.split('->').map(s => s.trim());
  return { start: extractYear(left), end: right === '...' || right === undefined ? 2035 : extractYear(right) };
};
const ccToLitre = (cc: number) => Math.round(cc / 100) / 10;
const inferFuel = (text: string): 'petrol' | 'diesel' | '' => {
  const t = text.toLowerCase();
  if (/\btdi\b|\btdci\b|\btddi\b|\bddi\b|\bdiesel\b|\bdci\b|\bcdti\b|\bhdi\b|\bjtd\b|\bcdi\b|\bcrdi\b|\becoblue\b|\bbluehdi\b|\btdv\b|\bsdv\b|\bd4d\b|\bd5\b/.test(t)) return 'diesel';
  if (/\btfsi\b|\btsi\b|\bvtec\b|\bfsi\b|\bpetrol\b|\bgdi\b|\becoboost\b|\bgtdi\b/.test(t)) return 'petrol';
  if (/\b\d+\.\d+t\b/i.test(t)) return 'petrol';
  return '';
};
const parseOptions = (raw: string) =>
  raw ? raw.replace(/[\[\]'"]/g, '').split(',').map(s => s.trim()).filter(Boolean) : [];
const PERF_VARIANTS = ['s3','s4','s5','s6','s7','s8','sq5','sq7','sq8','rs3','rs4','rs5','rs6','rs7'];

// ── Reg Lookup Section ────────────────────────────────────────────────────────

function RegLookupSection({ csvData, csvReady }: { csvData: RemapRow[]; csvReady: boolean }) {
  const [registration, setRegistration] = useState('');
  const [dvlaData, setDvlaData] = useState<DVLAVehicleData | null>(null);
  const [modelGroups, setModelGroups] = useState<ModelGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ModelGroup | null>(null);
  const [showAllEngines, setShowAllEngines] = useState(false);
  const [step, setStep] = useState<'input' | 'models' | 'specs'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runLookup = async () => {
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

      // All words in the API model string — keep short ones too (ST, RS, GT etc.)
      const dvlaModelRaw = (dvla.model || '').toLowerCase();
      const dvlaModelWords = dvlaModelRaw
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 0);

      // ── Hard model matching ────────────────────────────────────────────────
      // Find which CSV model name the API model *starts with*, trying longer names
      // first so "Transit Custom" beats "Transit", "C Class" beats "C" etc.
      const makeRows = csvData.filter(row => row.manufacturer.toLowerCase().trim() === dvlaMake);
      const uniqueModels = [...new Set(makeRows.map(row => row.model.toLowerCase().trim()))];
      uniqueModels.sort((a, b) => b.split(/\s+/).length - a.split(/\s+/).length || b.length - a.length);

      const matchedCsvModel = uniqueModels.find(csvModel => {
        const csvWords = csvModel.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
        return csvWords.length > 0 && csvWords.every((w, i) => dvlaModelWords[i] === w);
      }) ?? '';

      // Variant/trim tokens: everything after the matched base model
      // e.g. "FOCUS ST-2" with base "focus" → variantTokens = ["st", "2"]
      const baseWordCount = matchedCsvModel
        ? matchedCsvModel.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean).length
        : 0;
      const variantTokens = dvlaModelWords.slice(baseWordCount);

      // Performance variant keywords — if present in the API model the CSV row MUST
      // contain them, preventing e.g. Focus ST from ever matching Mondeo rows.
      const HARD_VARIANT_KEYWORDS = new Set(['st', 'rs', 'gti', 'gtd', 'gts', 'vxr', 'svr', 'amg', 'cupra']);
      const requiredVariants = variantTokens.filter(t => HARD_VARIANT_KEYWORDS.has(t));

      const scored: ScoredRow[] = csvData
        .filter(row => row.manufacturer.toLowerCase().trim() === dvlaMake)
        .map(row => {
          const rowModelLower = row.model.toLowerCase().trim();
          const text = `${row.engine_dropdown} ${row.engine_name}`;

          // ── Hard filters ──────────────────────────────────────────────────
          // 1. If we identified a base model, only keep rows for that exact model
          if (matchedCsvModel && rowModelLower !== matchedCsvModel) return null;

          // 2. Year range. Allow +1 on the end (car sitting at dealer into new year)
          // but NO tolerance on the start — a 2008 car cannot be a 2009+ model.
          const { start, end } = parseYearRange(row.year);
          if (!isNaN(start) && !isNaN(end) && (dvlaYear < start || dvlaYear > end + 1)) return null;

          // 3. Fuel type
          const rowFuel = inferFuel(text);
          if (rowFuel !== '' && rowFuel !== dvlaFuel) return null;

          // 4. Engine size: exclude if more than 0.3L away from DVLA value
          const litreMatch = text.match(/(\d\.\d)/);
          if (litreMatch) {
            const diff = Math.abs(parseFloat(litreMatch[1]) - dvlaLitre);
            if (diff > 0.3) return null;
          }

          // 5. Required performance variants (ST, RS, GTI…) — must appear in engine name
          if (requiredVariants.length > 0) {
            const rowLower = `${row.model} ${row.engine_name} ${row.engine_dropdown}`.toLowerCase();
            if (!requiredVariants.every(v => rowLower.includes(v))) return null;
          }

          // ── Scoring (ranks the remaining candidates for the right engine variant) ──
          let score = 40;
          if (!isNaN(start) && dvlaYear >= start && dvlaYear <= end) {
            score += 20;
            if (dvlaYear - start <= 5) score += 10;
          }
          if (rowFuel === dvlaFuel) score += 20;
          if (litreMatch) {
            const diff = Math.abs(parseFloat(litreMatch[1]) - dvlaLitre);
            if (diff < 0.05) score += 30; else if (diff <= 0.15) score += 15;
          }
          if (isLargePetrol) {
            const lower = `${row.model} ${row.engine_name}`.toLowerCase();
            if (PERF_VARIANTS.some(v => lower.includes(v))) score += 15;
          }
          // Bonus for matching variant tokens in the engine name (e.g. power level digits)
          if (variantTokens.length > 0) {
            const rowLower = `${row.model} ${row.engine_name} ${row.engine_dropdown}`.toLowerCase();
            const matchCount = variantTokens.filter(w => w.length > 1 && rowLower.includes(w)).length;
            score += matchCount * 8;
          }
          return { ...row, score };
        })
        .filter((r): r is ScoredRow => r !== null && r.score > 50);

      const groupMap = new Map<string, ModelGroup>();
      for (const row of scored) {
        const key = `${row.manufacturer}::${row.model}`;
        if (!groupMap.has(key)) {
          const { start, end } = parseYearRange(row.year);
          groupMap.set(key, {
            manufacturer: row.manufacturer,
            model: row.model,
            bestScore: row.score,
            engines: [row],
            topEngine: row,
            displayYear: isNaN(start) ? '' : end >= 2030 ? `${start}+` : `${start}–${end}`,
          });
        } else {
          const g = groupMap.get(key)!;
          g.engines.push(row);
          if (row.score > g.bestScore) { g.bestScore = row.score; g.topEngine = row; }
        }
      }

      const groups = Array.from(groupMap.values()).sort((a, b) => b.bestScore - a.bestScore).slice(0, 6);
      setModelGroups(groups);

      // Auto-select the top match — skip the model picker entirely
      if (groups.length > 0) {
        setSelectedGroup(groups[0]);
        setShowAllEngines(false);
        setStep('specs');
      } else {
        setStep('models'); // shows "no matches" state
      }
    } catch (err: any) {
      setError(err.message || 'Lookup failed. Check the registration and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative p-4 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[2.5rem] bg-[#111111] border border-white/5 shadow-2xl shadow-black mb-6 overflow-visible reveal-container">
      <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-[#FF7A00]/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 md:mb-8 relative z-10">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center flex-shrink-0">
          <Search size={20} className="text-[#FF7A00]" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Quick Lookup by Reg Plate</h2>
          <p className="text-white/40 text-xs sm:text-sm font-medium mt-0.5">Enter your number plate to instantly find your remap data</p>
        </div>
      </div>

      {/* Input */}
      <div className="relative mb-4 z-10">
        <input
          type="text"
          placeholder="ENTER REG (e.g. AB12 CDE)"
          value={registration}
          onChange={e => setRegistration(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && runLookup()}
          className="w-full bg-[#0A0A0A] border-2 border-white/10 rounded-2xl px-6 py-4 text-xl font-black tracking-widest text-white focus:outline-none focus:border-[#FF7A00] transition-all placeholder:text-white/20"
        />
        <button
          onClick={runLookup}
          disabled={isLoading || !registration.trim() || !csvReady}
          className="absolute right-2 top-2 bottom-2 bg-[#FF7A00] hover:bg-[#FF9500] text-black px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? <Activity className="animate-spin" size={18} /> : <><Search size={15} /> Look Up</>}
        </button>
      </div>
      {!csvReady && !error && <p className="text-white/25 text-xs mb-4 relative z-10">Loading vehicle database…</p>}
      {error && <p className="text-red-400 text-sm font-bold mb-4 relative z-10">{error}</p>}

      {/* DVLA strip */}
      {dvlaData && (
        <div className="bg-[#0A0A0A] border border-white/8 rounded-xl px-4 sm:px-5 py-3 sm:py-4 mb-6 relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
            <Info size={13} className="text-blue-400 shrink-0" />
            <span className="text-white/30 font-bold uppercase tracking-wider text-xs">Vehicle Found</span>
          </div>
          {/* Main vehicle name */}
          <p className="text-white font-black text-base sm:text-lg leading-tight mb-2">
            {dvlaData.make}{dvlaData.model ? ` ${dvlaData.model}` : ''}
          </p>
          {/* Details row */}
          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1">
            <span className="text-white/50 font-medium text-sm">{dvlaData.yearOfManufacture}</span>
            <span className="text-white/15">·</span>
            <span className="text-white/50 font-medium text-sm">{dvlaData.fuelType}</span>
            <span className="text-white/15">·</span>
            <span className="text-white/50 font-medium text-sm">{dvlaData.engineCapacity}cc ({ccToLitre(dvlaData.engineCapacity)}L)</span>
            {dvlaData.colour && <>
              <span className="text-white/15">·</span>
              <span className="text-white/50 font-medium text-sm">{dvlaData.colour}</span>
            </>}
            {dvlaData.transmission && <>
              <span className="text-white/15">·</span>
              <span className="text-white/50 font-medium text-sm">{dvlaData.transmission}</span>
            </>}
            {dvlaData.bodyType && <>
              <span className="text-white/15">·</span>
              <span className="text-white/50 font-medium text-sm">{dvlaData.bodyType}</span>
            </>}
          </div>
        </div>
      )}

      {/* Model cards — shown only when user clicks "Wrong vehicle?" */}
      {step === 'models' && (
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Select Your Model</p>
            <span className="text-xs text-white/25">{modelGroups.length} match{modelGroups.length !== 1 ? 'es' : ''} found</span>
          </div>
          {modelGroups.length === 0 ? (
            <div className="bg-[#0A0A0A] border border-dashed border-white/8 rounded-2xl p-10 text-center">
              <AlertTriangle className="text-yellow-500/50 mx-auto mb-3" size={28} />
              <p className="text-white/50 font-bold mb-1">No Matches Found</p>
              <p className="text-white/25 text-sm">Try a different registration or use the manual selector below.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                {modelGroups.map((group, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedGroup(group); setStep('specs'); }}
                    className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 hover:border-[#FF7A00]/40 transition-all group text-left w-full"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#FF7A00]/10 flex items-center justify-center shrink-0">
                        <span className="text-[#FF7A00] font-black text-xs">{i + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-black group-hover:text-[#FF7A00] transition-colors leading-none">{group.manufacturer} {group.model}</p>
                        <p className="text-white/30 text-xs mt-0.5 truncate">{group.topEngine.engine_name}{group.displayYear ? ` · ${group.displayYear}` : ''}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {parseInt(group.topEngine.bhp_gain) > 0 && (
                          <span className="text-[10px] font-bold bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">+{group.topEngine.bhp_gain} BHP</span>
                        )}
                        <ArrowRight className="text-white/20 group-hover:text-[#FF7A00] transition-colors" size={14} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Not finding vehicle prompt */}
              <div className="mt-5 flex items-center justify-center gap-3">
                <div className="flex-1 h-px bg-white/5" />
                <a
                  href="#manual-selector"
                  className="flex items-center gap-2 text-white/30 hover:text-[#FF7A00] transition-colors text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                >
                  Vehicle not here? Search manually below
                  <ArrowRight size={12} className="rotate-90" />
                </a>
                <div className="flex-1 h-px bg-white/5" />
              </div>
            </>
          )}
        </div>
      )}

      {/* Spec view */}
      {step === 'specs' && selectedGroup && (
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 leading-relaxed">
              {selectedGroup.manufacturer} {selectedGroup.model} — {selectedGroup.engines.length} variant{selectedGroup.engines.length !== 1 ? 's' : ''}
            </p>
            {modelGroups.length > 1 && (
              <button
                onClick={() => setStep('models')}
                className="flex items-center gap-1.5 text-white/30 hover:text-[#FF7A00] text-xs font-bold transition-colors self-start sm:self-auto shrink-0"
              >
                Wrong vehicle? See {modelGroups.length - 1} other{modelGroups.length - 1 !== 1 ? 's' : ''} <ArrowRight size={11} />
              </button>
            )}
          </div>
          {(() => {
            const sortedEngines = selectedGroup.engines.sort((a, b) => b.score - a.score);
            const enginesToShow = showAllEngines ? sortedEngines : [sortedEngines[0]];
            return (
              <div className="space-y-3">
                {enginesToShow.map((engine, i) => {
                  const options = parseOptions(engine.options_available);
                  return (
                    <div key={i} className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden hover:border-[#FF7A00]/20 transition-all">
                      {/* Header: engine name + Book button */}
                      <div className="flex items-start sm:items-center justify-between gap-3 px-4 sm:px-5 pt-4 pb-3 border-b border-white/5">
                        <div className="min-w-0">
                          <p className="text-white font-black leading-tight text-sm sm:text-base">{engine.engine_name}</p>
                          <p className="text-white/25 text-xs mt-0.5">{engine.year}</p>
                        </div>
                        <a
                          href={`/remapping-booking?reg=${encodeURIComponent(registration)}&vehicle=${encodeURIComponent(`${selectedGroup.manufacturer} ${selectedGroup.model} ${engine.engine_name}`)}`}
                          className="flex items-center gap-1.5 bg-[#FF7A00] hover:bg-[#FF9500] text-black text-xs font-black px-3 sm:px-3.5 py-2 rounded-lg transition-all shrink-0 shadow-[0_0_12px_rgba(255,122,0,0.25)]"
                        >
                          <Zap size={12} /> Book
                        </a>
                      </div>
                      {/* Stats: Power | Torque — stacked on mobile, side-by-side on sm+ */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
                        <div className="px-4 sm:px-5 py-3 sm:py-4">
                          <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-3">Power</p>
                          <div className="flex items-end gap-2 sm:gap-3">
                            <div>
                              <p className="text-white/35 text-[10px] uppercase font-bold mb-0.5">Stock</p>
                              <p className="text-white font-black text-xl sm:text-2xl leading-none">{engine.stock_bhp}</p>
                              <p className="text-white/25 text-[10px] mt-0.5">bhp</p>
                            </div>
                            <ArrowRight className="text-[#FF7A00]/50 mb-3 shrink-0" size={12} />
                            <div>
                              <p className="text-green-400/50 text-[10px] uppercase font-bold mb-0.5">Stage 1</p>
                              <p className="text-green-400 font-black text-xl sm:text-2xl leading-none">{engine.stage1_bhp}</p>
                              <p className="text-green-400/30 text-[10px] mt-0.5">bhp</p>
                            </div>
                            <div className="ml-auto self-center bg-[#FF7A00]/10 border border-[#FF7A00]/25 rounded-lg px-2 sm:px-2.5 py-1.5 text-center">
                              <p className="text-[#FF7A00] text-[9px] uppercase font-bold tracking-wide">Gain</p>
                              <p className="text-[#FF7A00] font-black text-sm sm:text-base leading-none">+{engine.bhp_gain}</p>
                              <p className="text-[#FF7A00]/40 text-[9px]">bhp</p>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 sm:px-5 py-3 sm:py-4">
                          <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-3">Torque</p>
                          <div className="flex items-end gap-2 sm:gap-3">
                            <div>
                              <p className="text-white/35 text-[10px] uppercase font-bold mb-0.5">Stock</p>
                              <p className="text-white font-black text-xl sm:text-2xl leading-none">{engine.stock_torque}</p>
                              <p className="text-white/25 text-[10px] mt-0.5">Nm</p>
                            </div>
                            <ArrowRight className="text-[#FF7A00]/50 mb-3 shrink-0" size={12} />
                            <div>
                              <p className="text-green-400/50 text-[10px] uppercase font-bold mb-0.5">Stage 1</p>
                              <p className="text-green-400 font-black text-xl sm:text-2xl leading-none">{engine.stage1_torque}</p>
                              <p className="text-green-400/30 text-[10px] mt-0.5">Nm</p>
                            </div>
                            <div className="ml-auto self-center bg-[#FF7A00]/10 border border-[#FF7A00]/25 rounded-lg px-2 sm:px-2.5 py-1.5 text-center">
                              <p className="text-[#FF7A00] text-[9px] uppercase font-bold tracking-wide">Gain</p>
                              <p className="text-[#FF7A00] font-black text-sm sm:text-base leading-none">+{engine.torque_gain}</p>
                              <p className="text-[#FF7A00]/40 text-[9px]">Nm</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {options.length > 0 && (
                        <div className="flex flex-wrap gap-1 px-5 pb-4 pt-1 border-t border-white/5">
                          {options.map((opt, oIdx) => (
                            <span key={oIdx} className="flex items-center gap-1 text-[10px] font-bold bg-white/5 text-white/40 px-2 py-0.5 rounded-full">
                              <CheckCircle size={9} className="text-green-400 shrink-0" />{opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                <p className="text-center text-white/25 text-xs pt-1">
                  Not finding your vehicle?{' '}
                  <a href="#manual-selector" className="text-white/40 hover:text-[#FF7A00] underline underline-offset-2 transition-colors">
                    Search manually below
                  </a>
                </p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ── Types ────────────────────────────────────────────────────────────────────

interface EngineSpec {
  engine_name: string;
  stock_bhp: number;
  stage1_bhp: number;
  bhp_gain: number;
  stock_torque: number;
  stage1_torque: number;
  torque_gain: number;
  options: string[];
}

type RemapData = Record<string, any>;

// ── Logo data ────────────────────────────────────────────────────────────────

const LOGO_DOMAINS: Record<string, string> = {
  'Acura': 'acura.com',
  'Alfa Romeo': 'alfaromeo.com',
  'Alpina': 'alpina.de',
  'Alpine': 'alpinecar.co.uk',
  'Aston Martin': 'astonmartin.com',
  'Audi': 'audi.com',
  'Bentley': 'bentleymotors.com',
  'BMW': 'bmw.com',
  'Bugatti': 'bugatti.com',
  'Cadillac': 'cadillac.com',
  'Chevrolet': 'chevrolet.com',
  'Chrysler': 'chrysler.com',
  'Citroën': 'citroen.com',
  'Cupra': 'cupraofficial.com',
  'Dacia': 'dacia.com',
  'Daewoo': 'daewoo.com',
  'Dallara': 'dallara.it',
  'DS': 'dsautomobiles.com',
  'Dodge': 'dodge.com',
  'Ferrari': 'ferrari.com',
  'Fiat': 'fiat.com',
  'Ford': 'ford.com',
  'Genesis': 'genesis.com',
  'GMC': 'gmc.com',
  'GWM': 'gwm.com',
  'Geely': 'geely.com',
  'Holden': 'holden.com.au',
  'Honda': 'honda.com',
  'Hummer': 'hummer.com',
  'Hyundai': 'hyundai.com',
  'Infiniti': 'infiniti.com',
  'Isuzu': 'isuzu.com',
  'Iveco': 'iveco.com',
  'Jaguar': 'jaguar.com',
  'Jeep': 'jeep.com',
  'Kia': 'kia.com',
  'KTM': 'ktm.com',
  'LDV': 'ldv.eu',
  'Lamborghini': 'lamborghini.com',
  'Lancia': 'lancia.com',
  'Land Rover': 'landrover.com',
  'Lexus': 'lexus.com',
  'Lincoln': 'lincoln.com',
  'Lotus': 'lotuscars.com',
  'Luxgen': 'luxgen.com',
  'MAN': 'man.eu',
  'MG': 'mgmotor.co.uk',
  'Mahindra': 'mahindra.com',
  'Maserati': 'maserati.com',
  'Mazda': 'mazda.com',
  'McLaren': 'mclaren.com',
  'Mercedes': 'mercedes-benz.com',
  'Mercury': 'ford.com',
  'Mini': 'mini.com',
  'Mitsubishi': 'mitsubishi-motors.com',
  'Nissan': 'nissan.com',
  'Opel': 'opel.com',
  'Pagani': 'pagani.com',
  'Peugeot': 'peugeot.com',
  'Piaggio': 'piaggio.com',
  'Pontiac': 'gm.com',
  'Porsche': 'porsche.com',
  'Renault': 'renault.com',
  'Rolls Royce': 'rolls-roycemotorcars.com',
  'Rover': 'landrover.com',
  'Saab': 'saabgroup.com',
  'Saturn': 'gm.com',
  'SEAT': 'seat.com',
  'Seat': 'seat.com',
  'Škoda': 'skoda-auto.com',
  'Skoda': 'skoda-auto.com',
  'Smart': 'smart.com',
  'SsangYong': 'ssangyong.com',
  'Subaru': 'subaru.com',
  'Suzuki': 'suzuki.com',
  'Tesla': 'tesla.com',
  'Toyota': 'toyota.com',
  'Triumph': 'triumph.co.uk',
  'Vauxhall': 'vauxhall.co.uk',
  'Volkswagen': 'volkswagen.com',
  'Volvo': 'volvocars.com',
};

// ── Brand Logo component ─────────────────────────────────────────────────────

function BrandLogo({ make, size = 28 }: { make: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const logoPath = getManufacturerLogoPath(make);
  const initials = make.replace(/[^A-Za-z ]/g, '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || make[0];
  const hue = make.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  const radius = Math.round(size * 0.28);

  if (!logoPath || failed) {
    return (
      <div
        style={{
          width: size, height: size, minWidth: size,
          background: `hsl(${hue}, 55%, 18%)`,
          border: `1px solid hsl(${hue}, 55%, 28%)`,
          borderRadius: radius,
          fontSize: Math.round(size * 0.34),
        }}
        className="flex items-center justify-center text-white font-black flex-shrink-0 select-none"
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size, minWidth: size, borderRadius: radius }}
      className="bg-white/8 flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/6"
    >
      <img
        src={logoPath}
        alt={make}
        style={{ width: size * 0.78, height: size * 0.78, objectFit: 'contain' }}
        onError={() => setFailed(true)}
        loading="lazy"
      />
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const splitText = (text: string, className: string = '') =>
  text.split(' ').map((word, i) => (
    <span key={i} className="inline-block overflow-hidden pb-4 -mb-4 mr-[0.25em]">
      <span className={`inline-block word-reveal ${className}`}>{word}</span>
    </span>
  ));

// ── Custom Dropdown ──────────────────────────────────────────────────────────

interface DropdownProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  disabled: boolean;
  searchable?: boolean;
  showLogos?: boolean;
}

function CustomDropdown({ label, value, onChange, options, placeholder, disabled, searchable = false, showLogos = false }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<HTMLLIElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  const handleOpen = () => { if (!disabled) { setOpen(true); setQuery(''); } };

  const handleSelect = (opt: string) => { onChange(opt); setOpen(false); setQuery(''); };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); setQuery(''); }
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false); setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (searchable && searchRef.current) setTimeout(() => searchRef.current?.focus(), 50);
    if (selectedRef.current) setTimeout(() => selectedRef.current?.scrollIntoView({ block: 'nearest' }), 60);
  }, [open, searchable]);

  useEffect(() => {
    if (!panelRef.current) return;
    if (open) {
      gsap.fromTo(panelRef.current,
        { opacity: 0, y: -8, scaleY: 0.95, transformOrigin: 'top center' },
        { opacity: 1, y: 0, scaleY: 1, duration: 0.22, ease: 'power2.out' }
      );
    }
  }, [open]);

  const isSelected = !!value;

  return (
    <div ref={containerRef} className="flex flex-col gap-2 relative" onKeyDown={handleKeyDown}>
      <label className="text-sm font-semibold text-white/50 uppercase tracking-widest select-none">{label}</label>

      {/* Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 ${
          disabled
            ? 'bg-[#0A0A0A] border-white/5 cursor-not-allowed'
            : open
            ? 'bg-[#1A1200] border-[#FF7A00]/60 shadow-[0_0_24px_rgba(255,122,0,0.15)]'
            : isSelected
            ? 'bg-[#111111] border-[#FF7A00]/35 hover:border-[#FF7A00]/60 hover:shadow-[0_0_20px_rgba(255,122,0,0.1)]'
            : 'bg-[#111111] border-white/8 hover:border-white/20'
        }`}
      >
        {/* Logo in trigger when selected */}
        {showLogos && value && <BrandLogo make={value} size={26} />}

        <span className={`text-base font-medium truncate flex-1 ${disabled ? 'text-white/20' : !value ? 'text-white/40' : 'text-white'}`}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={17}
          className={`flex-shrink-0 transition-all duration-300 ${
            disabled ? 'text-white/15' : open ? 'text-[#FF7A00] rotate-180' : isSelected ? 'text-[#FF7A00]' : 'text-white/25'
          }`}
        />
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(10, 12, 16, 0.98)',
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
            border: '1px solid rgba(255, 122, 0, 0.18)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,122,0,0.06) inset, 0 0 40px rgba(255,122,0,0.05)',
          }}
        >
          {searchable && (
            <div className="px-3 pt-3 pb-2 border-b border-white/5">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-white/5 border border-white/8 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#FF7A00]/40 transition-colors"
                />
              </div>
            </div>
          )}

          <ul
            ref={listRef}
            className="overflow-y-auto py-2"
            style={{ maxHeight: '260px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,122,0,0.4) transparent' }}
          >
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-white/30 text-sm text-center">No results</li>
            )}
            {filtered.map(opt => {
              const isActive = opt === value;
              return (
                <li
                  key={opt}
                  ref={isActive ? selectedRef : undefined}
                  onClick={() => handleSelect(opt)}
                  className={`flex items-center gap-3 px-3 py-2 mx-1.5 rounded-xl cursor-pointer transition-all duration-150 ${
                    isActive
                      ? 'bg-[#FF7A00]/10 text-[#FF9A33]'
                      : 'text-white/65 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {showLogos && <BrandLogo make={opt} size={28} />}
                  <span className="text-sm font-medium leading-snug flex-1">{opt}</span>
                  {isActive && <Check size={13} className="text-[#FF7A00] flex-shrink-0" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Stat Block ───────────────────────────────────────────────────────────────

const StatBlock = ({ label, stock, stage1, gain, unit }: { label: string; stock: number; stage1: number; gain: number; unit: string }) => (
  <div className="relative p-4 sm:p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 sm:mb-5">{label}</p>
    <div className="flex items-end justify-between gap-2 sm:gap-4 relative z-10">
      <div className="text-center">
        <p className="text-2xl sm:text-3xl font-black text-white/60">{stock}</p>
        <p className="text-xs text-white/30 mt-1 font-medium">Stock {unit}</p>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
        <div className="w-5 sm:w-8 h-px bg-white/20" />
        <div className="px-2 sm:px-2.5 py-1 rounded-lg bg-[#FF7A00]/15 border border-[#FF7A00]/30">
          <p className="text-[#FF7A00] font-black text-xs sm:text-sm">+{gain}</p>
        </div>
        <div className="w-5 sm:w-8 h-px bg-[#FF7A00]/50" />
      </div>
      <div className="text-center">
        <p className="text-2xl sm:text-3xl font-black text-[#FF7A00] drop-shadow-[0_0_12px_rgba(255,122,0,0.5)]">{stage1}</p>
        <p className="text-xs text-[#FF7A00]/60 mt-1 font-medium">Stage 1 {unit}</p>
      </div>
    </div>
  </div>
);

// ── Page ─────────────────────────────────────────────────────────────────────

export default function VehiclePerformanceLookup() {
  const container = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const [lookupData, setLookupData] = useState<RemapData | null>(null);
  const [dataError, setDataError] = useState(false);

  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('');

  const [csvData, setCsvData] = useState<RemapRow[]>([]);
  const [csvReady, setCsvReady] = useState(false);

  useEffect(() => {
    fetch('/data/remap-lookup.json')
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(setLookupData)
      .catch(() => setDataError(true));
  }, []);

  useEffect(() => {
    fetch('/data/remap-data.csv')
      .then(r => r.text())
      .then(csv => Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: results => { setCsvData(results.data as RemapRow[]); setCsvReady(true); },
      }))
      .catch(() => {});
  }, []);

  useGSAP(() => {
    gsap.fromTo('.word-reveal',
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1, stagger: 0.05, ease: 'power4.out', delay: 0.1 }
    );
    gsap.utils.toArray('.reveal-container').forEach((el: any) => {
      const items = el.querySelectorAll('.reveal-item');
      gsap.fromTo(items,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }
      );
    });
  }, { scope: container });

  useEffect(() => {
    if (result && resultRef.current) {
      gsap.fromTo(resultRef.current,
        { y: 40, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' }
      );
    }
  }, [selectedEngine]);

  const manufacturers: string[] = lookupData?.manufacturers ?? [];
  const models: string[] = selectedMake ? (lookupData?.[selectedMake]?.models ?? []) : [];
  const years: string[] = selectedMake && selectedModel ? (lookupData?.[selectedMake]?.[selectedModel]?.years ?? []) : [];
  const engines: string[] = selectedMake && selectedModel && selectedYear
    ? (lookupData?.[selectedMake]?.[selectedModel]?.[selectedYear]?.engines ?? []) : [];

  const result: EngineSpec | null =
    selectedMake && selectedModel && selectedYear && selectedEngine
      ? (lookupData?.[selectedMake]?.[selectedModel]?.[selectedYear]?.[selectedEngine] ?? null) : null;

  const handleMakeChange = (v: string) => { setSelectedMake(v); setSelectedModel(''); setSelectedYear(''); setSelectedEngine(''); };
  const handleModelChange = (v: string) => { setSelectedModel(v); setSelectedYear(''); setSelectedEngine(''); };
  const handleYearChange = (v: string) => { setSelectedYear(v); setSelectedEngine(''); };

  const stepsComplete = [selectedMake, selectedModel, selectedYear, selectedEngine].filter(Boolean).length;

  // Group vehicles by manufacturer for SEO links
  const vehiclesByMake = useMemo(() => {
    return VEHICLE_REMAPS.reduce((acc, vehicle) => {
      if (!acc[vehicle.make]) {
        acc[vehicle.make] = [];
      }
      acc[vehicle.make].push(vehicle);
      return acc;
    }, {} as Record<string, typeof VEHICLE_REMAPS>);
  }, []);

  const sortedMakes = Object.keys(vehiclesByMake).sort();

  return (
    <div ref={container} className="pt-24 md:pt-32 pb-16 md:pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="Vehicle Performance Lookup | ECU Remap Data | AutoCleanse"
        description="Look up Stage 1 remap performance gains for your vehicle. Select your make, model, year and engine to see BHP and torque improvements."
        path="/vehicle-performance-lookup"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Vehicle Performance Lookup Tool",
        "applicationCategory": "Automotive Business",
        "provider": {
          "@type": "LocalBusiness",
          "name": "AutoCleanse",
          "telephone": "08000430609",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "The Old Barn Industrial Estate, Webbers Yard",
            "addressLocality": "Totnes",
            "addressRegion": "Devon",
            "postalCode": "TQ9 6JY",
            "addressCountry": "GB"
          }
        },
        "description": "Look up Stage 1 remap performance gains for your vehicle. Select your make, model, year and engine to see BHP and torque improvements.",
        "url": "https://www.auto-cleanse.co.uk/vehicle-performance-lookup",
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "priceSpecification": {
            "@type": "PriceSpecification",
            "priceCurrency": "GBP"
          }
        }
      })}} />

      <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-[#FF7A00]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#FF7A00]/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Hero */}
        <div className="text-center mb-12 md:mb-20 reveal-container">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-[#FF7A00] text-sm font-semibold mb-8 reveal-item">
            <Search size={14} />
            Stage 1 Remap Data - 85 Manufacturers
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 sm:mb-8 leading-[1.1] flex flex-wrap justify-center drop-shadow-2xl">
            {splitText('Vehicle Performance', 'text-white')}
            <span className="inline-block overflow-hidden pb-4 -mb-4 font-mono translate-y-[0.1em] w-full sm:w-auto">
              <span className="inline-block word-reveal text-[#FF7A00] sm:ml-3">Lookup.</span>
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF7A00] to-transparent mx-auto mb-8 rounded-full" />
          <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-medium max-w-3xl mx-auto reveal-item">
            Select your vehicle to see exactly what performance gains are achievable with a Stage 1 remap.
          </p>
        </div>

        {/* Reg Plate Lookup */}
        <RegLookupSection csvData={csvData} csvReady={csvReady} />

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-white/20 text-xs font-bold uppercase tracking-widest px-2">or search manually</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* Lookup Card */}
        <div id="manual-selector" className="relative p-4 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[2.5rem] bg-[#111111] border border-white/5 shadow-2xl shadow-black mb-10 reveal-container overflow-visible">
          <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-[#FF7A00]/5 to-transparent pointer-events-none" />

          <div className="flex items-center gap-3 mb-6 md:mb-10 relative z-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center flex-shrink-0">
              <Car size={20} className="text-[#FF7A00]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Select Your Vehicle</h2>
              <p className="text-white/40 text-sm font-medium mt-0.5">{stepsComplete} of 4 steps complete</p>
            </div>
            {stepsComplete > 0 && (
              <button
                onClick={() => { setSelectedMake(''); setSelectedModel(''); setSelectedYear(''); setSelectedEngine(''); }}
                className="ml-auto text-sm text-white/30 hover:text-white/70 transition-colors font-medium"
              >
                Reset
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-white/5 rounded-full mb-6 md:mb-10 relative z-10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF7A00] to-[#FF9A33] rounded-full transition-all duration-500"
              style={{ width: `${(stepsComplete / 4) * 100}%` }}
            />
          </div>

          {dataError && (
            <p className="text-center py-10 text-white/40">Unable to load vehicle data. Please refresh the page.</p>
          )}

          {!lookupData && !dataError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
              {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}
            </div>
          )}

          {lookupData && !dataError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10 reveal-item">
              <CustomDropdown
                label="Manufacturer"
                value={selectedMake}
                onChange={handleMakeChange}
                options={manufacturers}
                placeholder="Select manufacturer..."
                disabled={false}
                searchable={true}
                showLogos={true}
              />
              <CustomDropdown
                label="Model"
                value={selectedModel}
                onChange={handleModelChange}
                options={models}
                placeholder={selectedMake ? 'Select model...' : 'Select manufacturer first'}
                disabled={!selectedMake}
                searchable={models.length > 12}
              />
              <CustomDropdown
                label="Year / Generation"
                value={selectedYear}
                onChange={handleYearChange}
                options={years}
                placeholder={selectedModel ? 'Select year...' : 'Select model first'}
                disabled={!selectedModel}
              />
              <CustomDropdown
                label="Engine"
                value={selectedEngine}
                onChange={setSelectedEngine}
                options={engines}
                placeholder={selectedYear ? 'Select engine...' : 'Select year first'}
                disabled={!selectedYear}
              />
            </div>
          )}
        </div>

        {/* Result Card */}
        {result && (
          <div ref={resultRef} className="relative rounded-[2.5rem] overflow-hidden border border-[#FF7A00]/20 shadow-[0_0_60px_rgba(255,122,0,0.12)] bg-[#111111]">

            {/* Header */}
            <div className="relative px-4 sm:px-8 md:px-12 py-6 sm:py-10 bg-gradient-to-br from-[#1A1200] via-[#150D00] to-[#111111] border-b border-[#FF7A00]/15">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,122,0,0.15)_0%,transparent_60%)] pointer-events-none" />
              <div className="relative z-10 flex flex-wrap items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Large manufacturer logo */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/6 border border-white/10 flex items-center justify-center overflow-hidden shadow-xl">
                      <BrandLogoLarge make={selectedMake} />
                    </div>
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.05)] pointer-events-none" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#FF7A00]/60 mb-1.5">Stage 1 Remap Data</p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                      {selectedMake} {selectedModel}
                    </h2>
                    <p className="text-white/50 font-medium mt-1 text-base sm:text-lg truncate">{selectedYear} &middot; {result.engine_name}</p>
                  </div>
                </div>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#FF7A00] text-black text-xs sm:text-sm font-black uppercase tracking-wide self-start shrink-0">
                  Stage 1
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="px-4 sm:px-8 md:px-12 py-6 sm:py-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                <StatBlock label="Power Output" stock={result.stock_bhp} stage1={result.stage1_bhp} gain={result.bhp_gain} unit="BHP" />
                <StatBlock label="Torque Output" stock={result.stock_torque} stage1={result.stage1_torque} gain={result.torque_gain} unit="Nm" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { label: 'Stock BHP', value: `${result.stock_bhp} bhp`, muted: true },
                  { label: 'Stage 1 BHP', value: `${result.stage1_bhp} bhp`, muted: false },
                  { label: 'Stock Torque', value: `${result.stock_torque} Nm`, muted: true },
                  { label: 'Stage 1 Torque', value: `${result.stage1_torque} Nm`, muted: false },
                ].map(item => (
                  <div key={item.label} className="text-center p-4 rounded-xl bg-[#0A0A0A] border border-white/5">
                    <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-2">{item.label}</p>
                    <p className={`text-xl font-black ${item.muted ? 'text-white/60' : 'text-[#FF7A00]'}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              {result.options.length > 0 && (
                <div className="pt-8 border-t border-white/5">
                  <div className="flex items-center gap-3 mb-5">
                    <Settings size={16} className="text-[#FF7A00]" />
                    <p className="text-sm font-bold uppercase tracking-widest text-white/40">Available Options</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.options.map(opt => (
                      <span key={opt} className="px-3 py-1.5 rounded-lg bg-[#FF7A00]/8 border border-[#FF7A00]/20 text-[#FF9A33] text-sm font-medium">
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="px-4 sm:px-8 md:px-12 py-6 sm:py-8 border-t border-white/5 bg-[#0D0D0D] flex flex-col sm:flex-row items-center justify-between gap-5">
              <div>
                <p className="text-white font-bold text-lg">Ready to remap your {selectedMake}?</p>
                <p className="text-white/40 text-sm font-medium mt-0.5">Mobile ECU remapping across Devon &amp; South West</p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <MagneticButton>
                  <a href="tel:08000430609" className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all text-sm">
                    0800 043 0609
                  </a>
                </MagneticButton>
                <MagneticButton>
                  <a href="/remapping-booking" className="px-5 py-3 rounded-xl bg-[#FF7A00] hover:bg-[#FF9500] text-black font-bold transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] text-sm flex items-center gap-2">
                    <Zap size={15} />
                    Book a Remap
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && lookupData && (
          <div className="text-center py-16 reveal-container">
            <div className="inline-flex flex-col items-center gap-4 reveal-item">
              <div className="w-16 h-16 rounded-2xl bg-[#FF7A00]/8 border border-[#FF7A00]/15 flex items-center justify-center">
                <TrendingUp size={28} className="text-[#FF7A00]/50" />
              </div>
              <p className="text-white/30 font-medium text-lg">
                {stepsComplete === 0 ? 'Start by selecting a manufacturer above' : 'Complete all four steps to see performance data'}
              </p>
            </div>
          </div>
        )}

        {/* SEO Directory Links */}
        <div className="mt-32 pt-16 border-t border-white/5 reveal-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white tracking-tighter mb-4 reveal-item">
              Browse by Manufacturer
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto reveal-item">
              Select your exact make and model to see tailored performance figures and expected Stage 1 gains.
            </p>
          </div>
          
          <div className="space-y-16">
            {sortedMakes.map((make) => (
              <div key={make} className="reveal-item">
                <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center">
                  <Car className="text-[#FF7A00] mr-4" size={24} />
                  {make}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {vehiclesByMake[make].map((vehicle) => (
                    <a 
                      key={vehicle.slug} 
                      href={`/${vehicle.slug}`}
                      className="p-6 rounded-2xl bg-[#1A1D22] border border-white/5 hover:border-[#FF7A00]/30 hover:bg-white/5 transition-all group flex flex-col justify-between h-full"
                    >
                      <div>
                        <h4 className="font-bold text-xl text-white/90 group-hover:text-white transition-colors mb-2">
                          {vehicle.model}
                        </h4>
                        <p className="text-sm text-white/40 mb-4 capitalize">
                          {vehicle.fuelType} / {vehicle.category}
                        </p>
                      </div>
                      <div className="flex items-center text-[#FF7A00] text-sm font-medium opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                        View Gains <ArrowRight size={14} className="ml-1" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// Larger version for result card header - no lazy load, slightly different sizing
function BrandLogoLarge({ make }: { make: string }) {
  const [failed, setFailed] = useState(false);
  const logoPath = getManufacturerLogoPath(make);
  const initials = make.replace(/[^A-Za-z ]/g, '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || make[0];
  const hue = make.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  if (!logoPath || failed) {
    return (
      <div
        style={{ background: `hsl(${hue}, 55%, 18%)`, fontSize: 20 }}
        className="w-full h-full flex items-center justify-center text-white font-black rounded-2xl"
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={logoPath}
      alt={make}
      className="w-11 h-11 object-contain"
      onError={() => setFailed(true)}
    />
  );
}
