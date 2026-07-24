import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-neural-bg',
  imports: [],
  templateUrl: './neural-bg.html',
  styleUrl: './neural-bg.css',
})
export class NeuralBg implements AfterViewInit, OnDestroy {
  @ViewChild('bgContainer', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private points!: THREE.Points;
  private frameId!: number;

  // Interactivity / Parallax state
  private targetX = 0;
  private targetY = 0;
  private mouseX = 0;
  private mouseY = 0;
  private scrollY = 0;
  private targetScrollY = 0;

  ngAfterViewInit() {
    this.initThree();
    this.animate();
  }

  ngOnDestroy() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.points) {
      this.points.geometry.dispose();
      (this.points.material as THREE.Material).dispose();
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
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    this.camera.position.z = 15;

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // 4. Particles (Starfield / Neural Dust)
    const particleCount = 600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;     // X
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50; // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50; // Z
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x00f5d4,
      size: 0.07,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);
  }

  private animate = () => {
    this.frameId = requestAnimationFrame(this.animate);

    // Smooth calculations (lerp)
    this.mouseX += (this.targetX - this.mouseX) * 0.05;
    this.mouseY += (this.targetY - this.mouseY) * 0.05;
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.05;

    // Apply continuous rotation + mouse interaction
    this.points.rotation.y = this.mouseX * 0.15 + (this.frameId * 0.0005);
    this.points.rotation.x = this.mouseY * 0.15;

    // Parallax scroll vertical translation
    this.points.position.y = this.scrollY * 0.007;

    this.renderer.render(this.scene, this.camera);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.targetX = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    this.targetY = (event.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.targetScrollY = window.scrollY;
  }

  @HostListener('window:resize')
  onResize() {
    if (!this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}
