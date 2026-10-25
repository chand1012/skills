# Satori

Make social cards, Open Graph images, posters, and other graphics with precise text and layout. This skill teaches an agent how to design the image, write its HTML/CSS, and render an SVG or PNG with the included TypeScript command.

It includes guidance on composition, typography, color, image quality, and visual review, plus an editable editorial card. The renderer uses Satori 0.63.2 and resvg's portable WebAssembly build. It does not need a browser or a separate package setup.

## Install

```sh
npx skills add chand1012/skills --skill satori
```

The script needs Bun 1.3 or newer. Bun downloads the pinned dependencies on first use, so that first run needs network access. You also need local font files for text. Fonts are not bundled.

## Ask your agent

> Use the satori skill to create a 1200×630 launch card. Use the supplied logo and fonts, a warm paper background, large black type, and one lime accent. Give me a PNG and the editable HTML.

## Run the renderer

From this skill's folder, run:

```sh
./scripts/render.ts --input assets/editorial-card.html --output /tmp/card.svg \
  --font 'Studio:400=/path/to/Regular.ttf' \
  --font 'Studio:700=/path/to/Bold.ttf'

./scripts/render.ts --input assets/editorial-card.html --output /tmp/card.png \
  --font 'Studio:400=/path/to/Regular.ttf' \
  --font 'Studio:700=/path/to/Bold.ttf' --scale 2
```

Replace the font paths with files you have. `Studio` is the family name used in the example HTML; the files can come from any suitable licensed typeface. The first command produces a 1200×630 SVG. The second produces a 2400×1260 PNG with the same composition.

Use `./scripts/render.ts --help` for all flags. If your skill installer loses the executable permission, run `bun --install=force ./scripts/render.ts ...` instead. Call the installed script by its full path when working elsewhere.

| Flag | Use |
| --- | --- |
| `--input`, `-i` | Read an HTML file, or `-` for standard input. |
| `--output`, `-o` | Write an SVG or PNG file, or `-` for standard output. |
| `--format svg\|png` | Choose a format explicitly; required for standard output. |
| `--preset` | Choose `og`, `square`, `portrait`, or `story`. The default is `og`. |
| `--width`, `--height` | Override either preset dimension. |
| `--scale` | Multiply PNG dimensions; use `2` for twice the width and height. |
| `--font` | Load a font with `Family[:weight[:style]]=path`. Repeat for other faces. |
| `--base-dir` | Set the folder used to resolve image and CSS asset paths. |
| `--allow-remote` | Permit HTTP(S) image downloads. Local assets work by default. |
| `--point-scale` | Set layout rounding precision; default `1`, or `0` for no rounding. |
| `--debug` | Draw layout boxes to diagnose spacing and clipping. |
| `--force` | Replace an existing output file. |

Font weights run from 100 to 900 in steps of 100. Styles are `normal` and `italic`. Font paths resolve from your working directory. Image paths resolve from the HTML file's folder unless you set `--base-dir`.

For pipelines, specify the format and keep diagnostics separate from image bytes:

```sh
cat card.html | ./scripts/render.ts -i - -o - --format svg \
  --base-dir . --font 'Studio:400=./fonts/Regular.ttf' > card.svg
```

## What the HTML can use

Use a static HTML fragment or a full document, with inline styles or embedded stylesheets. This version supports Flexbox, Grid, and block layout. The script embeds local images and CSS image URLs, then converts text into vector paths so the output can travel without font files. PNG output keeps transparent areas transparent.

Satori has its own layout engine. It may differ from a browser, and it does not run scripts or load external stylesheets. Supply fonts through `--font`; `@font-face` is rejected. Canvas, video, iframes, and responsive image sources are also rejected with an error. Use trusted source files: the renderer is a local file tool, not a sandbox for hostile HTML or SVG.

See [SKILL.md](SKILL.md) for the agent workflow, [the rendering guide](references/rendering-guide.md) for compatibility and troubleshooting, and [the design guide](references/design-guide.md) for visual direction.
