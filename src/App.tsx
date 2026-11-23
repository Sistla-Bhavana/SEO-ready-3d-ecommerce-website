import { useCallback, useEffect, useState } from 'react';
import { EngineeringSection } from './components/EngineeringSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroShowcase } from './components/HeroShowcase';
import { ProofAndFaqSection } from './components/ProofAndFaqSection';
import { ReservationSection } from './components/ReservationSection';
import { SeoInspectorModal } from './components/SeoInspectorModal';
import { SpecificationsSection } from './components/SpecificationsSection';
import {
  CameraPresetId,
  FinishPresetId,
  PartId,
  RpmMode,
} from './data/productData';
import { useSeoMetadata } from './seo/useSeoMetadata';

export default function App() {
  const [finishId, setFinishId] = useState<FinishPresetId>('obsidian');
  const [explodeAmount, setExplodeAmount] = useState<number>(0);
  const [rpmMode, setRpmMode] = useState<RpmMode>(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return 'paused';
    }
    return '33';
  });
  const [cameraPreset, setCameraPreset] = useState<CameraPresetId>('studio');
  const [cameraPresetNonce, setCameraPresetNonce] = useState<number>(0);
  const [zoomCommand, setZoomCommand] = useState<{
    direction: 'in' | 'out';
    nonce: number;
  } | null>(null);
  const [selectedPart, setSelectedPart] = useState<PartId | null>(null);
  const [seoModalOpen, setSeoModalOpen] = useState(false);

  const { canonicalUrl, jsonLdString } = useSeoMetadata(finishId);

  const handleCameraPreset = useCallback((preset: CameraPresetId) => {
    setCameraPreset(preset);
    setCameraPresetNonce((n) => n + 1);
  }, []);

  const handleZoom = useCallback((direction: 'in' | 'out') => {
    setZoomCommand((prev) => ({
      direction,
      nonce: (prev?.nonce ?? 0) + 1,
    }));
  }, []);

  const handleFocusSubsystem = useCallback(
    (preset: CameraPresetId, explode: number) => {
      setExplodeAmount(explode);
      setCameraPreset(preset);
      setCameraPresetNonce((n) => n + 1);
    },
    [],
  );

  // Close SEO Inspector Modal on Escape key
  useEffect(() => {
    if (!seoModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSeoModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [seoModalOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#111316]">
      <Header />

      <main className="flex-1">
        <HeroShowcase
          finishId={finishId}
          onFinishChange={setFinishId}
          explodeAmount={explodeAmount}
          onExplodeChange={setExplodeAmount}
          rpmMode={rpmMode}
          onRpmChange={setRpmMode}
          cameraPreset={cameraPreset}
          cameraPresetNonce={cameraPresetNonce}
          onCameraPreset={handleCameraPreset}
          zoomCommand={zoomCommand}
          onZoom={handleZoom}
          selectedPart={selectedPart}
          onSelectPart={setSelectedPart}
        />

        <EngineeringSection onFocusSubsystem={handleFocusSubsystem} />

        <SpecificationsSection
          selectedFinish={finishId}
          onSelectFinish={setFinishId}
        />

        <ProofAndFaqSection />

        <ReservationSection
          selectedFinish={finishId}
          onSelectFinish={setFinishId}
        />
      </main>

      <Footer onOpenSeoInspector={() => setSeoModalOpen(true)} />

      <SeoInspectorModal
        isOpen={seoModalOpen}
        onClose={() => setSeoModalOpen(false)}
        canonicalUrl={canonicalUrl}
        jsonLdString={jsonLdString}
      />
    </div>
  );
}
