# GLOSSARY — XÍCH LÔ ĐIÊN

Từ điển domain cho game top-down 3D arcade đua xe + bắn súng phong cách Sài Gòn.

## Entities (thực thể trong game)

- **Vehicle**: bất kỳ phương tiện nào trong game (player hoặc enemy). Có `type` (car/motorcycle/cyclo/bagaxi/truck), `hp`, `speed`, `damage`, `weapon`, `position`, `rotation`.
- **PlayerVehicle**: Vehicle do người chơi điều khiển. Có thêm `weaponSlots`, `money`, `currentWeapon`.
- **EnemyVehicle**: Vehicle AI. Có thêm `aiRole` (chaser/shooter/flanker), `behaviorState`.
- **Projectile**: viên đạn hoặc boom bay. Có `type`, `damage`, `owner`, `lifetime`, `velocity`.
- **Arena**: khu vực chiến đấu top-down 3D. Có `bounds`, `obstacles`, `spawnPoints`.
- **Obstacle**: vật cản trong arena (xe đỗ, container, cột đèn). Có `position`, `bounds`, `destructible`.
- **Pickup**: vật phẩm rơi trong arena (tiền, ammo, heal). Có `type`, `value`, `position`.
- **Explosion**: hiệu ứng nổ. Có `position`, `radius`, `damage`, `lifetime`.
- **Building**: tòa nhà/hàng quán trong overworld. Trang trí, có thể che chắn.
- **Road**: đoạn đường trong overworld. Có `start`, `end`, `width`.
- **Waypoint**: điểm đường trên overworld mà enemy di chuyển theo.

## Scenes (màn chơi)

- **OverworldScene**: cảnh đua xe trốn trên đường phố Sài Gòn. Player chạy thẳng, enemy rượt theo, chạm nhau → vào arena.
- **ArenaScene**: cảnh chiến đấu top-down 3D. Player + 3-7 enemy, bắn hết để qua màn.
- **ShopScene**: cảnh mua xe/vũ khí giữa các màn.
- **MenuScene**: cảnh menu chính, chọn xe, intro 1 dòng.
- **GameOverScene**: cảnh thua cuộc, retry hoặc về menu.

## Systems (hệ thống)

- **GameLoop**: vòng lặp chính (`requestAnimationFrame`), cập nhật tất cả systems mỗi frame.
- **InputSystem**: bắt phím WASD/Shift/Space/chuột cho player.
- **PhysicsSystem**: AABB collision giữa vehicles, projectiles, obstacles.
- **AISystem**: tính toán hành vi enemy mỗi frame (theo nhóm flank/shooter/chaser).
- **WeaponSystem**: xử lý bắn, reload, ammo, hit detection, damage.
- **SpawnSystem**: sinh enemy theo wave, sinh obstacle ngẫu nhiên.
- **CameraSystem**: follow player với smooth lerp, zoom động theo speed.
- **RenderSystem**: Three.js scene, lighting, shadow, post-processing.
- **AudioSystem**: WebAudio synth SFX + nhạc nền + voice snippets VN.
- **HUDSystem**: vẽ HP bar, ammo, money, mini-map, kill count bằng DOM/Canvas.
- **SaveSystem**: lưu tiền + xe đã mở khóa vào `localStorage`.
- **TransitionSystem**: chuyển scene mượt (fade out/in).

## Concepts (khái niệm)

- **Chạm xe (Car Collision)**: trong overworld, player chạm vào enemy → chuyển sang arena.
- **Money**: tiền trong game, dùng mua xe + vũ khí trong shop. Kiếm được khi giết enemy trong arena.
- **Wave**: 1 đợt enemy trong arena. 1 màn = 1 wave duy nhất (Q24 chốt).
- **Boss**: xe tải 250HP, chỉ xuất hiện ở màn 5.
- **Weapon Pickup**: vũ khí rơi trong arena, player chạm vào để đổi súng tạm thời.

## Game flow

```
MenuScene → chọn xe → OverworldScene (chạy + tránh) → chạm xe địch
  → ArenaScene (3-7 enemy, bắn hết) → ShopScene (mua xe/vũ khí)
  → OverworldScene màn mới → ... → màn 5 (boss) → Win
```

## Tech stack

- **Engine**: Three.js r160 (CDN: unpkg.com/three@0.160.0)
- **Render**: WebGL, perspective camera, shadow mapping (PCFSoftShadowMap)
- **Audio**: WebAudio API (synth SFX, nhạc loop, voice snippet)
- **Storage**: `localStorage` cho save
- **Deploy**: Cloudflare Pages, domain `xichloden.pages.dev`