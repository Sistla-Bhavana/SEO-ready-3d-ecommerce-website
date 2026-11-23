import {
  CameraPresetId,
  FINISH_VARIANTS,
  FinishPresetId,
  PartId,
  RpmMode,
} from '../data/productData';
import { TurntableViewport } from '../three/TurntableViewport';
import { ControlDock } from './ControlDock';

interface HeroShowcaseProps {
  finishId: FinishPresetId;
  onFinishChange: (finishId: FinishPresetId) => void;
  explodeAmount: number;
  onExplodeChange: (val: number) => void;
  rpmMode: RpmMode;
  onRpmChange: (mode: RpmMode) => void;
  cameraPreset: CameraPresetId;
  cameraPresetNonce: number;
  onCameraPreset: (preset: CameraPresetId) => void;
  zoomCommand: { direction: 'in' | 'out'; nonce: number } | null;
  onZoom: (dir: 'in' | 'out') => void;
  selectedPart: PartId | null;
  onSelectPart: (partId: PartId | null) => void;
}

export function HeroShowcase({
  finishId,
  onFinishChange,
  explodeAmount,
  onExplodeChange,
  rpmMode,
  onRpmChange,
  cameraPreset,
  cameraPresetNonce,
  onCameraPreset,
  zoomCommand,
  onZoom,
  selectedPart,
  onSelectPart,
}: HeroShowcaseProps) {
  const activeVariant =
    FINISH_VARIANTS.find((v) => v.id === finishId) ?? FINISH_VARIANTS[0];

  return (
    <section
      id="showcase"
      aria-label="Veld Audio R1 Interactive 3D Showcase"
      className="relative w-full h-[78vh] min-h-[580px] max-h-[820px] bg-[#101216] overflow-hidden border-b border-[#222630]"
    >
      {/* Isolated WebGL 3D Canvas */}
      <TurntableViewport
        finishId={finishId}
        explodeAmount={explodeAmount}
        rpmMode={rpmMode}
        cameraPreset={cameraPreset}
        cameraPresetNonce={cameraPresetNonce}
        zoomCommand={zoomCommand}
        selectedPart={selectedPart}
        onSelectPart={onSelectPart}
      />

      {/* Semantic DOM Hero Headline Overlay (Top-Left, non-occluding) */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <div className="max-w-[1200px] mx-auto px-6 pt-8 sm:pt-10">
          <div className="max-w-md">
            <p className="text-xs font-medium tracking-wide text-[#D4A85C] mb-2.5">
              Direct-Drive Reference · {activeVariant.name} ·{' '}
              <span className="font-mono tabular-nums">${activeVariant.priceUsd.toLocaleString()}</span>
            </p>
            <h1
              className="font-display font-semibold tracking-tight text-[#F8FAFC] leading-[1.08] mb-3"
              style={{ fontSize: 'clamp(2rem, 3.6vw, 3.15rem)', textWrap: 'balance' }}
            >
              Precision analog playback, machined from solid billet.
            </h1>
            <p className="text-sm sm:text-[15px] text-[#B8C0CC] leading-relaxed mb-5 max-w-[42ch]">
              A 14.2 kg isolated turntable engineered for zero-cogging rotational stability and archival mastering fidelity.
            </p>
            <div className="flex flex-wrap items-center gap-4 pointer-events-auto">
              <a
                href="#engineering"
                className="px-5 py-2.5 text-xs font-semibold text-[#101216] bg-[#E09F3E] hover:bg-[#ebb159] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Explore Engineering
              </a>
              <span className="text-xs text-[#9CA3AF] whitespace-nowrap">
                Drag to orbit · Click any part to inspect
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Bottom Control Dock */}
      <ControlDock
        finishId={finishId}
        onFinishChange={onFinishChange}
        explodeAmount={explodeAmount}
        onExplodeChange={onExplodeChange}
        rpmMode={rpmMode}
        onRpmChange={onRpmChange}
        cameraPreset={cameraPreset}
        onCameraPreset={onCameraPreset}
        onZoom={onZoom}
        selectedPart={selectedPart}
        onClearPart={() => onSelectPart(null)}
      />
    </section>
  );
}
