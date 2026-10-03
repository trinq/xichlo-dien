// assets.js — Vehicle mesh loader with Kenney fetch + primitive fallback.
//
// Strategy: try to fetch a Kenney Vehicle Kit GLB from CDN. On any failure
// (offline, CORS, missing), build the vehicle from Three.js primitives.
// Every vehicle returned has userData.colliderSize = { x, y, z } for AABB.
//
// All vehicles face +Z by default. Caller is responsible for rotation.

import * as THREE from 'three';

// CDN URL for Kenney Vehicle Kit (CC0). If unreachable, we fall back.
const KENNEY_BASE = 'https://raw.githubusercontent.com/KenneyNL/Assets/master/Vehicles/GLB';
const KENNEY_MAP = {
  car:       'delivery-flat.glb',       // approximate stand-in
  motorcycle:'motorbike.glb',
  truck:     'truck.glb',
  // cyclo and bagaxi have no Kenney equivalents → always primitive
};

const WHEEL = 0.35;

// Collider sizes per type (matches primitive dimensions roughly)
const COLLIDER = {
  car:        { x: 2.0, y: 1.2, z: 4.0 },
  motorcycle: { x: 0.8, y: 1.4, z: 2.0 },
  cyclo:      { x: 1.4, y: 1.6, z: 2.4 },
  bagaxi:     { x: 1.6, y: 1.8, z: 3.0 },
  truck:      { x: 2.4, y: 2.2, z: 6.0 },
};

let _loader = null;
let _glbCache = new Map(); // url -> THREE.Group | null

function getLoader() {
  if (!_loader) {
    // Lazy-import GLTFLoader via dynamic import (ES module CDN)
    // Fallback: if not available, primitives only.
    _loader = new Promise((resolve) => {
      import('https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js')
        .then((mod) => resolve(new mod.GLTFLoader()))
        .catch(() => resolve(null));
    });
  }
  return _loader;
}

async function tryLoadKenney(type) {
  const url = KENNEY_BASE + '/' + KENNEY_MAP[type];
  if (!url.endsWith('GLB')) return null; // sanity

  if (_glbCache.has(url)) return _glbCache.get(url);

  const loader = await getLoader();
  if (!loader) {
    _glbCache.set(url, null);
    return null;
  }

  try {
    const gltf = await new Promise((res, rej) => {
      loader.load(url, res, undefined, rej);
    });
    const group = gltf.scene || gltf.scenes[0];
    _glbCache.set(url, group);
    return group;
  } catch (e) {
    // console.warn('[assets] Kenney fetch failed, using primitive:', type, e.message);
    _glbCache.set(url, null);
    return null;
  }
}

// Public API: returns Promise<THREE.Group>
export async function loadVehicle(type) {
  if (!COLLIDER[type]) {
    throw new Error(`[assets] Unknown vehicle type: ${type}`);
  }

  let mesh = await tryLoadKenney(type);
  if (!mesh) {
    mesh = buildPrimitive(type);
  }

  mesh.userData.colliderSize = { ...COLLIDER[type] };
  mesh.userData.vehicleType = type;
  return mesh;
}

// === Primitive builders ===

const _mat = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.2 });
const _wheelMat = _mat(0x222222);
const _hubMat = _mat(0xaaaaaa);

function makeWheel() {
  const g = new THREE.Group();
  const tire = new THREE.Mesh(new THREE.CylinderGeometry(WHEEL, WHEEL, 0.3, 12), _wheelMat);
  tire.rotation.z = Math.PI / 2;
  g.add(tire);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(WHEEL * 0.5, WHEEL * 0.5, 0.32, 8), _hubMat);
  hub.rotation.z = Math.PI / 2;
  g.add(hub);
  return g;
}

function buildPrimitive(type) {
  switch (type) {
    case 'car':        return _buildCar();
    case 'motorcycle': return _buildMotorcycle();
    case 'cyclo':      return _buildCyclo();
    case 'bagaxi':     return _buildBagaxi();
    case 'truck':      return _buildTruck();
    default:           return _buildCar();
  }
}

function _buildCar() {
  const g = new THREE.Group();
  // Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 3.6), _mat(0x1976d2));
  body.position.y = 0.7;
  body.castShadow = true;
  g.add(body);
  // Cabin
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 1.8), _mat(0x0d47a1));
  cabin.position.set(0, 1.4, -0.2);
  cabin.castShadow = true;
  g.add(cabin);
  // Wheels (4)
  const offsets = [[-0.9, 0.3, 1.3], [0.9, 0.3, 1.3], [-0.9, 0.3, -1.3], [0.9, 0.3, -1.3]];
  offsets.forEach(([x, y, z]) => g.add(_placeWheel(x, y, z)));
  return g;
}

function _buildMotorcycle() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 1.6), _mat(0xd32f2f));
  body.position.y = 0.6;
  body.castShadow = true;
  g.add(body);
  const tank = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 6), _mat(0xb71c1c));
  tank.position.set(0, 0.85, 0.2);
  tank.scale.set(1, 0.8, 1.4);
  g.add(tank);
  // 2 wheels
  g.add(_placeWheel(0, 0.3, 0.9));
  g.add(_placeWheel(0, 0.3, -0.9));
  return g;
}

function _buildCyclo() {
  // Vietnamese cyclo: 3-wheel bicycle with passenger cabin in front
  const g = new THREE.Group();
  // Passenger cabin (yellow, signature)
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 1.4), _mat(0xffeb3b));
  cabin.position.set(0, 0.9, 0.6);
  cabin.castShadow = true;
  g.add(cabin);
  // Cabin roof (slight curve = box)
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.1, 1.5), _mat(0xfdd835));
  roof.position.set(0, 1.45, 0.6);
  g.add(roof);
  // Driver area behind cabin
  const driver = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.6), _mat(0x5d4037));
  driver.position.set(0, 0.6, -0.4);
  g.add(driver);
  // Handlebar
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6), _hubMat);
  bar.rotation.x = Math.PI / 2;
  bar.position.set(0, 1.0, -0.7);
  g.add(bar);
  // 1 front wheel + 2 rear wheels
  g.add(_placeWheel(0, 0.3, -0.9));   // front
  g.add(_placeWheel(-0.55, 0.3, 0.4)); // rear left
  g.add(_placeWheel(0.55, 0.3, 0.4));  // rear right
  return g;
}

function _buildBagaxi() {
  // Xe ba gác: 3-wheel cargo carrier
  const g = new THREE.Group();
  // Driver cabin (front)
  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.8), _mat(0x388e3c));
  cab.position.set(0, 0.9, -1.0);
  cab.castShadow = true;
  g.add(cab);
  // Cargo bed (rear, large)
  const bed = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.8, 1.6), _mat(0x8d6e63));
  bed.position.set(0, 0.7, 0.4);
  bed.castShadow = true;
  g.add(bed);
  // Cargo side rails
  const railMat = _mat(0x6d4c41);
  const railL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 1.6), railMat);
  railL.position.set(-0.8, 1.2, 0.4);
  g.add(railL);
  const railR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 1.6), railMat);
  railR.position.set(0.8, 1.2, 0.4);
  g.add(railR);
  // 1 front wheel + 2 rear wheels
  g.add(_placeWheel(0, 0.3, -1.5));
  g.add(_placeWheel(-0.6, 0.3, 0.8));
  g.add(_placeWheel(0.6, 0.3, 0.8));
  return g;
}

function _buildTruck() {
  const g = new THREE.Group();
  // Cab
  const cab = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 1.6), _mat(0xe53935));
  cab.position.set(0, 1.2, -2.0);
  cab.castShadow = true;
  g.add(cab);
  // Cargo container
  const cargo = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.0, 3.0), _mat(0xfafafa));
  cargo.position.set(0, 1.4, 0.5);
  cargo.castShadow = true;
  g.add(cargo);
  // 6 wheels (3 per side)
  for (let side of [-1.1, 1.1]) {
    for (let z of [1.5, 0.5, -0.5]) {
      g.add(_placeWheel(side, 0.3, z));
    }
  }
  return g;
}

function _placeWheel(x, y, z) {
  const w = makeWheel();
  w.position.set(x, y, z);
  return w;
}
