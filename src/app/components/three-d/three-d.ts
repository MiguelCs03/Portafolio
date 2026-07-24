import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-three-d',
  imports: [],
  templateUrl: './three-d.html',
})
export class ThreeD implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private group!: THREE.Group;
  private pointsMesh!: THREE.Points;
  private torusRing1!: THREE.Mesh;
  private torusRing2!: THREE.Mesh;
  private shockwaveRing!: THREE.Mesh;
  private frameId!: number;

  // Interactivity state
  private targetX = 0;
  private targetY = 0;
  private mouseX = 0;
  private mouseY = 0;
  private spinSpeed = 0.002;
  private shockwaveScale = 0;

  // Drag state
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };

  ngAfterViewInit() {
    this.initThree();
    this.animate();
  }

  ngOnDestroy() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
    
    // Clean up ThreeJS resources
    if (this.pointsMesh) {
      this.pointsMesh.geometry.dispose();
      (this.pointsMesh.material as THREE.Material).dispose();
    }
    if (this.torusRing1) {
      this.torusRing1.geometry.dispose();
      (this.torusRing1.material as THREE.Material).dispose();
    }
    if (this.torusRing2) {
      this.torusRing2.geometry.dispose();
      (this.torusRing2.material as THREE.Material).dispose();
    }
    if (this.shockwaveRing) {
      this.shockwaveRing.geometry.dispose();
      (this.shockwaveRing.material as THREE.Material).dispose();
    }
    if (this.renderer) {
      this.renderer.dispose();
      const container = this.containerRef.nativeElement;
      if (container && container.contains(this.renderer.domElement)) {
        container.removeChild(this.renderer.domElement);
      }
    }
  }

  private initThree() {
    const container = this.containerRef.nativeElement;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.z = 6.5;

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // 4. Main 3D Group
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // 5. Particles (Inner AI Core)
    const particleCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color('#00f5d4');
    const blueColor = new THREE.Color('#00d2ff');

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.acos(-1 + (2 * i) / particleCount);
      const phi = Math.sqrt(particleCount * Math.PI) * theta;
      const r = 1.95;

      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);

      positions[i * 3] = x + (Math.random() - 0.5) * 0.12;
      positions[i * 3 + 1] = y + (Math.random() - 0.5) * 0.12;
      positions[i * 3 + 2] = z + (Math.random() - 0.5) * 0.12;

      const mixedColor = cyanColor.clone().lerp(blueColor, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.pointsMesh = new THREE.Points(geometry, particleMaterial);
    this.group.add(this.pointsMesh);

    // 6. Outer Cyber Torus Ring 1 (Horizontal Orbit)
    const torusGeo1 = new THREE.TorusGeometry(2.35, 0.015, 16, 100);
    const torusMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f5d4,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    this.torusRing1 = new THREE.Mesh(torusGeo1, torusMat1);
    this.torusRing1.rotation.x = Math.PI / 3;
    this.group.add(this.torusRing1);

    // 7. Outer Cyber Torus Ring 2 (Vertical Orbit)
    const torusGeo2 = new THREE.TorusGeometry(2.6, 0.012, 16, 100);
    const torusMat2 = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    this.torusRing2 = new THREE.Mesh(torusGeo2, torusMat2);
    this.torusRing2.rotation.y = Math.PI / 4;
    this.group.add(this.torusRing2);

    // 8. Shockwave Ring (Triggers on click)
    const shockGeo = new THREE.RingGeometry(0.1, 0.15, 64);
    const shockMat = new THREE.MeshBasicMaterial({
      color: 0x00f5d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    this.shockwaveRing = new THREE.Mesh(shockGeo, shockMat);
    this.group.add(this.shockwaveRing);
  }

  private animate = () => {
    this.frameId = requestAnimationFrame(this.animate);

    // Smooth return to base spin speed after boost
    this.spinSpeed += (0.002 - this.spinSpeed) * 0.05;

    if (!this.isDragging) {
      this.pointsMesh.rotation.y += this.spinSpeed * 1.5;
      this.pointsMesh.rotation.x += this.spinSpeed * 0.8;

      this.torusRing1.rotation.z += this.spinSpeed * 2;
      this.torusRing1.rotation.y += this.spinSpeed;

      this.torusRing2.rotation.x -= this.spinSpeed * 1.8;
      this.torusRing2.rotation.z -= this.spinSpeed * 1.2;

      // Mouse inertia tracking
      this.mouseX += (this.targetX - this.mouseX) * 0.05;
      this.mouseY += (this.targetY - this.mouseY) * 0.05;

      this.group.rotation.y = this.mouseX * 0.4;
      this.group.rotation.x = this.mouseY * 0.4;
    }

    // Animate shockwave effect
    if (this.shockwaveScale > 0) {
      this.shockwaveScale += 0.12;
      this.shockwaveRing.scale.set(this.shockwaveScale, this.shockwaveScale, 1);
      const mat = this.shockwaveRing.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 1 - this.shockwaveScale / 3.5);

      if (this.shockwaveScale > 3.5) {
        this.shockwaveScale = 0;
        mat.opacity = 0;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  triggerPulse() {
    this.spinSpeed = 0.035; // boost 360 rotation speed
    this.shockwaveScale = 0.1; // trigger shockwave pulse
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.targetX = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    this.targetY = (event.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
  }

  @HostListener('window:resize')
  onResize() {
    if (!this.containerRef) return;
    const container = this.containerRef.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  onPointerDown(event: PointerEvent) {
    this.isDragging = true;
    this.previousMousePosition = { x: event.clientX, y: event.clientY };
    this.triggerPulse();
  }

  onPointerMove(event: PointerEvent) {
    if (this.isDragging) {
      const deltaMove = {
        x: event.clientX - this.previousMousePosition.x,
        y: event.clientY - this.previousMousePosition.y
      };

      this.group.rotation.y += deltaMove.x * 0.008;
      this.group.rotation.x += deltaMove.y * 0.008;

      this.previousMousePosition = { x: event.clientX, y: event.clientY };
    }
  }

  onPointerUp() {
    this.isDragging = false;
  }
}
