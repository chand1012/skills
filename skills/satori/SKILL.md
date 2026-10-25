---
name: satori
description: Design polished social cards, Open Graph images, posters, quote graphics, and static compositions in HTML/CSS, then render them to SVG or PNG with Satori using a bundled TypeScript CLI. Use for image deliverables with precise text, layout, branding, or data; not website screenshots or photorealistic image generation.
---

# Satori

Create a deliberate visual composition in HTML/CSS and deliver an inspected SVG or PNG. Use the bundled [TypeScript renderer](scripts/render.ts); it converts HTML into Satori's element tree, embeds image assets, outlines text, and uses resvg for PNG output. It runs with Bun and exact dependency imports, without a package manifest.

## Design the image

Use the brief, supplied brand assets, exact copy, and destination to choose dimensions and an art direction. Infer reasonable defaults when the brief is clear: 1200×630 for an Open Graph card, 1080×1080 for a square post, 1080×1350 for a portrait post, or 1080×1920 for a story. Respect supplied platform crop and interface requirements; these sizes are starting points, not guarantees of current platform behavior.

Before writing markup, choose the focal point, headline breaks, alignment, palette, typefaces, and one visual motif. Read [design-guide.md](references/design-guide.md) for hierarchy, typography, composition, surface treatments, and visual review. For layout starting points, read [recipes.md](references/recipes.md). Avoid reproducing the same gradient, floating cards, and badges for every brief.

Keep copy short enough to read at the destination size. Preserve names, numbers, claims, logos, and supplied wording. If real data is supplied, encode it accurately; decorative charts must not imply measured results. Do not shrink every text size to rescue an overcrowded composition.

## Author and render

Resolve the installed skill directory and call its script by path; never assume the current directory contains `scripts/render.ts`. Write the user's source HTML and outputs into their requested workspace, outside the installed skill. Copy [editorial-card.html](assets/editorial-card.html) when a warm editorial direction fits; change its structure, copy, palette, and motif to suit the brief. The example uses the font family `Studio`; supply that name with `--font`.

```sh
# From this skill's directory; substitute real, readable font paths.
./scripts/render.ts --input assets/editorial-card.html --output /tmp/card.svg \
  --font 'Studio:400=/path/to/Regular.ttf' --font 'Studio:700=/path/to/Bold.ttf'

./scripts/render.ts --input assets/editorial-card.html --output /tmp/card.png \
  --font 'Studio:400=/path/to/Regular.ttf' --font 'Studio:700=/path/to/Bold.ttf' --scale 2
```

Run `./scripts/render.ts --help` for the CLI contract. Use `bun --install=force ./scripts/render.ts ...` if executable mode was lost during installation. Bun 1.3+ and network access for the first dependency download are required. Packages remain in Bun's shared cache; no system packages are installed. Exact direct pins do not lock transitive dependencies.

Read [rendering-guide.md](references/rendering-guide.md) when writing markup, loading fonts/images, using stylesheets or SVG, debugging, or adapting to an older Satori installation. This renderer pins Satori 0.63.2. Its capabilities differ substantially from older Yoga-based releases: CSS Grid, block layout, stylesheets, and WOFF2 are supported here. Do not apply old limitations indiscriminately.

Essential rules:

- HTML is static source, not a browser screenshot. No JavaScript, React hooks, external CSS loading, canvas, or video. Inline styles and `<style>` rules work; ordinary class names need CSS definitions. Tailwind compilation is not included.
- Load fonts explicitly with repeatable `--font 'Family:weight:style=/path/font.ttf'` flags. Use real font files for every intended face. Do not assume system fonts or `@font-face` will resolve.
- Author to the selected canvas. The wrapper has explicit width/height, column Flexbox, border-box sizing, zero margin, and the first loaded font family; full documents retain body styles and attributes. Set explicit dimensions on images. Keep decorative layers from obscuring text.
- Relative image and CSS `url()` paths resolve from the input file's folder, or `--base-dir`; font paths resolve from the command's working directory. HTTP(S) assets require `--allow-remote`. Use local assets for repeatability.
- SVG text becomes paths, so downstream viewers need no font files. PNG uses the same SVG and preserves transparency. `--scale 2` doubles PNG pixel dimensions without changing the composition. It does not add detail to small source photographs.
- Existing files require `--force`. Use a separate `--debug` output for layout boxes; never deliver debug boxes accidentally.

## Inspect and improve

Render an initial PNG and view the actual image with an available image viewer. Inspect at full size and at its likely display size; for a social card, also check around 300–400 pixels wide. Browser previews of source HTML can differ from Satori; the generated artifact is the authority.

Check headline breaks, glyph coverage, line spacing, clipping, alignment, contrast, asset sharpness, and the visual order of attention. Check the outer margins and likely crops. Compare alternatives only when a meaningful design choice remains; vary composition or typography, not just accent colors. Fix the largest visual defect, render again, and inspect the result.

For supplied data, check values, units, scales, baselines, and labels against the source. For SVG delivery, open the SVG in the target viewer as well as checking a PNG render: filter support can differ. Confirm final dimensions and transparency, remove debug mode, and provide the final artifact with the editable HTML when useful. Report any font, asset, or rendering limitation that still affects the result.
