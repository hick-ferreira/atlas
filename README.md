# Atlas

An interactive anatomy atlas for study and reference, with animated illustrations. A bar at the top switches between regions.

- **Thigh** (`coxa/`): the quadriceps muscles and the extensor, flexor, adductor and abductor groups.
- **Arm and shoulder** (`ombro/`): deltoid, rotator cuff, biceps, brachialis, coracobrachialis and triceps, front and back views, with palpation notes, stretches and a quiz. Movement animation and stretch illustrations are still to come.

More body regions will be added.

The site content is in Brazilian Portuguese.

## What's in it

- **Thigh atlas:** an anatomical illustration with the four clickable quadriceps muscles, animated contraction, origin and insertion markers, guide lines and detail cards (origin, insertion, innervation, action, palpation and clinical notes).
- **3D model:** a three.js viewer (thigh and arm/shoulder pages) with the real skeleton and muscles from Z-Anatomy. Rotate, zoom, pick a muscle, isolate it, see it through the bones, show origin and insertion pins and play an illustrative contraction. Selection is synced with the 2D atlas.
- **Movement:** knee extension and thigh raise, with sliders that scrub through a real animation.
- **Extensors, flexors, adductors and abductors:** 14 muscles with signs of shortening and an illustrated stretch for each, plus a table of which muscle does what.
- **Challenge:** ten questions to identify the muscle on the illustration.
- Automatic light and dark theme, mobile-friendly layout.

## Run locally

It is a static site with no build step. The videos need an HTTP server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Publish on GitHub Pages

1. Create a repository and push these files to the `main` branch.
2. Go to **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. The site will be available at `https://hick-ferreira.github.io/atlas/`.

## Structure

```
index.html                region picker (home)
shared/viewer3d.js        3D viewer (three.js from a CDN, loads the GLB models lazily)
shared/nav.js             region bar shared by all pages (add new regions here)
coxa/index.html           thigh page (HTML, CSS and JS)
coxa/img/quad-perna.jpg   main thigh illustration
coxa/img/movimento/       knee and hip scrub videos + source sheet
coxa/img/alongamentos/    images (and one video) for each stretch
ombro/index.html          arm and shoulder page
ombro/img/                front and back illustrations (stretch images go in img/alongamentos/)
modelos/                  3D skeleton and muscle models (GLB) from Z-Anatomy, see modelos/LEIA-ME.md
docs/                     prompts used to generate the images (in Portuguese)
```

## Credits and disclaimer

- The illustrations were generated with Gemini and processed for the animations.
- The content is study material based on classical anatomy. Palpation landmarks vary from person to person, and this site does not replace a professional assessment.
- Choose a license for the code and for the images before making the repository public.
