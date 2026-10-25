# Rendering and compatibility

This guide describes the bundled CLI, which pins `satori@0.63.2`, `@resvg/resvg-wasm@2.6.2`, `parse5@7.3.0`, and `css-tree@3.1.0`. Consult the pinned version before changing dependencies. Satori's current main branch may have different behavior.

## Pipeline and output

The renderer parses an HTML fragment or full document with parse5. It converts attributes and inline CSS into Satori element objects, passes embedded `<style>` rules through to Satori, and resolves image assets into data URLs. Satori computes layout and emits SVG. PNG output rasterizes that SVG with resvg's WebAssembly build, so a native resvg addon is not required.

The script does not open Chromium, execute JavaScript, evaluate components, or take a screenshot. It is intended for static compositions authored for Satori. Browser layout can be useful for rough previews, but only the generated output verifies the result.

The root has explicit canvas dimensions, column Flexbox, border-box sizing, zero margin, and the first supplied font family. Border-box sizing keeps root padding inside the canvas. A full document retains its body attributes and inline styles, plus head stylesheets. CSS rules can override those defaults. The CLI discards the document title and metadata. For predictable output, set the body's background, padding, and typography explicitly. The default background is transparent.

The output extension selects SVG or PNG unless `--format` is supplied. A conflicting extension is an error. Standard output requires `--format`; diagnostics stay on standard error. Existing files require `--force`. Parent output directories are created. The input cannot also be the output.

`--width` and `--height` set logical layout dimensions. `--scale` changes PNG pixel dimensions only; it does not change wrapping or margins. Both multiplied dimensions must be whole pixels. SVG remains vector and rejects `--scale`. `--point-scale` controls Satori's pixel-grid rounding, not resolution; the default is 1, higher values allow finer positioning, and 0 disables rounding.

## Layout and CSS

Unlike older Yoga-based Satori releases, 0.63.2 uses Taffy for Flexbox, Grid, and block layout. Embedded stylesheets support selectors, specificity, variables, and media/container queries with documented differences. Inline styles use CSS declaration syntax in HTML; the CLI converts names such as `font-size` into the corresponding style keys. Unitless numeric inline values become numbers. Custom properties keep their `--name` keys.

Use Flexbox or Grid for a clear primary structure. Set explicit container sizes when text must wrap into a known area. In narrow flex children, `min-width: 0` can be needed to permit shrinking. Use absolute positioning for controlled decoration or exact diagram geometry, not as the only way to place variable copy.

Useful primitives include gradients, borders, shadows, transforms, overflow clipping, masks, object fitting, text shadow, text stroke, and inline SVG. Some are sensitive to downstream SVG support. Keep critical content away from mask edges and test the final PNG when using filters or blends.

Important limits:

- This is a partial CSS implementation. Table/ruby layout, subgrid, and some property values are unsupported. Unknown properties may be ignored. A successful process exit does not prove every style was applied.
- `@font-face` and `@import` are rejected by the CLI. Put external rules directly in `<style>` and pass fonts through `--font`.
- Inline `!important` is rejected; put declarations requiring it in a stylesheet. Stylesheet `!important` is supported by Satori.
- Class attributes work when `<style>` defines them. There is no bundled Tailwind compiler, CSS framework, browser default stylesheet, or external `<link rel="stylesheet">` loader.
- Stylesheet pseudo-elements `::before` and `::after` are supported by this release, but do not assume all pseudo-elements or interaction selectors work. Ordinary elements are easier to inspect for important content.
- Media queries use the image dimensions in a static light-mode screen context. They do not simulate a user's browser environment.
- Animation is not part of a static export. Set the intended final values directly; do not depend on transitions or keyframes.
- CSS `line-clamp`/text overflow and text balancing have limitations with mixed inline elements. Prefer intentional copy length and explicit line breaks for a hero headline.
- SVG cannot represent exact CSS perspective generally. The pinned normal Satori build approximates it. Experimental WebGL/perspective APIs are outside this HTML CLI.

For stable delivery, prefer plain hex/RGB colors unless a richer color space is intentional. Satori converts many modern color functions to SVG-compatible RGB, with sRGB gamut clipping. Review the final raster rather than relying on a browser's wide-gamut preview.

The CLI collapses formatting whitespace in ordinary text and drops indentation between block elements. Use `<br>`, nonbreaking spaces, and real inline elements for intentional spacing. Use `<pre>` or inline `white-space: pre-wrap` for preserved text. For exact preserved whitespace, declare it inline: stylesheet-only whitespace settings do not alter this parser's initial normalization.

## Fonts, languages, and glyphs

```sh
./scripts/render.ts -i card.html -o card.png \
  --font 'Brand Sans:400:normal=./fonts/Regular.ttf' \
  --font 'Brand Sans:700:normal=./fonts/Bold.ttf' \
  --font 'Brand Sans:400:italic=./fonts/Italic.ttf' \
  --font 'CJK:400=./fonts/CJK-Regular.otf'
```

Use those family names in `font-family`. Names may contain spaces; quote each whole specification. Colons and `=` are reserved in family names. Font paths may contain spaces, colons, or `=`. Weight/style default to 400/normal. Paths resolve from the working directory, unlike HTML asset paths.

Satori 0.63.2 supports TTF, OTF, WOFF, and WOFF2. Use static font files for exact weight control; variable fonts render at their default instance. System fonts are not discovered automatically. Every composition with text needs an explicit font, including decorative numbers, punctuation, or SVG text.

Font fallback uses the supplied faces. A generic family such as `serif` does not install or discover a font. Set `lang` for locale-sensitive glyph choices and supply appropriate coverage. This release shapes text with HarfBuzz and has partial bidirectional support. Complex scripts, mixed-direction text, and inline rearrangement need visual inspection with real content.

Text is embedded as paths by default and the CLI keeps that behavior. This makes output portable but increases file size and removes ordinary text selection/search. Do not promise editable SVG text. Keep the HTML source for content changes.

Emoji are not automatically downloaded by this script. Use a deliberate local image or SVG icon where the selected font lacks a usable glyph. Satori's JavaScript API has `graphemeImages` and `loadAdditionalAsset` options for custom applications, but this CLI does not expose callbacks.

## Images and SVG

Use `<img src="./images/product.png" width="440" height="360" style="object-fit: contain">`. Both dimensions make layout predictable; `contain` preserves the whole image, while `cover` fills a box by cropping. Use `object-position` for an intentional crop. SVG images should have dimensions and a viewBox.

The CLI resolves relative `<img src>`, SVG `<image href>`, and CSS `url()` paths against the HTML file's folder. An explicit `--base-dir` overrides that folder, including for stdin. A leading `/` means an absolute filesystem path. `file:` URLs work. Local paths are literal filesystem paths: avoid browser query strings and percent-encoded relative paths. Fragment references such as `url(#filter)` are left alone.

Local PNG, JPEG, SVG, WebP, GIF, and AVIF files are recognized by extension and embedded. Recognition is not a guarantee of codec support in every Satori/resvg path; PNG/JPEG and simple SVG are the most predictable choices. Convert unsupported assets before rendering. Animated assets do not yield an animated output.

Remote images require `--allow-remote`. Requests have a 30-second timeout and must return a successful status with an image Content-Type. HTTP(S) images are embedded before rendering so the final artifact does not need those requests. Prefer local files to avoid changing remote content, network failures, and large downloads. CSS image URLs are handled in both inline styles and embedded stylesheets. `<picture>`/`srcset` are rejected; choose the source explicitly.

For simple vector artwork, use inline `<svg>` with explicit dimensions, viewBox, fills, and strokes. Keep custom SVG IDs distinct when repeating symbols or masks. Nested SVGs that themselves refer to external assets are not recursively rewritten. The renderer accepts trusted local sources; it is not an HTML/SVG sanitizer or a network/file access sandbox. `--allow-remote` is an I/O preference, not a security boundary for hostile input.

Transparent output needs no special flag: leave the background unset. Check transparency on more than one background. A scaled PNG still cannot recover details missing from a small raster source. Local image embedding can make SVGs large; reduce source dimensions to what the deliverable needs, while preserving adequate resolution.

## Troubleshooting

| Symptom | Check or fix |
| --- | --- |
| Missing or wrong text face | Supply the actual face, match the family/weight/style, and inspect glyph coverage. |
| Headline clips or wraps awkwardly | Increase its width, adjust copy/breaks, inspect font metrics, and check line height before shrinking type. |
| Layout differs from browser | Inspect generated PNG, remove unsupported CSS, and reduce to a small reproduction. |
| Styles seem absent | Confirm classes have embedded rules. The script does not load external CSS. Check Satori's supported values. |
| Image cannot be read | Check the base folder, case-sensitive filename, format, image dimensions, and remote flag. |
| PNG looks soft | Use a higher-resolution source asset; use `--scale 2` for output resolution. |
| Overlap or strange gaps | Render a separate `--debug` image; check container bounds, shrink behavior, margins, and absolute children. |
| Permission denied running script | Use `bun --install=force /path/to/scripts/render.ts ...` or restore executable mode. |
| First-run package failure | Ensure Bun can reach the registry and write its cache. No manual project install is normally needed. |
| File already exists | Choose a different name or pass `--force` intentionally. |

When changing dependencies, rerun both SVG and PNG examples, check actual pixels, and retest stdin/stdout, fonts, image resolution, and stylesheet behavior. Direct pins do not freeze transitive package versions.

## Primary sources

These sources explain the underlying behavior. The CLI's additional restrictions are documented above.

- [Satori 0.63.2 documentation](https://github.com/vercel/satori/tree/0.63.2): supported CSS, stylesheets, layout, fonts, text, options, and runtime differences.
- [resvg-js and its WebAssembly build](https://github.com/thx/resvg-js): SVG rasterization and WASM API.
- [parse5](https://github.com/inikulin/parse5): HTML parsing and document/fragment behavior.
- [CSSTree](https://github.com/csstree/csstree): CSS parsing, walking, and serialization.
- [Bun automatic package installation](https://bun.sh/docs/runtime/auto-install): versioned imports and package caching.
