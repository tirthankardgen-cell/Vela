import {spacePolygon} from './rooms.js';

const OUTER_WALL = .2;
const INNER_WALL = .12;
const HEIGHT = 2.85;
const round = value => Math.round(value * 1e6) / 1e6;
const same = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-6;
const pointKey = p => p.map(round).join(',');
const segmentKey = (a, b) => [pointKey(a), pointKey(b)].sort().join('|');
const uid = () => globalThis.crypto.randomUUID();
const colours = {
  bedroom: '#ece5d8', living: '#f0eadf', dining: '#f0eadf',
  kitchen: '#e8ece4', bathroom: '#dfe9e8', balcony: '#e2e5d9',
  utility: '#e9e9e1', study: '#e8e4da', dressing: '#ece5d8',
  hall: '#f5f1e9',
};

function room(key, name, type, x, y, w, d, label = [.5, .55]) {
  return {key, name, type, x, y, w, d, label};
}

function flat(id, bhk, title, description, width, depth, rooms, portals) {
  return {
    id, bhk, title, description, width: round(width), depth: round(depth), rooms, portals,
    area: round(width * depth),
    bathrooms: rooms.filter(r => r.type === 'bathroom').length,
    balconies: rooms.filter(r => r.type === 'balcony').length,
  };
}

// Coordinates and overall sizes follow wall centre lines. The room schedule
// subtracts the appropriate half-thickness of each bounding wall.
function oneBedroom(balcony) {
  const id = balcony ? '1bhk-balcony' : '1bhk-city';
  const left = balcony ? 4.6 : 4;
  const width = balcony ? 8.4 : 7.4;
  const depth = balcony ? 8.8 : 7.8;
  const bedDepth = balcony ? 4.8 : 4;
  const hallEnd = bedDepth + 1.32;
  const bathWidth = balcony ? 2.1 : 1.9;
  const rooms = [
    room('living', 'Living & dining', 'living', 0, balcony ? 1.5 : 0, left, hallEnd - (balcony ? 1.5 : 0), [.69, .51]),
    room('kitchen', 'Kitchen', 'kitchen', 0, hallEnd, left, depth - hallEnd, [.57, .32]),
    room('bed1', 'Bedroom 1', 'bedroom', left, 0, width - left, bedDepth, [.72, .56]),
    room('hall', 'Entrance foyer', 'hall', left, bedDepth, width - left, 1.32, [.5, .53]),
    room('bath1', 'Bathroom', 'bathroom', left, hallEnd, bathWidth, depth - hallEnd, [.37, .55]),
    room('utility', 'Laundry', 'utility', left + bathWidth, hallEnd, width - left - bathWidth, depth - hallEnd, [.5, .35]),
  ];
  const portals = [
    {a: 'outside', b: 'hall', side: 'right', at: bedDepth + .66, w: 1, into: 'hall', name: 'Main entrance'},
    {a: 'hall', b: 'living', at: bedDepth + .66, w: 1.1, form: 'open'},
    {a: 'hall', b: 'bed1', at: width - .7, w: .9, into: 'bed1'},
    {a: 'living', b: 'kitchen', at: left - .85, w: 1.2, form: 'sliding'},
    {a: 'hall', b: 'bath1', at: left + bathWidth - .65, w: .75, into: 'bath1'},
    {a: 'hall', b: 'utility', at: left + bathWidth + (width - left - bathWidth) / 2, w: .8, form: 'sliding'},
  ];
  if (balcony) {
    rooms.push(room('balcony', 'Balcony', 'balcony', 0, 0, left, 1.5, [.68, .52]));
    portals.push({a: 'living', b: 'balcony', at: left - .95, w: 1.5, form: 'sliding'});
  }
  return flat(id, 1, balcony ? 'Balcony Retreat' : 'City Compact',
    balcony ? 'A separate bedroom, generous living space and a private balcony.' : 'An efficient one-bedroom home with a separate kitchen and laundry.',
    width, depth, rooms, portals);
}

function twoBedroom(balcony) {
  if (!balcony) return flat('2bhk-family', 2, 'Family Compact',
    'Two bedrooms, an open living and dining room, and a separate service lobby.',
    8.6, 10.42, [
      room('bed1', 'Bedroom 1', 'bedroom', 0, 0, 4.3, 3.8, [.74, .56]),
      room('bed2', 'Bedroom 2', 'bedroom', 4.3, 0, 4.3, 3.8, [.74, .56]),
      room('hall', 'Entrance hall', 'hall', 0, 3.8, 8.6, 1.32),
      room('living', 'Living & dining', 'living', 0, 5.12, 4.4, 5.3, [.68, .5]),
      room('lobby', 'Service lobby', 'hall', 4.4, 5.12, 1.32, 5.3, [.5, .55]),
      room('kitchen', 'Kitchen', 'kitchen', 5.72, 5.12, 2.88, 2.8, [.37, .55]),
      room('bath1', 'Bathroom', 'bathroom', 5.72, 7.92, 1.8, 2.5, [.34, .6]),
      room('utility', 'Laundry', 'utility', 7.52, 7.92, 1.08, 2.5, [.5, .34]),
    ], [
      {a: 'outside', b: 'hall', side: 'left', at: 4.46, w: 1, into: 'hall', name: 'Main entrance'},
      {a: 'hall', b: 'bed1', at: 3.6, w: .9, into: 'bed1'},
      {a: 'hall', b: 'bed2', at: 7.9, w: .9, into: 'bed2'},
      {a: 'hall', b: 'living', at: 1.25, w: 1.3, form: 'open'},
      {a: 'hall', b: 'lobby', at: 5.06, w: 1, form: 'open'},
      {a: 'lobby', b: 'kitchen', at: 5.97, w: 1.1, form: 'sliding'},
      {a: 'lobby', b: 'bath1', at: 8.72, w: .75, into: 'bath1'},
      {a: 'kitchen', b: 'utility', at: 8.06, w: .75, form: 'sliding'},
    ]);
  return flat('2bhk-balcony', 2, 'Family Balcony',
    'A main bedroom with its own bathroom, a second bathroom, study and balcony.',
    9.8, 12.32, [
      room('bed1', 'Bedroom 1', 'bedroom', 0, 0, 3.6, 4.8, [.7, .59]),
      room('bed2', 'Main bedroom', 'bedroom', 3.6, 0, 4.2, 4.8, [.72, .56]),
      room('ensuite', 'En suite', 'bathroom', 7.8, 0, 2, 2.4, [.36, .6]),
      room('bath1', 'Bathroom', 'bathroom', 7.8, 2.4, 2, 2.4, [.36, .42]),
      room('hall', 'Entrance hall', 'hall', 0, 4.8, 9.8, 1.32),
      room('living', 'Living & dining', 'living', 0, 6.12, 5, 4.8, [.68, .5]),
      room('balcony', 'Balcony', 'balcony', 0, 10.92, 5, 1.4, [.69, .5]),
      room('kitchen', 'Kitchen', 'kitchen', 5, 6.12, 4.8, 3.2, [.4, .57]),
      room('study', 'Study', 'study', 5, 9.32, 2.4, 3, [.5, .35]),
      room('utility', 'Laundry', 'utility', 7.4, 9.32, 2.4, 3, [.5, .36]),
    ], [
      {a: 'outside', b: 'hall', side: 'left', at: 5.46, w: 1, into: 'hall', name: 'Main entrance'},
      {a: 'hall', b: 'bed1', at: 2.9, w: .9, into: 'bed1'},
      {a: 'hall', b: 'bed2', at: 7.1, w: .9, into: 'bed2'},
      {a: 'bed2', b: 'ensuite', at: .8, w: .75, into: 'ensuite'},
      {a: 'hall', b: 'bath1', at: 9.15, w: .75, into: 'bath1'},
      {a: 'hall', b: 'living', at: 1.3, w: 1.4, form: 'open'},
      {a: 'hall', b: 'kitchen', at: 5.8, w: 1.1, form: 'sliding'},
      {a: 'living', b: 'balcony', at: 4.05, w: 1.5, form: 'sliding'},
      {a: 'living', b: 'study', at: 10.12, w: .9, into: 'study'},
      {a: 'kitchen', b: 'utility', at: 8.2, w: 1.1, form: 'sliding'},
    ]);
}

function threeBedroom(spacious) {
  const width = spacious ? 13.6 : 11.2;
  const hallTop = spacious ? 4.4 : 4;
  const publicTop = hallTop + 1.32;
  const livingWidth = spacious ? 5.2 : 4.8;
  const kitchenX = spacious ? 9.6 : 8.2;
  const diningEnd = spacious ? 8.92 : 8.4;
  const lobbyEnd = diningEnd + 1.32;
  const depth = lobbyEnd + 2.6;
  const bathSplit = spacious ? 7.4 : 6.5;
  const kitchenEnd = depth - 3;
  const rooms = spacious ? [
    room('bed1', 'Main bedroom', 'bedroom', 0, 0, 4.4, hallTop, [.72, .57]),
    room('ensuite', 'En suite', 'bathroom', 4.4, 0, 2, 2.4, [.35, .59]),
    room('dressing', 'Walk-in wardrobe', 'dressing', 4.4, 2.4, 2, 2, [.34, .5]),
    room('bed2', 'Bedroom 2', 'bedroom', 6.4, 0, 3.6, hallTop, [.72, .56]),
    room('bed3', 'Bedroom 3', 'bedroom', 10, 0, 3.6, hallTop, [.72, .56]),
  ] : [
    room('bed1', 'Bedroom 1', 'bedroom', 0, 0, 3.6, hallTop, [.72, .56]),
    room('bed2', 'Bedroom 2', 'bedroom', 3.6, 0, 3.8, hallTop, [.72, .56]),
    room('bed3', 'Bedroom 3', 'bedroom', 7.4, 0, 3.8, hallTop, [.72, .56]),
  ];
  rooms.push(
    room('hall', 'Entrance hall', 'hall', 0, hallTop, width, 1.32),
    room('living', 'Living room', 'living', 0, publicTop, livingWidth, depth - 1.4 - publicTop, [.7, .56]),
    room('balcony', 'Balcony', 'balcony', 0, depth - 1.4, livingWidth, 1.4, [.69, .5]),
    room('dining', 'Dining room', 'dining', livingWidth, publicTop, kitchenX - livingWidth, diningEnd - publicTop, [.5, .18]),
    room('lobby', 'Bathroom lobby', 'hall', livingWidth, diningEnd, kitchenX - livingWidth, 1.32),
    room('bath1', 'Bathroom', 'bathroom', livingWidth, lobbyEnd, bathSplit - livingWidth, 2.6, [.34, .56]),
    room(spacious ? 'study' : 'bath2', spacious ? 'Study' : 'Bathroom 2', spacious ? 'study' : 'bathroom', bathSplit, lobbyEnd, kitchenX - bathSplit, 2.6, [.36, .4]),
    room('kitchen', 'Kitchen', 'kitchen', kitchenX, publicTop, width - kitchenX, kitchenEnd - publicTop, [.37, .55]),
    room('utility', 'Laundry', 'utility', kitchenX, kitchenEnd, width - kitchenX, 3, [.5, .36]),
  );
  const portals = [
    {a: 'outside', b: 'hall', side: 'left', at: hallTop + .66, w: 1, into: 'hall', name: 'Main entrance'},
    ...rooms.filter(r => r.type === 'bedroom').map(r => ({a: 'hall', b: r.key, at: r.x + r.w - .7, w: .9, into: r.key})),
    {a: 'hall', b: 'living', at: 1.3, w: 1.4, form: 'open'},
    {a: 'hall', b: 'dining', at: spacious ? 7.4 : 6.5, w: 1.3, form: 'open'},
    {a: 'hall', b: 'kitchen', at: spacious ? 11.4 : 9, w: 1.1, form: 'sliding'},
    {a: 'living', b: 'dining', at: publicTop + 1.6, w: 2.2, form: 'open'},
    {a: 'dining', b: 'kitchen', at: publicTop + .85, w: 1.1, form: 'sliding'},
    {a: 'dining', b: 'lobby', at: kitchenX - .85, w: 1.1, form: 'open'},
    {a: 'lobby', b: 'bath1', at: bathSplit - .65, w: .75, into: 'bath1'},
    {a: 'lobby', b: spacious ? 'study' : 'bath2', at: kitchenX - .65, w: spacious ? .9 : .75, into: spacious ? 'study' : 'bath2'},
    {a: 'living', b: 'balcony', at: livingWidth - .95, w: 1.5, form: 'sliding'},
    {a: 'kitchen', b: 'utility', at: kitchenX + .85, w: 1.1, form: 'sliding'},
  ];
  if (spacious) portals.push(
    {a: 'bed1', b: 'ensuite', at: .8, w: .75, into: 'ensuite'},
    {a: 'bed1', b: 'dressing', at: 3.2, w: .9, form: 'sliding'},
  );
  return flat(spacious ? '3bhk-suite' : '3bhk-connected', 3,
    spacious ? 'Master Suite' : 'Connected Living',
    spacious ? 'A main suite, two more bedrooms, study and separate dining.' : 'Three bedrooms with shared living, dining, two bathrooms and a balcony.',
    width, depth, rooms, portals);
}

function fourBedroom(spacious) {
  const width = spacious ? 14.4 : 13.2;
  const hallTop = spacious ? 4.8 : 4;
  const publicTop = hallTop + 1.32;
  const livingWidth = spacious ? 5.2 : 4.6;
  const kitchenX = spacious ? 10.4 : 9.4;
  const diningEnd = spacious ? 9.42 : 8.42;
  const lobbyEnd = diningEnd + 1.32;
  const depth = spacious ? 13.72 : 12.84;
  const kitchenTop = spacious ? 10.92 : lobbyEnd;
  const serviceX = kitchenX - 1.32;
  const bathSplit = spacious ? 7.2 : 6.34;
  const utilityTop = depth - (spacious ? 1.6 : 1.5);
  const rooms = spacious ? [
    room('bed1', 'Main bedroom', 'bedroom', 0, 0, 4.6, hallTop, [.73, .54]),
    room('ensuite', 'En suite', 'bathroom', 4.6, 0, 2.2, 2.5, [.35, .57]),
    room('dressing', 'Walk-in wardrobe', 'dressing', 4.6, 2.5, 2.2, 2.3, [.32, .5]),
    room('bed2', 'Bedroom 2', 'bedroom', 6.8, 0, 3.8, hallTop, [.73, .57]),
    room('bed3', 'Bedroom 3', 'bedroom', 10.6, 0, 3.8, hallTop, [.73, .57]),
  ] : [
    room('bed1', 'Bedroom 1', 'bedroom', 0, 0, 3.8, hallTop, [.73, .57]),
    room('bed2', 'Bedroom 2', 'bedroom', 3.8, 0, 3.8, hallTop, [.73, .57]),
    room('bed3', 'Main bedroom', 'bedroom', 7.6, 0, 3.8, hallTop, [.73, .57]),
    room('ensuite', 'En suite', 'bathroom', 11.4, 0, 1.8, 2.4, [.34, .55]),
    room('dressing', 'Wardrobe room', 'dressing', 11.4, 2.4, 1.8, 1.6, [.3, .5]),
  ];
  rooms.push(
    room('hall', 'Entrance hall', 'hall', 0, hallTop, width, 1.32),
    room('bed4', 'Bedroom 4', 'bedroom', kitchenX, publicTop, width - kitchenX, kitchenTop - publicTop, [.73, .53]),
    room('living', 'Living room', 'living', 0, publicTop, livingWidth, depth - 1.4 - publicTop, [.69, .55]),
    room('balcony', 'Balcony', 'balcony', 0, depth - 1.4, livingWidth, 1.4, [.7, .5]),
    room('dining', 'Dining room', 'dining', livingWidth, publicTop, kitchenX - livingWidth, diningEnd - publicTop, [.5, .18]),
    room('lobby', 'Bathroom lobby', 'hall', livingWidth, diningEnd, kitchenX - livingWidth, 1.32),
    room('bath1', 'Bathroom 1', 'bathroom', livingWidth, lobbyEnd, bathSplit - livingWidth, depth - lobbyEnd, [.35, .56]),
    room('bath2', 'Bathroom 2', 'bathroom', bathSplit, lobbyEnd, serviceX - bathSplit, depth - lobbyEnd, [.34, .56]),
    room('service', 'Kitchen lobby', 'hall', serviceX, lobbyEnd, 1.32, utilityTop - lobbyEnd),
    room('utility', 'Laundry', 'utility', serviceX, utilityTop, 1.32, depth - utilityTop, [.5, .25]),
    room('kitchen', 'Kitchen', 'kitchen', kitchenX, kitchenTop, width - kitchenX, depth - kitchenTop, [.36, .5]),
  );
  const master = spacious ? 'bed1' : 'bed3';
  const portals = [
    {a: 'outside', b: 'hall', side: 'left', at: hallTop + .66, w: 1, into: 'hall', name: 'Main entrance'},
    ...rooms.filter(r => r.type === 'bedroom').map(r => ({a: 'hall', b: r.key, at: r.x + r.w - .7, w: .9, into: r.key})),
    {a: master, b: 'ensuite', at: .8, w: .75, into: 'ensuite'},
    {a: master, b: 'dressing', at: spacious ? 3.3 : 3.2, w: .9, form: 'sliding'},
    {a: 'hall', b: 'living', at: 1.3, w: 1.4, form: 'open'},
    {a: 'hall', b: 'dining', at: spacious ? 8.4 : 6.2, w: 1.4, form: 'open'},
    {a: 'living', b: 'dining', at: publicTop + 1.65, w: 2.2, form: 'open'},
    {a: 'dining', b: 'lobby', at: kitchenX - .8, w: 1.1, form: 'open'},
    {a: 'lobby', b: 'bath1', at: bathSplit - .65, w: .75, into: 'bath1'},
    {a: 'lobby', b: 'bath2', at: serviceX - .65, w: .75, into: 'bath2'},
    {a: 'lobby', b: 'service', at: serviceX + .66, w: 1, form: 'open'},
    {a: 'service', b: 'utility', at: serviceX + .66, w: .8, form: 'sliding'},
    {a: 'service', b: 'kitchen', at: kitchenTop + (spacious ? .6 : .8), w: spacious ? .9 : 1.05, form: 'sliding'},
    {a: 'living', b: 'balcony', at: livingWidth - .95, w: 1.5, form: 'sliding'},
  ];
  return flat(spacious ? '4bhk-grand' : '4bhk-residence', 4,
    spacious ? 'Grand Residence' : 'Family Residence',
    spacious ? 'Four bedrooms, a main suite, three bathrooms and generous shared spaces.' : 'Four bedrooms, three bathrooms and a dining room linked to the living area.',
    width, depth, rooms, portals);
}

export const flatTemplates = [
  oneBedroom(false), oneBedroom(true),
  twoBedroom(false), twoBedroom(true),
  threeBedroom(false), threeBedroom(true),
  fourBedroom(false), fourBedroom(true),
];
export const DEFAULT_FLAT_TEMPLATE = '2bhk-family';
export const getFlatTemplate = id => flatTemplates.find(t => t.id === id);

function onLine(p, a, b) {
  return Math.abs((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) < 1e-6 &&
    p[0] >= Math.min(a[0], b[0]) - 1e-6 && p[0] <= Math.max(a[0], b[0]) + 1e-6 &&
    p[1] >= Math.min(a[1], b[1]) - 1e-6 && p[1] <= Math.max(a[1], b[1]) + 1e-6;
}

function polygon(r) {
  return [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.d], [r.x, r.y + r.d]].map(p => p.map(round));
}

export function templateEdges(layout) {
  return [
    ...layout.room.vertices.map((a, index) => ({
      a, b: layout.room.vertices[(index + 1) % layout.room.vertices.length],
      t: layout.room.wallThickness, index,
    })),
    ...layout.items.filter(o => o.kind === 'wall').map(o => {
      const radians = o.rotation * Math.PI / 180;
      const dx = Math.cos(radians) * o.w / 2, dy = Math.sin(radians) * o.w / 2;
      return {id: o.id, a: [round(o.x - dx), round(o.y - dy)], b: [round(o.x + dx), round(o.y + dy)], t: o.d};
    }),
  ].map((e, index) => ({...e, index, len: Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1])}));
}

export function roomMeasurements(space, edges, fallback = INNER_WALL) {
  const points = spacePolygon(space, edges);
  if (!points) return null;
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  const w = Math.max(...xs) - x, d = Math.max(...ys) - y;
  const thickness = (axis, coordinate) => {
    const ref = space.walls.find(ref => {
      const e = edges.find((e, i) => ref.id ? e.id === ref.id : !e.id && i === ref.index);
      return e && Math.abs(e.a[axis] - coordinate) < 1e-6 && Math.abs(e.b[axis] - coordinate) < 1e-6;
    });
    const edge = ref && edges.find((e, i) => ref.id ? e.id === ref.id : !e.id && i === ref.index);
    return edge?.t || fallback;
  };
  return {
    x, y, w, d,
    clearWidth: round(w - (thickness(0, x) + thickness(0, x + w)) / 2),
    clearDepth: round(d - (thickness(1, y) + thickness(1, y + d)) / 2),
  };
}

function sharedBoundary(a, b, at) {
  if (Math.abs(a.x + a.w - b.x) < 1e-6 || Math.abs(b.x + b.w - a.x) < 1e-6) {
    const x = Math.max(a.x, b.x), low = Math.max(a.y, b.y), high = Math.min(a.y + a.d, b.y + b.d);
    if (at >= low && at <= high) return [round(x), round(at)];
  }
  if (Math.abs(a.y + a.d - b.y) < 1e-6 || Math.abs(b.y + b.d - a.y) < 1e-6) {
    const y = Math.max(a.y, b.y), low = Math.max(a.x, b.x), high = Math.min(a.x + a.w, b.x + b.w);
    if (at >= low && at <= high) return [round(at), round(y)];
  }
  throw new Error('Rooms do not share the requested doorway: ' + a.key + ' / ' + b.key);
}

export function createFlatTemplate(id = DEFAULT_FLAT_TEMPLATE, {idFactory = uid, project = {}} = {}) {
  const template = getFlatTemplate(id);
  if (!template) throw new Error('Choose an available flat template.');
  const items = [];
  function add(kind, x, y, options) {
    const item = {
      id: idFactory(), kind, label: kind, x: round(x), y: round(y),
      w: 1, d: 1, h: .8, e: 0, rotation: 0, flip: false,
      color: '#b59775', cost: 0, supplier: '', ...options,
    };
    items.push(item);
    return item;
  }
  const corners = [...new Map(template.rooms.flatMap(polygon).map(p => [pointKey(p), p])).values()];
  const border = corners.filter(p => p[0] === 0 || p[1] === 0 || p[0] === template.width || p[1] === template.depth);
  const vertices = [
    ...border.filter(p => p[1] === 0 && p[0] < template.width).sort((a, b) => a[0] - b[0]),
    ...border.filter(p => p[0] === template.width && p[1] < template.depth).sort((a, b) => a[1] - b[1]),
    ...border.filter(p => p[1] === template.depth && p[0] > 0).sort((a, b) => b[0] - a[0]),
    ...border.filter(p => p[0] === 0 && p[1] > 0).sort((a, b) => b[1] - a[1]),
  ];
  const walls = new Map();
  vertices.forEach((a, index) => walls.set(segmentKey(a, vertices[(index + 1) % vertices.length]), {index, a, b: vertices[(index + 1) % vertices.length]}));
  const spaces = template.rooms.map(r => {
    const points = polygon(r);
    const refs = [];
    points.forEach((a, i) => {
      const b = points[(i + 1) % 4];
      const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const stops = corners.filter(p => onLine(p, a, b)).sort((p, q) => Math.hypot(p[0] - a[0], p[1] - a[1]) - Math.hypot(q[0] - a[0], q[1] - a[1]));
      if (length < 1e-6) throw new Error('A template room has an empty wall.');
      for (let j = 0; j < stops.length - 1; j++) {
        const start = stops[j], end = stops[j + 1], key = segmentKey(start, end);
        let wall = walls.get(key);
        if (!wall) {
          const [from, to] = start[0] < end[0] || start[1] < end[1] ? [start, end] : [end, start];
          const o = add('wall', (from[0] + to[0]) / 2, (from[1] + to[1]) / 2, {
            label: r.name + ' · shared wall', w: Math.hypot(to[0] - from[0], to[1] - from[1]),
            d: INNER_WALL, h: HEIGHT, rotation: Math.atan2(to[1] - from[1], to[0] - from[0]) * 180 / Math.PI,
            color: '#d8d3c7',
          });
          wall = {id: o.id, a: from, b: to};
          walls.set(key, wall);
        }
        refs.push({...('id' in wall ? {id: wall.id} : {index: wall.index}), side: same(start, wall.a) ? 'a' : 'b'});
      }
    });
    return {id: idFactory(), name: r.name, type: r.type, templateKey: r.key, labelPosition: r.type === 'bedroom' ? [.55, .12] : r.label, floorColor: colours[r.type], walls: refs};
  });
  const layout = {
    format: 'roomnote-layout', version: 1, units: 'metres',
    project: {id: idFactory(), name: template.bhk + 'BHK · ' + template.title, client: '', designer: '', currency: 'INR', units: 'cm', budget: 0, ...project},
    room: {name: template.bhk + 'BHK · ' + template.title, height: HEIGHT, wallThickness: OUTER_WALL, vertices, spaces, zones: [], floorColor: '#f0eadf', wallColor: '#e5e0d5', edgeHeights: {}},
    items, notes: '', camera: null,
  };
  const edges = templateEdges(layout);
  const byKey = key => template.rooms.find(r => r.key === key);
  const entrySides = new Map();
  function opening(kind, point, options) {
    const edge = edges.find(e => onLine(point, e.a, e.b) &&
      Math.hypot(point[0] - e.a[0], point[1] - e.a[1]) >= options.w / 2 + .055 &&
      Math.hypot(point[0] - e.b[0], point[1] - e.b[1]) >= options.w / 2 + .055);
    if (!edge) throw new Error('An opening crosses a wall junction in ' + id + ': ' + options.label);
    const rotation = Math.atan2(edge.b[1] - edge.a[1], edge.b[0] - edge.a[0]) * 180 / Math.PI;
    return add(kind, point[0], point[1], {
      d: edge.t, h: kind === 'window' ? 1.1 : 2.1, e: kind === 'window' ? 1 : 0,
      color: kind === 'window' ? '#91b9c2' : '#a48a65',
      ...options, rotation, wall: edge.index, ...(edge.id ? {wallId: edge.id} : {}),
      offset: round(Math.hypot(point[0] - edge.a[0], point[1] - edge.a[1])),
    });
  }
  for (const portal of template.portals) {
    const target = byKey(portal.b), source = byKey(portal.a);
    const point = portal.a === 'outside'
      ? [portal.side === 'right' ? template.width : 0, portal.at]
      : sharedBoundary(source, target, portal.at);
    const edge = edges.find(e => onLine(point, e.a, e.b) && !same(point, e.a) && !same(point, e.b));
    const into = byKey(portal.into || portal.b);
    const centre = [into.x + into.w / 2, into.y + into.d / 2];
    const side = (edge.b[0] - edge.a[0]) * (centre[1] - point[1]) - (edge.b[1] - edge.a[1]) * (centre[0] - point[0]);
    const name = portal.name || (portal.form === 'open' ? target.name + ' passage' : target.name + ' door');
    opening('door', point, {
      label: name, w: portal.w, flip: side < 0,
      ...(portal.form ? {variant: portal.form === 'open' ? 'door-open' : 'door-sliding', h: portal.form === 'open' ? 2.4 : 2.1} : {}),
    });
    if (target.type === 'bathroom') entrySides.set(target.key, Math.abs(point[0] - target.x) < 1e-6 ? 'left' : Math.abs(point[1] - target.y) < 1e-6 ? 'top' : 'bottom');
  }
  // Only walls facing the outside receive windows; balcony edges remain railings.
  for (const r of template.rooms) {
    if (r.type === 'balcony') {
      const space = spaces.find(s => s.templateKey === r.key);
      for (const ref of space.walls) if ('index' in ref) layout.room.edgeHeights[ref.index] = 1.1;
      continue;
    }
    let point, w = 1.2, h = 1.1, e = 1;
    if (r.type === 'bedroom') {
      w = 1.5;
      point = r.y === 0 ? [r.x + r.w * .62, 0] : [template.width, r.y + 1.6];
    } else if (r.type === 'living') {
      point = [0, r.y + 1.65]; w = 1.8; e = 1.1;
    } else if (r.type === 'kitchen') {
      point = [r.x === 0 ? 0 : template.width, r.y + (r.x === 0 ? .72 : .6)]; w = 1; e = 1.1;
    } else if (r.type === 'bathroom') {
      w = .6; h = .6; e = 1.65;
      if (Math.abs(r.x + r.w - template.width) < 1e-6) point = [template.width, r.y + r.d * .72];
      else if (Math.abs(r.y + r.d - template.depth) < 1e-6) point = [r.x + r.w * .5, template.depth];
      else if (r.y === 0) point = [r.x + r.w * .5, 0];
    } else if (r.type === 'utility' || r.type === 'study') {
      w = r.type === 'study' ? 1.1 : .6; h = r.type === 'study' ? 1.1 : .6; e = r.type === 'study' ? 1 : 1.6;
      if (Math.abs(r.y + r.d - template.depth) < 1e-6) point = [r.x + r.w / 2, template.depth];
    }
    if (point) opening('window', point.map(round), {label: r.name + ' window', w, h, e});
  }

  function place(r, kind, x, y, options) {
    return add(kind, r.x + x, r.y + y, {...options, label: r.name + ' · ' + options.label});
  }
  const hasDining = template.rooms.some(r => r.type === 'dining');
  for (const r of template.rooms) {
    if (r.type === 'bedroom') {
      const bedY = Math.min(1.75, r.d / 2 - .3);
      place(r, 'bed', 1.16, bedY, {label: 'queen bed', w: 1.6, d: 2, h: .55, rotation: 270, color: '#c8b79b'});
      for (const sign of [-1, 1]) place(r, 'table', .37, bedY + sign * 1.11, {label: 'bedside table', variant: 'table-side', w: .42, d: .42, h: .5, color: '#af916f'});
      const dressing = template.portals.some(p => p.a === r.key && byKey(p.b)?.type === 'dressing');
      place(r, dressing ? 'table' : 'wardrobe', 1.1, r.d - (dressing ? .34 : .46), {
        label: dressing ? 'dresser' : 'wardrobe', ...(dressing ? {variant: 'table-console'} : {}),
        w: 1.8, d: dressing ? .35 : .6, h: dressing ? .8 : 2.25, color: '#b2997a',
      });
    } else if (r.type === 'living') {
      const y = 1.6;
      place(r, 'rug', r.w / 2, y, {label: 'living rug', w: Math.min(r.w - .6, 3.2), d: 2.6, h: .015, color: '#d8d0be'});
      place(r, 'sofa', .6, y, {label: 'three-seat sofa', w: 2.1, d: .9, h: .85, rotation: 270, color: '#9ca58d'});
      place(r, 'tv', r.w - .325, y, {label: 'TV console', w: 1.6, d: .35, h: .45, rotation: 90, color: '#b39470'});
      place(r, 'table', r.w * .51, y, {label: 'coffee table', w: .9, d: .55, h: .42, color: '#c4a478'});
      if (!hasDining) {
        place(r, 'dining', r.w * .65, r.d - 1.4, {label: 'four-seat dining', w: 1.2, d: .8, h: .76, color: '#bc9d74'});
      } else if (r.d >= 5.4) {
        for (const x of [1.05, 2.4]) place(r, 'chair', x, r.d - 1.2, {label: 'lounge chair', w: .7, d: .75, h: .85, rotation: 180, color: '#c1b49a'});
      }
    } else if (r.type === 'dining') {
      const sixSeats = r.w >= 4;
      place(r, 'dining', r.w / 2, r.d / 2 + .03, {label: sixSeats ? 'six-seat dining' : 'four-seat dining', ...(sixSeats ? {variant: 'dining-six'} : {}), w: sixSeats ? 1.8 : 1.4, d: .9, h: .76, color: '#ba9770'});
    } else if (r.type === 'kitchen') {
      if (r.x === 0) {
        place(r, 'counter', (r.w - 1.05) / 2 + .16, r.d - .46, {label: 'base cabinets', w: r.w - 1.05, d: .6, h: .9, color: '#b7bca9'});
        place(r, 'counter', .46, (r.d - 1.05) / 2 + .16, {label: 'return cabinets', w: .6, d: r.d - 1.05, h: .9, color: '#b7bca9'});
        place(r, 'sink', .75, r.d - .46, {label: 'sink', w: .7, d: .48, h: .04, e: .91, color: '#cbd4d2'});
        place(r, 'hob', r.w - 1.4, r.d - .46, {label: 'cooktop', w: .6, d: .5, h: .04, e: .91, color: '#3e4541'});
        place(r, 'fridge', r.w - .51, r.d - .51, {label: 'refrigerator', w: .7, d: .7, h: 1.8, color: '#c8ceca'});
      } else {
        place(r, 'counter', (1.5 + r.w - .16) / 2, .46, {label: 'base cabinets', w: r.w - 1.66, d: .6, h: .9, color: '#b7bca9'});
        place(r, 'counter', r.w - .46, (.8 + r.d - 1.05) / 2, {label: 'return cabinets', w: .6, d: r.d - 1.85, h: .9, color: '#b7bca9'});
        place(r, 'sink', r.w - .65, .46, {label: 'sink', w: .7, d: .48, h: .04, e: .91, color: '#cbd4d2'});
        place(r, 'hob', r.w - .46, Math.min(1.7, r.d - 1.38), {label: 'cooktop', w: .5, d: .55, h: .04, e: .91, color: '#3e4541'});
        place(r, 'fridge', r.w - .51, r.d - .51, {label: 'refrigerator', w: .7, d: .7, h: 1.8, color: '#c8ceca'});
      }
    } else if (r.type === 'bathroom') {
      const entry = entrySides.get(r.key), mirrored = entry === 'bottom';
      const y = value => mirrored ? r.d - value : value;
      place(r, 'basin', entry === 'left' ? r.w - .38 : .38, y(.43), {label: 'washbasin', w: .42, d: .38, h: .82, rotation: mirrored ? 180 : 0, color: '#f0f1eb'});
      place(r, 'toilet', r.w - .5, y(Math.min(1.25, r.d - 1.36)), {label: 'WC', w: .4, d: .7, h: .75, rotation: 90, color: '#f2f3ed'});
      place(r, 'shower', r.w - .61, y(r.d - .61), {label: 'shower', w: .9, d: .9, h: 2.1, rotation: mirrored ? 180 : 0, color: '#b8cfcd'});
    } else if (r.type === 'utility') {
      place(r, 'washer', r.w / 2, r.d - .475, {label: 'washing machine', w: .6, d: .65, h: .85, color: '#e0e3dd'});
    } else if (r.type === 'study') {
      place(r, 'table', r.w / 2, r.d - .46, {label: 'writing desk', variant: 'table-desk', w: 1.2, d: .6, h: .75, color: '#b79b78'});
      place(r, 'chair', r.w / 2, r.d - 1.2, {label: 'desk chair', w: .55, d: .6, h: .8, rotation: 180, color: '#adb5a0'});
    } else if (r.type === 'dressing') {
      place(r, 'wardrobe', r.w - .46, r.d / 2, {label: 'fitted wardrobe', w: r.d - .3, d: .6, h: 2.25, rotation: 90, color: '#b2997a'});
    } else if (r.type === 'balcony') {
      place(r, 'table', 1.45, r.d / 2, {label: 'bistro table', variant: 'table-round', w: .5, d: .5, h: .65, color: '#b69a73'});
      for (const [x, rotation] of [[.7, 270], [2.2, 90]]) place(r, 'chair', x, r.d / 2, {label: 'balcony chair', w: .55, d: .6, h: .8, rotation, color: '#a5b198'});
    }
  }
  const schedule = spaces.map(s => {
    const m = roomMeasurements(s, edges, OUTER_WALL);
    return s.name + ': ' + m.clearWidth.toFixed(2) + ' × ' + m.clearDepth.toFixed(2) + ' m clear';
  }).join('\n');
  layout.notes = template.bhk + 'BHK · ' + template.title + '\n' +
    'Clear room dimensions:\n' + schedule + '\n\n' +
    'External walls 200 mm; internal partitions 120 mm; ceiling 2.85 m. ' +
    'Main entrance 1,000 mm; bedroom doors 900 mm; bathroom doors 750 mm. ' +
    'Hallways provide at least 1,200 mm clear width. Windows face the exterior; balcony access uses sliding doors. ' +
    'Plan area is measured to wall centre lines, not a saleable-area calculation. Confirm site measurements and structural requirements before construction.';
  return layout;
}
