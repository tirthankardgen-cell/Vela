import test from 'node:test';
import assert from 'node:assert/strict';
import {flatTemplates, createFlatTemplate, templateEdges, roomMeasurements} from '../planner/templates.js';
import {spacePolygon} from '../planner/rooms.js';
import {planItemShape} from '../planner/plan-shapes.js';
import {fixtureTypes} from '../planner/fixtures.js';

const EPS = 1e-6;
function fixture(id) {
  let sequence = 0;
  return createFlatTemplate(id, {idFactory: () => id + '-test-' + ++sequence});
}
function polygonArea(points) {
  return Math.abs(points.reduce((area, a, i) => {
    const b = points[(i + 1) % points.length];
    return area + a[0] * b[1] - b[0] * a[1];
  }, 0)) / 2;
}
function footprint(o, x = 0, y = 0, w = o.w, d = o.d) {
  const angle = o.rotation * Math.PI / 180;
  const cosine = Math.cos(angle), sine = Math.sin(angle);
  const corners = [[x - w / 2, y - d / 2], [x + w / 2, y - d / 2], [x + w / 2, y + d / 2], [x - w / 2, y + d / 2]];
  const points = corners.map(([x, y]) => [o.x + x * cosine - y * sine, o.y + x * sine + y * cosine]);
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  return {label: o.label, x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), d: Math.max(...ys) - Math.min(...ys), e: o.e, h: o.h, points};
}
function footprints(o) {
  const parts = [footprint(o)];
  if (o.kind === 'dining') {
    if (o.d >= o.w) {
      for (const y of [-o.d * .27, o.d * .27]) for (const x of [-o.w / 2 - .24, o.w / 2 + .24]) parts.push(footprint(o, x, y, .42, .42));
      if (o.variant === 'dining-six') for (const y of [-o.d / 2 - .24, o.d / 2 + .24]) parts.push(footprint(o, 0, y, .42, .42));
    } else {
      for (const x of [-o.w * .27, o.w * .27]) for (const y of [-o.d / 2 - .24, o.d / 2 + .24]) parts.push(footprint(o, x, y, .42, .42));
      if (o.variant === 'dining-six') for (const x of [-o.w / 2 - .24, o.w / 2 + .24]) parts.push(footprint(o, x, 0, .42, .42));
    }
  }
  return parts;
}
const overlaps = (a, b) =>
  Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) > .005 &&
  Math.min(a.y + a.d, b.y + b.d) - Math.max(a.y, b.y) > .005 &&
  Math.min(a.e + a.h, b.e + b.h) - Math.max(a.e, b.e) > .005;
const onSegment = (p, e) =>
  Math.abs((e.b[0] - e.a[0]) * (p[1] - e.a[1]) - (e.b[1] - e.a[1]) * (p[0] - e.a[0])) < EPS &&
  p[0] >= Math.min(e.a[0], e.b[0]) - EPS && p[0] <= Math.max(e.a[0], e.b[0]) + EPS &&
  p[1] >= Math.min(e.a[1], e.b[1]) - EPS && p[1] <= Math.max(e.a[1], e.b[1]) + EPS;

test('the collection replaces legacy sketches with two distinct flats for each BHK size', () => {
  assert.equal(flatTemplates.length, 8);
  assert.equal(new Set(flatTemplates.map(t => t.id)).size, 8);
  for (const bhk of [1, 2, 3, 4]) {
    const options = flatTemplates.filter(t => t.bhk === bhk);
    assert.equal(options.length, 2);
    assert.notEqual(options[0].area, options[1].area);
  }
  for (const id of ['flat', 'l1', 'b2', 'unknown']) assert.throws(() => createFlatTemplate(id), /available flat/);
  const a = createFlatTemplate('1bhk-city'), b = createFlatTemplate('1bhk-city');
  assert.notEqual(a.project.id, b.project.id);
  assert.equal(a.items.some(o => b.items.some(p => p.id === o.id)), false);
});

for (const template of flatTemplates) {
  test(template.id + ': closed rooms, shared walls and clear dimensions form one complete flat', () => {
    const layout = fixture(template.id), edges = templateEdges(layout);
    assert.equal(layout.items.filter(o => o.kind === 'bed').length, template.bhk);
    assert.ok(layout.room.vertices.length <= 24 && layout.room.vertices.length >= 4);
    assert.ok(layout.items.length <= 200);
    assert.equal(new Set([...layout.items, ...layout.room.spaces].map(o => o.id)).size, layout.items.length + layout.room.spaces.length);
    assert.ok(Math.abs(polygonArea(layout.room.vertices) - template.area) < EPS);
    let total = 0;
    const measurements = layout.room.spaces.map(space => {
      const points = spacePolygon(space, edges);
      assert.ok(points, space.name + ' must have a joined floor');
      total += polygonArea(points);
      const m = roomMeasurements(space, edges);
      assert.ok(m.clearWidth > .85 && m.clearDepth > 1, space.name + ' has an invalid clear size');
      if (space.type === 'hall') assert.ok(Math.min(m.clearWidth, m.clearDepth) >= 1.2 - EPS, space.name + ' must retain a 1.2 m clear passage');
      if (space.type === 'bedroom') assert.ok(m.clearWidth >= 3 && m.clearDepth >= 3.6);
      return {...m, e: 0, h: 1, name: space.name};
    });
    assert.ok(Math.abs(total - template.area) < EPS, 'Room floors must cover the footprint exactly');
    for (let i = 0; i < measurements.length; i++) for (let j = i + 1; j < measurements.length; j++)
      assert.equal(overlaps(measurements[i], measurements[j]), false, measurements[i].name + ' overlaps ' + measurements[j].name);
    for (const edge of edges.filter(e => e.id)) {
      const uses = layout.room.spaces.flatMap(s => s.walls.filter(r => r.id === edge.id));
      assert.equal(uses.length, 2, 'An internal wall must be shared once');
      assert.notEqual(uses[0].side, uses[1].side);
    }
  });

  test(template.id + ': doorways connect every room and windows face the outside', () => {
    const layout = fixture(template.id), edges = templateEdges(layout), spaces = layout.room.spaces;
    const graph = new Map([['outside', new Set()], ...spaces.map(s => [s.id, new Set()])]);
    const openings = layout.items.filter(o => ['door', 'window'].includes(o.kind));
    for (const o of openings) {
      const edge = edges[o.wall];
      assert.ok(edge && onSegment([o.x, o.y], edge));
      assert.ok(o.offset - o.w / 2 >= .055 - EPS && edge.len - o.offset - o.w / 2 >= .055 - EPS, o.label + ' crosses a corner');
      assert.ok(o.e + o.h <= layout.room.height + EPS);
      assert.equal(o.wallId || null, edge.id || null);
      if (o.kind === 'window') {
        assert.equal(edge.id, undefined, 'A window cannot face another room');
        continue;
      }
      const neighbours = spaces.filter(s => s.walls.some(ref => ref.id ? ref.id === edge.id : !edge.id && ref.index === edge.index)).map(s => s.id);
      if (!edge.id) neighbours.push('outside');
      assert.equal(neighbours.length, 2, o.label + ' must connect two spaces');
      graph.get(neighbours[0]).add(neighbours[1]); graph.get(neighbours[1]).add(neighbours[0]);
      const bedrooms = spaces.filter(s => neighbours.includes(s.id) && s.type === 'bedroom');
      assert.ok(bedrooms.length <= 1, 'Do not use a bedroom as the route to another bedroom');
    }
    const visited = new Set(['outside']), queue = ['outside'];
    while (queue.length) for (const id of graph.get(queue.shift())) if (!visited.has(id)) {visited.add(id); queue.push(id);}
    assert.equal(visited.size, graph.size, 'Every room must be reachable from the entrance');
    for (const space of spaces.filter(s => ['bedroom', 'living', 'kitchen'].includes(s.type))) {
      assert.ok(openings.some(o => o.kind === 'window' && space.walls.some(ref => !ref.id && ref.index === o.wall)), space.name + ' needs exterior daylight');
    }
    for (const window of openings.filter(o => o.kind === 'window')) {
      const edge = edges[window.wall], vertical = Math.abs(edge.a[0] - edge.b[0]) < EPS;
      for (const hob of layout.items.filter(o => o.kind === 'hob')) {
        const bounds = footprint(hob);
        const nearWall = vertical ? Math.abs(hob.x - window.x) < .65 : Math.abs(hob.y - window.y) < .65;
        const axis = vertical ? 'y' : 'x', extent = vertical ? 'd' : 'w';
        if (nearWall) assert.ok(bounds[axis] + bounds[extent] <= window[axis] - window.w / 2 ||
          bounds[axis] >= window[axis] + window.w / 2, 'Keep an operable window clear of the cooktop');
      }
    }
    for (let i = 0; i < openings.length; i++) for (let j = i + 1; j < openings.length; j++) {
      const a = openings[i], b = openings[j];
      if (a.wall === b.wall) assert.ok(Math.abs(a.offset - b.offset) >= (a.w + b.w) / 2 + .03, a.label + ' overlaps ' + b.label);
    }
  });

  test(template.id + ': furniture, dining chairs and door swings stay clear', () => {
    const layout = fixture(template.id), edges = templateEdges(layout);
    const objects = layout.items.filter(o => !['wall', 'door', 'window', 'rug'].includes(o.kind));
    const parts = [];
    for (const o of objects) {
      const space = layout.room.spaces.find(s => o.label.startsWith(s.name + ' · '));
      assert.ok(space, o.label + ' needs a room');
      const m = roomMeasurements(space, edges), room = template.rooms.find(r => r.key === space.templateKey);
      const left = m.x + (room.x === 0 ? .1 : .06), top = m.y + (room.y === 0 ? .1 : .06);
      const right = m.x + m.w - (Math.abs(room.x + room.w - template.width) < EPS ? .1 : .06);
      const bottom = m.y + m.d - (Math.abs(room.y + room.d - template.depth) < EPS ? .1 : .06);
      for (const p of footprints(o)) {
        assert.ok(p.x >= left - EPS && p.y >= top - EPS && p.x + p.w <= right + EPS && p.y + p.d <= bottom + EPS, o.label + ' crosses a wall');
        parts.push(p);
      }
      assert.ok(o.e + o.h <= layout.room.height + EPS);
      if (o.kind === 'bed') assert.ok(m.w - 2.16 - .1 >= .9 - EPS, 'Keep at least 0.9 m past the bed foot');
      if (o.kind === 'dining') {
        const chairs = footprints(o).slice(1);
        for (const c of chairs) {
          const back = c.y < o.y - o.d / 2 ? c.y - top : c.y > o.y + o.d / 2 ? bottom - c.y - c.d :
            c.x < o.x - o.w / 2 ? c.x - left : right - c.x - c.w;
          assert.ok(back >= .45 - EPS, 'Leave room to pull out dining chairs');
        }
      }
    }
    for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) {
      if (parts[i].label !== parts[j].label) assert.equal(overlaps(parts[i], parts[j]), false, parts[i].label + ' collides with ' + parts[j].label);
    }
    for (const door of layout.items.filter(o => o.kind === 'door' && !['door-open', 'door-sliding'].includes(o.variant))) {
      const angle = door.rotation * Math.PI / 180, cosine = Math.cos(angle), sine = Math.sin(angle);
      for (const p of parts.filter(p => p.e < 2.1)) {
        // Sample the complete occupied rectangle, not just the furniture centre.
        for (let ix = 0; ix <= 8; ix++) for (let iy = 0; iy <= 8; iy++) {
          const x = p.x + p.w * ix / 8 - door.x, y = p.y + p.d * iy / 8 - door.y;
          const dx = x * cosine + y * sine + door.w / 2, dy = (-x * sine + y * cosine) * (door.flip ? -1 : 1);
          const hits = dx > .025 && dy > .025 && Math.hypot(dx, dy) < door.w - .025;
          assert.equal(hits, false, door.label + ' swings into ' + p.label);
        }
      }
      const symbol = planItemShape(door);
      assert.equal(symbol.includes('scale(1 -1)'), door.flip);
    }
  });
}

test('fixture symbols and six-seat dining previews represent their persisted objects', () => {
  for (const [kind, spec] of Object.entries(fixtureTypes)) {
    const shape = planItemShape({kind, ...spec});
    assert.ok(shape.startsWith('<') && !shape.includes('undefined') && !shape.includes('NaN'), kind);
  }
  const six = planItemShape({kind: 'dining', variant: 'dining-six', w: 1.8, d: .9, color: '#b39470'});
  assert.equal((six.match(/<rect /g) || []).length, 7, 'One table and six chairs');
  assert.equal(planItemShape({kind: 'door', variant: 'door-open', w: 1.2, d: .12, color: '#b39470'}).includes(' A'), false);
});
