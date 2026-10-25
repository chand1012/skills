# Composition recipes

Use these as structural starting points. Choose type, imagery, and color for the user's subject. Do not turn the examples into a fixed house style. All sample measurements assume a 1200×630 image unless stated otherwise.

## Editorial announcement

Start from [the bundled HTML](../assets/editorial-card.html). It uses warm paper, a shared alignment grid, a strong two-line headline, and a dark geometric panel. The sample bars are explicitly decorative. Replace them with a subject-specific illustration or real data when available.

The layout depends on the font's proportions. Supply `Studio` regular and bold faces, render, and adjust the headline width or size if necessary. A 1080×1920 version needs a new vertical arrangement; changing the preset alone does not redesign it.

## Product launch with an image

Use a 56 px outer margin and a two-column layout. Give the headline roughly 52% of the inner width and the product the remainder. Place an optional short eyebrow above the title and one sentence below it. Keep the product large enough to recognize when the entire card is shown at 350 px wide.

```html
<div style="display:flex;width:100%;height:100%;padding:56px;background:#111a24;color:#f4f2e9;gap:40px">
  <div style="display:flex;flex-direction:column;justify-content:center;width:52%">
    <div style="font-size:18px;letter-spacing:2px;color:#a9c7cc;margin-bottom:20px">PRODUCT UPDATE</div>
    <div style="font-size:80px;font-weight:700;line-height:1.02;letter-spacing:-3px">Your exact<br>headline here.</div>
    <div style="font-size:26px;line-height:1.35;margin-top:24px;color:#b9c3c9">One clear supporting sentence.</div>
  </div>
  <div style="display:flex;flex:1;align-items:center;justify-content:center">
    <img src="./product.png" width="440" height="440" style="object-fit:contain">
  </div>
</div>
```

This is a source template, not an executable example without `product.png` and appropriate fonts. Replace the placeholders with supplied copy and a real image. Do not add a fake UI screenshot with unreadable text merely to fill the panel.

## Quote graphic

Make the quote the focal point. Use a quiet background and 60–76 px type for a short passage, with generous line spacing and a narrower measure. Place the person's name and role below at 24–28 px. If a portrait is supplied, decide whether it supports the quote before giving it half the canvas.

Keep the exact wording and attribution. If the quote cannot fit at a useful reading size, ask for or propose an approved excerpt; do not silently rewrite words inside quotation marks. Use a subtle oversized quotation mark only if it helps the balance. Check that it is present in the chosen font.

## Metric or honest chart

Give the central number room, then establish its meaning with a unit, period, and comparison. A value such as “42%” needs a denominator and context. For bars, calculate geometry from the source values instead of approximating with hand-picked heights:

```text
usable chart height = 240 px
domain minimum = 0
domain maximum = chosen axis maximum that includes every value
bar height = value / domain maximum × usable chart height
```

Use local SVG geometry for crisp bars, dots, or lines. Prefer HTML labels laid out around the SVG when that makes font and wrap behavior easier to control. Keep label spacing clear and use consistent numeric precision. A numeric card should not need a tiny legend to explain its main claim.

## Bold event poster

For 1080×1350, try a compact identity at the top, an oversized title in the middle, and the date/location in a clear lower block. Let one geometric form or supplied image provide contrast against the type. Use negative space to separate the event identity from practical information.

Do not crop the event name, date, address, or ticket instruction for style. If deliberate headline cropping is part of the brief, keep the message identifiable and inspect likely platform crops. A story version needs additional room for interface overlays based on the user's destination.

## Transparent badge or diagram

Leave the root background unset, supply explicit dimensions, and use outlined text plus simple SVG paths. Add enough padding for strokes and shadows. Check the output on both light and dark surfaces. For a real logo, preserve the supplied vector geometry and brand rules; do not treat a logo as an invitation to improvise a replacement.

## A useful variant workflow

Create two candidates only when there is a real design choice: for example, a centered type composition and a split product composition. Keep required copy identical so the comparison is meaningful. Render and inspect both, pick the one that serves the message, then refine its spacing and typography. Color variations can follow if the user asks for them.
