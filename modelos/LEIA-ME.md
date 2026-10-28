# 3D models

Skeleton and muscles exported from Z-Anatomy (Blender) as Draco-compressed GLB.

| File | Content |
|---|---|
| `esqueleto.glb` / `.json` | 176 skeleton meshes (bones, cartilage, teeth) and their record cards |
| `musculos.glb` / `.json` | 246 muscle meshes and their record cards |
| `regioes/musculos_<region>.glb` / `.json` | the same muscles split by region (head, neck, back, thorax, abdomen, pelvis, hip/glutes, shoulder, arm, forearm, hand, thigh, leg, foot) |

- Units are meters, Y axis up, about 1.7 m tall. Skeleton and muscles share the same coordinate space, so they can be loaded together.
- Mesh names are the Z-Anatomy names (`Rectus femoris muscle.r`). The `.json` files are keyed by that name and hold `nome` (pt-BR), `latim`, `ta2`, `regiao`, and empty `origem`, `insercao`, `acao`, `inervacao` to be filled in.
- Load with three.js `GLTFLoader` plus `DRACOLoader`.

## License

Z-Anatomy models are CC BY-SA 4.0 (based on BodyParts3D, CC BY-SA 2.1 JP). These files are derivatives: keep the attribution and the same license.
