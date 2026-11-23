import * as THREE from 'three';
import { FINISH_VARIANTS, FinishPresetId, PartId, RpmMode } from '../data/productData';
import { TurntableTextureSet } from './proceduralTextures';

export interface TurntableHandle {
  root: THREE.Group;
  interactables: THREE.Object3D[];
  applyFinish: (finishId: FinishPresetId) => void;
  update: (
    delta: number,
    explodeTarget: number,
    rpmMode: RpmMode,
    selectedPart: PartId | null,
  ) => boolean;
  dispose: () => void;
}

function tagPart(obj: THREE.Object3D, partId: PartId, interactables: THREE.Object3D[]) {
  obj.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.layers.enable(1);
      child.userData.partId = partId;
      interactables.push(child);
    }
  });
}

function createRoundedRectShape(width: number, depth: number, radius: number): THREE.Shape {
  const w = width / 2;
  const d = depth / 2;
  const r = Math.min(radius, w, d);
  const shape = new THREE.Shape();
  shape.moveTo(-w + r, -d);
  shape.lineTo(w - r, -d);
  shape.quadraticCurveTo(w, -d, w, -d + r);
  shape.lineTo(w, d - r);
  shape.quadraticCurveTo(w, d, w - r, d);
  shape.lineTo(-w + r, d);
  shape.quadraticCurveTo(-w, d, -w, d - r);
  shape.lineTo(-w, -d + r);
  shape.quadraticCurveTo(-w, -d, -w + r, -d);
  return shape;
}

export function createTurntableAssembly(
  textures: TurntableTextureSet,
  isSoftwareGl: boolean,
): TurntableHandle {
  const root = new THREE.Group();
  const interactables: THREE.Object3D[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometriesToDispose.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materialsToDispose.push(m);
    return m;
  };

  // Shared calibrated PBR materials (mutable colors for finish switching)
  const initialFinish = FINISH_VARIANTS[0];

  const plinthMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: initialFinish.plinthColor,
      roughness: initialFinish.plinthRoughness,
      metalness: initialFinish.plinthMetalness,
      roughnessMap: textures.brushedMetalRoughness,
      clearcoat: 0.12,
      clearcoatRoughness: 0.45,
    }),
  );

  const elastomerMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x15171c,
      roughness: 0.86,
      metalness: 0.04,
    }),
  );

  const brassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: initialFinish.platterColor,
      roughness: initialFinish.platterRoughness,
      metalness: initialFinish.platterMetalness,
      anisotropy: 0.78,
      anisotropyRotation: Math.PI / 2,
      roughnessMap: textures.brushedMetalRoughness,
    }),
  );

  const platterRimMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: textures.strobeRim,
      roughness: 0.24,
      metalness: 0.92,
      anisotropy: 0.65,
    }),
  );

  const tonearmMetalMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: initialFinish.tonearmColor,
      roughness: 0.28,
      metalness: 0.88,
      clearcoat: 0.2,
    }),
  );

  const chromeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe2e5ea,
      roughness: 0.14,
      metalness: 0.98,
    }),
  );

  const vinylMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      map: textures.vinylAlbedo,
      roughnessMap: textures.vinylRoughness,
      roughness: 0.36,
      metalness: 0.08,
      clearcoat: 0.55,
      clearcoatRoughness: 0.22,
    }),
  );

  const acrylicCoverMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xdbe4ef,
      roughness: 0.08,
      metalness: 0.0,
      transmission: isSoftwareGl ? 0 : 0.88,
      transparent: true,
      opacity: isSoftwareGl ? 0.28 : 1,
      ior: 1.49,
      thickness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      depthWrite: false,
    }),
  );

  const deckPlateMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: textures.deckPlate,
      roughness: 0.48,
      metalness: 0.45,
    }),
  );

  const dialMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: textures.counterweightDial,
      roughness: 0.28,
      metalness: 0.88,
    }),
  );

  // =========================================================================
  // 1. ISOLATION FEET (4 bottom-center-pivoted CNC brass & elastomer cones)
  // =========================================================================
  const feetGroup = new THREE.Group();
  const footProfile = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.14, 0.0),
    new THREE.Vector2(0.18, 0.04),
    new THREE.Vector2(0.21, 0.05),
    new THREE.Vector2(0.21, 0.11),
    new THREE.Vector2(0.16, 0.14),
    new THREE.Vector2(0.16, 0.2),
    new THREE.Vector2(0.0, 0.2),
  ];
  const footGeo = trackGeo(new THREE.LatheGeometry(footProfile, 32));
  const oRingGeo = trackGeo(new THREE.TorusGeometry(0.185, 0.018, 12, 32));

  const footPositions: [number, number][] = [
    [-1.85, -1.35],
    [1.85, -1.35],
    [-1.85, 1.35],
    [1.85, 1.35],
  ];

  for (const [fx, fz] of footPositions) {
    const footUnit = new THREE.Group();
    footUnit.position.set(fx, 0, fz);

    const cone = new THREE.Mesh(footGeo, brassMat);
    cone.castShadow = true;
    cone.receiveShadow = true;

    const ring = new THREE.Mesh(oRingGeo, elastomerMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.08;

    footUnit.add(cone, ring);
    feetGroup.add(footUnit);
  }
  tagPart(feetGroup, 'feet', interactables);
  root.add(feetGroup);

  // =========================================================================
  // 2. CONSTRAINED-LAYER CNC PLINTH
  // =========================================================================
  const plinthGroup = new THREE.Group();
  plinthGroup.position.set(0, 0.2, 0);

  // Lower elastomer sub-layer
  const subShape = createRoundedRectShape(4.42, 3.36, 0.14);
  const subPlinthGeo = trackGeo(
    new THREE.ExtrudeGeometry(subShape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    }),
  );
  subPlinthGeo.rotateX(-Math.PI / 2);
  const subPlinthMesh = new THREE.Mesh(subPlinthGeo, elastomerMat);
  subPlinthMesh.position.y = 0.02;
  subPlinthMesh.castShadow = true;
  subPlinthMesh.receiveShadow = true;

  // Main CNC aluminum billet plinth
  const mainShape = createRoundedRectShape(4.56, 3.48, 0.16);
  const mainPlinthGeo = trackGeo(
    new THREE.ExtrudeGeometry(mainShape, {
      depth: 0.34,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.035,
      bevelSegments: 4,
    }),
  );
  mainPlinthGeo.rotateX(-Math.PI / 2);
  mainPlinthGeo.computeTangents();
  const mainPlinthMesh = new THREE.Mesh(mainPlinthGeo, plinthMat);
  mainPlinthMesh.position.y = 0.18;
  mainPlinthMesh.castShadow = true;
  mainPlinthMesh.receiveShadow = true;

  // Recessed platter well ring on plinth deck
  const wellGeo = trackGeo(new THREE.CylinderGeometry(1.52, 1.54, 0.04, 64));
  const wellMesh = new THREE.Mesh(wellGeo, elastomerMat);
  wellMesh.position.set(-0.48, 0.56, 0.04);
  wellMesh.receiveShadow = true;

  // Engraved control plate + tactile CNC switches
  const deckGeo = trackGeo(new THREE.BoxGeometry(1.16, 0.025, 0.44));
  const deckMesh = new THREE.Mesh(deckGeo, deckPlateMat);
  deckMesh.position.set(-1.52, 0.565, 1.32);

  const btnGeo = trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 0.04, 24));
  const btnPositions = [-1.72, -1.46, -1.2];
  for (const bx of btnPositions) {
    const btn = new THREE.Mesh(btnGeo, brassMat);
    btn.position.set(bx, 0.585, 1.41);
    btn.castShadow = true;
    plinthGroup.add(btn);
  }

  // Rear brass RCA & XLR output block
  const ioBlockGeo = trackGeo(new THREE.BoxGeometry(0.9, 0.22, 0.08));
  const ioBlock = new THREE.Mesh(ioBlockGeo, elastomerMat);
  ioBlock.position.set(0.95, 0.36, -1.75);
  const rcaJackGeo = trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 0.09, 16));
  rcaJackGeo.rotateX(Math.PI / 2);
  for (const rx of [0.7, 0.85, 1.05, 1.2]) {
    const jack = new THREE.Mesh(rcaJackGeo, brassMat);
    jack.position.set(rx, 0.36, -1.8);
    plinthGroup.add(jack);
  }

  plinthGroup.add(subPlinthMesh, mainPlinthMesh, wellMesh, deckMesh, ioBlock);
  tagPart(plinthGroup, 'plinth', interactables);
  root.add(plinthGroup);

  // =========================================================================
  // 3. ISOLATED CORELESS MOTOR POD & SILICONE BELT
  // =========================================================================
  const motorGroup = new THREE.Group();
  const motorPos = new THREE.Vector3(-1.82, 0.76, -1.16);

  const motorPodProfile = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.27, 0),
    new THREE.Vector2(0.28, 0.04),
    new THREE.Vector2(0.28, 0.34),
    new THREE.Vector2(0.24, 0.38),
    new THREE.Vector2(0.11, 0.38),
    new THREE.Vector2(0.11, 0.45),
    new THREE.Vector2(0.0, 0.45),
  ];
  const motorPodGeo = trackGeo(new THREE.LatheGeometry(motorPodProfile, 36));
  const motorPodMesh = new THREE.Mesh(motorPodGeo, brassMat);
  motorPodMesh.position.copy(motorPos);
  motorPodMesh.castShadow = true;

  const pulleyGeo = trackGeo(new THREE.CylinderGeometry(0.085, 0.085, 0.14, 24));
  const pulleyMesh = new THREE.Mesh(pulleyGeo, chromeMat);
  pulleyMesh.position.set(motorPos.x, motorPos.y + 0.48, motorPos.z);

  // Precision drive belt connecting motor pulley to sub-platter perimeter
  const beltPts: THREE.Vector3[] = [];
  const subCenter = new THREE.Vector3(-0.48, 0.86, 0.04);
  const subR = 0.72;
  const pulCenter = new THREE.Vector3(motorPos.x, 0.86, motorPos.z);
  const pulR = 0.095;
  for (let i = 0; i <= 24; i++) {
    const a = -0.35 * Math.PI + (i / 24) * Math.PI * 1.15;
    beltPts.push(
      new THREE.Vector3(
        subCenter.x + Math.cos(a) * subR,
        0.86,
        subCenter.z + Math.sin(a) * subR,
      ),
    );
  }
  for (let i = 0; i <= 12; i++) {
    const a = 0.8 * Math.PI + (i / 12) * Math.PI * 0.85;
    beltPts.push(
      new THREE.Vector3(
        pulCenter.x + Math.cos(a) * pulR,
        0.86,
        pulCenter.z + Math.sin(a) * pulR,
      ),
    );
  }
  const beltCurve = new THREE.CatmullRomCurve3(beltPts, true);
  const beltGeo = trackGeo(new THREE.TubeGeometry(beltCurve, 64, 0.015, 8, true));
  const beltMesh = new THREE.Mesh(beltGeo, elastomerMat);

  motorGroup.add(motorPodMesh, pulleyMesh, beltMesh);
  tagPart(motorGroup, 'motor', interactables);
  root.add(motorGroup);

  // =========================================================================
  // 4. PLATTER ASSEMBLY (Sub-platter, Brass Flywheel, Strobe Rim, Elastomer Mat)
  // =========================================================================
  const platterGroup = new THREE.Group();
  platterGroup.position.set(-0.48, 0.78, 0.04);

  // Inner Sub-platter & bearing housing
  const subPlatterGeo = trackGeo(new THREE.CylinderGeometry(0.72, 0.72, 0.14, 48));
  const subPlatterMesh = new THREE.Mesh(subPlatterGeo, tonearmMetalMat);
  subPlatterMesh.position.y = 0.08;

  // Main 6.4kg Brass Flywheel Platter (multi-material: rim strobe texture + top/bottom brushed brass)
  const platterBodyGeo = trackGeo(new THREE.CylinderGeometry(1.46, 1.48, 0.28, 72));
  const platterMesh = new THREE.Mesh(platterBodyGeo, [platterRimMat, brassMat, brassMat]);
  platterMesh.position.y = 0.24;
  platterMesh.castShadow = true;
  platterMesh.receiveShadow = true;

  // Chamfered top bevel ring
  const bevelRingGeo = trackGeo(new THREE.TorusGeometry(1.445, 0.022, 12, 72));
  bevelRingGeo.rotateX(Math.PI / 2);
  const bevelRingMesh = new THREE.Mesh(bevelRingGeo, brassMat);
  bevelRingMesh.position.y = 0.375;

  // Vulcanized elastomer platter mat
  const matGeo = trackGeo(new THREE.CylinderGeometry(1.4, 1.41, 0.032, 64));
  const matMesh = new THREE.Mesh(matGeo, elastomerMat);
  matMesh.position.y = 0.396;
  matMesh.receiveShadow = true;

  // Precision steel spindle
  const spindleGeo = trackGeo(new THREE.CylinderGeometry(0.032, 0.036, 0.36, 20));
  const spindleMesh = new THREE.Mesh(spindleGeo, chromeMat);
  spindleMesh.position.y = 0.44;

  platterGroup.add(subPlatterMesh, platterMesh, bevelRingMesh, matMesh, spindleMesh);
  tagPart(platterGroup, 'platter', interactables);
  root.add(platterGroup);

  // =========================================================================
  // 5. 180G VINYL LP DISC
  // =========================================================================
  const vinylGroup = new THREE.Group();
  vinylGroup.position.set(-0.48, 1.2, 0.04);

  const vinylDiskGeo = trackGeo(new THREE.CylinderGeometry(1.42, 1.42, 0.02, 72));
  // Rotate so label reads cleanly from front-3/4 camera
  const vinylEdgeMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x121317, roughness: 0.35, metalness: 0.1 }),
  );
  const vinylDiskMesh = new THREE.Mesh(vinylDiskGeo, [vinylEdgeMat, vinylMat, vinylEdgeMat]);
  vinylDiskMesh.castShadow = true;
  vinylDiskMesh.receiveShadow = true;

  vinylGroup.add(vinylDiskMesh);
  tagPart(vinylGroup, 'vinyl', interactables);
  root.add(vinylGroup);

  // =========================================================================
  // 6. KNURLED RECORD CLAMP PUCK
  // =========================================================================
  const clampGroup = new THREE.Group();
  clampGroup.position.set(-0.48, 1.21, 0.04);

  const clampProfile = [
    new THREE.Vector2(0.038, 0.0),
    new THREE.Vector2(0.32, 0.0),
    new THREE.Vector2(0.32, 0.045),
    new THREE.Vector2(0.24, 0.075),
    new THREE.Vector2(0.24, 0.175),
    new THREE.Vector2(0.205, 0.21),
    new THREE.Vector2(0.0, 0.21),
  ];
  const clampBodyGeo = trackGeo(new THREE.LatheGeometry(clampProfile, 48));
  const clampBodyMesh = new THREE.Mesh(clampBodyGeo, tonearmMetalMat);
  clampBodyMesh.castShadow = true;

  const clampCapGeo = trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.015, 36));
  const clampCapMesh = new THREE.Mesh(clampCapGeo, brassMat);
  clampCapMesh.position.y = 0.212;

  const clampBandGeo = trackGeo(new THREE.TorusGeometry(0.242, 0.01, 10, 48));
  clampBandGeo.rotateX(Math.PI / 2);
  const clampBandMesh = new THREE.Mesh(clampBandGeo, brassMat);
  clampBandMesh.position.y = 0.12;

  clampGroup.add(clampBodyMesh, clampCapMesh, clampBandMesh);
  tagPart(clampGroup, 'clamp', interactables);
  root.add(clampGroup);

  // =========================================================================
  // 7. 12-INCH GIMBALLED S-CURVE TONEARM & CARTRIDGE
  // =========================================================================
  const tonearmGroup = new THREE.Group();
  tonearmGroup.position.set(1.56, 0.76, -0.78);

  // Base Mounting Collar
  const armBaseGeo = trackGeo(new THREE.CylinderGeometry(0.38, 0.42, 0.16, 40));
  const armBaseMesh = new THREE.Mesh(armBaseGeo, tonearmMetalMat);
  armBaseMesh.position.y = 0.08;
  armBaseMesh.castShadow = true;

  const armPillarGeo = trackGeo(new THREE.CylinderGeometry(0.15, 0.18, 0.36, 32));
  const armPillarMesh = new THREE.Mesh(armPillarGeo, brassMat);
  armPillarMesh.position.y = 0.32;
  armPillarMesh.castShadow = true;

  // Pivot Gimbal Yoke
  const armPivotGroup = new THREE.Group();
  armPivotGroup.position.set(0, 0.52, 0);

  const yokeShape = new THREE.Shape();
  yokeShape.moveTo(-0.22, -0.1);
  yokeShape.lineTo(0.22, -0.1);
  yokeShape.lineTo(0.22, 0.2);
  yokeShape.lineTo(0.15, 0.2);
  yokeShape.lineTo(0.15, -0.02);
  yokeShape.lineTo(-0.15, -0.02);
  yokeShape.lineTo(-0.15, 0.2);
  yokeShape.lineTo(-0.22, 0.2);
  yokeShape.closePath();

  const yokeGeo = trackGeo(
    new THREE.ExtrudeGeometry(yokeShape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 2,
    }),
  );
  yokeGeo.center();
  const yokeMesh = new THREE.Mesh(yokeGeo, tonearmMetalMat);
  yokeMesh.castShadow = true;

  // Counterweight Cylinder with engraved gram scale
  const cwBodyGeo = trackGeo(new THREE.CylinderGeometry(0.145, 0.145, 0.24, 36));
  cwBodyGeo.rotateZ(Math.PI / 2);
  cwBodyGeo.rotateY(Math.PI / 2);
  const cwMesh = new THREE.Mesh(cwBodyGeo, [dialMat, brassMat, brassMat]);
  cwMesh.position.set(0.06, 0.04, -0.44);
  cwMesh.rotation.y = Math.atan2(-0.68, 1.85);
  cwMesh.castShadow = true;

  // Rear counterweight stub shaft
  const stubGeo = trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 0.56, 16));
  stubGeo.rotateX(Math.PI / 2);
  const stubMesh = new THREE.Mesh(stubGeo, chromeMat);
  stubMesh.position.set(0.03, 0.04, -0.25);

  // S-Curved 12-inch Titanium Arm Wand (TubeGeometry)
  const armCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.04, 0.05),
    new THREE.Vector3(-0.08, 0.04, 0.56),
    new THREE.Vector3(-0.36, 0.03, 1.12),
    new THREE.Vector3(-0.62, 0.01, 1.54),
    new THREE.Vector3(-0.84, -0.01, 1.78),
  ]);
  const wandGeo = trackGeo(new THREE.TubeGeometry(armCurve, 48, 0.032, 16, false));
  const wandMesh = new THREE.Mesh(wandGeo, tonearmMetalMat);
  wandMesh.castShadow = true;

  // SME Collar
  const collarGeo = trackGeo(new THREE.CylinderGeometry(0.048, 0.048, 0.09, 20));
  collarGeo.rotateX(Math.PI / 2);
  const collarMesh = new THREE.Mesh(collarGeo, brassMat);
  collarMesh.position.set(-0.82, -0.01, 1.76);
  collarMesh.rotation.y = -0.52;

  // Magnesium Headshell & Moving-Coil Cartridge
  const headshellGroup = new THREE.Group();
  headshellGroup.position.set(-0.92, -0.02, 1.88);
  headshellGroup.rotation.y = -0.52;

  const hsGeo = trackGeo(new THREE.BoxGeometry(0.13, 0.035, 0.26));
  const hsMesh = new THREE.Mesh(hsGeo, tonearmMetalMat);
  hsMesh.castShadow = true;

  const cartGeo = trackGeo(new THREE.BoxGeometry(0.11, 0.095, 0.17));
  const cartMesh = new THREE.Mesh(cartGeo, brassMat);
  cartMesh.position.set(0, -0.06, 0.02);
  cartMesh.castShadow = true;

  const stylusGeo = trackGeo(new THREE.ConeGeometry(0.012, 0.045, 8));
  stylusGeo.rotateX(Math.PI);
  const stylusMesh = new THREE.Mesh(stylusGeo, chromeMat);
  stylusMesh.position.set(0, -0.125, 0.07);

  // Cue finger lift
  const liftCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.065, 0.01, 0.02),
    new THREE.Vector3(0.13, 0.03, 0.04),
    new THREE.Vector3(0.16, 0.06, 0.06),
  ]);
  const liftGeo = trackGeo(new THREE.TubeGeometry(liftCurve, 12, 0.008, 8, false));
  const liftMesh = new THREE.Mesh(liftGeo, chromeMat);

  headshellGroup.add(hsMesh, cartMesh, stylusMesh, liftMesh);

  // Anti-skate weight dial
  const antiSkateGeo = trackGeo(new THREE.CylinderGeometry(0.1, 0.1, 0.09, 24));
  const antiSkateMesh = new THREE.Mesh(antiSkateGeo, brassMat);
  antiSkateMesh.position.set(0.32, -0.22, 0.16);

  // Tonearm rest post on plinth deck
  const armRestGeo = trackGeo(new THREE.CylinderGeometry(0.045, 0.055, 0.34, 16));
  const armRestMesh = new THREE.Mesh(armRestGeo, tonearmMetalMat);
  armRestMesh.position.set(-0.22, -0.35, 0.72);

  armPivotGroup.add(yokeMesh, cwMesh, stubMesh, wandMesh, collarMesh, headshellGroup);
  tonearmGroup.add(armBaseMesh, armPillarMesh, armPivotGroup, antiSkateMesh, armRestMesh);
  tagPart(tonearmGroup, 'tonearm', interactables);
  root.add(tonearmGroup);

  // =========================================================================
  // 8. SMOKED OPTICAL ACRYLIC DUST COVER (Hinged at Rear)
  // =========================================================================
  const coverGroup = new THREE.Group();
  coverGroup.position.set(0, 0.76, -1.72);

  // Open slightly (24 deg) in rest pose to reveal platter & tonearm cleanly
  coverGroup.rotation.x = -0.38;

  const coverPivot = new THREE.Group();
  coverPivot.position.set(0, 0, 1.72);

  const coverW = 4.44;
  const coverD = 3.36;
  const coverH = 0.88;
  const wallT = 0.045;

  const topPanel = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(coverW, wallT, coverD)),
    acrylicCoverMat,
  );
  topPanel.position.set(0, coverH, 0);
  topPanel.renderOrder = 5;

  const frontPanel = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(coverW, coverH, wallT)),
    acrylicCoverMat,
  );
  frontPanel.position.set(0, coverH / 2, coverD / 2 - wallT / 2);
  frontPanel.renderOrder = 5;

  const leftPanel = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(wallT, coverH, coverD - wallT * 2)),
    acrylicCoverMat,
  );
  leftPanel.position.set(-coverW / 2 + wallT / 2, coverH / 2, 0);
  leftPanel.renderOrder = 5;

  const rightPanel = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(wallT, coverH, coverD - wallT * 2)),
    acrylicCoverMat,
  );
  rightPanel.position.set(coverW / 2 - wallT / 2, coverH / 2, 0);
  rightPanel.renderOrder = 5;

  // Rear machined hinges
  const hingeGeo = trackGeo(new THREE.BoxGeometry(0.32, 0.12, 0.08));
  for (const hx of [-1.45, 1.45]) {
    const hinge = new THREE.Mesh(hingeGeo, brassMat);
    hinge.position.set(hx, 0.04, -coverD / 2);
    coverPivot.add(hinge);
  }

  coverPivot.add(topPanel, frontPanel, leftPanel, rightPanel);
  coverGroup.add(coverPivot);
  tagPart(coverGroup, 'cover', interactables);
  root.add(coverGroup);

  // =========================================================================
  // 9. GROUND CONTACT SHADOW PLANE
  // =========================================================================
  const contactShadowGeo = trackGeo(new THREE.PlaneGeometry(6.6, 5.2));
  contactShadowGeo.rotateX(-Math.PI / 2);
  const contactShadowMat = trackMat(
    new THREE.MeshBasicMaterial({
      map: textures.contactShadow,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    }),
  );
  const contactShadowMesh = new THREE.Mesh(contactShadowGeo, contactShadowMat);
  contactShadowMesh.position.y = 0.005;
  root.add(contactShadowMesh);

  // =========================================================================
  // ANIMATION & MATERIAL STATE
  // =========================================================================
  let currentExplode = 0;
  let currentArmSwing = 0.24; // engaged over LP when spinning
  const baseY = {
    feet: 0,
    plinth: 0.2,
    motor: 0,
    platter: 0.78,
    vinyl: 1.2,
    clamp: 1.21,
    tonearm: 0.76,
    cover: 0.76,
  };

  function applyFinish(finishId: FinishPresetId) {
    const f = FINISH_VARIANTS.find((v) => v.id === finishId) ?? FINISH_VARIANTS[0];
    plinthMat.color.setHex(f.plinthColor);
    plinthMat.roughness = f.plinthRoughness;
    plinthMat.metalness = f.plinthMetalness;

    brassMat.color.setHex(f.platterColor);
    brassMat.roughness = f.platterRoughness;
    brassMat.metalness = f.platterMetalness;

    tonearmMetalMat.color.setHex(f.tonearmColor);
  }

  function update(
    delta: number,
    explodeTarget: number,
    rpmMode: RpmMode,
    selectedPart: PartId | null,
  ): boolean {
    const dt = Math.min(delta, 0.05);
    let needsMoreFrames = false;

    // 1. Exponential damping for Exploded View layers
    const prevExplode = currentExplode;
    currentExplode = THREE.MathUtils.damp(currentExplode, explodeTarget, 7.5, dt);
    if (Math.abs(currentExplode - explodeTarget) > 0.0008) {
      needsMoreFrames = true;
    } else if (prevExplode !== explodeTarget) {
      currentExplode = explodeTarget;
    }

    const e = currentExplode;
    feetGroup.position.y = baseY.feet - e * 0.28;
    plinthGroup.position.y = baseY.plinth;
    motorGroup.position.y = baseY.motor + e * 0.42;
    platterGroup.position.y = baseY.platter + e * 0.56;
    vinylGroup.position.y = baseY.vinyl + e * 1.18;
    clampGroup.position.y = baseY.clamp + e * 1.65;
    tonearmGroup.position.y = baseY.tonearm + e * 0.68;
    coverGroup.position.y = baseY.cover + e * 2.15;
    coverGroup.rotation.x = THREE.MathUtils.lerp(-0.38, -0.05, e);

    // 2. Turntable platter & vinyl spin (33⅓ RPM = 3.49 rad/s, 45 RPM = 4.71 rad/s)
    // Scale angular speed slightly for pleasant visual readability while preserving 33 vs 45 ratio
    const angularSpeed = rpmMode === '33' ? 1.15 : rpmMode === '45' ? 1.56 : 0;
    if (angularSpeed > 0) {
      platterGroup.rotation.y -= angularSpeed * dt;
      vinylGroup.rotation.y -= angularSpeed * dt;
      clampGroup.rotation.y -= angularSpeed * dt;
      pulleyMesh.rotation.y -= angularSpeed * 2.4 * dt;
      needsMoreFrames = true;
    }

    // 3. Smooth tonearm cue position (parks over rest when paused or exploded)
    const armTargetSwing = rpmMode !== 'paused' && e < 0.08 ? 0.26 : -0.14;
    currentArmSwing = THREE.MathUtils.damp(currentArmSwing, armTargetSwing, 6.0, dt);
    armPivotGroup.rotation.y = currentArmSwing;
    armPivotGroup.rotation.x = THREE.MathUtils.lerp(0.06, 0.0, (currentArmSwing + 0.14) / 0.4);
    if (Math.abs(currentArmSwing - armTargetSwing) > 0.001) {
      needsMoreFrames = true;
    }

    // 4. Subtle emissive highlight on selected part
    const highlightHex = 0x2a1d0b;
    plinthMat.emissive.setHex(selectedPart === 'plinth' ? highlightHex : 0x000000);
    brassMat.emissive.setHex(
      selectedPart === 'platter' || selectedPart === 'motor' || selectedPart === 'feet'
        ? highlightHex
        : 0x000000,
    );
    tonearmMetalMat.emissive.setHex(
      selectedPart === 'tonearm' || selectedPart === 'clamp' ? highlightHex : 0x000000,
    );

    return needsMoreFrames;
  }

  function dispose() {
    for (const g of geometriesToDispose) g.dispose();
    for (const m of materialsToDispose) m.dispose();
  }

  return {
    root,
    interactables,
    applyFinish,
    update,
    dispose,
  };
}
