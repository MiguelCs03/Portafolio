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
  private outerMesh!: THREE.Mesh;
  private frameId!: number;

  // Interactivity state
  private targetX = 0;
  private targetY = 0;
  private mouseX = 0;
  private mouseY = 0;

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
    if (this.outerMesh) {
      this.outerMesh.geometry.dispose();
      (this.outerMesh.material as THREE.Material).dispose();
    }
    if (this.renderer) {
      this.renderer.dispose();
      const container = this.containerRef.nativeElement;
      if (container.contains(this.renderer.domElement)) {
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
    this.camera.position.z = 7;

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // 4. Group for combining elements and rotation
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // 5. Particles (Inner AI Core)
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color('#00f5d4');
    const blueColor = new THREE.Color('#00d2ff');

    for (let i = 0; i < particleCount; i++) {
      // Golden ratio sampling for uniform distribution on a sphere
      const theta = Math.acos(-1 + (2 * i) / particleCount);
      const phi = Math.sqrt(particleCount * Math.PI) * theta;
      const r = 2.0;

      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);

      // Add minor random noise for organic feel
      positions[i * 3] = x + (Math.random() - 0.5) * 0.15;
      positions[i * 3 + 1] = y + (Math.random() - 0.5) * 0.15;
      positions[i * 3 + 2] = z + (Math.random() - 0.5) * 0.15;

      // Color lerp
      const mixedColor = cyanColor.clone().lerp(blueColor, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.pointsMesh = new THREE.Points(geometry, material);
    this.group.add(this.pointsMesh);

    // 6. Outer Wireframe Sphere
    const outerGeo = new THREE.IcosahedronGeometry(2.1, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x00f5d4,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });
    this.outerMesh = new THREE.Mesh(outerGeo, outerMat);
    this.group.add(this.outerMesh);
  }

  private animate = () => {
    this.frameId = requestAnimationFrame(this.animate);

    // Default continuous rotations
    if (!this.isDragging) {
      this.pointsMesh.rotation.y += 0.0015;
      this.pointsMesh.rotation.x += 0.0008;

      this.outerMesh.rotation.y -= 0.0006;
      this.outerMesh.rotation.z += 0.001;

      // Smooth interpolation for mouse lag effect
      this.mouseX += (this.targetX - this.mouseX) * 0.05;
      this.mouseY += (this.targetY - this.mouseY) * 0.05;

      this.group.rotation.y = this.mouseX * 0.3;
      this.group.rotation.x = this.mouseY * 0.3;
    }

    this.renderer.render(this.scene, this.camera);
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

  // Pointer dragging events
  onPointerDown(event: PointerEvent) {
    this.isDragging = true;
    this.previousMousePosition = { x: event.clientX, y: event.clientY };
  }

  onPointerMove(event: PointerEvent) {
    if (this.isDragging) {
      const deltaMove = {
        x: event.clientX - this.previousMousePosition.x,
        y: event.clientY - this.previousMousePosition.y
      };

      // Direct drag rotation
      this.group.rotation.y += deltaMove.x * 0.005;
      this.group.rotation.x += deltaMove.y * 0.005;

      this.previousMousePosition = { x: event.clientX, y: event.clientY };
    }
  }

  onPointerUp() {
    this.isDragging = false;
  }
}
