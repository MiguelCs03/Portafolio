import * as THREE from 'three';

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export interface LaptopRig {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  root: THREE.Group;
  update: (progress: number, pointerX: number, pointerY: number, dragX: number, dragY: number, time: number, isDesktop: boolean) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
}

function createLidBackTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 680;
  const ctx = canvas.getContext('2d')!;

  // Matte brushed obsidian aluminum
  const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bg.addColorStop(0, '#171a21');
  bg.addColorStop(0.5, '#11141a');
  bg.addColorStop(1, '#1a1e28');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle diagonal metallic sheen
  const sheen = ctx.createRadialGradient(512, 320, 30, 512, 320, 420);
  sheen.addColorStop(0, 'rgba(0, 245, 212, 0.14)');
  sheen.addColorStop(0.55, 'rgba(0, 210, 255, 0.04)');
  sheen.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle hairline tech frame
  ctx.strokeStyle = 'rgba(0, 245, 212, 0.16)';
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

  // Glowing MC monogram emblem in center
  const cx = canvas.width / 2;
  const cy = canvas.height / 2 - 12;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 245, 212, 0.65)';
  ctx.shadowBlur = 32;
  ctx.strokeStyle = '#00f5d4';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(cx - 88, cy - 88, 176, 176, 36);
  ctx.stroke();

  const innerGrad = ctx.createLinearGradient(cx - 88, cy - 88, cx + 88, cy + 88);
  innerGrad.addColorStop(0, 'rgba(0, 245, 212, 0.18)');
  innerGrad.addColorStop(1, 'rgba(168, 85, 247, 0.12)');
  ctx.fillStyle = innerGrad;
  ctx.fill();

  ctx.font = '800 84px Geist, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const textGrad = ctx.createLinearGradient(cx - 60, cy, cx + 60, cy);
  textGrad.addColorStop(0, '#00f5d4');
  textGrad.addColorStop(0.6, '#00d2ff');
  textGrad.addColorStop(1, '#c084fc');
  ctx.fillStyle = textGrad;
  ctx.fillText('MC', cx, cy + 4);
  ctx.restore();

  // Micro label under emblem
  ctx.fillStyle = 'rgba(226, 226, 232, 0.55)';
  ctx.font = '600 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('M.CESARY // FULL STACK & CLOUD', cx, cy + 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function createScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 800;
  const ctx = canvas.getContext('2d')!;

  // Deep OS desktop wallpaper
  const bg = ctx.createLinearGradient(0, 0, 1280, 800);
  bg.addColorStop(0, '#090d14');
  bg.addColorStop(0.5, '#0d1520');
  bg.addColorStop(1, '#12101f');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1280, 800);

  // Ambient screen glows
  const g1 = ctx.createRadialGradient(320, 260, 20, 320, 260, 440);
  g1.addColorStop(0, 'rgba(0, 245, 212, 0.18)');
  g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, 1280, 800);

  const g2 = ctx.createRadialGradient(980, 520, 20, 980, 520, 400);
  g2.addColorStop(0, 'rgba(168, 85, 247, 0.16)');
  g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, 1280, 800);

  // Top macOS-style menu bar
  ctx.fillStyle = 'rgba(10, 14, 22, 0.85)';
  ctx.fillRect(0, 0, 1280, 44);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 44);
  ctx.lineTo(1280, 44);
  ctx.stroke();

  ctx.fillStyle = '#00f5d4';
  ctx.font = '700 18px monospace';
  ctx.fillText('MC // WORKSPACE OS', 28, 28);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  ctx.fillStyle = 'rgba(226, 226, 232, 0.85)';
  ctx.textAlign = 'right';
  ctx.font = '600 17px monospace';
  ctx.fillText(`ONLINE · ${timeStr}`, 1250, 28);
  ctx.textAlign = 'left';

  // Left Window: Code / Architecture Editor
  ctx.fillStyle = 'rgba(16, 20, 29, 0.92)';
  ctx.strokeStyle = 'rgba(0, 245, 212, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(44, 82, 680, 520, 18);
  ctx.fill();
  ctx.stroke();

  // Window header dots
  const dotColors = ['#ff5f56', '#ffbd2e', '#27c93f'];
  dotColors.forEach((c, idx) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(74 + idx * 22, 108, 6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = 'rgba(185, 202, 196, 0.7)';
  ctx.font = '600 15px monospace';
  ctx.fillText('architecture.module.ts — NestJS + Neon', 155, 113);

  const codeLines: Array<[string, string]> = [
    ["import { Module } from '@nestjs/common';", '#c084fc'],
    ["import { PrismaModule } from './prisma/prisma.module';", '#c084fc'],
    ['', '#fff'],
    ['@Module({', '#00f5d4'],
    ['  imports: [PrismaModule, AuthModule, AnalyticsModule],', '#e2e2e8'],
    ['  cloud: ["AWS Lambda", "Render", "Vercel", "Neon DB"],', '#00d2ff'],
    ['  frontend: ["Angular 21", "Tailwind v4", "Three.js"],', '#00f5d4'],
    ['  uptime: "99.9%",', '#e2b45a'],
    ['})', '#00f5d4'],
    ['export class PortfolioEngine {', '#e2e2e8'],
    ['  readonly experience = "2+ años Full Stack";', '#a7f3d0'],
    ['  readonly shipped = 5;', '#a7f3d0'],
    ['}', '#e2e2e8'],
  ];

  codeLines.forEach(([line, color], idx) => {
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.font = '500 16px monospace';
    ctx.fillText(String(idx + 1).padStart(2, '0'), 66, 165 + idx * 32);
    ctx.fillStyle = color;
    ctx.fillText(line, 106, 165 + idx * 32);
  });

  // Right Cards: Shipped Production Apps
  const cards = [
    { title: 'Multipuntos Multicenter', sub: 'NestJS · Angular · AWS', accent: '#00f5d4' },
    { title: 'Círculo Rojo (Web)', sub: 'Admin · Laravel · REST', accent: '#00d2ff' },
    { title: 'Círculo Rojo (App)', sub: 'Flutter · iOS & Android', accent: '#c084fc' },
    { title: 'Live Telemetry API', sub: 'NestJS · Prisma · Neon', accent: '#e2b45a' },
  ];

  cards.forEach((card, i) => {
    const y = 82 + i * 134;
    ctx.fillStyle = 'rgba(20, 25, 36, 0.9)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(754, y, 482, 114, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = card.accent;
    ctx.beginPath();
    ctx.roundRect(774, y + 24, 8, 66, 4);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 22px Geist, system-ui, sans-serif';
    ctx.fillText(card.title, 802, y + 48);

    ctx.fillStyle = 'rgba(185, 202, 196, 0.8)';
    ctx.font = '600 16px monospace';
    ctx.fillText(card.sub, 802, y + 82);
  });

  // Bottom Dock
  ctx.fillStyle = 'rgba(18, 22, 32, 0.85)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(360, 668, 560, 88, 26);
  ctx.fill();
  ctx.stroke();

  const dockLabels = ['ANG', 'NEST', 'AWS', 'DB', 'FLUT', 'GIT'];
  const dockColors = ['#dd0031', '#e0234e', '#ff9900', '#00f5d4', '#00d2ff', '#a855f7'];
  dockLabels.forEach((lbl, idx) => {
    const x = 400 + idx * 84;
    ctx.fillStyle = dockColors[idx];
    ctx.beginPath();
    ctx.roundRect(x, 686, 56, 52, 14);
    ctx.fill();
    ctx.fillStyle = '#07090e';
    ctx.font = '800 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(lbl, x + 28, 718);
  });
  ctx.textAlign = 'left';

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function createPcbTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 680;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#071412';
  ctx.fillRect(0, 0, 1024, 680);

  // Subtle circuit grid
  ctx.strokeStyle = 'rgba(0, 245, 212, 0.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1024; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 680);
    ctx.stroke();
  }
  for (let y = 0; y < 680; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Gold & Cyan PCB traces
  const traces: Array<{ pts: Array<[number, number]>; color: string }> = [
    { pts: [[120, 140], [320, 140], [380, 220], [512, 220]], color: '#e2b45a' },
    { pts: [[120, 520], [280, 520], [360, 400], [512, 400]], color: '#00f5d4' },
    { pts: [[900, 150], [720, 150], [650, 260], [512, 260]], color: '#00d2ff' },
    { pts: [[900, 510], [710, 510], [640, 390], [512, 390]], color: '#e2b45a' },
    { pts: [[512, 90], [512, 590]], color: '#00f5d4' },
    { pts: [[200, 340], [820, 340]], color: '#e2b45a' },
  ];

  traces.forEach(({ pts, color }) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.lineWidth = 3;
    ctx.beginPath();
    pts.forEach(([x, y], idx) => (idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.stroke();
    ctx.restore();
  });

  // Labeled silicon chips
  const chips = [
    { x: 420, y: 260, w: 184, h: 160, label: 'CORE // NESTJS', sub: 'API & MICROSERVICES', color: '#00f5d4' },
    { x: 140, y: 110, w: 170, h: 80, label: 'NEON PG', sub: 'PRISMA ORM', color: '#e2b45a' },
    { x: 700, y: 110, w: 180, h: 80, label: 'AWS LAMBDA', sub: 'SERVERLESS', color: '#00d2ff' },
    { x: 140, y: 480, w: 170, h: 80, label: 'ANGULAR 21', sub: 'SIGNALS + 3D', color: '#e2b45a' },
    { x: 700, y: 480, w: 180, h: 80, label: 'DOCKER', sub: 'CLOUD DEPLOY', color: '#00f5d4' },
  ];

  chips.forEach((c) => {
    ctx.fillStyle = '#0e161d';
    ctx.strokeStyle = c.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(c.x, c.y, c.w, c.h, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = c.color;
    ctx.font = '800 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(c.label, c.x + c.w / 2, c.y + c.h / 2 - 4);
    ctx.fillStyle = 'rgba(226, 226, 232, 0.65)';
    ctx.font = '600 12px monospace';
    ctx.fillText(c.sub, c.x + c.w / 2, c.y + c.h / 2 + 18);
  });
  ctx.textAlign = 'left';

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function createLaptopRig(container: HTMLElement): LaptopRig {
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 0.5, 7.6);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  // Studio Lighting with cyan + warm amber rim lights
  const ambient = new THREE.AmbientLight('#b9d4df', 0.85);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight('#ffffff', 2.2);
  keyLight.position.set(4, 6, 5);
  scene.add(keyLight);

  const cyanRim = new THREE.PointLight('#00f5d4', 18, 16);
  cyanRim.position.set(-4.2, 2.5, 2.5);
  scene.add(cyanRim);

  const warmRim = new THREE.PointLight('#e2b45a', 14, 15);
  warmRim.position.set(4.5, -1.8, 3.2);
  scene.add(warmRim);

  const purpleFill = new THREE.PointLight('#a855f7', 10, 14);
  purpleFill.position.set(0, 3.5, -4);
  scene.add(purpleFill);

  const root = new THREE.Group();
  scene.add(root);

  const disposableGeometries: THREE.BufferGeometry[] = [];
  const disposableMaterials: THREE.Material[] = [];
  const disposableTextures: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T) => {
    disposableGeometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T) => {
    disposableMaterials.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T) => {
    disposableTextures.push(t);
    return t;
  };

  const chassisMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#1b1f28',
      metalness: 0.82,
      roughness: 0.28,
    }),
  );

  const darkTrimMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#0e1117',
      metalness: 0.5,
      roughness: 0.55,
    }),
  );

  const accentGlowMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#00f5d4',
      emissive: '#00f5d4',
      emissiveIntensity: 1.4,
      roughness: 0.2,
    }),
  );

  // ---------------- 1. BASE CHASSIS + KEYBOARD + TRACKPAD ----------------
  const baseGroup = new THREE.Group();
  root.add(baseGroup);

  const baseBody = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.2, 0.12, 2.16)), chassisMat);
  baseGroup.add(baseBody);

  // Subtle glowing side strip
  const frontLip = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.7, 0.018, 0.02)), accentGlowMat);
  frontLip.position.set(0, 0.01, 1.08);
  baseGroup.add(frontLip);

  // Keyboard recess
  const kbRecess = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.74, 0.02, 1.05)), darkTrimMat);
  kbRecess.position.set(0, 0.056, -0.26);
  baseGroup.add(kbRecess);

  // Backlit Keycap Grid (InstancedMesh for 60fps performance)
  const keyGeo = trackGeo(new THREE.BoxGeometry(0.16, 0.022, 0.15));
  const keyMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#171c26',
      emissive: '#00d2ff',
      emissiveIntensity: 0.16,
      roughness: 0.45,
      metalness: 0.35,
    }),
  );
  const cols = 13;
  const rows = 5;
  const keysInstanced = new THREE.InstancedMesh(keyGeo, keyMat, cols * rows);
  const dummy = new THREE.Object3D();
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dummy.position.set(-1.17 + c * 0.195, 0.072, -0.64 + r * 0.19);
      dummy.updateMatrix();
      keysInstanced.setMatrixAt(idx++, dummy.matrix);
    }
  }
  baseGroup.add(keysInstanced);

  // Glass Trackpad
  const trackpadMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#131720',
      metalness: 0.65,
      roughness: 0.18,
    }),
  );
  const trackpad = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.12, 0.014, 0.66)), trackpadMat);
  trackpad.position.set(0, 0.06, 0.64);
  baseGroup.add(trackpad);

  // ---------------- 2. INTERNAL MOTHERBOARD / PCB LAYER ----------------
  const pcbGroup = new THREE.Group();
  root.add(pcbGroup);

  const pcbTexture = trackTex(createPcbTexture());
  const pcbBoardMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: pcbTexture,
      emissiveMap: pcbTexture,
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 0.55,
      roughness: 0.35,
      metalness: 0.45,
    }),
  );
  const pcbMesh = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.86, 0.032, 1.88)), pcbBoardMat);
  pcbMesh.position.set(0, 0.01, 0);
  pcbGroup.add(pcbMesh);

  // Raised 3D Silicon CPU block on PCB
  const cpuBlock = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.48, 0.04, 0.42)),
    trackMat(
      new THREE.MeshStandardMaterial({
        color: '#111827',
        emissive: '#00f5d4',
        emissiveIntensity: 0.22,
        metalness: 0.85,
        roughness: 0.2,
      }),
    ),
  );
  cpuBlock.position.set(0, 0.042, 0);
  pcbGroup.add(cpuBlock);

  // ---------------- 3. HINGED LID + SCREEN + PROTECTIVE GLASS ----------------
  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, 0.06, -1.06);
  root.add(lidGroup);

  // Hinge bar
  const hinge = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.036, 0.036, 2.35, 20)),
    darkTrimMat,
  );
  hinge.rotation.z = Math.PI / 2;
  lidGroup.add(hinge);

  // Lid aluminum frame
  const lidFrame = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.2, 0.064, 2.12)), chassisMat);
  lidFrame.position.set(0, 0.032, 1.06);
  lidGroup.add(lidFrame);

  // Back of the lid (with glowing MC emblem)
  const lidBackTexture = trackTex(createLidBackTexture());
  const lidBackMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: lidBackTexture,
      emissiveMap: lidBackTexture,
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 0.35,
      metalness: 0.65,
      roughness: 0.3,
    }),
  );
  const lidBackPlane = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(3.16, 2.08)), lidBackMat);
  lidBackPlane.position.set(0, 0.066, 1.06);
  lidBackPlane.rotation.x = -Math.PI / 2;
  lidGroup.add(lidBackPlane);

  // Screen display (inside face of the lid)
  const screenTexture = trackTex(createScreenTexture());
  const screenMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: screenTexture,
      emissiveMap: screenTexture,
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 0.72,
      roughness: 0.22,
      metalness: 0.08,
    }),
  );
  const screenPlane = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(3.02, 1.94)), screenMat);
  screenPlane.position.set(0, -0.002, 1.06);
  screenPlane.rotation.x = Math.PI / 2;
  lidGroup.add(screenPlane);

  // Protective Glass Layer (separates outward in Exploded View)
  const glassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: '#aefcf0',
      transparent: true,
      opacity: 0.18,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.4,
      clearcoat: 1,
      side: THREE.DoubleSide,
    }),
  );
  const glassPlane = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(3.04, 1.96)), glassMat);
  glassPlane.position.set(0, -0.015, 1.06);
  glassPlane.rotation.x = Math.PI / 2;
  lidGroup.add(glassPlane);

  const update = (
    progress: number,
    pointerX: number,
    pointerY: number,
    dragX: number,
    dragY: number,
    time: number,
    isDesktop: boolean,
  ) => {
    const p = clamp01(progress);

    // Phase weights
    const openT = smoothstep(0.16, 0.42, p);
    const explodeIn = smoothstep(0.48, 0.64, p);
    const explodeOut = smoothstep(0.80, 0.92, p);
    const explodeT = explodeIn * (1 - explodeOut);
    const exitT = smoothstep(0.88, 1.0, p);

    // Position across scroll
    const heroX = isDesktop ? 1.55 : 0;
    const centerX = lerp(heroX, 0, smoothstep(0.14, 0.36, p));
    const explodedX = lerp(centerX, isDesktop ? 1.2 : 0, explodeT);
    const posX = lerp(explodedX, 0, exitT);

    const baseHeroY = isDesktop ? -0.1 : -0.35;
    const posY = lerp(baseHeroY, 0.12, openT) + exitT * 2.2 + Math.sin(time * 1.4) * 0.045;

    root.position.set(posX, posY, lerp(0, 0.35, openT) - explodeT * 0.5);

    // Laptop rotations:
    // Closed hero pose tilts top cover toward viewer so MC emblem shines clearly
    const rotX = lerp(0.82, 0.26, openT) + explodeT * 0.24 + pointerY * 0.08 + dragY;
    const rotY = lerp(-0.46, 0.08, openT) - explodeT * 0.68 + pointerX * 0.12 + dragX;
    const rotZ = lerp(0.14, 0, openT) - explodeT * 0.14;

    root.rotation.set(rotX, rotY, rotZ);

    const baseScale = isDesktop ? 1.0 : 0.72;
    const scale = baseScale * lerp(1.0, 1.08, openT) * (1 - explodeT * 0.12) * (1 - exitT * 0.35);
    root.scale.setScalar(scale);

    // Lid hinge angle: closed (~0.04) -> open (-1.82 rad ≈ 104 deg)
    lidGroup.rotation.x = lerp(-0.04, -1.82, openT);

    // Exploded view layer separation
    baseGroup.position.y = -explodeT * 0.55;
    pcbGroup.position.y = explodeT * 0.18;
    pcbGroup.visible = explodeT > 0.01;
    lidGroup.position.y = 0.06 + explodeT * 0.85;
    glassPlane.position.y = -0.015 - explodeT * 0.52;

    // Fade screen emissive slightly on exit
    screenMat.emissiveIntensity = 0.72 * (1 - exitT * 0.85);
    lidBackMat.emissiveIntensity = 0.35 * (1 - exitT * 0.85);

    renderer.render(scene, camera);
  };

  const resize = (w: number, h: number) => {
    if (w <= 0 || h <= 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  const dispose = () => {
    disposableGeometries.forEach((g) => g.dispose());
    disposableMaterials.forEach((m) => m.dispose());
    disposableTextures.forEach((t) => t.dispose());
    renderer.dispose();
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
  };

  return { scene, camera, renderer, root, update, resize, dispose };
}
