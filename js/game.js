// game.js — main orchestrator. Owns Three.js renderer, scene, camera, render loop.
import * as THREE from 'three';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();
    this.fpsAccum = 0;
    this.fpsFrames = 0;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // sky blue
    this.scene.fog = new THREE.Fog(0x87ceeb, 50, 200);

    // Camera (perspective, slightly tilted top-down)
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    );
    this.camera.position.set(0, 12, -18);
    this.camera.lookAt(0, 0, 0);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff4e0, 1.0);
    sun.position.set(30, 50, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 200;
    sun.shadow.camera.left = -60;
    sun.shadow.camera.right = 60;
    sun.shadow.camera.top = 60;
    sun.shadow.camera.bottom = -60;
    this.scene.add(sun);

    // Ground plane (100m x 100m, gray)
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
    this.ground = new THREE.Mesh(groundGeo, groundMat);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);

    // Gameplay state
    this.gameplayStarted = false;
    this.currentScene = 'boot';

    // Input system (Ticket 03)
    import('./systems/InputSystem.js').then((mod) => {
      this.input = new mod.InputSystem(window);
      console.log('[Game] InputSystem ready');
    }).catch((err) => {
      console.error('[Game] InputSystem FAILED:', err);
    });

    // Handle resize
    window.addEventListener('resize', () => this._onResize());
  }

  start() {
    const loop = () => {
      const dt = Math.min(this.clock.getDelta(), 0.05); // cap dt to avoid spikes
      this._update(dt);
      this._render();
      this._updateFps(dt);
      this._postFrame();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  startGameplay() {
    this.gameplayStarted = true;
    // Tickets 05+ will replace this stub
    console.log('[Game] Gameplay start requested (overworld + arena pending tickets 05+06)');
  }

  _update(dt) {
    // Subclasses/scenes will hook in via their own update in later tickets
  }

  _render() {
    this.renderer.render(this.scene, this.camera);
  }

  _postFrame() {
    // Clear edge-triggered input states at end of frame
    if (this.input) this.input.endFrame();
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  _updateFps(dt) {
    this.fpsAccum += dt;
    this.fpsFrames += 1;
    if (this.fpsAccum >= 0.5) {
      const fps = Math.round(this.fpsFrames / this.fpsAccum);
      const el = document.getElementById('fps');
      if (el) el.textContent = `FPS: ${fps}`;
      this.fpsAccum = 0;
      this.fpsFrames = 0;
    }
  }
}
