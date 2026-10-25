# Design images that hold attention

Use this guide when choosing a direction or improving a rendered composition. The dimensions and type sizes below are starting points for a 1200×630 canvas. Scale them with the composition and actual viewing size, then inspect the result.

## Choose a direction with a reason

Write a short internal brief: audience, message, destination, focal point, and mood. Translate the mood into visible choices. “Premium” might mean restrained color, careful type, and generous space; it does not automatically mean black, gold, or a glass effect.

| Direction | Useful visual decisions | Where it fits |
| --- | --- | --- |
| Editorial | Warm paper, sharp rules, large type, asymmetric columns, small publication details | Essays, announcements, reports |
| Technical | Dark neutral surface, precise geometry, diagrams, a restrained accent, clear labels | Developer products, benchmarks, infrastructure |
| Expressive | Oversized type, tight crops, saturated contrast, one bold shape | Events, culture, campaigns |
| Photographic | One intentional crop, a quiet text area, contrast treatment, little decoration | People, places, physical products |
| Analytical | A dominant value or honest chart, clear units, muted context, direct labels | Results, comparisons, dashboards |

Use supplied branding as the foundation. When branding is absent, choose a coherent direction that serves the subject. Avoid unnecessary gradients, decorative grids, browser chrome, generic dashboard fragments, or pill labels. Each element should carry information, establish identity, or support the composition.

## Establish hierarchy before decoration

Choose one first read: a headline, a person, a product, or a number. Secondary text should support it; metadata should recede. If everything has the same contrast, size, or visual weight, nothing leads.

- For headline cards, try 64–96 px display text, 24–32 px supporting copy, and 16–20 px metadata. At 300 px display width, 16 px becomes 4 px; critical information needs more room or larger type.
- Start with 48–72 px outer margins. Align the brand, headline, supporting text, and footer to deliberate shared edges.
- Use a spacing rhythm such as 8, 16, 24, 32, 48, 64. Break it for optical balance when needed.
- Give the focal area more space than a small footer or logo. Empty space can create emphasis without another decorative element.
- Control headline width and line breaks together. Two strong lines usually beat three cramped lines with a stranded final word. Keep intended words together with a nonbreaking space when necessary.
- Leave space between the text and an illustration. A visual touching a headline by accident reads as a layout failure.

Sketch the large shapes first. Hide small text and decoration mentally: the image should still have a clear structure. For variants, change one substantial decision, such as a type-led layout versus a split image, rather than making a dozen color swaps.

## Treat typography as the main material

Load actual faces for each weight/style used. A font declared as 700 must contain the intended bold outlines; labeling a regular file “700” does not make it a quality bold face. Prefer static instances for controlled output. A variable font renders at its default instance in the pinned Satori version.

Use one family, or a purposeful pairing with distinct roles. Match the face to the message: an expressive display face can carry a short title; a quiet text face can carry the explanation. Use a monospaced face for technical labels or aligned values when it earns the space, not as a universal signal of sophistication.

For large headlines, begin around `line-height: 1` to `1.1` and modest negative `letter-spacing`, then inspect ascenders, descenders, punctuation, and the actual font. Dense display text may need tighter tracking; body text usually needs more breathing room. Do not apply one tracking value to every size.

For supporting copy, begin around `line-height: 1.3` to `1.5`. Use adequate contrast and keep lines short. Choose a softer secondary color rather than tiny text. Set heading and paragraph margins explicitly so semantic element defaults do not determine the rhythm.

Inspect the longest actual title, punctuation, non-Latin characters, and numbers. Font coverage and layout behavior matter more than the nominal family name. For CJK or mixed scripts, provide a matching fallback face and set `lang` where appropriate. Inspect RTL text with actual content; Satori's bidirectional behavior has limits, especially around inline elements.

Use OpenType features when they help: `font-variant-numeric: tabular-nums` for columns of figures, or `font-feature-settings` for features the selected font contains. Inspect the result rather than assuming every font has the feature.

## Build color and depth deliberately

Choose a background, primary ink, secondary ink, and one accent before adding more colors. Keep the accent concentrated where attention belongs. Pure white on pure black can feel harsher than a warm white on a deep neutral. Saturated colors can work well, but text still needs a stable background.

Check contrast at the actual display size. Thin type over a detailed image often needs a quiet panel or a directional scrim. A broad low-contrast gradient that leaves half a line unreadable is not a fix.

Use depth to separate planes: a subtle border on a dark panel, a small contact shadow for a physical card, or a low-opacity geometric layer behind the subject. Stacking several shadows and blurs rarely improves hierarchy. Heavy SVG filters can increase file size, render time, and downstream differences; test them in the output format.

For texture, prefer a small licensed raster asset or a restrained SVG pattern. Keep it subordinate. Do not generate hundreds of overlapping DOM elements for grain. For glows, start with a radial gradient; use blur only when the shape needs it. Inspect gradient banding in the final PNG.

## Make imagery specific

Use a supplied product image, logo, portrait, diagram, or a motif tied to the subject. Satori lays out images; it does not invent photographs. When suitable assets are unavailable, use type and simple geometry rather than a misleading imitation of the product.

Set both displayed dimensions and `object-fit` for raster images. Choose the crop intentionally: a face should keep its eyes and enough breathing room, a product should retain its identifying details, and a logo should keep its aspect ratio. Keep the source resolution adequate for the final PNG, especially at `--scale 2`.

Use clean inline SVG for simple diagrams, icons, and vector illustrations. Set width, height, and viewBox, and use explicit fills and strokes. Avoid icon glyphs that depend on an unstated font, emoji whose appearance varies, and randomly assembled decorative symbols. Intricate SVG effects require inspection in both SVG and PNG.

## Design data honestly

Scale bars and points from actual values. Decide whether a zero baseline is required for the encoding; bar lengths generally need one. Show units and meaningful labels. Keep comparison periods, denominators, and precision consistent. Do not add invented growth percentages, customer logos, or performance claims to make a card look convincing.

If a chart is only a motif, make that context explicit or choose abstract geometry that cannot be confused with results. The bundled example labels its bars as an illustration. For a real chart, replace that motif with accurately computed geometry and labels.

## Review the image, not just the markup

Inspect the rendered artifact at full size, at a small display size, and with the expected crop. Ask:

1. Is the intended subject the first thing the eye finds?
2. Can the headline be read quickly, with natural breaks and no accidental tangencies?
3. Does the composition balance text, imagery, and empty space?
4. Are margins, baselines, corners, and repeated gaps consistent where they should be?
5. Are all required words, logos, glyphs, and data present and legible?
6. Are edge content, shadows, and descenders clipped? Does transparency look right on light and dark surfaces?
7. Does each decorative element earn its place?

Fix the largest defect first. If the title is crowded, shorten optional copy or restructure the layout before reducing the type. If the artwork feels generic, change the motif or composition before polishing shadows. Stop when the image meets the brief and the rendered checks pass; endless minor variants are not a substitute for judgment.
