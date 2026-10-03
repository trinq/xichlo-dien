# SPEC — XÍCH LÔ ĐIÊN

> **Status**: `ready-for-agent`
> **Triage**: ready-for-agent
> **Last updated**: 2026-10-03
> **Glossary**: [GLOSSARY.md](./GLOSSARY.md)

## Problem Statement

Người dùng muốn build game top-down 3D arcade phong cách đua xe + bắn súng, lấy bối cảnh đường phố Sài Gòn với các phương tiện đặc trưng Việt Nam (xích lô, xe ba gác, xe máy, ô tô, xe tải). Game phải chạy trên browser, deploy miễn phí, không cần backend, build trong 1 session và deliver qua Cloudflare Pages.

Vấn đề cụ thể:
- Không có game arcade "đua xe bắn súng" nào có theme Sài Gòn trên thị trường.
- Người dùng muốn game vui, dễ chơi, cảm giác "Việt Nam" rõ ràng (xe, nhạc, giọng nói, cảnh quan).
- Game phải chạy mượt trên browser desktop, không cần cài đặt.
- Phải triển khai nhanh, demo được ngay, có thể chia sẻ link.

## Solution

Build game web 3D arcade dùng Three.js, gồm 2 loop chính:
1. **Overworld** — player lái xích lô/xe trên đường phố Sài Gòn, enemy rượt theo từ sau.
2. **Arena** — khi player chạm enemy, chuyển sang arena top-down 3D, bắn hết 3-7 enemy để qua màn.

Mỗi màn thắng → ShopScene mua xe/vũ khí → Overworld màn mới. Sau 5 màn → win.

Mọi asset dùng CC0 (Kenney Vehicle Kit) hoặc tự build bằng primitive Three.js. Âm thanh synth bằng WebAudio. Deploy qua Cloudflare Pages tại `xichloden.pages.dev`.

## User Stories

### Core Gameplay

1. As a player, I want to start the game from a main menu, so that I can choose when to begin playing.
2. As a player, I want to choose my vehicle (ô tô / xe máy / xích lô / xe ba gác) before starting, so that I can play with my preferred style.
3. As a player, I want to see a 1-line intro explaining the game vibe, so that I understand the context immediately.
4. As a player, I want to drive my vehicle in the overworld with WASD, so that I can move naturally.
5. As a player, I want the camera to follow my vehicle smoothly, so that I can focus on the action.
6. As a player, I want to see enemy vehicles chasing me from behind in the overworld, so that I feel the pressure.
7. As a player, I want enemy contact to trigger arena mode, so that I have a chance to fight back.
8. As a player, I want to shoot weapons with mouse click in arena, so that I can defend myself.
9. As a player, I want to use 6 different weapons (machine gun, shotgun, rocket, mine, flame, sticky bomb), so that combat stays varied.
10. As a player, I want to switch weapons with number keys 1-6, so that I can adapt to situations.
11. As a player, I want ammo and reload mechanics, so that weapons feel balanced.
12. As a player, I want HP bar for my vehicle, so that I know how close to death I am.
13. As a player, I want to die and respawn at last checkpoint, so that I don't lose all progress.
14. As a player, I want to see kill count, so that I track my progress in the arena.
15. As a player, I want to win the arena by killing all enemies, so that I can proceed to the next level.
16. As a player, I want a shop between levels to buy new vehicles and weapons, so that I can upgrade.
17. As a player, I want to spend money earned from kills, so that upgrades feel rewarding.
18. As a player, I want enemy AI to use tactics (flank, shoot from range, chase), so that combat feels intelligent.
19. As a player, I want 5 levels with increasing difficulty, so that I have a clear progression.
20. As a player, I want a boss fight on level 5 (xe tải 250HP), so that the game has a climax.
21. As a player, I want a win screen after completing all 5 levels, so that I feel accomplished.

### Vehicles

22. As a player, I want 4 player vehicle types with different stats (speed, HP, ammo capacity), so that I can experiment.
23. As a player, I want xích lô to be slow but tanky (matching real-life cyclo), so that vehicle identity is clear.
24. As a player, I want xe máy to be fast but fragile, so that speed has tradeoffs.
25. As a player, I want xe ba gác to be slow but with high ammo capacity, so that it feels like a weapons platform.
26. As a player, I want ô tô to be balanced, so that it's a safe default.
27. As a player, I want to unlock new vehicles by buying them in the shop, so that I have a goal.
28. As a player, I want to see 5 enemy vehicle types in arenas, so that combat is visually varied.

### Visual & Atmosphere

29. As a player, I want the game set in a Saigon street (vỉa hè, hàng quán, đèn đường vàng), so that the theme is unmistakable.
30. As a player, I want low-poly 3D models with simple materials, so that the game loads fast.
31. As a player, I want the camera angle to be top-down 3D (slight perspective), so that I can see the action.
32. As a player, I want dynamic camera zoom based on speed, so that high-speed moments feel intense.
33. As a player, I want shadows and simple lighting, so that the world has depth.
34. As a player, I want explosions and hit effects, so that combat feels impactful.
35. As a player, I want the screen to shake on explosions, so that I feel the damage.

### Audio

36. As a player, I want sound effects for shooting, hits, explosions, so that combat is satisfying.
37. As a player, I want background music synth with Vietnamese flavor (trống + sáo + đàn bầu), so that audio matches the theme.
38. As a player, I want voice snippets in Vietnamese ("SẴN SÀNG!", "ĐÃ HẠ!", "TIÊU DIỆT!"), so that feedback is clear.
39. As a player, I want to toggle sound on/off in the menu, so that I can play silently if needed.

### HUD

40. As a player, I want HP bar in top-left, so that I can see my health.
41. As a player, I want ammo counter in bottom-right, so that I know when to reload.
42. As a player, I want money counter in top-right, so that I see my wealth.
43. As a player, I want current weapon icon in bottom-left, so that I know which gun is active.
44. As a player, I want kill count in arena, so that I track progress.
45. As a player, I want a minimap showing enemy positions, so that I can plan tactics.

### Persistence

46. As a player, I want my money and unlocked vehicles to be saved between sessions, so that I don't lose progress.
47. As a player, I want to reset progress if I want to start over.

### Deployment

48. As a player, I want to access the game via a public URL, so that I can play anywhere.
49. As a developer, I want the game to deploy via Cloudflare Pages, so that hosting is free and fast.
50. As a developer, I want the game to be a single static folder deployable via drag-and-drop, so that deployment is trivial.

## Implementation Decisions

### Architecture (1 main seam: `Game` orchestrator)

The codebase will have **one main orchestrator class** `Game` that owns all systems. No factory, no DI container, no abstraction layer. Each system is a plain class instantiated by `Game` in its constructor.

```
Game {
  scenes: { menu, overworld, arena, shop, gameover }
  systems: { input, physics, ai, weapon, spawn, camera, render, audio, hud, save, transition }
  currentScene: Scene  // active scene
  start(), update(dt), render()
}
```

Each scene has `enter()`, `exit()`, `update(dt)`, `render()`. Scene change is triggered by the `TransitionSystem`.

### Modules

1. **Game.js** — main orchestrator, owns Three.js renderer + scene.
2. **scenes/MenuScene.js** — main menu, vehicle selection, intro text.
3. **scenes/OverworldScene.js** — driving in Saigon streets, enemy chase, contact → arena.
4. **scenes/ArenaScene.js** — top-down 3D combat, kill all enemies to win.
5. **scenes/ShopScene.js** — buy vehicles/weapons with money.
6. **scenes/GameOverScene.js** — retry or back to menu.
7. **systems/InputSystem.js** — keyboard + mouse state.
8. **systems/PhysicsSystem.js** — AABB collision, vehicle movement.
9. **systems/AISystem.js** — enemy behavior (chaser, shooter, flanker).
10. **systems/WeaponSystem.js** — firing, reload, projectile lifecycle.
11. **systems/CameraSystem.js** — follow + zoom lerp.
12. **systems/SpawnSystem.js** — wave composition, enemy spawn.
13. **systems/RenderSystem.js** — Three.js setup, lighting, shadow.
14. **systems/AudioSystem.js** — WebAudio SFX + synth music + voice.
15. **systems/HUDSystem.js** — DOM-based HUD overlay.
16. **systems/SaveSystem.js** — `localStorage` for money + unlocks.
17. **systems/TransitionSystem.js** — fade in/out between scenes.
18. **entities/Vehicle.js** — base vehicle class.
19. **entities/PlayerVehicle.js** — extends Vehicle, input-driven.
20. **entities/EnemyVehicle.js** — extends Vehicle, AI-driven.
21. **entities/Projectile.js** — bullet/rocket/mine with lifetime.
22. **entities/Pickup.js** — money/ammo/heal drops.
23. **world/SaigonStreet.js** — procedural street generation (buildings, lights, road).
24. **world/Arena.js** — arena generation (obstacles, spawn points).
25. **assets/loadKenney.js** — fetch + parse Kenney Vehicle Kit GLB/GLTF.
26. **assets/buildPrimitive.js** — build xe ba gác, xích lô bằng Three.js primitives.
27. **index.html** — entry, loads Three.js CDN, HUD DOM, main script.
28. **js/main.js** — boots `Game`.

### Data Shapes (from glossary)

```js
// Vehicle (base)
{
  type: 'car' | 'motorcycle' | 'cyclo' | 'bagaxi' | 'truck',
  hp: number,        // current
  maxHp: number,
  speed: number,     // max speed units/sec
  damage: number,    // collision damage
  weapon: WeaponType,
  position: { x, y, z },
  rotation: number,  // radians, around Y
  velocity: { x, z },
  mesh: THREE.Group,
  alive: boolean
}

// PlayerVehicle extends Vehicle
{
  money: number,
  currentWeapon: WeaponType,
  weaponSlots: [WeaponType, ...],  // unlocked weapons
  ammo: { [WeaponType]: number }
}

// EnemyVehicle extends Vehicle
{
  aiRole: 'chaser' | 'shooter' | 'flanker',
  behaviorState: 'idle' | 'pursue' | 'attack' | 'flank' | 'retreat'
}

// Arena
{
  bounds: { min: {x,z}, max: {x,z} },
  obstacles: Obstacle[],
  spawnPoints: { x, z }[],
  enemies: EnemyVehicle[]
}

// Level config
{
  id: 1..5,
  overworldLength: number,    // meters
  arenaEnemies: VehicleType[],
  arenaSize: { width, depth },
  moneyReward: number
}
```

### Tech Stack

- **Three.js r160** via unpkg CDN.
- **WebGL** renderer, PCFSoftShadowMap.
- **WebAudio API** for SFX, music, voice (no audio files).
- **localStorage** for save.
- **No build tool** — direct `<script>` tags + ES modules.

### Asset Strategy

- **Kenney Vehicle Kit** (CC0) — ô tô, xe máy, truck.
- **Self-built primitives** — xe ba gác, xích lô (Box + Cylinder geometry).
- **Buildings** — self-built from BoxGeometry + colored materials (vàng nhạt, xám, đỏ).
- **No external textures** — solid colors + low-poly look.

### Audio Strategy

- **SFX** — WebAudio `OscillatorNode` + envelope (sine for laser, square for boom, sawtooth for engine).
- **Music** — looped sequence of synthesized notes (trống = noise burst, sáo = triangle wave pentatonic, đàn bầu = sine wave with long decay).
- **Voice** — pre-recorded snippets not used; instead, dynamic formant-synth Vietnamese text via `SpeechSynthesisUtterance` (built-in browser TTS, `vi-VN` locale).

### Combat Balance

| Weapon | Damage | Fire rate | Range | Ammo | Reload |
|---|---|---|---|---|---|
| Machine gun | 5 | 10/sec | 30m | 100 | 3s |
| Shotgun | 15×5 | 1/sec | 15m | 30 | 2s |
| Rocket | 80 | 0.5/sec | 50m | 10 | 4s |
| Mine | 50 | 0.3/sec | place | 15 | 1s |
| Flame | 8 | 20/sec | 8m | 200 | 5s |
| Sticky bomb | 60 | 1/sec | 25m | 8 | 3s |

### Vehicle Stats

| Vehicle | Speed | HP | Damage | Ammo mult |
|---|---|---|---|---|
| Ô tô | 18 | 100 | 25 | 1.0 |
| Xe máy | 26 | 60 | 15 | 0.7 |
| Xích lô | 10 | 150 | 10 | 1.5 |
| Xe ba gác | 12 | 130 | 20 | 2.0 |
| Xe tải (boss) | 8 | 250 | 35 | — |

### Level Progression

| Level | Overworld length | Arena enemies | Boss |
|---|---|---|---|
| 1 | 500m | 3 (2 xe máy + 1 xích lô) | — |
| 2 | 700m | 4 (2 xe máy + 1 xích lô + 1 ô tô) | — |
| 3 | 900m | 5 (2 ô tô + 1 xe máy + 1 xích lô + 1 ba gác) | — |
| 4 | 1100m | 6 (2 ô tô + 1 ba gác + 1 xe máy + 1 SUV + 1 xích lô) | — |
| 5 | 1300m | 7 (1 xe tải + 2 ô tô + 2 xe máy + 1 ba gác + 1 xích lô) | boss |

### Camera

- **Overworld**: chase cam, offset `(0, 8, -12)` behind player, look-at player+10m forward.
- **Arena**: top-down 3D, offset `(0, 25, 0)`, look-at arena center, slight tilt.
- **Lerp**: position lerp factor 0.1, lookAt lerp 0.15.
- **FOV**: 60° (overworld) → 50° (arena) for cinematic feel.

### Performance Targets

- **60 FPS** on mid-range desktop (Intel UHD or better).
- **First paint < 2s** on broadband.
- **Total size < 30MB** (Three.js CDN cached separately).

## Testing Decisions

### What makes a good test (for this codebase)

- **External behavior, not internals**: test what the user sees/hears, not class internals.
- **Each scene can boot and exit without crash** (smoke test).
- **Each weapon can fire and register a hit** (combat test).
- **Each vehicle type loads a mesh** (asset test).
- **Each level starts and ends correctly** (progression test).

### Test seams

- **Highest seam**: `index.html` loads → Game.start() → MenuScene renders → click "Start" → OverworldScene loads → click "Start Arena" → ArenaScene loads → kill all → ShopScene loads. This is the "click-through smoke test" — single full-flow test.
- **Mid seam**: Per-system unit (e.g., `WeaponSystem.fire(weapon, owner, direction)` returns projectile with valid velocity).
- **Low seam**: Pure functions only where they exist (e.g., damage calculation, AABB overlap).

### Test artifacts

1. **`tests/smoke.html`** — auto-clicks through scenes, logs to console. Manual run.
2. **`tests/smoke.js`** — Node-based smoke (if Node available, run via `node tests/smoke.js` against built bundle).
3. **No test framework** — use `console.assert` + `console.error` for fail.

### Tests we will write

1. **Smoke: page loads** — `index.html` opens, Three.js initializes, canvas renders, no console errors.
2. **Smoke: menu visible** — after init, "XÍCH LÔ ĐIÊN" title + vehicle selection visible.
3. **Smoke: vehicle selection** — clicking each vehicle updates `currentVehicleType`.
4. **Smoke: start overworld** — clicking "BẮT ĐẦU" enters OverworldScene, player mesh appears.
5. **Smoke: arena entry** — colliding with enemy enters ArenaScene.
6. **Smoke: weapon fire** — pressing Space in arena spawns projectile.
7. **Smoke: enemy death** — killing all enemies returns to overworld or shop.
8. **Smoke: shop** — buying vehicle updates `money` and unlocks.
9. **Smoke: level 5 boss** — boss spawns with 250 HP, killing it triggers win screen.
10. **Smoke: save/load** — refresh page restores `money` + unlocks.

### What we will NOT test

- Pixel-perfect rendering.
- Frame-rate benchmarks (manual).
- Audio output (manual ear check).
- Cloudflare deployment (manual one-time check).
- Cross-browser quirks beyond Chrome/Firefox/Safari latest.

## Out of Scope

- **Multiplayer / online leaderboards**.
- **User accounts / login**.
- **Mobile touch controls** — desktop keyboard + mouse only. (May work on mobile with virtual joystick later, not now.)
- **Localization beyond Vietnamese** — all text in Vietnamese.
- **Procedural city generation beyond simple grid** — Saigon streets are simple grid of road segments.
- **Advanced physics** — no realistic vehicle simulation, no suspension, no tire model. Top-down AABB only.
- **Cutscenes / story narration** — only the 1-line intro.
- **Achievements / unlocks beyond vehicle/weapon purchase**.
- **Settings menu** — only sound on/off.
- **Replay system**.
- **Multiple save slots** — single save.
- **Real-world Saigon geography accuracy** — generic "Sài Gòn đường phố" vibe, not Phố Bùi Viện or Nguyễn Huệ exact.

## Further Notes

### Deployment

1. Build output: `xichlo-dien/dist/` containing `index.html`, `js/*.js`, `assets/*`.
2. Drag-and-drop `dist/` to [pages.cloudflare.com](https://pages.cloudflare.com) → Direct Upload.
3. Subdomain: `xichloden.pages.dev`.
4. Optional: custom domain later (e.g., `xichlo-dien.vn`).

### Asset Credits

- **Kenney Vehicle Kit** (CC0) by Kenney.nl — used for ô tô, xe máy, xe tải.
- **Three.js** (MIT) by mrdoob.
- All other content (buildings, primitive vehicles, audio) original work, no license required.

### Future expansion (not in this spec)

- Mobile touch controls.
- Multiplayer arena (WebRTC).
- More vehicle types (xe buýt, xe bồn, container).
- Story mode with cutscenes.
- Level editor.
- Steam release via Electron wrapper.

### Known limitations to flag at delivery

- `localStorage` is per-browser — switching browsers resets progress.
- Audio is synthesized, not real Vietnamese instruments — may sound "video-game-y" rather than authentic.
- Vehicle models are low-poly by design (CC0 constraint) — no detailed interiors.
- 5 levels is short; full game would have 20+ levels. This is a demo/prototype.
