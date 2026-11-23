import * as THREE from 'three';

export interface TurntableTextureSet {
  vinylAlbedo: THREE.CanvasTexture;
  vinylRoughness: THREE.CanvasTexture;
  strobeRim: THREE.CanvasTexture;
  brushedMetalRoughness: THREE.CanvasTexture;
  counterweightDial: THREE.CanvasTexture;
  deckPlate: THREE.CanvasTexture;
  contactShadow: THREE.CanvasTexture;
  dispose: () => void;
}

export function createTurntableTextures(maxAnisotropy: number): TurntableTextureSet {
  const aniso = Math.max(1, Math.min(maxAnisotropy, 16));

  // 1. Vinyl LP Albedo (Concentric Microgrooves + Printed Center Label)
  const vinylCanvas = document.createElement('canvas');
  vinylCanvas.width = 1024;
  vinylCanvas.height = 1024;
  const vCtx = vinylCanvas.getContext('2d')!;
  const cx = 512;
  const cy = 512;

  vCtx.fillStyle = '#0c0d10';
  vCtx.fillRect(0, 0, 1024, 1024);

  // Subtle concentric groove rings
  for (let r = 178; r <= 496; r += 2.2) {
    const isBandGap =
      (r > 235 && r < 244) ||
      (r > 312 && r < 321) ||
      (r > 395 && r < 404) ||
      (r > 466 && r < 474);
    vCtx.beginPath();
    vCtx.arc(cx, cy, r, 0, Math.PI * 2);
    if (isBandGap) {
      vCtx.strokeStyle = 'rgba(38, 42, 50, 0.75)';
      vCtx.lineWidth = 1.6;
    } else {
      const shade = 14 + Math.floor((Math.sin(r * 0.7) + 1) * 7);
      vCtx.strokeStyle = `rgb(${shade}, ${shade + 1}, ${shade + 3})`;
      vCtx.lineWidth = 1.1;
    }
    vCtx.stroke();
  }

  // Center Label (radius 170px)
  const labelGrad = vCtx.createRadialGradient(cx, cy, 18, cx, cy, 172);
  labelGrad.addColorStop(0, '#c89b54');
  labelGrad.addColorStop(0.94, '#b2843e');
  labelGrad.addColorStop(1, '#7a5926');
  vCtx.beginPath();
  vCtx.arc(cx, cy, 170, 0, Math.PI * 2);
  vCtx.fillStyle = labelGrad;
  vCtx.fill();

  // Inner dark ring & typography on label
  vCtx.beginPath();
  vCtx.arc(cx, cy, 152, 0, Math.PI * 2);
  vCtx.strokeStyle = '#181a1f';
  vCtx.lineWidth = 2;
  vCtx.stroke();

  vCtx.fillStyle = '#14161a';
  vCtx.textAlign = 'center';
  vCtx.font = '600 22px "Outfit", sans-serif';
  vCtx.fillText('VELD AUDIO', cx, cy - 72);
  vCtx.font = '500 13px "IBM Plex Mono", monospace';
  vCtx.fillText('REFERENCE TEST PRESSING', cx, cy - 48);
  vCtx.fillText('33 1/3 RPM  ·  SIDE A', cx, cy + 72);
  vCtx.fillText('STEREO  ·  180G VIRGIN VINYL', cx, cy + 96);

  // Spindle hole cutout accent
  vCtx.beginPath();
  vCtx.arc(cx, cy, 16, 0, Math.PI * 2);
  vCtx.fillStyle = '#101216';
  vCtx.fill();

  const vinylAlbedo = new THREE.CanvasTexture(vinylCanvas);
  vinylAlbedo.colorSpace = THREE.SRGBColorSpace;
  vinylAlbedo.anisotropy = aniso;

  // 2. Vinyl Roughness Map (Linear NoColorSpace)
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = 512;
  roughCanvas.height = 512;
  const rCtx = roughCanvas.getContext('2d')!;
  rCtx.fillStyle = '#383838'; // glossy vinyl grooves
  rCtx.fillRect(0, 0, 512, 512);

  for (let r = 90; r <= 248; r += 2) {
    const isBandGap =
      (r > 118 && r < 122) ||
      (r > 156 && r < 160) ||
      (r > 198 && r < 202) ||
      (r > 233 && r < 237);
    rCtx.beginPath();
    rCtx.arc(256, 256, r, 0, Math.PI * 2);
    rCtx.strokeStyle = isBandGap ? '#1e1e1e' : '#585858';
    rCtx.lineWidth = 1.2;
    rCtx.stroke();
  }
  // Matte paper center label
  rCtx.beginPath();
  rCtx.arc(256, 256, 86, 0, Math.PI * 2);
  rCtx.fillStyle = '#cfcfcf';
  rCtx.fill();

  const vinylRoughness = new THREE.CanvasTexture(roughCanvas);
  vinylRoughness.anisotropy = aniso;

  // 3. Strobe Platter Rim Texture (sRGB)
  const strobeCanvas = document.createElement('canvas');
  strobeCanvas.width = 1024;
  strobeCanvas.height = 128;
  const sCtx = strobeCanvas.getContext('2d')!;
  sCtx.fillStyle = '#d4a85c';
  sCtx.fillRect(0, 0, 1024, 128);

  // Horizontal brushed grain streaks
  for (let y = 0; y < 128; y += 2) {
    const alpha = 0.04 + (y % 6 === 0 ? 0.05 : 0);
    sCtx.fillStyle = y % 4 === 0 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    sCtx.fillRect(0, y, 1024, 1);
  }

  // Machined strobe dot band along lower quarter of platter rim
  sCtx.fillStyle = '#1b1d22';
  sCtx.fillRect(0, 74, 1024, 34);
  for (let x = 8; x < 1024; x += 16) {
    // Major 33.3 row
    sCtx.beginPath();
    sCtx.arc(x, 86, 3.1, 0, Math.PI * 2);
    sCtx.fillStyle = '#e5c17d';
    sCtx.fill();

    // Minor 45 row
    if (x % 32 === 8) {
      sCtx.beginPath();
      sCtx.arc(x + 8, 99, 2.1, 0, Math.PI * 2);
      sCtx.fillStyle = '#b99658';
      sCtx.fill();
    }
  }

  const strobeRim = new THREE.CanvasTexture(strobeCanvas);
  strobeRim.colorSpace = THREE.SRGBColorSpace;
  strobeRim.wrapS = THREE.RepeatWrapping;
  strobeRim.wrapT = THREE.ClampToEdgeWrapping;
  strobeRim.anisotropy = aniso;

  // 4. Brushed Metal Linear Roughness Map (NoColorSpace)
  const metalCanvas = document.createElement('canvas');
  metalCanvas.width = 256;
  metalCanvas.height = 256;
  const mCtx = metalCanvas.getContext('2d')!;
  mCtx.fillStyle = '#808080';
  mCtx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y++) {
    const val = 105 + Math.floor(Math.sin(y * 1.9) * 18 + ((y * 37) % 24));
    mCtx.fillStyle = `rgb(${val},${val},${val})`;
    mCtx.fillRect(0, y, 256, 1);
  }
  const brushedMetalRoughness = new THREE.CanvasTexture(metalCanvas);
  brushedMetalRoughness.wrapS = THREE.RepeatWrapping;
  brushedMetalRoughness.wrapT = THREE.RepeatWrapping;
  brushedMetalRoughness.repeat.set(3, 3);
  brushedMetalRoughness.anisotropy = aniso;

  // 5. Counterweight Tracking Force Gram Dial (sRGB)
  const dialCanvas = document.createElement('canvas');
  dialCanvas.width = 512;
  dialCanvas.height = 128;
  const dCtx = dialCanvas.getContext('2d')!;
  dCtx.fillStyle = '#c89b54';
  dCtx.fillRect(0, 0, 512, 128);
  dCtx.fillStyle = '#181a1f';
  dCtx.fillRect(0, 0, 512, 14);
  dCtx.fillRect(0, 114, 512, 14);

  const ticks = ['0.0', '0.5', '1.0', '1.5', '2.0', '2.5', '3.0'];
  dCtx.strokeStyle = '#16181c';
  dCtx.fillStyle = '#16181c';
  dCtx.font = '600 18px "IBM Plex Mono", monospace';
  dCtx.textAlign = 'center';
  for (let i = 0; i < 35; i++) {
    const x = (i / 35) * 512 + 12;
    const isMajor = i % 5 === 0;
    dCtx.lineWidth = isMajor ? 2.5 : 1.2;
    dCtx.beginPath();
    dCtx.moveTo(x, 22);
    dCtx.lineTo(x, isMajor ? 56 : 40);
    dCtx.stroke();
    if (isMajor) {
      const label = ticks[Math.floor(i / 5) % ticks.length];
      dCtx.fillText(label, x, 86);
    }
  }
  const counterweightDial = new THREE.CanvasTexture(dialCanvas);
  counterweightDial.colorSpace = THREE.SRGBColorSpace;
  counterweightDial.wrapS = THREE.RepeatWrapping;
  counterweightDial.anisotropy = aniso;

  // 6. Control Deck Plate Engraved Markings (sRGB)
  const deckCanvas = document.createElement('canvas');
  deckCanvas.width = 512;
  deckCanvas.height = 192;
  const pCtx = deckCanvas.getContext('2d')!;
  pCtx.fillStyle = '#14161b';
  pCtx.fillRect(0, 0, 512, 192);
  pCtx.strokeStyle = '#2d313c';
  pCtx.lineWidth = 3;
  pCtx.strokeRect(8, 8, 496, 176);

  pCtx.fillStyle = '#d4d6dc';
  pCtx.font = '600 22px "Outfit", sans-serif';
  pCtx.fillText('VELD AUDIO', 28, 48);
  pCtx.fillStyle = '#c89b54';
  pCtx.font = '500 16px "IBM Plex Mono", monospace';
  pCtx.fillText('SERIES R1 · QUARTZ PLL', 28, 76);

  pCtx.fillStyle = '#9ca3af';
  pCtx.font = '500 15px "IBM Plex Mono", monospace';
  pCtx.fillText('33⅓        45         STOP', 190, 148);

  const deckPlate = new THREE.CanvasTexture(deckCanvas);
  deckPlate.colorSpace = THREE.SRGBColorSpace;
  deckPlate.anisotropy = aniso;

  // 7. Contact Shadow Radial Falloff
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const shCtx = shadowCanvas.getContext('2d')!;
  const shGrad = shCtx.createRadialGradient(128, 128, 12, 128, 128, 126);
  shGrad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
  shGrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.34)');
  shGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  shCtx.fillStyle = shGrad;
  shCtx.fillRect(0, 0, 256, 256);

  const contactShadow = new THREE.CanvasTexture(shadowCanvas);

  return {
    vinylAlbedo,
    vinylRoughness,
    strobeRim,
    brushedMetalRoughness,
    counterweightDial,
    deckPlate,
    contactShadow,
    dispose: () => {
      vinylAlbedo.dispose();
      vinylRoughness.dispose();
      strobeRim.dispose();
      brushedMetalRoughness.dispose();
      counterweightDial.dispose();
      deckPlate.dispose();
      contactShadow.dispose();
    },
  };
}
