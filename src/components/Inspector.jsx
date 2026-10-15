import Icon from './Icon';
const dimension=(label,id,props={})=><label>{label} · cm<input id={id} type="number" step="1" {...props}/><small className="dimension-equivalent" id={`${id}-equivalent`}/></label>;
export default function Inspector({open=true,onClose}) {
 return <aside hidden={!open} className="inspector" id="studio-properties" tabIndex={-1}>
  <div className="inspector-heading"><h2 id="inspector-title">Your layout</h2><button className="panel-close" onClick={onClose} aria-label="Close properties"><Icon name="close" size={16}/></button></div>
  <div id="empty-inspector"><div className="empty-icon"><Icon name="cursor" size={28}/></div><p>Click a wall to change its colour, or an object to change its size.</p><div className="project-metrics"><div><span id="metric-area">—</span><small>FLOOR AREA · M²</small></div><div><span id="metric-budget">—</span><small>ITEM ESTIMATE</small></div></div></div>
  <section id="outer-wall-form" hidden aria-label="Selected wall"><p id="outer-wall-measurements" className="wall-measurements"/><label>Wall colour<input type="color" id="outer-wall-color"/></label><button type="button" id="outer-wall-reset">Use home wall colour</button><p className="muted">This colour applies to this wall only, in the plan and 3D view.</p></section>
  <form id="item-form" hidden>
   <label>Name<input id="item-label" maxLength="80"/></label>
   <div className="two-fields"><div id="width-label">{dimension('Width','item-width',{min:5,max:1000})}</div><div id="depth-label">{dimension('Depth','item-depth',{min:3,max:1000})}</div></div>
   <label>Colour<input type="color" id="item-color"/></label><div id="item-materials" className="mini-swatches" aria-label="Apply an item finish"/>
   <div className="two-fields"><button type="button" id="rotate-item">Rotate 90°</button><button type="button" id="mirror-item">Flip chaise</button></div>
   <div className="two-fields"><button type="button" id="duplicate-item">Duplicate</button><button type="button" id="delete-item" className="danger">Remove</button></div>
   <details id="placement-details" className="inspector-details"><summary>Height & position</summary>
    <div className="two-fields">{dimension('Height','item-height',{min:1,max:600})}{dimension('Distance above floor','item-elevation',{min:0,max:600})}</div>
    <div className="two-fields" id="position-fields">{dimension('From left','item-x')}{dimension('From top','item-y')}</div>
    <label id="rotation-label">Angle · degrees<input id="item-rotation" type="number" min="-360" max="360" step="15"/></label>
    <label id="wall-field" hidden>Attach to wall<select id="item-wall"/></label><p className="muted" id="item-note"/>
   </details>
   <details id="cost-details" className="inspector-details"><summary>Cost & supplier (optional)</summary><label>Item cost <span id="cost-currency">USD</span><input id="item-cost" type="number" min="0" max="1000000000" step="0.01" placeholder="Not specified"/></label><label>Supplier / reference<input id="item-supplier" maxLength="160" placeholder="Brand, model or reference"/></label></details>
  </form>
  <details className="inspector-bottom"><summary>Project notes</summary><textarea id="notes" rows="4" maxLength="3000" placeholder="Add a note…" aria-label="Project notes"/></details>
 </aside>;
}
