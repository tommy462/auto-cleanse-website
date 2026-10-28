import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { trackEvent } from '../lib/tracking';

// Interactive cutaway of a wall-flow DPF: drive to load soot and ash, then try a
// regeneration, an additive or an off-vehicle clean and see what each removes.
// The facts match the blog posts on regeneration, ash and additives. Everything
// explanatory is rendered on the server; only the animation is client-side.

type Phase =
  | 'idle' | 'driving' | 'regen' | 'additive' | 'blocked'
  | 'removed' | 'flushing' | 'drying' | 'testing' | 'cycling';

// SVG geometry (viewBox x 40-760, y 0-420). Simplified, not to scale: five big
// channels read better on a phone than a realistic cell count.
const SUB_X0 = 120;
const SUB_X1 = 680;
const PLUG = 22;
const CH_TOP = 60;
const PITCH = 60;
const WALL = 8;
const CHANNELS = 5;
const ASH_MAX = 240;
const SOOT_MAX = 18;
const SOOT_LIMIT = 90; // past this the ECU will normally refuse to regenerate

const channels = Array.from({ length: CHANNELS }, (_, i) => {
  const top = CH_TOP + i * PITCH + WALL / 2;
  const bottom = CH_TOP + (i + 1) * PITCH - WALL / 2;
  return { i, inlet: i % 2 === 0, top, bottom, mid: (top + bottom) / 2 };
});
const inlets = channels.filter((c) => c.inlet);
const outlets = channels.filter((c) => !c.inlet);
const walls = Array.from({ length: CHANNELS + 1 }, (_, k) => CH_TOP + k * PITCH);

const CLEAN_STEPS: { phase: Phase; title: string; body: string }[] = [
  {
    phase: 'removed',
    title: 'Off the vehicle and pre-tested',
    body: 'The filter is removed, inspected for cracks or melting, and air flow tested on the machine to record its back-pressure before anything is cleaned.',
  },
  {
    phase: 'flushing',
    title: 'Reverse flush on the METclean XL',
    body: 'Water only, no chemicals. The filter goes on the machine the opposite way round, so heated water flows from the outlet side back to the inlet at 1 to 2 bar, set to suit the filter. High-pressure micro-cavitation bursts break up the packed ash and carry it out of the face it went in by.',
  },
  {
    phase: 'drying',
    title: 'Hot-air dry',
    body: 'Dried right through with hot air at up to 100°C, because a damp filter gives a false flow reading and should not go back on a vehicle.',
  },
  {
    phase: 'testing',
    title: 'Flow tested again',
    body: 'The same air flow test as before, so the drop in back-pressure is measured rather than assumed.',
  },
];

const MESSAGES: Record<string, string> = {
  start:
    'This filter has some soot and ash in it, like most DPFs that have done a few years of work. Try each option and watch what it actually removes.',
  drive:
    'Driving: soot, which is carbon, collects on the walls of the inlet channels. A little ash from burnt engine oil comes in with it.',
  driveHigh: 'The soot load is high now. Try a regeneration before it gets any worse.',
  regen:
    'Regeneration: the filter is taken to around 600°C and the soot burns off as gas. Ash is already burnt, so it stays behind and packs towards the plugged end.',
  regenEmpty: 'There is very little soot to burn. A regeneration will not touch the ash.',
  blocked:
    'The soot load is past the point where the ECU will normally allow a regeneration, because burning that much at once can overheat and crack the filter. This one needs a workshop check first.',
  additive:
    'Additive or spray: it helps soot burn at a lower temperature, but only once a proper drive lets a regeneration finish. It does nothing for ash, and some additives leave a little metallic ash of their own.',
  cleaned:
    'Clean: the soot is gone, and so is the ash that no regeneration or additive could shift. The before and after flow figures show the difference.',
  cycles:
    'Six drive-and-regen cycles: the soot came and went every time, but the ash only went one way. That is why an older DPF can block even when every regeneration finishes.',
};

// Air flow pre-test bands from the METclean XL manual.
const band = (r: number) => (r < 30 ? 'OK (5 to 15 mbar)' : r < 60 ? 'Medium (15 to 30 mbar)' : 'Blocked (over 30 mbar)');
const level = (v: number) => (v < 15 ? 'Low' : v < 40 ? 'Moderate' : v < 70 ? 'High' : 'Very high');
const clamp = (v: number) => Math.max(0, Math.min(100, v));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function DpfCutaway() {
  const [soot, setSoot] = useState(45);
  const [ash, setAsh] = useState(28);
  const [phase, setPhase] = useState<Phase>('idle');
  const [message, setMessage] = useState(MESSAGES.start);
  const [runId, setRunId] = useState(0);
  const [test, setTest] = useState<{ before: string; after?: string } | null>(null);
  const alive = useRef(true);
  // Set on every mount: StrictMode mounts twice in development.
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  const busy = phase !== 'idle' && phase !== 'blocked';
  const restriction = clamp(Math.round(soot * 0.55 + ash * 0.8));
  const offVehicle = phase === 'removed' || phase === 'flushing' || phase === 'drying' || phase === 'testing';
  const burning = phase === 'regen' || phase === 'additive';

  const run = async (steps: [Phase, number, () => void][]) => {
    for (const [p, ms, apply] of steps) {
      if (!alive.current) return;
      setPhase(p);
      apply();
      await sleep(ms);
    }
    if (alive.current) setPhase('idle');
  };

  const drive = () => {
    trackEvent('dpf_explainer', { action: 'drive' });
    setRunId((n) => n + 1);
    const next = clamp(soot + 30);
    run([['driving', 1500, () => { setSoot(next); setAsh((a) => clamp(a + 2)); setMessage(next >= 75 ? MESSAGES.driveHigh : MESSAGES.drive); }]]);
  };

  const regen = (kind: 'regen' | 'additive') => {
    trackEvent('dpf_explainer', { action: kind });
    if (soot > SOOT_LIMIT) { setPhase('blocked'); setMessage(MESSAGES.blocked); return; }
    if (soot < 8) { setMessage(MESSAGES.regenEmpty); return; }
    run([[kind, 2400, () => {
      setSoot(kind === 'regen' ? 0 : Math.round(soot * 0.3));
      if (kind === 'additive') setAsh((a) => clamp(a + 3));
      setMessage(MESSAGES[kind]);
    }]]);
  };

  const clean = () => {
    trackEvent('dpf_explainer', { action: 'off_vehicle_clean' });
    run([
      ['removed', 1300, () => { setTest({ before: band(restriction) }); setMessage(CLEAN_STEPS[0].body); }],
      ['flushing', 3200, () => { setSoot(0); setAsh(3); setMessage(CLEAN_STEPS[1].body); }],
      ['drying', 1600, () => setMessage(CLEAN_STEPS[2].body)],
      ['testing', 1500, () => { setTest((t) => t && { ...t, after: band(clamp(Math.round(3 * 0.8))) }); setMessage(CLEAN_STEPS[3].body); }],
      ['idle', 0, () => setMessage(MESSAGES.cleaned)],
    ]);
  };

  const cycles = async () => {
    trackEvent('dpf_explainer', { action: 'cycles' });
    setMessage('Running six drive-and-regen cycles. Watch the ash at the plugged end.');
    let a = ash;
    for (let c = 0; c < 6; c++) {
      if (!alive.current) return;
      setRunId((n) => n + 1);
      setPhase('cycling');
      setSoot(70);
      a = clamp(a + 7);
      setAsh(a);
      await sleep(700);
      if (!alive.current) return;
      setPhase('regen');
      setSoot(0);
      await sleep(700);
    }
    if (!alive.current) return;
    setMessage(MESSAGES.cycles);
    setPhase('idle');
  };

  const reset = () => { setSoot(45); setAsh(28); setPhase('idle'); setTest(null); setMessage(MESSAGES.start); };

  const sootScale = { transform: `scaleY(${soot / 100})` };
  const ashScale = { transform: `scaleX(${ash / 100})` };
  const btn =
    'min-h-[48px] rounded-xl px-4 py-3 text-sm font-bold text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111317]';

  return (
    <div className="rounded-[1.5rem] md:rounded-[2rem] bg-[#111317] border border-white/5 p-3 sm:p-6 md:p-8">
      <div className="relative lg:grid lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:gap-y-4">
        {/* ── Cutaway ── */}
        <div className="lg:col-span-7 lg:row-start-1">
          <svg
            viewBox="40 0 720 420"
            className="w-full h-auto"
            role="img"
            aria-label={`Cutaway of a diesel particulate filter. Soot load ${level(soot).toLowerCase()}, ash load ${level(ash).toLowerCase()}.`}
          >
            <defs>
              <pattern id="dpfx-pores" width="6" height="5" patternUnits="userSpaceOnUse">
                <rect width="6" height="5" fill="#a8a090" />
                <circle cx="2" cy="2.5" r="1" fill="#6f695e" />
              </pattern>
              <pattern id="dpfx-ash" width="7" height="7" patternUnits="userSpaceOnUse">
                <rect width="7" height="7" fill="#efe9d8" />
                <circle cx="2" cy="2" r="1" fill="#c9c0aa" />
                <circle cx="5.5" cy="5" r="0.8" fill="#bdb49d" />
              </pattern>
              <linearGradient id="dpfx-burn" x1="0" x2="1">
                <stop offset="0" stopColor="#ffcf66" />
                <stop offset="0.5" stopColor="#FF7A00" />
                <stop offset="1" stopColor="#c2410c" />
              </linearGradient>
            </defs>

            {/* Exhaust pipe and cones: fade when the filter is off the vehicle */}
            <g opacity={offVehicle ? 0.15 : 1} style={{ transition: 'opacity 0.6s' }}>
              <polygon points="40,185 64,185 96,72 96,348 64,235 40,235" fill="#1b1e23" stroke="rgba(255,255,255,0.12)" />
              <polygon points="760,185 736,185 704,72 704,348 736,235 760,235" fill="#1b1e23" stroke="rgba(255,255,255,0.12)" />
            </g>

            {/* Canister */}
            <rect x="96" y="40" width="608" height="340" rx="24" fill="#16181c" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />

            {/* Channel interiors */}
            {channels.map((c) => (
              <rect key={`ch${c.i}`} x={SUB_X0} y={c.top} width={SUB_X1 - SUB_X0} height={c.bottom - c.top} fill="#3a4049" />
            ))}

            {/* Soot cake on the inlet channel walls */}
            {inlets.map((c) => (
              <g key={`soot${c.i}`} className={burning ? 'dpfx-flicker' : undefined}>
                <rect
                  x={SUB_X0} y={c.top} width={SUB_X1 - PLUG - SUB_X0} height={SOOT_MAX}
                  className="dpfx-scale" fill={burning ? 'url(#dpfx-burn)' : '#050505'}
                  style={{ ...sootScale, transformOrigin: '50% 0%' }}
                />
                <rect
                  x={SUB_X0} y={c.bottom - SOOT_MAX} width={SUB_X1 - PLUG - SUB_X0} height={SOOT_MAX}
                  className="dpfx-scale" fill={burning ? 'url(#dpfx-burn)' : '#050505'}
                  style={{ ...sootScale, transformOrigin: '50% 100%' }}
                />
              </g>
            ))}

            {/* Ash packed towards the plugged end of the inlet channels */}
            {inlets.map((c) => (
              <rect
                key={`ash${c.i}`}
                x={SUB_X1 - PLUG - ASH_MAX} y={c.top} width={ASH_MAX} height={c.bottom - c.top}
                fill="url(#dpfx-ash)" className="dpfx-scale"
                style={{ ...ashScale, transformOrigin: '100% 50%' }}
              />
            ))}

            {/* Porous ceramic walls */}
            {walls.map((y) => (
              <rect key={`w${y}`} x={SUB_X0} y={y - WALL / 2} width={SUB_X1 - SUB_X0} height={WALL} fill="url(#dpfx-pores)" />
            ))}

            {/* Plugs: inlet channels closed at the outlet end, outlet channels at the inlet end */}
            {channels.map((c) => (
              <rect
                key={`plug${c.i}`}
                x={c.inlet ? SUB_X1 - PLUG : SUB_X0} y={c.top} width={PLUG} height={c.bottom - c.top}
                fill="#cbc3b0"
              />
            ))}

            {/* Exhaust flow: in through the inlets, through the walls, out of the outlets */}
            {(phase === 'driving' || phase === 'testing' || phase === 'cycling') && (
              <g stroke={phase === 'testing' ? '#ffffff' : '#FF9A33'} strokeWidth="2" strokeLinecap="round" opacity="0.85">
                {inlets.map((c) => (
                  <line key={`fi${c.i}`} x1="44" y1={c.mid} x2={SUB_X1 - PLUG - 6} y2={c.mid} className="dpfx-flow" />
                ))}
                {outlets.map((c) => (
                  <line key={`fo${c.i}`} x1={SUB_X0 + PLUG + 6} y1={c.mid} x2="756" y2={c.mid} className="dpfx-flow" />
                ))}
                {outlets.flatMap((c) => [280, 420, 560].flatMap((x) => [
                  <line key={`fu${c.i}-${x}`} x1={x} y1={c.mid - PITCH} x2={x} y2={c.mid - 4} className="dpfx-flow" />,
                  <line key={`fd${c.i}-${x}`} x1={x + 30} y1={c.mid + PITCH} x2={x + 30} y2={c.mid + 4} className="dpfx-flow" />,
                ]))}
              </g>
            )}

            {/* Particles arriving while driving */}
            {phase === 'driving' && (
              <g key={`drive${runId}`}>
                {inlets.flatMap((c, ci) => [0, 1, 2, 3].map((k) => {
                  const stop = 160 + ((ci * 97 + k * 131) % 420);
                  return (
                    <circle
                      key={`p${c.i}-${k}`} cx="50" cy={c.mid + (k % 2 ? 9 : -9)} r="5" fill="#000"
                      stroke="#FF9A33" strokeWidth="0.6" className="dpfx-particle"
                      style={{ '--dx': `${stop - 50}px`, animationDelay: `${(k * 0.18 + ci * 0.07).toFixed(2)}s` } as CSSProperties}
                    />
                  );
                }))}
              </g>
            )}

            {/* Reverse flush: heated water at 1 to 2 bar from the outlet side with high-pressure micro-cavitation bursts, ash carried out of the inlet face */}
            {phase === 'flushing' && (
              <g>
                <g stroke="#5cc8ff" strokeWidth="2.5" strokeLinecap="round">
                  {outlets.map((c) => (
                    <line key={`wo${c.i}`} x1="756" y1={c.mid} x2={SUB_X0 + PLUG + 6} y2={c.mid} className="dpfx-flow-rev" />
                  ))}
                  {inlets.map((c) => (
                    <line key={`wi${c.i}`} x1={SUB_X1 - PLUG - 6} y1={c.mid} x2="44" y2={c.mid} className="dpfx-flow-rev" />
                  ))}
                </g>
                {outlets.map((c) => (
                  <circle key={`air${c.i}`} cx={SUB_X1 + 12} cy={c.mid} r="18" fill="none" stroke="#5cc8ff" strokeWidth="3" className="dpfx-burst" />
                ))}
                {inlets.flatMap((c, ci) => [0, 1, 2].map((k) => (
                  <rect
                    key={`out${c.i}-${k}`} x={SUB_X1 - PLUG - 40 - k * 50} y={c.mid - 5} width="11" height="10" rx="2"
                    fill="#efe9d8" className="dpfx-out"
                    style={{ '--dx': `${-(SUB_X1 - 70 - k * 50)}px`, animationDelay: `${(k * 0.3 + ci * 0.11).toFixed(2)}s` } as CSSProperties}
                  />
                )))}
              </g>
            )}

            {/* Hot-air dry */}
            {phase === 'drying' && (
              <rect x={SUB_X0} y={CH_TOP} width={SUB_X1 - SUB_X0} height={CHANNELS * PITCH} fill="#FF7A00" className="dpfx-shimmer" />
            )}

            {/* End labels, large enough to read on a phone */}
            <text x="80" y="408" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="20" fontWeight="700" fontFamily="JetBrains Mono, monospace">IN</text>
            <text x="720" y="408" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="20" fontWeight="700" fontFamily="JetBrains Mono, monospace">OUT</text>
            {offVehicle && (
              <text x="400" y="28" textAnchor="middle" fill="#FF9A33" fontSize="18" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                OFF THE VEHICLE
              </text>
            )}
          </svg>

        </div>

        {/* ── Controls and readouts: on phones the buttons and message come first, so they
            share the screen with the drawing; from lg the readouts lead. ── */}
        <div className="mt-4 lg:mt-0 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2 flex flex-col gap-5">
          <ul className="order-4 lg:order-1 grid grid-cols-1 gap-2 rounded-xl bg-[#1A1D22] border border-white/5 p-4">
            {[
              ['Soot', soot],
              ['Ash', ash],
              ['Back-pressure', restriction],
            ].map(([label, v]) => (
              <li key={label as string} className="grid grid-cols-[7.5rem_1fr_5.5rem] items-center gap-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/60">{label}</span>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-[#FF7A00] transition-[width] duration-700"
                    style={{ width: `${v}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-white text-right">{level(v as number)}</span>
              </li>
            ))}
          </ul>

          <div className="order-1 lg:order-2 grid grid-cols-2 gap-3">
            <button type="button" onClick={drive} disabled={busy || soot >= 100} className={`${btn} bg-[#1A1D22] border border-white/10 text-white hover:border-[#FF7A00]/50`}>
              Drive
              <span className="block text-xs font-medium text-white/60">Load soot and ash</span>
            </button>
            <button type="button" onClick={() => regen('regen')} disabled={busy} className={`${btn} bg-[#1A1D22] border border-white/10 text-white hover:border-[#FF7A00]/50`}>
              Regenerate
              <span className="block text-xs font-medium text-white/60">Burn the soot</span>
            </button>
            <button type="button" onClick={() => regen('additive')} disabled={busy} className={`${btn} bg-[#1A1D22] border border-white/10 text-white hover:border-[#FF7A00]/50`}>
              Additive or spray
              <span className="block text-xs font-medium text-white/60">The bottle option</span>
            </button>
            <button type="button" onClick={clean} disabled={busy} className={`${btn} btn-shine text-white`}>
              Off-vehicle clean
              <span className="block text-xs font-medium text-white/80">Our workshop process</span>
            </button>
          </div>

          <div className="order-2 lg:order-3 flex flex-wrap gap-x-5 gap-y-2">
            <button type="button" onClick={cycles} disabled={busy} className="min-h-[44px] text-sm font-semibold text-[#FF9A33] hover:text-white disabled:opacity-40 underline underline-offset-4 decoration-[#FF7A00]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] rounded">
              Run six drive-and-regen cycles
            </button>
            <button type="button" onClick={reset} disabled={busy} className="min-h-[44px] min-w-[44px] px-2 text-sm font-semibold text-white/50 hover:text-white disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] rounded">
              Reset
            </button>
          </div>

          <p
            className={`order-3 lg:order-4 rounded-xl border p-4 text-sm leading-relaxed min-h-[7.5rem] ${phase === 'blocked' ? 'border-[#FF7A00]/50 bg-[#FF7A00]/10 text-white' : 'border-white/5 bg-[#0d0f12] text-white/75'}`}
            aria-live="polite"
          >
            {message}
          </p>

          {/* Off-vehicle clean stages: always in the HTML, highlighted while running */}
          <ol className="order-5 grid grid-cols-1 gap-2">
            {CLEAN_STEPS.map((s, i) => (
              <li
                key={s.phase}
                className={`flex gap-3 rounded-lg px-3 py-2 transition-colors ${phase === s.phase ? 'bg-[#FF7A00]/10' : ''}`}
              >
                <span className={`font-mono text-xs font-bold mt-0.5 ${phase === s.phase ? 'text-[#FF7A00]' : 'text-white/55'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={`text-sm font-semibold ${phase === s.phase ? 'text-white' : 'text-white/55'}`}>{s.title}</span>
              </li>
            ))}
          </ol>
          <p className="order-6 text-xs text-white/60 leading-relaxed">
            {test
              ? <>Pre-test: <span className="text-white/80 font-semibold">{test.before}</span>{test.after && <>. Post-test: <span className="text-white/80 font-semibold">{test.after}</span></>}.</>
              : 'Back-pressure bands from the METclean XL air flow test: 5 to 15 mbar OK, 15 to 30 medium, over 30 blocked.'}
          </p>
        </div>

        <div className="mt-5 lg:mt-0 lg:col-span-7 lg:col-start-1 lg:row-start-2">
          {/* Legend */}
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/60">
            {[
              ['#050505', 'Soot (carbon)', 'border border-white/30'],
              ['#efe9d8', 'Ash (from engine oil)', ''],
              ['#a8a090', 'Porous ceramic wall', ''],
              ['#cbc3b0', 'Plug', ''],
              ['#5cc8ff', 'Heated water (clean only)', ''],
            ].map(([c, label, extra]) => (
              <li key={label} className="flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded-sm ${extra}`} style={{ background: c }} aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-white/55">Simplified illustration, not to scale.</p>
        </div>
      </div>

      {/* What removes what: the takeaway, readable without touching the animation */}
      <div className="mt-6 md:mt-8 overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <caption className="sr-only">What each option removes from a DPF</caption>
          <thead>
            <tr className="text-[10px] font-mono uppercase tracking-widest text-white/60">
              <th scope="col" className="py-2 pr-4 font-medium">Option</th>
              <th scope="col" className="py-2 pr-4 font-medium">Soot</th>
              <th scope="col" className="py-2 font-medium">Ash</th>
            </tr>
          </thead>
          <tbody className="text-white/75">
            <tr className="border-t border-white/5">
              <th scope="row" className="py-3 pr-4 font-bold text-white">Regeneration</th>
              <td className="py-3 pr-4">Burns it off</td>
              <td className="py-3">Stays in</td>
            </tr>
            <tr className="border-t border-white/5">
              <th scope="row" className="py-3 pr-4 font-bold text-white">Additive or spray</th>
              <td className="py-3 pr-4">Helps it burn</td>
              <td className="py-3">Stays in, can add a little</td>
            </tr>
            <tr className="border-t border-white/5">
              <th scope="row" className="py-3 pr-4 font-bold text-[#FF9A33]">Off-vehicle clean (water only)</th>
              <td className="py-3 pr-4">Removed</td>
              <td className="py-3">Removed</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 text-xs text-white/60 leading-relaxed">
          None of them can repair a cracked or melted filter. That is why every filter is inspected before it is cleaned.
        </p>
      </div>
    </div>
  );
}
