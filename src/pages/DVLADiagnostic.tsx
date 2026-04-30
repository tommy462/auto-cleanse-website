import { useState, useRef } from 'react';
import { Search, Info, AlertCircle, CheckCircle2, Car, Cpu, Droplets, Zap } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SEO from '../components/SEO';

export default function DVLADiagnostic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [registration, setRegistration] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useGSAP(() => {
    gsap.fromTo('.reveal-item', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
  }, { scope: containerRef });

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registration.trim()) return;

    setIsLookingUp(true);
    setError(null);
    setRawResponse(null);

    try {
      const cleanReg = registration.trim().toUpperCase().replace(/\s+/g, '');
      
      const response = await fetch('/api/lookup-dvla', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registration: cleanReg }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch DVLA data');
      }

      setRawResponse(data);
    } catch (err: any) {
      console.error('Diagnostic lookup error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <div ref={containerRef} className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO 
        title="DVLA Data Diagnostic | AutoCleanse" 
        description="Internal tool for investigating DVLA vehicle data for remapping profile matching."
        path="/debug/dvla"
      />

      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-[#FF7A00]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#FF7A00]/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 text-center reveal-item">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-[#FF7A00] text-xs font-bold mb-6">
            <Zap size={14} />
            Diagnostic Mode — v1.0
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
            DVLA <span className="text-[#FF7A00]">Data Inspector.</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-medium">
            Enter a registration to inspect every field available in the official DVLA response. 
            Used for mapping vehicle specs to remap profiles.
          </p>
        </div>

        <div className="bg-[#111111] border border-white/5 rounded-[2rem] p-8 mb-10 shadow-2xl reveal-item">
          <form onSubmit={handleLookup} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="diagnostic-reg" className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2.5 ml-1">
                Vehicle Registration
              </label>
              <div className="relative">
                <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                <input
                  id="diagnostic-reg"
                  type="text"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value.toUpperCase())}
                  placeholder="E.G. GU16 ABC"
                  className="w-full pl-12 pr-4 py-4 bg-[#0A0A0A] border border-white/10 text-white rounded-2xl focus:ring-2 focus:ring-[#FF7A00]/40 focus:border-[#FF7A00]/60 placeholder:text-white/20 transition-all font-mono text-xl tracking-wider"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLookingUp || !registration.trim()}
                className="w-full md:w-auto px-10 py-4 bg-[#FF7A00] hover:bg-[#FF9500] text-black font-black rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,122,0,0.2)]"
              >
                {isLookingUp ? (
                  <div className="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <Search size={20} />
                )}
                {isLookingUp ? 'Scanning...' : 'Inspect Vehicle'}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 mb-10 flex items-start gap-4 reveal-item">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
              <AlertCircle className="text-red-500" size={20} />
            </div>
            <div>
              <p className="text-red-200 font-bold text-lg">Lookup Failed</p>
              <p className="text-red-200/60 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {rawResponse && (
          <div className="space-y-8 reveal-item">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="text-emerald-500" size={20} />
              </div>
              <div>
                <p className="text-emerald-200 font-bold text-lg">Data Captured</p>
                <p className="text-emerald-200/60 text-sm font-medium">
                  {rawResponse.make} {rawResponse.registrationNumber} — {rawResponse.fuelType}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 shadow-xl">
                <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-6 flex items-center gap-2.5">
                  <Cpu size={14} className="text-[#FF7A00]" />
                  Engine & Technical
                </h3>
                <div className="space-y-4">
                  <DataField label="Manufacturer" value={rawResponse.make} />
                  <DataField label="Year of Mfg" value={rawResponse.yearOfManufacture} />
                  <DataField label="Engine Capacity" value={rawResponse.engineCapacity ? `${rawResponse.engineCapacity}cc` : null} />
                  <DataField label="Fuel Type" value={rawResponse.fuelType} />
                  <DataField label="Euro Status" value={rawResponse.euroStatus} />
                  <DataField label="CO2 Emissions" value={rawResponse.co2Emissions ? `${rawResponse.co2Emissions} g/km` : null} />
                  <DataField label="Type Approval" value={rawResponse.typeApproval} />
                </div>
              </div>

              <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 shadow-xl">
                <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-6 flex items-center gap-2.5">
                  <Droplets size={14} className="text-[#FF7A00]" />
                  Chassis & Style
                </h3>
                <div className="space-y-4">
                  <DataField label="Colour" value={rawResponse.colour} />
                  <DataField label="Wheel Plan" value={rawResponse.wheelplan} />
                  <DataField label="Revenue Weight" value={rawResponse.revenueWeight ? `${rawResponse.revenueWeight}kg` : null} />
                  <DataField label="Tax Class" value={rawResponse.taxClass} />
                  <DataField label="Tax Status" value={rawResponse.taxStatus} />
                  <DataField label="MOT Status" value={rawResponse.motStatus} />
                  <DataField label="Last V5C Issued" value={rawResponse.dateOfLastV5CIssued} />
                </div>
              </div>
            </div>

            <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white tracking-tight">Full Raw JSON</h3>
                <button 
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(rawResponse, null, 2))}
                  className="text-xs font-bold text-[#FF7A00] hover:text-[#FF9500] transition-colors"
                >
                  COPY JSON
                </button>
              </div>
              <div className="bg-[#0A0A0A] rounded-2xl p-6 overflow-auto max-h-[500px] border border-white/5">
                <pre className="text-[#FF7A00]/80 font-mono text-sm leading-relaxed">
                  {JSON.stringify(rawResponse, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DataField({ label, value }: { label: string, value: any }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
      <span className="text-white/40 text-sm font-medium">{label}</span>
      <span className="text-white font-bold">{value?.toString() || '—'}</span>
    </div>
  );
}
