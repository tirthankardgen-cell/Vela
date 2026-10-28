import {useMemo, useRef, useState} from 'react';
import {flatTemplates, DEFAULT_FLAT_TEMPLATE, createFlatTemplate, getFlatTemplate, templateEdges, roomMeasurements} from '../../planner/templates.js';
import {spacePolygon} from '../../planner/rooms.js';
import {planItemShape} from '../../planner/plan-shapes.js';
import {feetAndInches} from '../lib/measurements.js';
import Icon from './Icon';
import './flat-templates.css';

const path = points => points.map((p, i) => (i ? 'L' : 'M') + p.join(',')).join(' ') + 'Z';
const cache = new Map();
function preview(template) {
  if (!cache.has(template.id)) {
    let sequence = 0;
    const layout = createFlatTemplate(template.id, {idFactory: () => template.id + '-preview-' + ++sequence});
    const edges = templateEdges(layout);
    cache.set(template.id, {layout, edges});
  }
  return cache.get(template.id);
}
const areaFeet = template => Math.round(template.area * 10.7639104).toLocaleString('en-IN');
const size = (metres, units) => units === 'ft-in' ? '≈ ' + feetAndInches(metres) : metres.toFixed(2) + ' m';

export function FlatTemplatePlan({template, detailed = false}) {
  const {layout, edges} = useMemo(() => preview(template), [template]);
  const order = o => o.kind === 'wall' ? -2 : o.kind === 'rug' ? -1 : ['door', 'window'].includes(o.kind) ? 2 : 0;
  const entry = layout.items.find(o => o.label === 'Main entrance');
  return <svg className={'flat-template-plan' + (detailed ? ' is-detailed' : '')}
    viewBox={[-.65, -.85, template.width + 1.55, template.depth + 1.5].join(' ')}
    role="img" aria-label={template.bhk + 'BHK ' + template.title + ' furnished floor plan'}>
    <title>{template.bhk + 'BHK · ' + template.title}</title>
    <path d={path(layout.room.vertices)} fill={layout.room.floorColor} stroke="#848a79" strokeWidth=".2"/>
    {layout.room.spaces.map(r => <path key={r.id} d={path(spacePolygon(r, edges))} fill={r.floorColor}/>)}
    {edges.filter(e => !e.id).map(e => <line key={e.index} x1={e.a[0]} y1={e.a[1]} x2={e.b[0]} y2={e.b[1]} stroke="#a3a591" strokeWidth=".2"/>)}
    {[...layout.items].sort((a, b) => order(a) - order(b)).map(o =>
      <g key={o.id} transform={'translate(' + o.x + ' ' + o.y + ') rotate(' + o.rotation + ')'} dangerouslySetInnerHTML={{__html: planItemShape(o)}}/>)}
    {detailed && layout.room.spaces.map(r => {
      const m = roomMeasurements(r, edges);
      const [fx, fy] = r.type === 'bedroom' ? [.55, .12] : r.labelPosition;
      const x = m.x + m.w * fx, y = m.y + m.d * fy;
      const vertical = m.w < 1.6 && m.d > m.w * 2;
      const font = Math.min(.25, (vertical ? m.d : m.w) / (r.name.length * .6 + 1));
      return <text key={r.id} x={x} y={y} textAnchor="middle" fontSize={font}
        transform={vertical ? 'rotate(-90 ' + x + ' ' + y + ')' : undefined}
        fill="#4b5847" stroke="#f4f1e9" strokeWidth=".04" paintOrder="stroke">
        {r.name}<tspan x={x} dy={font * 1.35} fontSize={font * .82}>{m.clearWidth.toFixed(2) + ' × ' + m.clearDepth.toFixed(2) + ' m'}</tspan>
      </text>;
    })}
    <g fill="#62705b" stroke="#858c78" strokeWidth=".015">
      <path d={'M0,-.27 V-.52 M0,-.4 H' + template.width + ' M' + template.width + ',-.27 V-.52'} fill="none"/>
      <text x={template.width / 2} y={-.49} textAnchor="middle" fontSize=".23" stroke="none">{template.width.toFixed(2) + ' m'}</text>
      <path d={'M' + (template.width + .25) + ',0 H' + (template.width + .5) + ' M' + (template.width + .4) + ',0 V' + template.depth + ' M' + (template.width + .25) + ',' + template.depth + ' H' + (template.width + .5)} fill="none"/>
      <text x={template.width + .62} y={template.depth / 2} textAnchor="middle" fontSize=".23" stroke="none"
        transform={'rotate(90 ' + (template.width + .62) + ' ' + template.depth / 2 + ')'}>{template.depth.toFixed(2) + ' m'}</text>
      {detailed && <text x={entry.x === 0 ? -.17 : template.width + .16} y={entry.y + .1}
        textAnchor={entry.x === 0 ? 'end' : 'start'} fontSize=".18" stroke="none"
        transform={'rotate(-90 ' + (entry.x === 0 ? -.17 : template.width + .16) + ' ' + (entry.y + .1) + ')'}>ENTRY</text>}
    </g>
  </svg>;
}

export function FlatTemplateBrowser({value = DEFAULT_FLAT_TEMPLATE, onChange, units = 'cm'}) {
  const template = getFlatTemplate(value) || getFlatTemplate(DEFAULT_FLAT_TEMPLATE);
  const {layout, edges} = useMemo(() => preview(template), [template]);
  return <section className="flat-template-browser" aria-label="Furnished flat templates">
    <div className="flat-template-heading"><div><span className="flat-template-eyebrow">8 FURNISHED FLAT LAYOUTS</span><h2>Find your starting point.</h2></div><p>Two layouts for every flat size.</p></div>
    <div className="flat-template-filters" role="group" aria-label="Number of bedrooms">
      {[1, 2, 3, 4].map(bhk => <button key={bhk} type="button" aria-pressed={template.bhk === bhk}
        onClick={() => onChange(flatTemplates.find(t => t.bhk === bhk).id)}>{bhk}BHK<span>2 layouts</span></button>)}
    </div>
    <div className="flat-template-cards">
      {flatTemplates.filter(t => t.bhk === template.bhk).map(t => <button type="button" key={t.id}
        className="flat-template-card" data-flat-template={t.id} aria-pressed={t.id === template.id}
        aria-label={'Preview ' + t.bhk + 'BHK ' + t.title} onClick={() => onChange(t.id)}>
        <div className="flat-template-thumbnail"><FlatTemplatePlan template={t}/>{t.id === template.id && <span className="flat-template-check"><Icon name="check" size={14}/><span className="sr-only">Selected</span></span>}</div>
        <div className="flat-template-card-copy"><strong>{t.title}</strong><span>{t.width.toFixed(1) + ' × ' + t.depth.toFixed(2) + ' m'}</span><small>{areaFeet(t)} sq ft · {t.bathrooms} {t.bathrooms === 1 ? 'bath' : 'baths'}{t.balconies ? ' · balcony' : ''}</small></div>
      </button>)}
    </div>
    <div className="flat-template-detail" data-preview-template={template.id}>
      <div className="flat-template-drawing"><FlatTemplatePlan template={template} detailed/>
        <div className="flat-template-legend"><span><i className="legend-wall"/>Walls & doors</span><span><i className="legend-window"/>Windows</span><span><i className="legend-furniture"/>Furniture</span></div>
      </div>
      <div className="flat-template-specs">
        <span className="flat-template-eyebrow">{template.bhk} BEDROOMS · {template.bathrooms} {template.bathrooms === 1 ? 'BATHROOM' : 'BATHROOMS'}</span>
        <h3>{template.title}</h3><p>{template.description}</p>
        <dl className="flat-template-metrics"><div><dt>Plan area</dt><dd>{template.area.toFixed(1)} m²<small>{areaFeet(template)} sq ft</small></dd></div><div><dt>Ceiling height</dt><dd>{size(2.85, units)}<small>{units === 'ft-in' ? '2.85 m' : '≈ ' + feetAndInches(2.85)}</small></dd></div></dl>
        <details className="flat-template-room-schedule" open>
          <summary>Room dimensions</summary><p>Clear internal sizes, after allowing for walls.</p>
          <div className="flat-template-table-scroll"><table><caption className="sr-only">Clear room dimensions for {template.bhk}BHK {template.title}</caption>
            <thead><tr><th scope="col">Room</th><th scope="col">Width × depth</th></tr></thead>
            <tbody>{layout.room.spaces.map(r => {
              const m = roomMeasurements(r, edges);
              return <tr key={r.id}><th scope="row">{r.name}</th><td>{size(m.clearWidth, units)} × {size(m.clearDepth, units)}</td></tr>;
            })}</tbody>
          </table></div>
        </details>
        <p className="flat-template-measurement-note">Overall dimensions and plan area follow wall centre lines. Doors, windows and furniture are included and editable.</p>
      </div>
    </div>
  </section>;
}

export function FlatTemplateDialog() {
  const dialog = useRef(null), [value, setValue] = useState(DEFAULT_FLAT_TEMPLATE);
  const template = getFlatTemplate(value);
  function apply() {
    document.dispatchEvent(new CustomEvent('vela:template', {detail: {id: value}}));
    dialog.current.close();
  }
  return <dialog ref={dialog} id="flat-template-dialog" className="flat-template-dialog" aria-labelledby="flat-template-dialog-title"
    onClick={event => {if (event.target === dialog.current) dialog.current.close();}}>
    <header><div><span className="flat-template-eyebrow">VELA · FLAT TEMPLATES</span><h2 id="flat-template-dialog-title">A considered place to begin.</h2></div>
      <button type="button" aria-label="Close flat templates" onClick={() => dialog.current.close()}><Icon name="close" size={20}/></button></header>
    <div className="flat-template-dialog-body"><FlatTemplateBrowser value={value} onChange={setValue}/></div>
    <footer><p>Replaces the current layout. Undo restores it.</p><button className="flat-template-apply" type="button" onClick={apply}>Use this {template.bhk}BHK layout <Icon name="arrow" size={17}/></button></footer>
  </dialog>;
}
