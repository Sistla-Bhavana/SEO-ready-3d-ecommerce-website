export type FinishPresetId = 'obsidian' | 'champagne' | 'nordic';
export type CameraPresetId = 'studio' | 'tonearm' | 'platter' | 'profile';
export type RpmMode = '33' | '45' | 'paused';
export type PartId =
  | 'plinth'
  | 'platter'
  | 'tonearm'
  | 'vinyl'
  | 'clamp'
  | 'motor'
  | 'cover'
  | 'feet';

export interface FinishVariant {
  id: FinishPresetId;
  name: string;
  sku: string;
  priceUsd: number;
  swatchHex: string;
  secondaryHex: string;
  plinthColor: number;
  plinthRoughness: number;
  plinthMetalness: number;
  platterColor: number;
  platterRoughness: number;
  platterMetalness: number;
  tonearmColor: number;
  summary: string;
}

export const FINISH_VARIANTS: FinishVariant[] = [
  {
    id: 'obsidian',
    name: 'Obsidian Anodized',
    sku: 'VA-R1-OBS',
    priceUsd: 4800,
    swatchHex: '#1C1F26',
    secondaryHex: '#C89B54',
    plinthColor: 0x1a1d24,
    plinthRoughness: 0.42,
    plinthMetalness: 0.82,
    platterColor: 0xd4a85c,
    platterRoughness: 0.2,
    platterMetalness: 0.96,
    tonearmColor: 0x262a33,
    summary: 'Bead-blasted hard-anodized 6061-T6 chassis paired with raw brushed C36000 brass platter.',
  },
  {
    id: 'champagne',
    name: 'Champagne Titanium',
    sku: 'VA-R1-CHM',
    priceUsd: 5000,
    swatchHex: '#9A968E',
    secondaryHex: '#7A6852',
    plinthColor: 0x8e8a82,
    plinthRoughness: 0.34,
    plinthMetalness: 0.88,
    platterColor: 0xb39164,
    platterRoughness: 0.22,
    platterMetalness: 0.94,
    tonearmColor: 0x1e2026,
    summary: 'Satin titanium-anodized billet plinth with warm bronze-tinted flywheel and matte graphite arm.',
  },
  {
    id: 'nordic',
    name: 'Nordic Ceramic',
    sku: 'VA-R1-NRD',
    priceUsd: 5200,
    swatchHex: '#DCDAD3',
    secondaryHex: '#525760',
    plinthColor: 0xd9d7d0,
    plinthRoughness: 0.62,
    plinthMetalness: 0.14,
    platterColor: 0xaab0ba,
    platterRoughness: 0.18,
    platterMetalness: 0.95,
    tonearmColor: 0x3b4049,
    summary: 'Micro-arc ceramic-coated aluminum plinth matched with precision-turned stainless steel platter.',
  },
];

export interface PartInspectionInfo {
  id: PartId;
  title: string;
  subsystem: string;
  material: string;
  specHighlight: string;
  description: string;
}

export const PART_DETAILS: Record<PartId, PartInspectionInfo> = {
  plinth: {
    id: 'plinth',
    title: 'Constrained-Layer CNC Plinth',
    subsystem: 'Chassis Architecture',
    material: '6061-T6 Billet Aluminum + Sorbothane Core',
    specHighlight: '48 mm solid profile · 7.1 kg',
    description:
      'Milled from a single 22 kg aerospace aluminum block with internal viscoelastic damping pockets that dissipate floor-borne resonance below 12 Hz.',
  },
  platter: {
    id: 'platter',
    title: 'High-Inertia Brass Flywheel Platter',
    subsystem: 'Rotational Mass',
    material: 'C36000 Free-Machining Brass',
    specHighlight: '6.4 kg · 308 mm diameter',
    description:
      'Dynamically balanced to G0.4 tolerance with optical strobe index dots and an integrated 4 mm vulcanized elastomer mat.',
  },
  tonearm: {
    id: 'tonearm',
    title: '12-Inch Gimballed S-Curve Tonearm',
    subsystem: 'Tracking Geometry',
    material: 'Grade 5 Titanium & Carbon Composite',
    specHighlight: '305 mm effective length · 0.42° max error',
    description:
      'ABEC-9 hybrid ceramic gimbal bearings paired with a laser-etched brass tracking-force counterweight and calibrated anti-skate ring.',
  },
  vinyl: {
    id: 'vinyl',
    title: '180g Reference Test Pressing',
    subsystem: 'Acoustic Media',
    material: 'Virgin Black Compound Vinyl',
    specHighlight: '33⅓ / 45 RPM quartz-locked',
    description:
      'Seated flush against the damped platter surface for zero micro-chatter and clean harmonic decay across inner grooves.',
  },
  clamp: {
    id: 'clamp',
    title: 'Knurled Record Stabilizer Puck',
    subsystem: 'Coupling Interface',
    material: 'Anodized Brass & Delrin Collar',
    specHighlight: '420 g · Non-marring contact',
    description:
      'Flattens minor vinyl warps against the platter mat without introducing bearing drag or spindle eccentricity.',
  },
  motor: {
    id: 'motor',
    title: 'Isolated Coreless Drive Pod',
    subsystem: 'Propulsion & Clock',
    material: 'Turned Brass Housing · Optical Encoder',
    specHighlight: '0.018% WRMS · 3,600 PPR feedback',
    description:
      'Slotless iron-free stator eliminates magnetic cogging while the optical phase-locked loop corrects speed drift 1,200 times per second.',
  },
  cover: {
    id: 'cover',
    title: 'Smoked Optical Acrylic Cover',
    subsystem: 'Environmental Shield',
    material: 'Cast UV-Stabilized Acrylic',
    specHighlight: '6 mm beveled edge · Friction hinge',
    description:
      'Optically clear cast acrylic shield engineered to lift cleanly off its damped rear hinge pins during critical mastering sessions.',
  },
  feet: {
    id: 'feet',
    title: 'Three-Stage Isolation Cones',
    subsystem: 'Mechanical Grounding',
    material: 'Turned Brass & Elastomer Rings',
    specHighlight: '3.8 Hz resonant cutoff · ±6 mm level',
    description:
      'Micro-threaded brass leveling feet decoupled with dual-durometer elastomer rings isolate the chassis from structural building vibration.',
  },
};

export interface EngineeringPillar {
  id: string;
  index: string;
  title: string;
  headline: string;
  description: string;
  metrics: { label: string; value: string }[];
}

export const ENGINEERING_PILLARS: EngineeringPillar[] = [
  {
    id: 'plinth',
    index: '01',
    title: 'Plinth & Isolation',
    headline: 'Monolithic 5-axis chassis with viscoelastic core damping',
    description:
      'Conventional hollow plinths act as acoustic drums that color midrange transients. The R1 chassis is pocket-milled from solid 6061-T6 billet aluminum and bonded to a constrained internal brass plate via dual-layer elastomer.',
    metrics: [
      { label: 'Total Chassis Mass', value: '14.2 kg' },
      { label: 'Natural Resonance', value: '< 11 Hz' },
      { label: 'CNC Tolerance', value: '±0.015 mm' },
    ],
  },
  {
    id: 'drive',
    index: '02',
    title: 'Coreless Direct-Drive',
    headline: 'Zero-cogging brushless propulsion locked by optical encoding',
    description:
      'An iron-free twin-stator motor eliminates torque ripple completely. A 3,600-pulse-per-revolution optical disc monitors platter velocity every 0.83 milliseconds, holding pitch within 0.002% under heavy stylus modulation.',
    metrics: [
      { label: 'Wow & Flutter', value: '0.018% WRMS' },
      { label: 'Rumble S/N', value: '-86 dB' },
      { label: 'Startup Torque', value: '3.2 kg·cm' },
    ],
  },
  {
    id: 'platter',
    index: '03',
    title: 'Brass Flywheel',
    headline: '6.4 kg CNC-turned C36000 brass platter for rotational inertia',
    description:
      'Machined from solid C36000 brass and balanced dynamically across two planes, the 308 mm flywheel stores mechanical momentum so transient piano attacks and sub-bass fundamentals never sag.',
    metrics: [
      { label: 'Platter Weight', value: '6.4 kg' },
      { label: 'Platter Diameter', value: '308 mm' },
      { label: 'Runout Tolerance', value: '< 0.01 mm' },
    ],
  },
  {
    id: 'tonearm',
    index: '04',
    title: '12-Inch Titanium Arm',
    headline: 'Low-error S-curve geometry on ABEC-9 ceramic gimbal bearings',
    description:
      'The extended 305 mm effective length reduces lateral tracking angle distortion across inner record grooves by 38% compared to standard 9-inch arms, while Grade 5 titanium damps high-frequency tube ringing.',
    metrics: [
      { label: 'Effective Length', value: '305 mm' },
      { label: 'Bearing Friction', value: '< 5 mg' },
      { label: 'Tracking Error', value: '0.42° max' },
    ],
  },
];

export interface SpecRow {
  category: 'drive' | 'tonearm' | 'chassis';
  parameter: string;
  value: string;
  notes: string;
}

export const TECHNICAL_SPECS: SpecRow[] = [
  {
    category: 'drive',
    parameter: 'Drive Topology',
    value: 'Coreless Brushless Direct-Drive',
    notes: 'Optical 3,600 PPR phase-locked loop',
  },
  {
    category: 'drive',
    parameter: 'Selectable Speeds',
    value: '33⅓ RPM / 45 RPM',
    notes: 'Quartz reference ±0.002% stability',
  },
  {
    category: 'drive',
    parameter: 'Wow & Flutter',
    value: '0.018% WRMS',
    notes: 'Measured JIS C5521 unweighted',
  },
  {
    category: 'drive',
    parameter: 'Signal-to-Noise (Rumble)',
    value: '-86 dB',
    notes: 'IEC 98 weighted',
  },
  {
    category: 'drive',
    parameter: 'Platter Mass & Alloy',
    value: '6.4 kg · C36000 Brass',
    notes: '308 mm diameter with 4 mm elastomer mat',
  },
  {
    category: 'tonearm',
    parameter: 'Effective Length / Overhang',
    value: '305 mm / 13.2 mm',
    notes: '12-inch S-curve Grade 5 titanium wand',
  },
  {
    category: 'tonearm',
    parameter: 'Gimbal Bearing Friction',
    value: '< 5 mg (Vertical & Lateral)',
    notes: 'Pre-loaded ABEC-9 silicon nitride ceramic',
  },
  {
    category: 'tonearm',
    parameter: 'Tracking Force Range',
    value: '0.0 – 3.5 g (0.05 g steps)',
    notes: 'Laser-etched brass counterweight dial',
  },
  {
    category: 'tonearm',
    parameter: 'Cartridge Compatibility',
    value: '5 g – 18 g (Headshell included)',
    notes: 'Standard SME-type bayonet mount',
  },
  {
    category: 'chassis',
    parameter: 'Plinth Construction',
    value: '6061-T6 Billet Aluminum',
    notes: '5-axis CNC milled with elastomer core',
  },
  {
    category: 'chassis',
    parameter: 'Analog Outputs',
    value: 'Balanced XLR & Gold RCA',
    notes: 'Dedicated star-ground binding post',
  },
  {
    category: 'chassis',
    parameter: 'Dimensions & Net Weight',
    value: '464 × 368 × 148 mm · 14.2 kg',
    notes: 'Includes smoked cast acrylic dust cover',
  },
];

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  studio: string;
  outcome: string;
}

export const STUDIO_TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      'Swapping our archival transfer bay to the Veld Audio R1 dropped our low-frequency mechanical noise floor by 4.2 dB and made inner-groove sibilance disappear on classical lacquer acetates.',
    author: 'Henrik Lindqvist',
    role: 'Chief Mastering Engineer',
    studio: 'Nordhavn Mastering, Copenhagen',
    outcome: '-4.2 dB floor noise reduction across 180 archival transfers',
  },
  {
    quote:
      'You expect a 6.4 kg brass platter to take forever to stabilize, yet the coreless PLL locks 33⅓ RPM in 1.1 seconds with zero pitch wander on sustained solo piano.',
    author: 'Claire Deschamps',
    role: 'Vinyl Cutting & Reference Engineer',
    studio: 'Atelier Sonore, Lyon',
    outcome: '0.018% measured WRMS stability on studio test lacquers',
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Does the Veld Audio R1 include a moving-coil phono cartridge?',
    answer:
      'Every R1 ships standard with a machined magnesium SME-mount headshell, precision alignment protractor, and calibrated 420 g record stabilizer clamp. Buyers may pair their preferred low-output MC or MM cartridge, or add a factory-mounted reference MC cartridge during reservation.',
  },
  {
    question: 'How does the coreless direct-drive motor eliminate magnetic cogging?',
    answer:
      'Traditional direct-drive motors wrap copper coils around iron stator cores, creating discrete magnetic attraction pulses as rotor poles pass. The R1 uses an air-core twin-stator coil geometry with zero iron in the magnetic gap, delivering completely continuous torque governed by a 3,600 PPR optical encoder.',
  },
  {
    question: 'Can the turntable be auditioned in person before allocation?',
    answer:
      'Yes. Private one-hour studio auditions are available at our Copenhagen, Zurich, and Portland partner listening rooms. Select Studio Audition in the reservation form below to schedule a session with your own test pressings.',
  },
  {
    question: 'What warranty and calibration support are included?',
    answer:
      'Each R1 carries a 10-year transferable mechanical and motor warranty. Every chassis is serialized, dynamically balanced, and accompanied by a signed optical wow-and-flutter plot measured on its specific platter prior to crating.',
  },
];
