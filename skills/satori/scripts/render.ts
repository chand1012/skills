#!/usr/bin/env -S bun --install=force
// Purpose: Render static HTML/CSS to SVG with Satori, or PNG with resvg.
// Usage: ./render.ts --input card.html --output card.png --font 'Inter:400=Inter.ttf'
// Runtime: Bun 1.3+ on PATH; env must support -S. First run needs registry access.
// Dependencies: exact versions in the imports below; no package.json required.
import satori from 'satori@0.63.2';
import { initWasm, Resvg } from '@resvg/resvg-wasm@2.6.2';
import { parse, parseFragment } from 'parse5@7.3.0';
import * as css from 'css-tree@3.1.0';
import { parseArgs } from 'node:util';
import { readFile, writeFile, mkdir, realpath } from 'node:fs/promises';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HELP = `Render HTML to SVG or PNG. No browser or JavaScript execution.

Usage:
  render.ts -i card.html -o card.png --font 'Inter:400=./Inter-Regular.ttf'
  render.ts -i card.html -o card.svg --preset og --font 'Inter:700=./Inter-Bold.ttf'
  cat card.html | render.ts -i - -o - --format svg --base-dir . > card.svg

Options:
  -i, --input PATH          HTML fragment or document; - reads stdin (required)
  -o, --output PATH         .svg or .png file; - writes stdout (required)
      --format svg|png     Infer from output extension; required for stdout
      --preset NAME        og (1200x630, default), square (1080x1080),
                           portrait (1080x1350), story (1080x1920)
      --width PX           Override preset width; positive integer
      --height PX          Override preset height; positive integer
      --scale NUMBER       PNG pixel multiplier; default 1, e.g. 2 for retina
      --font SPEC          Repeatable: FAMILY[:WEIGHT[:STYLE]]=PATH
                           Weight: 100..900 in steps of 100 (default 400)
                           Style: normal or italic (default normal)
                           Font paths resolve from the working directory
      --base-dir DIR       Resolve HTML asset paths here; default input folder
                           (working directory for stdin)
      --allow-remote       Fetch http(s) image/CSS URL assets; default local only
      --point-scale NUMBER Layout precision, default 1; 0 disables rounding
      --debug              Draw layout boxes (diagnostic output)
      --force              Replace an existing output file
  -h, --help               Show this help

Use local font files; system fonts and @font-face are not loaded automatically.
Text is embedded as vector paths. PNG dimensions = width/height times scale.
Full documents use the body plus head <style> elements. External stylesheets,
scripts, canvas, video, iframes, and responsive image sources are rejected.
Image src and CSS url() assets are embedded. Inline SVG is supported.
Progress/errors go to stderr; stdout contains only output bytes when -o -.
`;

type HtmlNode = any; // parse5 nodes vary by HTML/SVG namespace and document context.
type Element = { type: string; props: Record<string, any> };
const fail = (message: string): never => { throw new Error(message); };

function numberFlag(value: string | undefined, fallback: number, name: string, integer = false, zero = false) {
  const n = value === undefined ? fallback : Number(value);
  if (!Number.isFinite(n) || (zero ? n < 0 : n <= 0) || (integer && !Number.isInteger(n))) {
    fail(`--${name} must be a ${zero ? 'nonnegative' : 'positive'} ${integer ? 'integer' : 'number'}.`);
  }
  return n;
}

async function main() {
  const { values: v } = parseArgs({ args: Bun.argv.slice(2), strict: true, options: {
    input: { type: 'string', short: 'i' }, output: { type: 'string', short: 'o' },
    format: { type: 'string' }, preset: { type: 'string' }, width: { type: 'string' },
    height: { type: 'string' }, scale: { type: 'string' },
    font: { type: 'string', multiple: true }, 'base-dir': { type: 'string' },
    'allow-remote': { type: 'boolean' }, 'point-scale': { type: 'string' },
    debug: { type: 'boolean' }, force: { type: 'boolean' }, help: { type: 'boolean', short: 'h' },
  } });
  if (v.help) { console.log(HELP); return; }
  if (!v.input || !v.output) fail('--input and --output are required. Use --help for examples.');
  const presets: Record<string, [number, number]> = {
    og: [1200, 630], square: [1080, 1080], portrait: [1080, 1350], story: [1080, 1920],
  };
  const preset = presets[v.preset ?? 'og'];
  if (!preset) fail(`Unknown preset: ${v.preset}. Choose og, square, portrait, or story.`);
  const width = numberFlag(v.width, preset[0], 'width', true);
  const height = numberFlag(v.height, preset[1], 'height', true);
  const scale = numberFlag(v.scale, 1, 'scale');
  const pointScaleFactor = numberFlag(v['point-scale'], 1, 'point-scale', false, true);
  const extension = extname(v.output).slice(1).toLowerCase();
  const format = v.format ?? extension;
  if (format !== 'svg' && format !== 'png') fail('Choose --format svg or png, or a .svg/.png output filename.');
  if (v.output !== '-' && extension && extension !== format) fail('--format conflicts with the output extension.');
  if (format === 'svg' && v.scale !== undefined) fail('--scale applies to PNG only. SVG is already scalable.');
  if (format === 'png' && (!Number.isInteger(width * scale) || !Number.isInteger(height * scale))) {
    fail('PNG width and height multiplied by --scale must be whole pixels.');
  }
  if (v.input !== '-' && v.output !== '-') {
    const inputPath = await realpath(v.input);
    const outputPath = await realpath(v.output).catch(() => resolve(v.output!));
    if (inputPath === outputPath) fail('Input and output must be different files, even with --force.');
  }
  const baseDir = resolve(v['base-dir'] ?? (v.input === '-' ? '.' : dirname(resolve(v.input))));
  const source = v.input === '-' ? await Bun.stdin.text() : await readFile(v.input, 'utf8');
  if (!source.trim()) fail('Input HTML is empty.');

  // Cache repeated assets; resolve all I/O before Satori sees the tree.
  const assets = new Map<string, Promise<string>>();
  function asset(src: string): Promise<string> {
    if (src.startsWith('data:') || src.startsWith('#')) return Promise.resolve(src);
    if (assets.has(src)) return assets.get(src)!;
    const pending = (async () => {
      let bytes: Buffer;
      let mime: string;
      if (/^https?:\/\//i.test(src)) {
        if (!v['allow-remote']) fail(`Remote asset blocked: ${src}. Use local files or --allow-remote.`);
        const response = await fetch(src, { signal: AbortSignal.timeout(30_000) });
        if (!response.ok) fail(`Asset returned HTTP ${response.status}: ${src}`);
        bytes = Buffer.from(await response.arrayBuffer());
        mime = response.headers.get('content-type')?.split(';')[0] ?? '';
        if (!mime.startsWith('image/')) fail(`Remote asset must return an image Content-Type: ${src}`);
      } else {
        if (/^[a-z][a-z\d+.-]*:/i.test(src) && !src.startsWith('file:')) fail(`Unsupported asset URL: ${src}`);
        const path = src.startsWith('file:') ? fileURLToPath(src) : resolve(baseDir, src);
        const types: Record<string, string> = {
          '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
          '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif',
        };
        mime = types[extname(path).toLowerCase()];
        if (!mime) fail(`Unknown image extension: ${path}. Use PNG, JPEG, SVG, WebP, GIF, or AVIF.`);
        bytes = await readFile(path);
      }
      return `data:${mime};base64,${bytes.toString('base64')}`;
    })();
    assets.set(src, pending);
    return pending;
  }

  async function parseCss(text: string, context: 'stylesheet' | 'declarationList') {
    const ast = css.parse(text, { context, onParseError(error: Error) { throw error; } });
    const jobs: Promise<void>[] = [];
    css.walk(ast, (node: any) => {
      if (node.type === 'Atrule' && ['font-face', 'import'].includes(node.name.toLowerCase())) {
        fail(`@${node.name} is not loaded. Pass fonts with --font and inline external stylesheets.`);
      }
      if (node.type === 'Url') jobs.push(asset(node.value).then(url => { node.value = url; }));
    });
    await Promise.all(jobs);
    return ast;
  }

  const document = /<!doctype\b|<html\b|<head\b|<body\b/i.test(source) ? parse(source) : parseFragment(source);
  const find = (node: HtmlNode, tag: string): HtmlNode | undefined => {
    if (node.tagName === tag) return node;
    for (const child of node.childNodes ?? []) { const match = find(child, tag); if (match) return match; }
  };
  const body = find(document, 'body');
  const head = find(document, 'head');
  if (head?.childNodes.some((n: HtmlNode) => n.tagName === 'base')) fail('<base> is unsupported; use --base-dir.');
  const headNodes = (head?.childNodes ?? []).filter((n: HtmlNode) => ['style', 'script', 'link'].includes(n.tagName));

  async function convert(node: HtmlNode, preserve = false): Promise<any> {
    if (node.nodeName === '#text') return preserve ? node.value : node.value.replace(/[ \t\r\n\f]+/g, ' ');
    if (!node.tagName) return null;
    const tag = node.tagName;
    if (['script', 'iframe', 'canvas', 'video', 'audio', 'picture', 'source', 'template', 'base'].includes(tag)) {
      fail(`<${tag}> is unsupported in this static renderer. Supply an image or static HTML instead.`);
    }
    const attrs: Record<string, string> = Object.fromEntries((node.attrs ?? []).map((a: any) => [a.prefix ? `${a.prefix}:${a.name}` : a.name, a.value]));
    if (tag === 'link') {
      if ((attrs.rel ?? '').toLowerCase().split(/\s+/).includes('stylesheet')) fail('External stylesheets are unsupported. Move the CSS into <style>.');
      return null;
    }
    if (['meta', 'title'].includes(tag)) return null;
    if ('srcset' in attrs) fail('srcset is unsupported. Choose one image with src and explicit dimensions.');
    if (Object.keys(attrs).some(k => /^on/i.test(k))) fail('HTML event handlers are unsupported. Remove on* attributes.');
    if (tag === 'style') {
      const text = (node.childNodes ?? []).map((n: HtmlNode) => n.value ?? '').join('');
      return { type: 'style', props: { ...attrs, dangerouslySetInnerHTML: { __html: css.generate(await parseCss(text, 'stylesheet')) } } };
    }
    const props: Record<string, any> = {};
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'style') continue;
      props[key === 'class' ? 'className' : key === 'for' ? 'htmlFor' : key === 'tabindex' ? 'tabIndex' : key] = value;
    }
    if (attrs.style) {
      props.style = {};
      const declarations = await parseCss(attrs.style, 'declarationList');
      declarations.children.forEach((d: any) => {
        if (d.type !== 'Declaration') return;
        if (d.important) fail('Inline !important is unsupported. Put that declaration in <style> instead.');
        const key = d.property.startsWith('--') ? d.property : d.property.replace(/^-ms-/, 'ms-').replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase());
        const value = css.generate(d.value);
        props.style[key] = /^-?(?:\d+\.?\d*|\.\d+)$/.test(value) ? Number(value) : value;
      });
    }
    if (tag === 'img') {
      if (!attrs.src) fail('Every <img> needs src.');
      props.src = await asset(attrs.src);
    }
    // SVG <image href> resources follow the same embedding policy.
    if (tag === 'image' && (attrs.href || attrs['xlink:href'])) {
      props.href = await asset(attrs.href || attrs['xlink:href']);
      delete props['xlink:href'];
    }
    preserve ||= tag === 'pre' || /white-space\s*:\s*(pre|break-spaces)/i.test(attrs.style ?? '');
    const children = await Promise.all((node.childNodes ?? []).map((n: HtmlNode) => convert(n, preserve)));
    // Drop formatting whitespace between block elements; keep inline word spacing.
    const inline = new Set(['span', 'a', 'strong', 'em', 'b', 'i', 'small', 'code', 'br']);
    props.children = children.filter((child: any, i: number) => {
      if (child === null) return false;
      if (preserve || typeof child !== 'string' || child.trim()) return true;
      const prev = children[i - 1]; const next = children[i + 1];
      return typeof prev === 'string' || typeof next === 'string' || inline.has(prev?.type) || inline.has(next?.type);
    });
    return { type: tag, props };
  }

  const fonts = await Promise.all((v.font ?? []).map(async spec => {
    const match = /^([^:=]+)(?::([1-9]00))?(?::(normal|italic))?=(.+)$/.exec(spec);
    if (!match) fail(`Invalid --font ${JSON.stringify(spec)}. Use 'Family:400:normal=/path/font.ttf'.`);
    return { name: match![1].trim(), weight: Number(match![2] ?? 400) as any,
      style: (match![3] ?? 'normal') as 'normal' | 'italic', data: await readFile(resolve(match![4])) };
  }));
  const converted = body ? await convert(body) : null;
  const content = await Promise.all([...headNodes, ...(body ? [] : document.childNodes)].map(n => convert(n)));
  const tree: Element = { type: body ? 'body' : 'div', props: {
    ...converted?.props,
    style: { display: 'flex', flexDirection: 'column', position: 'relative', width, height,
      margin: 0, boxSizing: 'border-box', fontFamily: fonts[0]?.name, ...converted?.props.style },
    children: [...content, ...(converted?.props.children ?? [])].filter(n => n !== null && !(typeof n === 'string' && !n.trim())),
  } };
  const svg = await satori(tree as any, { width, height, fonts, embedFont: true, debug: v.debug, pointScaleFactor });
  let bytes: Uint8Array = Buffer.from(svg);
  if (format === 'png') {
    const wasm = new URL('./index_bg.wasm', import.meta.resolve('@resvg/resvg-wasm@2.6.2'));
    await initWasm(await readFile(wasm));
    const renderer = new Resvg(svg, { fitTo: { mode: 'width', value: width * scale } });
    try {
      const image = renderer.render();
      try { bytes = image.asPng(); } finally { image.free(); }
    } finally { renderer.free(); }
  }
  if (v.output === '-') {
    await Bun.write(Bun.stdout, bytes);
  } else {
    await mkdir(dirname(resolve(v.output)), { recursive: true });
    await writeFile(v.output, bytes, { flag: v.force ? 'w' : 'wx' });
    console.error(`Rendered ${v.output} (${format === 'png' ? width * scale : width}x${format === 'png' ? height * scale : height}, ${bytes.length} bytes).`);
  }
}

main().catch(error => {
  console.error(`render: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
