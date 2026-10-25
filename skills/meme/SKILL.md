---
name: meme
description: Create a meme given some input from the user.
---

# Meme

Create a meme using your tools and the user's input. This requires the [Satori Skill](https://github.com/chand1012/skills/tree/main/skills/satori) to also be installed as its used to create the meme images.

## Meme Types
| Category | Description | Examples |
|---|---|---|
| Comics & characters | Illustrated panels or recurring characters acting out a situation | Rage comics, Wojak comics, Polandball |
| Captioned images | An image with text that sets up or delivers the joke | Advice animals, classic image macros, Drake |
| Reactions | Images used as a response | Shocked Pikachu, facepalms |

## Templates 

Meme templates do not have text on them. If the user sends you a meme that contains existing text or overlay images, you must use your tools to ideally find the original image. If you cannot find the original from multiple web searches, you can fall back to using AI image editing tools to remove the text and overlay images. 

### Saving Templates

Once you have the reusable template you can use to create the memes, you should save a copy locally so we can reference back to them later. By default, save to the user's home directory in a folder called `.meme_templates` where the name of the file tells us what the meme template is called. When the user asks for a meme you should always check the template library before anything else.

## Generating the Meme

Use the HTML templates below with the Satori skill's renderer. They are starting points: replace the image paths, text, dimensions, and overlay positions for each meme. Save the HTML beside its image assets, or use absolute image paths. Escape user text as HTML so characters such as `<` and `&` render literally.

Read the template image's dimensions before choosing the canvas. The examples use an 800 × 600 image. For another size, choose a canvas width and calculate the image height as `canvas width × source height / source width`, rounded to a whole pixel. Keep the full image visible without cropping or stretching. Scale text sizes, padding, and overlay coordinates with the image.

Load actual font files through Satori's `--font` option. Use Arial for captions and Arial or Impact for reactions; CSS font names alone do not load fonts. Match the supplied font weight to the HTML. If the requested font is unavailable, explain the substitution.

### Comics & Characters

Use the full comic or character template as the background, keeping its original aspect ratio. Place text inside the relevant panels, speech bubbles, or label areas. Follow the user's positions when provided; otherwise choose positions that preserve the reading order and keep faces and actions visible.

This example places one text box and one optional image overlay on an 800 × 600 background. Duplicate or remove overlays as needed. Replace the sample coordinates with positions measured on the selected template; they are not fixed positions for every comic.

```html
<div style="display: flex; position: relative; width: 800px; height: 600px; background: #fff; overflow: hidden;">
  <img src="./template.png" width="800" height="600"
    style="position: absolute; left: 0; top: 0; object-fit: contain;" />
  <div style="display: flex; position: absolute; left: 40px; top: 28px; width: 300px; height: 100px; align-items: center; justify-content: center; font-family: Arial; font-weight: 400; font-size: 30px; line-height: 1.15; text-align: center; color: #000;">
    Text for this panel
  </div>
  <img src="./overlay.png" width="100" height="100"
    style="position: absolute; left: 600px; top: 420px; object-fit: contain;" />
</div>
```

Keep an overlay image's own aspect ratio as well. Remove its `<img>` element when the meme does not need one. Text should sit directly on the template unless its design calls for a filled label or speech bubble.

### Captioned Images

Add a white caption area above the full image. Use black Arial text in that white space. Keep the image's original aspect ratio; the finished canvas is taller because it includes the caption area. Do not place the caption over the image for this layout.

This example has an 800 × 180 caption area above an 800 × 600 image, giving an 800 × 780 canvas. Increase the caption area's height when the text needs more room, and increase the canvas height by the same amount. The image height stays unchanged.

```html
<div style="display: flex; flex-direction: column; width: 800px; height: 780px; background: #fff;">
  <div style="display: flex; flex-shrink: 0; width: 800px; height: 180px; box-sizing: border-box; padding: 24px 32px; align-items: center; font-family: Arial; font-weight: 400; font-size: 40px; line-height: 1.2; color: #000;">
    When the fix works on the first try
  </div>
  <img src="./template.png" width="800" height="600"
    style="flex-shrink: 0; object-fit: contain;" />
</div>
```

Keep the caption left-aligned by default. Use deliberate line breaks when they improve the joke's timing. If the meme also needs labels inside the image, place them in a separate, relatively positioned image container using the comic overlay pattern.

### Reactions

Use the full reaction image as the canvas, keeping its original aspect ratio. Place Arial or Impact text over the image, usually near the top or bottom. Choose positions that leave the expression visible. A reaction can also work without text; omit the text elements when the image alone conveys the response.

This example uses white Impact text with a black outline for contrast. For Arial, change `font-family` and load the matching Arial file. Use the user's capitalization; uppercase is a style choice, not a requirement.

```html
<div style="display: flex; position: relative; width: 800px; height: 600px; overflow: hidden;">
  <img src="./template.png" width="800" height="600"
    style="position: absolute; left: 0; top: 0; object-fit: contain;" />
  <div style="display: flex; position: absolute; left: 32px; top: 24px; width: 736px; justify-content: center; font-family: Impact; font-weight: 400; font-size: 56px; line-height: 1.1; text-align: center; color: #fff; -webkit-text-stroke: 2px #000;">
    THE BUILD PASSED
  </div>
  <div style="display: flex; position: absolute; left: 32px; bottom: 24px; width: 736px; justify-content: center; font-family: Impact; font-weight: 400; font-size: 56px; line-height: 1.1; text-align: center; color: #fff; -webkit-text-stroke: 2px #000;">
    ON MY MACHINE
  </div>
</div>
```

Remove either text block if only one caption is needed. Adjust its width, position, line breaks, or font size if it covers the subject or runs beyond the image.

### Render and Check

Pass the same canvas dimensions to the renderer as those used by the outer HTML container. Resolve the installed Satori skill's directory before calling its renderer. For the captioned example:

```sh
bun --install=force /path/to/satori/scripts/render.ts \
  --input /path/to/meme.html --output /path/to/meme.png \
  --width 800 --height 780 \
  --font 'Arial:400=/path/to/Arial.ttf'
```

For the comic and reaction examples, use `--width 800 --height 600`. Load `Impact:400` instead of Arial for the reaction example as written. These commands create a new image; use a new output name or Satori's `--force` option when intentionally replacing an existing render.

View the rendered PNG before delivering it. Check that the full source image is visible, its proportions are unchanged, all text fits, and the font and contrast are correct. For comics, check panel order and overlay placement. For captioned images, check that the caption fits entirely within the white header. For reactions, check that the expression is still visible. Fix any clipping or unwanted overlap and render again.
