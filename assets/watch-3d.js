import * as THREE from 'three';

export class Watch3D {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.watch = null;
    this.hourHand = null;
    this.minuteHand = null;
    this.secondHand = null;
    
    // Mechanical elements (caseback)
    this.movementGroup = null;
    this.balanceWheel = null;
    this.gear1 = null;
    this.gear2 = null;
    this.gear3 = null;
    this.rotorGroup = null;
    
    // Interaction states
    this.mouse = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };
    this.currentRotation = { x: 0, y: 0 };
    this.manualRotation = { x: 0, y: 0 };
    
    this.targetCameraZ = 2.5;
    this.showCaseback = false;
    this.isAutoRotating = true;
    this.animationId = null;

    this.init();
    this.createWatch();
    this.setupLights();
    this.setupControls();
    this.injectUI();
    this.animate();
  }

  init() {
    const width = this.container.clientWidth || 400;
    const height = this.container.clientHeight || 400;

    this.scene = new THREE.Scene();
    this.scene.background = null;

    this.camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    this.camera.position.z = this.targetCameraZ;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => this.onWindowResize());
  }

  createWatch() {
    this.watch = new THREE.Group();

    // ================== DIAL SIDE (FRONT) ==================
    const watchGroupFront = new THREE.Group();

    // Watch case ring
    const caseGeometry = new THREE.CylinderGeometry(1.02, 1.02, 0.22, 64);
    const caseMaterial = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 0.25,
      metalness: 0.9,
    });
    const watchCase = new THREE.Mesh(caseGeometry, caseMaterial);
    watchCase.rotation.x = Math.PI / 2;
    watchCase.castShadow = true;
    watchCase.receiveShadow = true;
    this.watch.add(watchCase);

    // Watch dial (face)
    const dialGeometry = new THREE.CylinderGeometry(0.95, 0.95, 0.03, 64);
    const dialMaterial = new THREE.MeshStandardMaterial({
      color: 0x121e36, // Premium deep midnight blue
      roughness: 0.35,
      metalness: 0.15,
    });
    const dial = new THREE.Mesh(dialGeometry, dialMaterial);
    dial.position.z = 0.08;
    dial.rotation.x = Math.PI / 2;
    dial.receiveShadow = true;
    watchGroupFront.add(dial);

    // Inner gold bezel
    const bezelGeometry = new THREE.TorusGeometry(0.96, 0.02, 16, 100);
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xC4956A, // Warm AUNA gold
      roughness: 0.15,
      metalness: 0.85,
    });
    const bezel = new THREE.Mesh(bezelGeometry, goldMaterial);
    bezel.position.z = 0.095;
    watchGroupFront.add(bezel);

    // Hour markers (12 gold dots)
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * Math.PI / 180;
      const x = 0.76 * Math.cos(angle - Math.PI / 2);
      const y = 0.76 * Math.sin(angle - Math.PI / 2);

      const markerGeometry = new THREE.CylinderGeometry(0.035, 0.035, 0.015, 32);
      const marker = new THREE.Mesh(markerGeometry, goldMaterial);
      marker.position.set(x, y, 0.105);
      marker.rotation.x = Math.PI / 2;
      marker.castShadow = true;
      watchGroupFront.add(marker);
    }

    // Hands material
    const handMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.6,
    });

    // Hour hand (centered, offset for proper rotational pivot)
    const hourHandGeo = new THREE.BoxGeometry(0.06, 0.35, 0.015);
    hourHandGeo.translate(0, 0.125, 0); // Translate so pivot is at center of watch
    this.hourHand = new THREE.Mesh(hourHandGeo, handMaterial);
    this.hourHand.position.set(0, 0, 0.11);
    this.hourHand.castShadow = true;
    watchGroupFront.add(this.hourHand);

    // Minute hand
    const minuteHandGeo = new THREE.BoxGeometry(0.045, 0.52, 0.015);
    minuteHandGeo.translate(0, 0.2, 0);
    this.minuteHand = new THREE.Mesh(minuteHandGeo, handMaterial);
    this.minuteHand.position.set(0, 0, 0.12);
    this.minuteHand.castShadow = true;
    watchGroupFront.add(this.minuteHand);

    // Second hand (elegant rose-gold accent)
    const secondHandGeo = new THREE.BoxGeometry(0.02, 0.6, 0.01);
    secondHandGeo.translate(0, 0.22, 0);
    const secondMaterial = new THREE.MeshStandardMaterial({
      color: 0xE8D4C0,
      roughness: 0.1,
      metalness: 0.8,
    });
    this.secondHand = new THREE.Mesh(secondHandGeo, secondMaterial);
    this.secondHand.position.set(0, 0, 0.13);
    this.secondHand.castShadow = true;
    watchGroupFront.add(this.secondHand);

    // Center gold cap
    const capGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 32);
    const cap = new THREE.Mesh(capGeometry, goldMaterial);
    cap.position.set(0, 0, 0.135);
    cap.rotation.x = Math.PI / 2;
    cap.castShadow = true;
    watchGroupFront.add(cap);

    this.watch.add(watchGroupFront);

    // ================== CASEBACK SIDE (BACK) ==================
    this.movementGroup = new THREE.Group();
    // Rotate so its z axis is facing back
    this.movementGroup.position.z = -0.06;

    // Movement base plate (dark grey circular steel plate with circular lines)
    const movementPlateGeo = new THREE.CylinderGeometry(0.94, 0.94, 0.04, 64);
    const movementPlateMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.4,
      metalness: 0.9,
    });
    const movementBase = new THREE.Mesh(movementPlateGeo, movementPlateMat);
    movementBase.rotation.x = Math.PI / 2;
    this.movementGroup.add(movementBase);

    // Bridge plates (sub-plates with skeleton cutouts)
    const bridgeGeo = new THREE.CylinderGeometry(0.88, 0.88, 0.02, 32, 1, false, 0, Math.PI * 1.3);
    const bridgeMat = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 0.3,
      metalness: 0.9,
    });
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge.position.z = -0.01;
    bridge.rotation.x = Math.PI / 2;
    this.movementGroup.add(bridge);

    // Balance Wheel (Golden oscillation ring)
    const balanceGroup = new THREE.Group();
    balanceGroup.position.set(-0.35, -0.2, -0.015);
    
    const balanceRingGeo = new THREE.TorusGeometry(0.24, 0.02, 12, 48);
    const balanceRing = new THREE.Mesh(balanceRingGeo, goldMaterial);
    balanceGroup.add(balanceRing);

    const balanceSpokeGeo = new THREE.BoxGeometry(0.03, 0.46, 0.01);
    const balanceSpoke = new THREE.Mesh(balanceSpokeGeo, goldMaterial);
    balanceGroup.add(balanceSpoke);
    
    this.balanceWheel = balanceGroup;
    this.movementGroup.add(this.balanceWheel);

    // Ruby jewel pivots (bearing jewels on wheels)
    const rubyMaterial = new THREE.MeshStandardMaterial({
      color: 0xff1e56,
      roughness: 0.05,
      metalness: 0.9,
      emissive: 0x440011,
    });
    const rubyGeo = new THREE.SphereGeometry(0.028, 16, 16);
    
    // Balance pivot jewel
    const jewel1 = new THREE.Mesh(rubyGeo, rubyMaterial);
    jewel1.position.set(-0.35, -0.2, -0.022);
    this.movementGroup.add(jewel1);

    // Gear 1 (Escapement/small brass gear)
    this.gear1 = new THREE.Group();
    this.gear1.position.set(-0.15, -0.05, -0.012);
    const gear1Mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.01, 16), goldMaterial);
    gear1Mesh.rotation.x = Math.PI / 2;
    this.gear1.add(gear1Mesh);
    this.movementGroup.add(this.gear1);

    const jewel2 = new THREE.Mesh(rubyGeo, rubyMaterial);
    jewel2.position.set(-0.15, -0.05, -0.018);
    this.movementGroup.add(jewel2);

    // Gear 2 (Intermediate silver gear)
    this.gear2 = new THREE.Group();
    this.gear2.position.set(0.12, -0.22, -0.012);
    const gear2Mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.01, 24), bridgeMat);
    gear2Mesh.rotation.x = Math.PI / 2;
    this.gear2.add(gear2Mesh);
    this.movementGroup.add(this.gear2);

    const jewel3 = new THREE.Mesh(rubyGeo, rubyMaterial);
    jewel3.position.set(0.12, -0.22, -0.018);
    this.movementGroup.add(jewel3);

    // Gear 3 (Mainspring large brass barrel gear)
    this.gear3 = new THREE.Group();
    this.gear3.position.set(0.2, 0.2, -0.012);
    const gear3Mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.015, 32), goldMaterial);
    gear3Mesh.rotation.x = Math.PI / 2;
    this.gear3.add(gear3Mesh);
    this.movementGroup.add(this.gear3);

    const jewel4 = new THREE.Mesh(rubyGeo, rubyMaterial);
    jewel4.position.set(0.2, 0.2, -0.02);
    this.movementGroup.add(jewel4);

    // Automatic Rotor (Self-winding oscillating weight)
    this.rotorGroup = new THREE.Group();
    this.rotorGroup.position.set(0, 0, -0.024);

    // Semi-circular weight (rotor)
    const rotorWeightGeo = new THREE.CylinderGeometry(0.88, 0.88, 0.022, 32, 1, false, 0, Math.PI);
    const rotorWeightMat = new THREE.MeshStandardMaterial({
      color: 0xb58455, // Gold finish rotor
      roughness: 0.2,
      metalness: 0.85,
    });
    const rotorWeight = new THREE.Mesh(rotorWeightGeo, rotorWeightMat);
    rotorWeight.rotation.x = Math.PI / 2;
    // Offset the mesh so it pivots from the center
    rotorWeight.position.y = -0.44; 
    
    // Rotor arm structure
    const rotorArmGeo = new THREE.BoxGeometry(0.12, 0.44, 0.022);
    const rotorArm = new THREE.Mesh(rotorArmGeo, rotorWeightMat);
    rotorArm.position.y = -0.22;
    
    this.rotorGroup.add(rotorWeight);
    this.rotorGroup.add(rotorArm);

    // Rotor center ball-bearing cap
    const rotorCapGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.028, 16);
    const rotorCapMat = new THREE.MeshStandardMaterial({
      color: 0x999999,
      roughness: 0.1,
      metalness: 0.9,
    });
    const rotorCap = new THREE.Mesh(rotorCapGeo, rotorCapMat);
    rotorCap.rotation.x = Math.PI / 2;
    this.rotorGroup.add(rotorCap);

    this.movementGroup.add(this.rotorGroup);

    // Exhibition back glass cover (seals the movement)
    const backGlassGeo = new THREE.CylinderGeometry(0.92, 0.92, 0.01, 64);
    const backGlassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      roughness: 0.05,
      metalness: 0.1,
    });
    const backGlass = new THREE.Mesh(backGlassGeo, backGlassMat);
    backGlass.rotation.x = Math.PI / 2;
    backGlass.position.z = -0.038;
    this.movementGroup.add(backGlass);

    this.watch.add(this.movementGroup);

    this.scene.add(this.watch);
  }

  setupLights() {
    // Ambient light (soft white)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    // Primary bright studio light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    this.scene.add(keyLight);

    // Fill Light (ambient blue glow for premium shadows)
    const fillLight = new THREE.DirectionalLight(0x7ea0cc, 0.6);
    fillLight.position.set(-5, 3, 3);
    this.scene.add(fillLight);

    // Rim Gold Light
    const accentLight = new THREE.PointLight(0xC4956A, 0.8, 15);
    accentLight.position.set(-2, -3, 2);
    this.scene.add(accentLight);
  }

  setupControls() {
    let isDragging = false;
    let prevPosition = { x: 0, y: 0 };

    const onMove = (clientX, clientY) => {
      if (isDragging) {
        const deltaX = clientX - prevPosition.x;
        const deltaY = clientY - prevPosition.y;

        this.manualRotation.y += deltaX * 0.008;
        this.manualRotation.x += deltaY * 0.008;

        prevPosition = { x: clientX, y: clientY };
        this.isAutoRotating = false;
        
        const autoRotateBtn = document.getElementById('ctrl-auto-rotate');
        if (autoRotateBtn) autoRotateBtn.classList.remove('active');
      } else {
        // Fallback gentle mouse parallax
        this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
      }
    };

    // Desktop Drag
    this.renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevPosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      onMove(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Mobile touch
    this.renderer.domElement.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Scroll Zoom support on container hover
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.targetCameraZ += e.deltaY * 0.003;
      this.targetCameraZ = Math.max(1.3, Math.min(this.targetCameraZ, 4.0));
    }, { passive: false });
  }

  injectUI() {
    // Add dynamic stylesheet for watch controls if not exists
    if (!document.getElementById('watch-controls-style')) {
      const style = document.createElement('style');
      style.id = 'watch-controls-style';
      style.textContent = `
        .watch-control-bar {
          position: absolute;
          bottom: -72px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          background: rgba(250, 250, 248, 0.8);
          backdrop-filter: blur(20px) saturate(140%);
          -webkit-backdrop-filter: blur(20px) saturate(140%);
          border: 1px solid rgba(15, 13, 10, 0.08);
          border-radius: 99px;
          padding: 6px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          z-index: 200;
          pointer-events: auto;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        body[style*="background: #0F0D0A"] .watch-control-bar,
        body[style*="background:#0F0D0A"] .watch-control-bar,
        body.dark-theme .watch-control-bar,
        body[class*="dark"] .watch-control-bar {
          background: rgba(26, 23, 20, 0.95);
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        }

        @media (max-width: 860px) {
          .watch-control-bar {
            bottom: -82px;
            scale: 0.85;
          }
        }

        .watch-ctrl-btn {
          background: transparent;
          border: none;
          border-radius: 99px;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-dim, #4A4641);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        body[style*="background: #0F0D0A"] .watch-ctrl-btn,
        body[style*="background:#0F0D0A"] .watch-ctrl-btn,
        body.dark-theme .watch-ctrl-btn,
        body[class*="dark"] .watch-ctrl-btn {
          color: rgba(255, 255, 255, 0.7);
        }

        .watch-ctrl-btn svg {
          width: 20px;
          height: 20px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .watch-ctrl-btn:hover {
          background: var(--accent-light, #E8D4C0);
          color: var(--accent-dark, #8B6F47);
        }

        body[style*="background: #0F0D0A"] .watch-ctrl-btn:hover,
        body[style*="background:#0F0D0A"] .watch-ctrl-btn:hover,
        body.dark-theme .watch-ctrl-btn:hover,
        body[class*="dark"] .watch-ctrl-btn:hover {
          background: var(--accent, #C4956A);
          color: #0F0D0A;
        }

        .watch-ctrl-btn.active {
          background: var(--accent, #C4956A);
          color: #ffffff;
        }

        body[style*="background: #0F0D0A"] .watch-ctrl-btn.active,
        body[style*="background:#0F0D0A"] .watch-ctrl-btn.active,
        body.dark-theme .watch-ctrl-btn.active,
        body[class*="dark"] .watch-ctrl-btn.active {
          background: var(--accent, #C4956A);
          color: #0F0D0A;
        }
      `;
      document.head.appendChild(style);
    }

    // Create the Control Bar
    const controlBar = document.createElement('div');
    controlBar.className = 'watch-control-bar';
    controlBar.innerHTML = `
      <button class="watch-ctrl-btn" id="ctrl-caseback" title="Show Automatic Movement">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 7a5 5 0 1 0 0 10"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>
      </button>
      <button class="watch-ctrl-btn active" id="ctrl-auto-rotate" title="Toggle Display Rotation">
        <svg viewBox="0 0 24 24">
          <path d="M21.5 2v6h-6"/>
          <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l.73-.73"/>
        </svg>
      </button>
      <button class="watch-ctrl-btn" id="ctrl-zoom-in" title="Zoom In">
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="11" y1="8" x2="11" y2="14"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </button>
      <button class="watch-ctrl-btn" id="ctrl-zoom-out" title="Zoom Out">
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </button>
      <button class="watch-ctrl-btn" id="ctrl-reset" title="Reset Camera">
        <svg viewBox="0 0 24 24">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
          <path d="M16 3h5v5"/>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
          <path d="M8 21H3v-5"/>
        </svg>
      </button>
    `;

    // Ensure container has relative styling so our absolute bar places nicely
    const currentStyle = window.getComputedStyle(this.container);
    if (currentStyle.position === 'static') {
      this.container.style.position = 'relative';
    }

    this.container.appendChild(controlBar);

    // Event Wireup
    document.getElementById('ctrl-caseback').addEventListener('click', (e) => {
      e.stopPropagation();
      this.showCaseback = !this.showCaseback;
      const btn = document.getElementById('ctrl-caseback');
      if (this.showCaseback) {
        btn.classList.add('active');
        // Reset manual orientation when switching to caseback to view it upright
        this.manualRotation.x = 0;
        this.manualRotation.y = 0;
      } else {
        btn.classList.remove('active');
        this.manualRotation.x = 0;
        this.manualRotation.y = 0;
      }
    });

    document.getElementById('ctrl-auto-rotate').addEventListener('click', (e) => {
      e.stopPropagation();
      this.isAutoRotating = !this.isAutoRotating;
      document.getElementById('ctrl-auto-rotate').classList.toggle('active', this.isAutoRotating);
    });

    document.getElementById('ctrl-zoom-in').addEventListener('click', (e) => {
      e.stopPropagation();
      this.targetCameraZ = Math.max(1.3, this.targetCameraZ - 0.3);
    });

    document.getElementById('ctrl-zoom-out').addEventListener('click', (e) => {
      e.stopPropagation();
      this.targetCameraZ = Math.min(4.0, this.targetCameraZ + 0.3);
    });

    document.getElementById('ctrl-reset').addEventListener('click', (e) => {
      e.stopPropagation();
      this.manualRotation.x = 0;
      this.manualRotation.y = 0;
      this.targetCameraZ = 2.5;
      this.showCaseback = false;
      this.isAutoRotating = true;
      document.getElementById('ctrl-caseback').classList.remove('active');
      document.getElementById('ctrl-auto-rotate').classList.add('active');
    });
  }

  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  updateHandRotations() {
    const now = new Date();
    const ms = now.getMilliseconds();
    const s = now.getSeconds() + ms / 1000;
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;

    // Smooth continuous sweeping for mechanical feel
    this.secondHand.rotation.z = -(s * 6 * Math.PI / 180);
    this.minuteHand.rotation.z = -(m * 6 * Math.PI / 180);
    this.hourHand.rotation.z = -(h * 30 * Math.PI / 180);
  }

  animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    // Front dial time sweeping
    this.updateHandRotations();

    // Rotate mechanical elements in caseback movement
    const time = Date.now() * 0.001;
    if (this.balanceWheel) {
      // High frequency heartbeat oscillation (4Hz = 8 pi rad/s)
      this.balanceWheel.rotation.z = Math.sin(time * 25) * 1.1;
    }
    if (this.gear1) this.gear1.rotation.y += 0.04; // escapement wheel
    if (this.gear2) this.gear2.rotation.y -= 0.015; // intermediary
    if (this.gear3) this.gear3.rotation.y += 0.004; // slow barrel

    // Auto-rotation handling
    if (this.isAutoRotating) {
      this.manualRotation.y += 0.006;
    }

    // Determine target rotation based on parallax and manual adjustments
    // If showCaseback is true, we flip Y-axis 180 deg to show the exhibition back
    const baseFlipY = this.showCaseback ? Math.PI : 0;
    
    // Smooth interpolation to target values
    this.targetRotation.y = baseFlipY + this.manualRotation.y + (this.mouse.x * 0.24);
    this.targetRotation.x = this.manualRotation.x + (this.mouse.y * 0.18);

    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.07;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.07;

    this.watch.rotation.x = this.currentRotation.x;
    this.watch.rotation.y = this.currentRotation.y;

    // Self-winding rotor physics lag simulation (rotor swings with gravity when watch tilts)
    if (this.rotorGroup) {
      const tiltZ = -this.currentRotation.y * 1.5 - Math.sin(this.currentRotation.x) * 1.2;
      this.rotorGroup.rotation.z += (tiltZ - this.rotorGroup.rotation.z) * 0.06;
    }

    // Smooth camera zoom
    this.camera.position.z += (this.targetCameraZ - this.camera.position.z) * 0.08;

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
    const bar = this.container.querySelector('.watch-control-bar');
    if (bar) {
      this.container.removeChild(bar);
    }
  }
}
