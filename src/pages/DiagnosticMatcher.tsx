import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { lookupVehicle, DVLAVehicleData } from '../services/dvla';
import SEO from '../components/SEO';
import { Search, Info, CheckCircle, AlertTriangle, ChevronRight, Activity, Filter, Database, TrendingUp } from 'lucide-react';
import gsap from 'gsap';

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
  // Computed/Internal
  score?: number;
  matchReasons?: string[];
}

const DiagnosticMatcher = () => {
  const [registration, setRegistration] = useState('');
  const [dvlaData, setDvlaData] = useState<DVLAVehicleData | null>(null);
  const [csvData, setCsvData] = useState<RemapRow[]>([]);
  const [matches, setMatches] = useState<RemapRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);

  // Load CSV on mount
  useEffect(() => {
    const loadCSV = async () => {
      try {
        const response = await fetch('/data/remap-data.csv');
        const reader = response.body?.getReader();
        const result = await reader?.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result?.value);
        
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setCsvData(results.data as RemapRow[]);
          },
          error: (err: any) => {
            console.error('Error parsing CSV:', err);
            setError('Failed to load remap database.');
          }
        });
      } catch (err) {
        console.error('Error fetching CSV:', err);
        setError('Could not access remap-data.csv.');
      }
    };

    loadCSV();
  }, []);

  const parseCapacity = (capacityStr: string): number => {
    // Try to extract capacity from strings like "2.0T", "1.6 TDI", "1968cc"
    const ccMatch = capacityStr.match(/(\d{3,4})cc/i);
    if (ccMatch) return parseInt(ccMatch[1]);

    const litreMatch = capacityStr.match(/(\d\.\d)/);
    if (litreMatch) return parseFloat(litreMatch[1]) * 1000;

    return 0;
  };

  const convertCcToLitre = (cc: number): number => {
    // 1968cc -> 2.0
    // 2995cc -> 3.0
    // 1598cc -> 1.6
    // 1498cc -> 1.5
    return Math.round(cc / 100) / 10;
  };

  const runDiagnostic = async () => {
    if (!registration) return;
    
    setIsLoading(true);
    setError(null);
    setHasRun(true);

    try {
      const dvla = await lookupVehicle(registration);
      setDvlaData(dvla);

      const dvlaMake = dvla.make.toLowerCase();
      const dvlaYear = dvla.yearOfManufacture;
      const dvlaFuel = dvla.fuelType.toLowerCase();
      const dvlaCapacity = dvla.engineCapacity;
      const dvlaLitre = convertCcToLitre(dvlaCapacity);

      const scoredMatches = csvData.map(row => {
        let score = 0;
        const reasons: string[] = [];

        // 1. Manufacturer (40)
        if (row.manufacturer.toLowerCase() === dvlaMake) {
          score += 40;
          reasons.push('Manufacturer Match (+40)');
        }

        // 2. Year (20)
        // CSV year is usually like "2015 -> 2019" or "2020 -> ..."
        const yearParts = row.year.split('->').map(s => s.trim());
        const startYear = parseInt(yearParts[0]);
        const endYear = yearParts[1] === '...' ? 2099 : parseInt(yearParts[1]);

        if (dvlaYear >= startYear && dvlaYear <= endYear) {
          score += 20;
          reasons.push(`Year in Range (${row.year}) (+20)`);
        }

        // 3. Fuel (20)
        // Infer fuel from engine_dropdown or engine_name if not in CSV
        const rowText = (row.engine_dropdown + ' ' + row.engine_name).toLowerCase();
        let rowFuel = '';
        if (rowText.includes('tdi') || rowText.includes('diesel') || rowText.includes('dcia')) rowFuel = 'diesel';
        else if (rowText.includes('vtec') || rowText.includes('petrol') || rowText.includes('tsi') || rowText.includes('tfsi')) rowFuel = 'petrol';

        if (rowFuel && rowFuel === dvlaFuel) {
          score += 20;
          reasons.push(`Fuel Match (${rowFuel}) (+20)`);
        }

        // 4. Capacity (30)
        const rowCapacity = parseCapacity(row.engine_dropdown) || parseCapacity(row.engine_name);
        const rowLitre = convertCcToLitre(rowCapacity);
        
        if (rowLitre === dvlaLitre && rowLitre > 0) {
          score += 30;
          reasons.push(`Capacity Match (${rowLitre}L) (+30)`);
        } else if (rowText.includes(dvlaLitre.toFixed(1))) {
          score += 30;
          reasons.push(`Capacity found in text (${dvlaLitre.toFixed(1)}L) (+30)`);
        }

        // 5. Model (10)
        if (dvla.model && row.model.toLowerCase().includes(dvla.model.toLowerCase())) {
          score += 10;
          reasons.push('Model Name Partial Match (+10)');
        }

        return { ...row, score, matchReasons: reasons };
      })
      .filter(row => row.score && row.score > 40) // Must at least match manufacturer
      .sort((a, b) => (b.score || 0) - (a.score || 0));

      setMatches(scoredMatches.slice(0, 10)); // Top 10 matches
    } catch (err) {
      console.error('Diagnostic error:', err);
      setError('An error occurred during diagnostic lookup.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO title="Diagnostic Matcher | Internal Tool" description="Vehicle Remap Data Matcher" path="/diagnostic-matcher" />
      
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Diagnostic <span className="text-[#FF7A00]">Matcher</span>
          </h1>
          <p className="text-white/50 text-xl max-w-2xl mx-auto">
            Validate remap database accuracy against live DVLA vehicle data.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              placeholder="ENTER REGISTRATION (e.g. AA11AAA)"
              value={registration}
              onChange={(e) => setRegistration(e.target.value.toUpperCase())}
              className="w-full bg-[#1A1D22] border-2 border-white/10 rounded-2xl px-6 py-5 text-2xl font-black tracking-widest text-white focus:outline-none focus:border-[#FF7A00] transition-all placeholder:text-white/20"
            />
            <button
              onClick={runDiagnostic}
              disabled={isLoading || !registration}
              className="absolute right-2 top-2 bottom-2 bg-[#FF7A00] hover:bg-[#FF9500] text-black px-8 rounded-xl font-bold transition-all flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? <Activity className="animate-spin" /> : 'RUN'}
            </button>
          </div>
          {error && <p className="text-red-500 mt-4 text-center font-bold">{error}</p>}
        </div>

        {hasRun && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* DVLA Data Card */}
            <div className="lg:col-span-1">
              <div className="bg-[#1A1D22] border border-white/5 rounded-3xl p-8 sticky top-32">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mr-4">
                    <Info className="text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">DVLA Output</h2>
                </div>

                {dvlaData ? (
                  <div className="space-y-4">
                    <div className="bg-[#0A0A0A] p-4 rounded-2xl">
                      <p className="text-white/40 text-xs uppercase font-bold mb-1">Make</p>
                      <p className="text-white text-xl font-bold">{dvlaData.make}</p>
                    </div>
                    <div className="bg-[#0A0A0A] p-4 rounded-2xl">
                      <p className="text-white/40 text-xs uppercase font-bold mb-1">Model</p>
                      <p className="text-white text-xl font-bold">{dvlaData.model || 'N/A'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#0A0A0A] p-4 rounded-2xl">
                        <p className="text-white/40 text-xs uppercase font-bold mb-1">Year</p>
                        <p className="text-white text-xl font-bold">{dvlaData.yearOfManufacture}</p>
                      </div>
                      <div className="bg-[#0A0A0A] p-4 rounded-2xl">
                        <p className="text-white/40 text-xs uppercase font-bold mb-1">Fuel</p>
                        <p className="text-white text-xl font-bold">{dvlaData.fuelType}</p>
                      </div>
                    </div>
                    <div className="bg-[#0A0A0A] p-4 rounded-2xl">
                      <p className="text-white/40 text-xs uppercase font-bold mb-1">Engine</p>
                      <p className="text-white text-xl font-bold">{dvlaData.engineCapacity}cc ({convertCcToLitre(dvlaData.engineCapacity)}L)</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/30 italic">No DVLA data returned.</p>
                )}
              </div>
            </div>

            {/* Matches List */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-white flex items-center">
                  <TrendingUp className="text-[#FF7A00] mr-4" />
                  Potential Matches
                </h2>
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-white/50 text-sm">
                  Found {matches.length} matches
                </div>
              </div>

              {matches.length > 0 ? (
                <div className="space-y-6">
                  {matches.map((match, index) => (
                    <div 
                      key={index} 
                      className="bg-[#1A1D22] border border-white/5 rounded-3xl p-6 hover:border-[#FF7A00]/30 transition-all group"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-white group-hover:text-[#FF7A00] transition-colors">
                            {match.manufacturer} {match.model}
                          </h3>
                          <p className="text-white/50 font-medium">{match.engine_name}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-black text-[#FF7A00] leading-none mb-1">
                            {match.score}
                          </div>
                          <p className="text-white/30 text-xs uppercase font-bold">Confidence Score</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className="bg-[#0A0A0A] p-3 rounded-xl">
                          <p className="text-white/40 text-[10px] uppercase font-bold mb-1">Stock</p>
                          <p className="text-white font-bold">{match.stock_bhp} BHP</p>
                        </div>
                        <div className="bg-[#0A0A0A] p-3 rounded-xl border border-green-500/20">
                          <p className="text-green-500/60 text-[10px] uppercase font-bold mb-1">Stage 1</p>
                          <p className="text-green-500 font-bold">{match.stage1_bhp} BHP</p>
                        </div>
                        <div className="bg-[#0A0A0A] p-3 rounded-xl">
                          <p className="text-white/40 text-[10px] uppercase font-bold mb-1">Torque</p>
                          <p className="text-white font-bold">{match.stock_torque} NM</p>
                        </div>
                        <div className="bg-[#0A0A0A] p-3 rounded-xl border border-[#FF7A00]/20">
                          <p className="text-[#FF7A00]/60 text-[10px] uppercase font-bold mb-1">Gain</p>
                          <p className="text-[#FF7A00] font-bold">+{match.bhp_gain} BHP</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {match.matchReasons?.map((reason, rIdx) => (
                          <div key={rIdx} className="flex items-center bg-white/5 px-3 py-1 rounded-full text-xs font-bold text-white/70">
                            <CheckCircle size={12} className="text-green-500 mr-2" />
                            {reason}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#1A1D22] border border-dashed border-white/10 rounded-3xl p-20 text-center">
                  <AlertTriangle className="text-yellow-500 mx-auto mb-4" size={48} />
                  <p className="text-white text-xl font-bold mb-2">No Strong Matches Found</p>
                  <p className="text-white/40">Try a different registration or check the remap database.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticMatcher;
