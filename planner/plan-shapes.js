import {catalogueVariants} from '../src/lib/catalogue.js';

export const escapeSVG = value => String(value).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const path = points => points.map((p, i) => (i ? 'L' : 'M') + p.join(',')).join(' ') + 'Z';

// The canvas, furniture cards and flat previews share the same plan symbols.
export function planItemShape(o) {
  const form = catalogueVariants[o.variant]?.form;
  const w = o.w, d = o.d, fill = escapeSVG(o.color), stroke = '#675f53';
  const box = (x, y, a, b, f = fill, r = .04) => '<rect x="' + x + '" y="' + y + '" width="' + a + '" height="' + b + '" rx="' + r + '" fill="' + f + '" stroke="' + stroke + '" stroke-width=".014"/>';
  const line = (points, colour = stroke, width = .018) => '<path d="' + points + '" fill="none" stroke="' + colour + '" stroke-width="' + width + '"/>';
  const ellipse = (x, y, rx, ry, f = fill) => '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '" stroke="' + stroke + '" stroke-width=".014"/>';
  let s = '';
  if (o.kind === 'wall') {
    s = box(-w / 2, -d / 2, w, d / 2, escapeSVG(o.faceColors?.b || o.color), 0) + box(-w / 2, 0, w, d / 2, escapeSVG(o.faceColors?.a || o.color), 0);
  } else if (form === 'round') {
    s = ellipse(0, 0, w / 2, d / 2);
  } else if (o.kind === 'door' && form === 'open') {
    s = '<rect x="' + -w / 2 + '" y="' + -d / 2 + '" width="' + w + '" height="' + d + '" fill="#f5f3ed"/>' +
      line('M' + -w / 2 + ',' + -d / 2 + ' V' + d / 2 + ' M' + w / 2 + ',' + -d / 2 + ' V' + d / 2);
  } else if (o.kind === 'door' && form === 'sliding') {
    s = '<rect x="' + -w / 2 + '" y="' + -d / 2 + '" width="' + w + '" height="' + d + '" fill="#f5f3ed"/>' +
      box(-w / 2, -.07, w / 2, .05) + box(0, .02, w / 2, .05) +
      line('M' + -w / 2 + ',-.1 H' + w / 2 + ' M' + -w / 2 + ',.1 H' + w / 2, fill, .015);
  } else if (o.kind === 'door' && form === 'double') {
    const r = w / 2;
    s = '<rect x="' + -r + '" y="' + (-d / 2 - .005) + '" width="' + w + '" height="' + (d + .01) + '" fill="#f5f3ed"/>' +
      line('M' + -r + ',0 V' + r + ' A' + r + ',' + r + ' 0 0 0 0,0 M' + r + ',0 V' + r + ' A' + r + ',' + r + ' 0 0 1 0,0', fill, .025);
  } else if (o.kind === 'lsofa') {
    const side = Math.min(.72, w * .35), body = Math.min(.85, d * .65);
    const p = o.flip ? [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, -d / 2 + body], [-w / 2 + side, -d / 2 + body], [-w / 2 + side, d / 2], [-w / 2, d / 2]] :
      [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [w / 2 - side, d / 2], [w / 2 - side, -d / 2 + body], [-w / 2, -d / 2 + body]];
    s = '<path d="' + path(p) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width=".018"/>' + box(-w / 2 + .06, -d / 2 + .05, w - .12, .14, '#ffffff38');
  } else if (o.kind === 'door') {
    s = '<rect x="' + -w / 2 + '" y="' + (-d / 2 - .005) + '" width="' + w + '" height="' + (d + .01) + '" fill="#f5f3ed"/>' +
      line('M' + -w / 2 + ',0 L' + -w / 2 + ',' + w + ' A' + w + ',' + w + ' 0 0 0 ' + w / 2 + ',0', fill, .025) +
      line('M' + -w / 2 + ',0 V' + w, fill, .04);
  } else if (o.kind === 'window') {
    const thickness = Math.max(d, .17);
    s = box(-w / 2, -thickness / 2, w, thickness, '#d1e7eb', 0) + line('M' + -w / 2 + ',0 H' + w / 2 + ' M0,' + -thickness / 2 + ' V' + thickness / 2, '#5e98a5', .02);
  } else if (o.kind === 'dining') {
    s = box(-w / 2, -d / 2, w, d);
    const c = .42;
    if (d >= w) {
      for (const y of [-d * .27, d * .27]) for (const x of [-w / 2 - .24, w / 2 + .24]) s += box(x - c / 2, y - c / 2, c, c, '#e0e1da', .08);
      if (form === 'six-seat') for (const y of [-d / 2 - .24, d / 2 + .24]) s += box(-c / 2, y - c / 2, c, c, '#e0e1da', .08);
    } else {
      for (const x of [-w * .27, w * .27]) for (const y of [-d / 2 - .24, d / 2 + .24]) s += box(x - c / 2, y - c / 2, c, c, '#e0e1da', .08);
      if (form === 'six-seat') for (const x of [-w / 2 - .24, w / 2 + .24]) s += box(x - c / 2, -c / 2, c, c, '#e0e1da', .08);
    }
  } else if (o.kind === 'bed') {
    s = box(-w / 2, -d / 2, w, d) + box(-w / 2 + .07, -d / 2 + .09, w / 2 - .1, .37, '#f2efe8', .06) +
      box(.03, -d / 2 + .09, w / 2 - .1, .37, '#f2efe8', .06) + line('M' + -w / 2 + ',' + (-d / 2 + .58) + ' H' + w / 2, '#a5a293', .02);
  } else if (o.kind === 'fan') {
    s = '<circle r="' + w / 2 + '" fill="none" stroke="#9ea996" stroke-width=".014" stroke-dasharray=".05 .05"/><circle r=".10" fill="' + fill + '"/>';
    for (let i = 0; i < 3; i++) s += '<rect x=".03" y="-.065" width="' + w * .42 + '" height=".13" rx=".06" fill="' + fill + '" transform="rotate(' + i * 120 + ')"/>';
  } else if (o.kind === 'heater') {
    s = box(-w / 2, -d / 2, w, d);
    for (let i = 1; i < 8; i++) s += line('M' + (-w / 2 + w * i / 8) + ',' + -d / 2 + ' V' + d / 2, '#899083', .012);
  } else if (o.kind === 'partition') {
    s = box(-w / 2, -d / 2, w, d, fill, .008);
    for (let x = -w / 2 + .03; x < w / 2; x += .1) s += line('M' + x + ',' + -d / 2 + ' V' + d / 2, '#e6d7bb', .012);
  } else if (o.kind === 'counter') {
    s = box(-w / 2, -d / 2, w, d) + box(-w / 2 + .04, -d / 2 + .04, w - .08, d - .08, '#deded0', .02);
    const count = Math.max(1, Math.round(Math.max(w, d) / .6));
    for (let i = 1; i < count; i++) {
      s += w >= d ? line('M' + (-w / 2 + w * i / count) + ',' + -d / 2 + ' V' + d / 2, '#9b9f8e', .012) :
        line('M' + -w / 2 + ',' + (-d / 2 + d * i / count) + ' H' + w / 2, '#9b9f8e', .012);
    }
  } else if (o.kind === 'sink') {
    s = box(-w / 2, -d / 2, w, d, '#d2dbd8', .025) + box(-w * .36, -d * .3, w * .72, d * .6, '#9eafad', .07) +
      line('M0,' + -d * .2 + ' V' + -d * .43 + ' H' + w * .15, '#617876', .025);
  } else if (o.kind === 'hob') {
    s = box(-w / 2, -d / 2, w, d, fill, .035);
    for (const x of [-w * .23, w * .23]) for (const y of [-d * .23, d * .23]) s += ellipse(x, y, w * .13, w * .13, '#68716a');
  } else if (o.kind === 'fridge') {
    s = box(-w / 2, -d / 2, w, d) + line('M' + -w / 2 + ',' + -d * .32 + ' H' + w / 2) + line('M' + w * .3 + ',' + -d * .4 + ' H' + w * .43, '#707d76', .035);
  } else if (o.kind === 'washer') {
    s = box(-w / 2, -d / 2, w, d) + ellipse(0, .025, w * .3, w * .3, '#b6c1bc') +
      line('M' + -w * .38 + ',' + -d * .35 + ' H' + w * .38, '#82928a', .03);
  } else if (o.kind === 'toilet') {
    s = box(-w / 2, -d / 2, w, d * .23, fill, .025) + ellipse(0, d * .075, w * .46, d * .31, fill) + ellipse(0, d * .085, w * .3, d * .2, '#d0dfdc');
  } else if (o.kind === 'basin') {
    s = box(-w / 2, -d / 2, w, d) + ellipse(0, .025, w * .35, d * .28, '#d0dfdc') +
      line('M0,' + -d * .16 + ' V' + -d * .4, '#7d938b', .025);
  } else if (o.kind === 'shower') {
    s = box(-w / 2, -d / 2, w, d, '#d7e5e2', .025) +
      line('M' + -w / 2 + ',' + -d / 2 + ' H' + w / 2 + ' V' + d / 2, '#7faaa7', .035) +
      ellipse(w * .25, -d * .25, .04, .04, '#93b2ac') + line('M' + -w * .25 + ',' + -d / 2 + ' V' + -d * .3 + ' H0', '#6f9490', .025);
  } else {
    s = box(-w / 2, -d / 2, w, d, fill, o.kind === 'rug' ? .02 : .04);
    if (o.kind === 'sofa' || o.kind === 'chair') s += box(-w / 2 + .04, -d / 2 + .04, w - .08, .13, '#ffffff38');
    if (o.kind === 'tv') s += box(-w * .38, d / 2 - .04, w * .76, .035, '#273d37', .008);
    if (o.kind === 'shrine') s += line('M' + -w * .3 + ',' + -d * .2 + ' L0,' + d * .2 + ' L' + w * .3 + ',' + -d * .2, '#ead9a8', .04);
  }
  if (o.kind === 'fan') return '<g transform="scale(1 ' + d / w + ')">' + s + '</g>';
  return o.kind === 'door' && o.flip && !['open', 'sliding'].includes(form) ? '<g transform="scale(1 -1)">' + s + '</g>' : s;
}
