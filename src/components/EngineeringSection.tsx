import { useState } from 'react';
import { ENGINEERING_PILLARS, CameraPresetId } from '../data/productData';

interface EngineeringSectionProps {
  onFocusSubsystem: (preset: CameraPresetId, explode: number) => void;
}

const KEY_BENCHMARKS = [
  { value: '0.018%', label: 'Wow & Flutter (JIS WRMS)' },
  { value: '-86 dB', label: 'Rumble Signal-to-Noise' },
  { value: '6.4 kg', label: 'C36000 Brass Flywheel Mass' },
  { value: '305 mm', label: '12-Inch Titanium Tonearm' },
];

export function EngineeringSection({ onFocusSubsystem }: EngineeringSectionProps) {
  const [activePillarId, setActivePillarId] = useState<string>('plinth');
  const [plinthImgFailed, setPlinthImgFailed] = useState(false);
  const [tonearmImgFailed, setTonearmImgFailed] = useState(false);

  const activePillar =
    ENGINEERING_PILLARS.find((p) => p.id === activePillarId) ?? ENGINEERING_PILLARS[0];

  const handleInspectPillar = (id: string) => {
    if (id === 'tonearm') {
      onFocusSubsystem('tonearm', 0.15);
    } else if (id === 'platter') {
      onFocusSubsystem('platter', 0.55);
    } else if (id === 'drive') {
      onFocusSubsystem('studio', 0.78);
    } else {
      onFocusSubsystem('profile', 0.35);
    }
    const el = document.getElementById('showcase');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Quantitative Proof Strip directly adjacent to Hero */}
      <section aria-label="Measured Acoustic Benchmarks" className="w-full bg-white border-b border-[#E3E2DC]">
        <div className="max-w-[1200px] mx-auto px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {KEY_BENCHMARKS.map((item) => (
            <div key={item.label} className="flex flex-col">
              <span className="font-mono tabular-nums text-2xl sm:text-3xl font-medium text-[#111316] tracking-tight">
                {item.value}
              </span>
              <span className="text-xs sm:text-sm text-[#52555A] mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 01: Asymmetric Engineering Bento & Subsystem Architecture */}
      <section id="engineering" className="max-w-[1200px] mx-auto px-6 py-20 sm:py-24">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-medium text-[#B45309] mb-2">
            01. Acoustic Architecture
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#111316] leading-[1.15]"
            style={{ textWrap: 'balance' }}
          >
            Engineered to eliminate mechanical resonance before the stylus ever touches vinyl.
          </h2>
        </div>

        {/* Asymmetric 2:1 Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-12">
          {/* Primary CNC Plinth Feature (col-span-2) */}
          <article className="lg:col-span-2 bg-white border border-[#E3E2DC] rounded-xl overflow-hidden flex flex-col">
            <div className="relative aspect-[16/10] w-full bg-[#181A20] overflow-hidden">
              {!plinthImgFailed ? (
                <img
                  src="/src/assets/images/craft_cnc_plinth_1795440002536.jpg"
                  alt="5-axis CNC machined anodized aluminum plinth and solid brass isolation cylinder"
                  referrerPolicy="no-referrer"
                  onError={() => setPlinthImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1B1E26] to-[#111317] text-[#D4A85C] text-sm font-medium p-6">
                  6061-T6 Billet Aluminum &amp; C36000 Brass Chassis
                </div>
              )}
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-[#52555A] mb-2">
                  Chassis Metallurgy · 6061-T6 Aerospace Billet
                </p>
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#111316] mb-3">
                  Constrained-layer plinth milled from a 22 kg solid block
                </h3>
                <p className="text-sm sm:text-[15px] text-[#52555A] leading-relaxed max-w-[65ch]">
                  Internal acoustic chambers are pocket-milled around the spindle bearing well and laminated to a viscoelastic Sorbothane sub-frame, draining structural floor energy across 4 Hz to 240 Hz without hollow cabinet ringing.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-[#ECECE6] flex items-center justify-between gap-4">
                <span className="text-xs font-mono tabular-nums text-[#52555A]">
                  Tolerance ±0.015 mm · 48 mm thickness
                </span>
                <button
                  type="button"
                  onClick={() => handleInspectPillar('drive')}
                  className="text-xs font-semibold text-[#B45309] hover:text-[#92400E] hover:underline underline-offset-4 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] rounded-sm"
                >
                  View Exploded Chassis in 3D
                </button>
              </div>
            </div>
          </article>

          {/* Secondary Tonearm Feature (col-span-1) */}
          <article className="bg-white border border-[#E3E2DC] rounded-xl overflow-hidden flex flex-col">
            <div className="relative aspect-[4/3] w-full bg-[#181A20] overflow-hidden">
              {!tonearmImgFailed ? (
                <img
                  src="/src/assets/images/craft_tonearm_gimbal_1795440002960.jpg"
                  alt="12-inch titanium gimballed tonearm with laser-etched brass tracking counterweight"
                  referrerPolicy="no-referrer"
                  onError={() => setTonearmImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1B1E26] to-[#111317] text-[#D4A85C] text-sm font-medium p-6">
                  12-Inch Grade 5 Titanium Tonearm
                </div>
              )}
            </div>
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-[#52555A] mb-2">
                  Tracking Geometry · ABEC-9 Hybrid Ceramic
                </p>
                <h3 className="font-display text-xl font-semibold text-[#111316] mb-3">
                  12-inch titanium S-curve tonearm
                </h3>
                <p className="text-sm text-[#52555A] leading-relaxed">
                  An extended 305 mm pivot-to-stylus geometry cuts inner-groove tracking distortion by 38% while laser-etched brass counterweights calibrate down to 0.05 g.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-[#ECECE6] flex items-center justify-between gap-4">
                <span className="text-xs font-mono tabular-nums text-[#52555A]">
                  0.42° max error
                </span>
                <button
                  type="button"
                  onClick={() => handleInspectPillar('tonearm')}
                  className="text-xs font-semibold text-[#B45309] hover:text-[#92400E] hover:underline underline-offset-4 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] rounded-sm"
                >
                  Inspect Tonearm
                </button>
              </div>
            </div>
          </article>
        </div>

        {/* Interactive Subsystem Breakdown Tabs */}
        <div className="bg-white border border-[#E3E2DC] rounded-xl p-6 sm:p-8">
          <div
            className="flex flex-wrap items-center gap-2 pb-6 border-b border-[#ECECE6]"
            role="tablist"
            aria-label="Engineering Subsystems"
          >
            {ENGINEERING_PILLARS.map((pillar) => {
              const active = pillar.id === activePillar.id;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActivePillarId(pillar.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] ${
                    active
                      ? 'bg-[#111316] text-white'
                      : 'bg-[#F3F2EE] text-[#52555A] hover:text-[#111316]'
                  }`}
                >
                  {pillar.index}. {pillar.title}
                </button>
              );
            })}
          </div>

          <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#111316] mb-3">
                {activePillar.headline}
              </h3>
              <p className="text-sm sm:text-[15px] text-[#52555A] leading-relaxed max-w-[65ch] mb-5">
                {activePillar.description}
              </p>
              <button
                type="button"
                onClick={() => handleInspectPillar(activePillar.id)}
                className="px-4 py-2 text-xs font-semibold text-[#111316] border border-[#D4D2CA] hover:border-[#111316] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]"
              >
                Focus 3D Viewport on {activePillar.title}
              </button>
            </div>

            <dl className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {activePillar.metrics.map((m) => (
                <div
                  key={m.label}
                  className="p-4 bg-[#F7F7F5] border border-[#E7E6E0] rounded-lg flex lg:items-center lg:justify-between flex-col lg:flex-row gap-1"
                >
                  <dt className="text-xs text-[#52555A]">{m.label}</dt>
                  <dd className="font-mono tabular-nums text-base font-medium text-[#111316]">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
