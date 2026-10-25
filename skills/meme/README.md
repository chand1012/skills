# Meme

Create memes from an idea, a named template, or an image you provide. The skill helps your agent find a clean template, place the text, and render the finished image with [Satori](../satori/README.md).

## Install

```sh
npx skills add chand1012/skills --skill meme
```

Install the required Satori skill too:

```sh
npx skills add chand1012/skills --skill satori
```

Satori needs Bun 1.3 or newer, network access for its first dependency download, and local font files. Fonts are not bundled. Use Arial for captions and Arial or Impact for reactions.

## Meme layouts

| Type | Layout |
| --- | --- |
| Comics & characters | Keep the full comic as the background. Place text and optional images in the relevant panels or speech bubbles. |
| Captioned images | Add black Arial text in a white area above the full image. |
| Reactions | Place Arial or Impact text over the full image, keeping the expression visible. Text is optional. |

Each layout preserves the source image's proportions. Captioned images gain extra height for the white caption area.

## Ask your agent

Give the agent your idea, the wording you want, and a template name or image if you have one. Include any preferences for text placement, font, and output location.

For a comic:

> Use the meme skill to make a two-panel rage comic about fixing one bug and finding three more. Put “Fixed it” in the first panel and “Three new bugs” in the second. Save it as a PNG.

For a caption above an image:

> Use the meme skill with this image. Add “When the fix works on the first try” in black Arial text on a white area above it. Keep the whole image visible.

For a reaction:

> Use the meme skill to make a Shocked Pikachu reaction. Put “THE BUILD PASSED” at the top and “ON MY MACHINE” at the bottom in white Impact text with a black outline. Keep the face visible.

## Reusing templates

The agent checks `~/.meme_templates` before looking for a template elsewhere. It saves reusable images there with descriptive filenames so you can use them again.

If a supplied image already has text or added images, the agent searches for a clean original. If multiple searches fail, it can use an available AI image editor to remove them.

The agent renders and inspects the finished PNG to check text fit, contrast, image proportions, and placement. See [SKILL.md](SKILL.md) for the workflow and editable Satori HTML templates.
