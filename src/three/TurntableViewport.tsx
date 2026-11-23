import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {
  CameraPresetId,
  FinishPresetId,
  PartId,
  RpmMode,
} from '../data/productData';
import { OG_IMAGE_PATH } from '../seo/useSeoMetadata';
import { createTurntableTextures } from './proceduralTextures';
import { createTurntableAssembly } from './turntableModel';

interface TurntableViewportProps {
  finishId: FinishPresetId;
  explodeAmount: number;
  rpmMode: RpmMode;
  cameraPreset: CameraPresetId;
  cameraPresetNonce: number;
  zoomCommand: { direction: 'in' | 'out'; nonce: number } | null;
  selectedPart: PartId | null;
  onSelectPart: (partId: PartId | null) => void;
}

const CAMERA_PRESETS: Record<
  CameraPresetId,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  studio: { pos: [3.85, 3.0, 4.95], target: [-0.32, 0.58, 0.12] },
  tonearm: { pos: [2.65, 1.92, 2.28], target: [0.92, 0.95, -0.12] },
  platter: { pos: [-0.45, 3.85, 2.55], target: [-0.48, 0.92, 0.04] },
  profile: { pos: [0.0, 1.45, 5.85], target: [0.0, 0.72, 0.0] },
};

// Pre-allocated math helpers outside render loop (Zero GC)
const _camGoalPos = new THREE.Vector3();
const _camGoalTarget = new THREE.Vector3();
const _zoomDir = new THREE.Vector3();
const _pointerNdc = new THREE.Vector2();

export function TurntableViewport({
  finishId,
  explodeAmount,
  rpmMode,
  cameraPreset,
  cameraPresetNonce,
  zoomCommand,
  selectedPart,
  onSelectPart,
}: TurntableViewportProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  // Mutable state refs so React UI updates never tear down WebGL
  const stateRef = useRef({
    finishId,
    explodeAmount,
    rpmMode,
    selectedPart,
  });
  stateRef.current = { finishId, explodeAmount, rpmMode, selectedPart };

  const onSelectPartRef = useRef(onSelectPart);
  onSelectPartRef.current = onSelectPart;

  // Imperative bridge refs to trigger transitions & renders from prop changes
  const controllerRef = useRef<{
    applyFinish: (f: FinishPresetId) => void;
    triggerPreset: (preset: CameraPresetId) => void;
    triggerZoom: (dir: 'in' | 'out') => void;
    wake: () => void;
  } | null>(null);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    // 1. Detect Software WebGL from GPU renderer string (never User-Agent)
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = mountEl.clientWidth || window.innerWidth;
    const height = mountEl.clientHeight || 640;
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mountEl.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglUnavailable(true);
    };
    const handleContextRestored = () => {
      setWebglUnavailable(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    // 2. Scene, Camera & Horizon-Matched Studio Fog
    const scene = new THREE.Scene();
    const bgColor = new THREE.Color(0x101216);
    scene.background = bgColor;
    scene.fog = new THREE.FogExp2(0x101216, 0.042);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 80);
    const initPreset = CAMERA_PRESETS.studio;
    camera.position.set(...initPreset.pos);

    // 3. Mandatory Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    // 4. Balanced 3-Point Warm/Cool Studio Lighting + Softboxes
    const hemiLight = new THREE.HemisphereLight(0xc2d4ea, 0x181a20, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1de, 2.3);
    keyLight.position.set(5.5, 7.5, 4.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    const d = 4.2;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xcfe0ff, 1.35);
    rimLight.position.set(-5.0, 4.2, -4.8);
    scene.add(rimLight);

    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const overheadSoftbox = new THREE.RectAreaLight(0xfff6ea, 3.2, 5.5, 2.4);
      overheadSoftbox.position.set(-0.4, 4.6, 0.8);
      overheadSoftbox.lookAt(-0.3, 0.6, 0);
      scene.add(overheadSoftbox);
    }

    // 5. Studio Cyclorama Floor
    const floorGeo = new THREE.PlaneGeometry(46, 46);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x121419,
      roughness: 0.78,
      metalness: 0.12,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // 6. Procedural Textures & Composite 3D Turntable Assembly
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const textures = createTurntableTextures(maxAniso);
    const turntable = createTurntableAssembly(textures, isSoftwareGl);
    turntable.applyFinish(stateRef.current.finishId);
    scene.add(turntable.root);

    // 7. OrbitControls (enableZoom = false so mouse wheel smoothly scrolls the page)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...initPreset.target);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.065;
    controls.minPolarAngle = 0.18;
    controls.maxPolarAngle = Math.PI / 2 - 0.06;
    controls.minDistance = 2.6;
    controls.maxDistance = 9.5;
    controls.update();

    // 8. Pre-warm shaders once on GPU devices
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 9. Smooth Camera Preset & Zoom Transition State
    let camTransitionActive = false;
    _camGoalPos.copy(camera.position);
    _camGoalTarget.copy(controls.target);

    const cancelTransition = () => {
      camTransitionActive = false;
    };
    controls.addEventListener('start', cancelTransition);

    // 10. Render Loop / Software-WebGL Pacing (afterDraw + requestRender)
    let frameId = 0;
    let isDisposed = false;
    let loopActive = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (isDisposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function stepScene(now: number): boolean {
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      let active = turntable.update(
        dt,
        stateRef.current.explodeAmount,
        stateRef.current.rpmMode,
        stateRef.current.selectedPart,
      );

      if (camTransitionActive) {
        const lambda = 6.5;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _camGoalPos.x, lambda, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _camGoalPos.y, lambda, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _camGoalPos.z, lambda, dt);

        controls.target.x = THREE.MathUtils.damp(controls.target.x, _camGoalTarget.x, lambda, dt);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _camGoalTarget.y, lambda, dt);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _camGoalTarget.z, lambda, dt);

        if (
          camera.position.distanceToSquared(_camGoalPos) < 0.0004 &&
          controls.target.distanceToSquared(_camGoalTarget) < 0.0004
        ) {
          camera.position.copy(_camGoalPos);
          controls.target.copy(_camGoalTarget);
          camTransitionActive = false;
        } else {
          active = true;
        }
      }

      const controlsChanged = controls.update();
      if (controlsChanged) active = true;

      renderer.render(scene, camera);
      return active;
    }

    function tick() {
      if (isDisposed) return;
      const now = performance.now();
      const needsMore = stepScene(now);
      if (needsMore) {
        if (isSoftwareGl) afterDraw(tick);
        else frameId = requestAnimationFrame(tick);
      } else {
        loopActive = false;
      }
    }

    function wake() {
      if (isDisposed || loopActive) return;
      loopActive = true;
      lastTime = performance.now();
      if (isSoftwareGl) {
        frameId = requestAnimationFrame(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    controls.addEventListener('change', wake);

    // 11. Raycasting on Layer 1 for Interactive Part Inspection
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    let downX = 0;
    let downY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
      if (dist > 6) return; // Dragged camera, not a click

      const rect = renderer.domElement.getBoundingClientRect();
      _pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(_pointerNdc, camera);
      const hits = raycaster.intersectObjects(turntable.interactables, false);
      if (hits.length > 0) {
        const partId = hits[0].object.userData.partId as PartId | undefined;
        if (partId) {
          onSelectPartRef.current(partId);
          wake();
        }
      } else {
        onSelectPartRef.current(null);
        wake();
      }
    };

    let lastHoverCheck = 0;
    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverCheck < 60) return;
      lastHoverCheck = now;

      const rect = renderer.domElement.getBoundingClientRect();
      _pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(_pointerNdc, camera);
      const hits = raycaster.intersectObjects(turntable.interactables, false);
      renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    // 12. Responsive ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.max(1, Math.floor(entry.contentRect.width));
      const h = Math.max(1, Math.floor(entry.contentRect.height));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      wake();
    });
    resizeObserver.observe(mountEl);

    controllerRef.current = {
      applyFinish: (f: FinishPresetId) => {
        turntable.applyFinish(f);
        wake();
      },
      triggerPreset: (preset: CameraPresetId) => {
        const p = CAMERA_PRESETS[preset];
        _camGoalPos.set(...p.pos);
        _camGoalTarget.set(...p.target);
        camTransitionActive = true;
        wake();
      },
      triggerZoom: (dir: 'in' | 'out') => {
        const basePos = camTransitionActive ? _camGoalPos : camera.position;
        const baseTarget = camTransitionActive ? _camGoalTarget : controls.target;
        _zoomDir.subVectors(basePos, baseTarget);
        const currentDist = _zoomDir.length();
        const factor = dir === 'in' ? 0.8 : 1.25;
        const nextDist = THREE.MathUtils.clamp(currentDist * factor, 2.6, 9.5);
        _zoomDir.normalize().multiplyScalar(nextDist);
        _camGoalTarget.copy(baseTarget);
        _camGoalPos.copy(baseTarget).add(_zoomDir);
        camTransitionActive = true;
        wake();
      },
      wake,
    };

    // Initial render
    wake();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', cancelTransition);
      controls.removeEventListener('change', wake);
      controls.dispose();

      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      turntable.dispose();
      textures.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      envTarget.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === mountEl) {
        mountEl.removeChild(renderer.domElement);
      }
      controllerRef.current = null;
    };
  }, []);

  // Sync finish changes without rebuilding scene
  useEffect(() => {
    controllerRef.current?.applyFinish(finishId);
  }, [finishId]);

  // Wake loop on explode, RPM, or selectedPart updates
  useEffect(() => {
    controllerRef.current?.wake();
  }, [explodeAmount, rpmMode, selectedPart]);

  // Smooth camera preset transitions
  useEffect(() => {
    if (cameraPresetNonce === 0) return;
    controllerRef.current?.triggerPreset(cameraPreset);
  }, [cameraPreset, cameraPresetNonce]);

  // Smooth zoom button transitions
  useEffect(() => {
    if (!zoomCommand) return;
    controllerRef.current?.triggerZoom(zoomCommand.direction);
  }, [zoomCommand]);

  if (webglUnavailable) {
    return (
      <div className="relative w-full h-full bg-[#101216] flex items-center justify-center">
        <img
          src={OG_IMAGE_PATH}
          alt="Veld Audio R1 direct-drive reference turntable studio view"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101216]/85 via-[#101216]/35 to-transparent" />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full select-none"
      role="img"
      aria-label="Interactive 3D model of the Veld Audio R1 Direct-Drive Reference Turntable"
    />
  );
}
