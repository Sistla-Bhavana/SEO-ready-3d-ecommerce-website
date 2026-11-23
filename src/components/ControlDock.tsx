import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Minus, Plus, RotateCcw, X } from 'lucide-react';
import {
  CameraPresetId,
  FINISH_VARIANTS,
  FinishPresetId,
  PART_DETAILS,
  PartId,
  RpmMode,
} from '../data/productData';

interface ControlDockProps {
  finishId: FinishPresetId;
  onFinishChange: (finishId: FinishPresetId) => void;
  explodeAmount: number;
  onExplodeChange: (val: number) => void;
  rpmMode: RpmMode;
  onRpmChange: (mode: RpmMode) => void;
  cameraPreset: CameraPresetId;
  onCameraPreset: (preset: CameraPresetId) => void;
  onZoom: (dir: 'in' | 'out') => void;
  selectedPart: PartId | null;
  onClearPart: () => void;
}

const CAMERA_OPTIONS: { id: CameraPresetId; label: string }[] = [
  { id: 'studio', label: 'Hero 3/4' },
  { id: 'tonearm', label: 'Tonearm' },
  { id: 'platter', label: 'Platter' },
  { id: 'profile', label: 'Side' },
];

export function ControlDock({
  finishId,
  onFinishChange,
  explodeAmount,
  onExplodeChange,
  rpmMode,
  onRpmChange,
  cameraPreset,
  onCameraPreset,
  onZoom,
  selectedPart,
  onClearPart,
}: ControlDockProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Keyboard shortcut 'H' to toggle Cinema / Zen Mode
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.key === 'h' || e.key === 'H') {
        setCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const inspectedPart = selectedPart ? PART_DETAILS[selectedPart] : null;

  return (
    <div
      className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[min(920px,94vw)] z-20 flex flex-col items-center pointer-events-none"
    >
      {/* Attached Collapse / Expand Tab */}
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
        className="pointer-events-auto mb-1.5 px-3.5 py-1.5 rounded-t-lg bg-[#181B22] border border-b-0 border-white/15 text-xs font-medium text-[#D1D5DB] hover:text-white flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E09F3E]"
      >
        {collapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Show Controls</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Hide Controls</span>
          </>
        )}
      </button>

      {/* Main Collapsible Bottom Dock (No backdrop-blur over WebGL) */}
      <div
        className={`w-full bg-[#161920] border border-white/12 rounded-xl shadow-2xl transition-all duration-200 overflow-hidden ${
          collapsed
            ? 'max-h-0 opacity-0 border-transparent pointer-events-none translate-y-3'
            : 'max-h-[340px] opacity-100 pointer-events-auto translate-y-0'
        }`}
      >
        {/* Inspected Component Readout Strip (when user clicks a 3D part) */}
        {inspectedPart && (
          <div className="px-4 py-2.5 bg-[#1D212B] border-b border-white/10 flex items-center justify-between gap-4">
            <div className="min-w-0 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <span className="text-xs font-semibold text-[#E09F3E] whitespace-nowrap">
                {inspectedPart.title}
              </span>
              <span className="text-xs text-[#9CA3AF] truncate">
                {inspectedPart.material} · <span className="font-mono tabular-nums text-[#E5E7EB]">{inspectedPart.specHighlight}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={onClearPart}
              aria-label="Close component inspection"
              className="p-1 text-[#9CA3AF] hover:text-white rounded transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E09F3E]"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Unified Controls Row */}
        <div className="px-4 py-3 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
          {/* 1. Exploded View Slider */}
          <div className="flex items-center gap-3 min-w-[190px] flex-1">
            <label
              htmlFor="explode-range"
              className="text-xs font-medium text-[#D1D5DB] whitespace-nowrap shrink-0"
            >
              Explode
            </label>
            <input
              id="explode-range"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={explodeAmount}
              onChange={(e) => onExplodeChange(parseFloat(e.target.value))}
              className="studio-slider w-full min-w-[90px]"
            />
            <span className="text-xs font-mono tabular-nums text-[#9CA3AF] w-9 text-right shrink-0">
              {Math.round(explodeAmount * 100)}%
            </span>
          </div>

          <div className="hidden lg:block w-px h-6 bg-white/10 shrink-0" aria-hidden="true" />

          {/* 2. Material Finishes */}
          <div className="flex items-center gap-2 shrink-0" role="group" aria-label="Chassis Finish">
            <span className="text-xs font-medium text-[#9CA3AF] whitespace-nowrap mr-1">Finish</span>
            {FINISH_VARIANTS.map((variant) => {
              const active = variant.id === finishId;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => onFinishChange(variant.id)}
                  title={variant.name}
                  aria-label={`Select ${variant.name} finish`}
                  aria-pressed={active}
                  className={`w-6 h-6 rounded-full border-2 transition-transform shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E09F3E] ${
                    active ? 'border-[#E09F3E] scale-110' : 'border-white/25 hover:border-white/60'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${variant.swatchHex} 55%, ${variant.secondaryHex} 55%)`,
                  }}
                />
              );
            })}
          </div>

          <div className="hidden lg:block w-px h-6 bg-white/10 shrink-0" aria-hidden="true" />

          {/* 3. Camera Presets & Zoom */}
          <div className="flex items-center gap-1.5 shrink-0" role="group" aria-label="Camera Presets">
            <div className="flex items-center bg-[#101216] p-0.5 rounded-lg border border-white/10">
              {CAMERA_OPTIONS.map((cam) => {
                const active = cam.id === cameraPreset;
                return (
                  <button
                    key={cam.id}
                    type="button"
                    onClick={() => onCameraPreset(cam.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E09F3E] ${
                      active
                        ? 'bg-[#252A36] text-white'
                        : 'text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    {cam.label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => onZoom('in')}
              aria-label="Zoom in"
              className="p-1.5 rounded-md bg-[#101216] border border-white/10 text-[#D1D5DB] hover:text-white transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E09F3E]"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onZoom('out')}
              aria-label="Zoom out"
              className="p-1.5 rounded-md bg-[#101216] border border-white/10 text-[#D1D5DB] hover:text-white transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E09F3E]"
            >
              <Minus className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                onExplodeChange(0);
                onCameraPreset('studio');
              }}
              aria-label="Reset 3D view"
              title="Reset view"
              className="p-1.5 rounded-md bg-[#101216] border border-white/10 text-[#D1D5DB] hover:text-white transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E09F3E]"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:block w-px h-6 bg-white/10 shrink-0" aria-hidden="true" />

          {/* 4. Platter RPM Speed */}
          <div
            className="flex items-center bg-[#101216] p-0.5 rounded-lg border border-white/10 shrink-0"
            role="group"
            aria-label="Platter Rotation Speed"
          >
            {(['33', '45', 'paused'] as RpmMode[]).map((mode) => {
              const active = rpmMode === mode;
              const label = mode === '33' ? '33⅓ RPM' : mode === '45' ? '45 RPM' : 'Stop';
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onRpmChange(mode)}
                  className={`px-2.5 py-1 text-xs font-mono tabular-nums rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E09F3E] ${
                    active
                      ? 'bg-[#E09F3E] text-[#101216] font-semibold'
                      : 'text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
