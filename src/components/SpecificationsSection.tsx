import { useState } from 'react';
import {
  FINISH_VARIANTS,
  FinishPresetId,
  TECHNICAL_SPECS,
} from '../data/productData';

interface SpecificationsSectionProps {
  selectedFinish: FinishPresetId;
  onSelectFinish: (finish: FinishPresetId) => void;
}

type SpecFilter = 'all' | 'drive' | 'tonearm' | 'chassis';

export function SpecificationsSection({
  selectedFinish,
  onSelectFinish,
}: SpecificationsSectionProps) {
  const [filter, setFilter] = useState<SpecFilter>('all');

  const filteredSpecs =
    filter === 'all'
      ? TECHNICAL_SPECS
      : TECHNICAL_SPECS.filter((row) => row.category === filter);

  return (
    <section
      id="specifications"
      className="w-full bg-white border-y border-[#E3E2DC] py-20 sm:py-24"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <p className="text-xs font-medium text-[#B45309] mb-2">
              02. Technical Specifications
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#111316]"
              style={{ textWrap: 'balance' }}
            >
              Laboratory tolerances and material editions.
            </h2>
          </div>

          {/* Interactive Spec Filter Segmented Control */}
          <div
            className="flex items-center gap-1 p-1 bg-[#F3F2EE] border border-[#E3E2DC] rounded-lg self-start md:self-auto"
            role="group"
            aria-label="Filter Specifications"
          >
            {(
              [
                { id: 'all', label: 'All Specs' },
                { id: 'drive', label: 'Drive & Platter' },
                { id: 'tonearm', label: 'Tonearm' },
                { id: 'chassis', label: 'Chassis & I/O' },
              ] as { id: SpecFilter; label: string }[]
            ).map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] ${
                    active
                      ? 'bg-white text-[#111316] shadow-xs'
                      : 'text-[#52555A] hover:text-[#111316]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Semantic Specification Table */}
        <div className="border border-[#E3E2DC] rounded-xl overflow-hidden mb-14">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F7F7F5] border-b border-[#E3E2DC]">
              <tr>
                <th scope="col" className="py-3.5 px-5 text-xs font-semibold text-[#52555A]">
                  Parameter
                </th>
                <th scope="col" className="py-3.5 px-5 text-xs font-semibold text-[#52555A]">
                  Measured Value
                </th>
                <th
                  scope="col"
                  className="hidden sm:table-cell py-3.5 px-5 text-xs font-semibold text-[#52555A]"
                >
                  Engineering Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECE6]">
              {filteredSpecs.map((spec) => (
                <tr key={spec.parameter} className="hover:bg-[#FAF9F7] transition-colors">
                  <td className="py-3.5 px-5 text-sm font-medium text-[#111316]">
                    {spec.parameter}
                  </td>
                  <td className="py-3.5 px-5 text-sm font-mono tabular-nums text-[#111316]">
                    {spec.value}
                  </td>
                  <td className="hidden sm:table-cell py-3.5 px-5 text-xs sm:text-sm text-[#52555A]">
                    {spec.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Interactive Finish Editions (synced with 3D model & JSON-LD Offer) */}
        <div>
          <h3 className="font-display text-xl font-semibold text-[#111316] mb-5">
            Select Finish Edition
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FINISH_VARIANTS.map((variant) => {
              const isSelected = variant.id === selectedFinish;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => onSelectFinish(variant.id)}
                  aria-pressed={isSelected}
                  className={`text-left p-6 rounded-xl border transition-colors flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] ${
                    isSelected
                      ? 'bg-[#FAF8F3] border-[#B45309]'
                      : 'bg-white border-[#E3E2DC] hover:border-[#B5B3AA]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span
                        className="w-7 h-7 rounded-full border border-black/15 shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${variant.swatchHex} 55%, ${variant.secondaryHex} 55%)`,
                        }}
                        aria-hidden="true"
                      />
                      <span className="text-xs font-mono tabular-nums text-[#52555A]">
                        {variant.sku}
                      </span>
                    </div>
                    <h4 className="font-display text-lg font-semibold text-[#111316] mb-1.5">
                      {variant.name}
                    </h4>
                    <p className="text-sm text-[#52555A] leading-relaxed mb-5">
                      {variant.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#ECECE6] flex items-center justify-between">
                    <span className="font-mono tabular-nums text-base font-semibold text-[#111316]">
                      ${variant.priceUsd.toLocaleString()}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-[#B45309]' : 'text-[#52555A]'
                      }`}
                    >
                      {isSelected ? 'Active in 3D Stage' : 'Preview in 3D'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
