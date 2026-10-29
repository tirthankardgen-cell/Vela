import Icon from './Icon';
const dimension=(label,id,props={})=><label>{label} · cm<input id={id} type="number" step="any" {...props}/><small className="dimension-equivalent" id={`${id}-equivalent`}/></label>;
export default function Inspector({open=true,onClose}) {
 return <aside hidden={!open} className="inspector" id="studio-properties" tabIndex={-1}>
  <div className="inspector-heading"><h2 id="inspector-title">Your layout</h2><button className="panel-close" onClick={onClose} aria-label="Collapse properties"><Icon name="minus" size={16}/>Collapse</button></div>
  <div id="empty-inspector"><div className="empty-icon"><Icon name="cursor" size={28}/></div><p>Click a wall to change its colour, or an object to change its size.</p><div className="project-metrics"><div><span id="metric-area">—</span><small>FLOOR AREA · M²</small></div><div><span id="metric-budget">—</span><small>ITEM ESTIMATE</small></div></div></div>
  <section id="outer-wall-form" hidden aria-label="Selected wall"><p id="outer-wall-measurements" className="wall-measurements"/><div className="two-fields"><label>Inside face<input type="color" id="outer-wall-color"/></label><label>Outside face<input type="color" id="outer-wall-back-color"/></label></div><button type="button" id="outer-wall-reset">Use default wall colour</button><p className="muted">Paint each face separately. Inside faces the room; outside faces away.</p></section>
  <section id="space-form" hidden aria-label="Selected room"><p id="space-measurements" className="wall-measurements"/><label>Floor colour<input type="color" id="space-floor-color"/></label><p className="muted" id="space-hint">Drag the room’s floor or name to move its walls and floor together. Shared walls separate when moved; neighbouring rooms stay in place.</p></section>
  <form id="item-form" hidden>
   <label>Name<input id="item-label" maxLength="80"/></label>
   <div className="two-fields"><div id="width-label">{dimension('Width','item-width',{min:5,max:1000})}</div><div id="depth-label">{dimension('Depth','item-depth',{min:3,max:1000})}</div></div>
   <section id="door-controls" className="door-controls" hidden aria-label="Door swing"><h3>Door swing</h3><label>Opens toward<select id="door-swing"><option value="a">Inside</option><option value="b">Outside</option></select></label><button type="button" id="door-hinge"><Icon name="redo" size={16}/>Flip hinge side</button><small id="door-swing-note">The arc shows the opening direction in the plan.</small></section>
   <div className="vertical-position">{dimension('Above floor','item-elevation',{min:0,max:600})}<div className="two-fields"><button type="button" id="lower-item"><Icon name="down" size={14}/>Lower 5 cm</button><button type="button" id="raise-item"><Icon name="up" size={14}/>Raise 5 cm</button></div><small>Vertical position · visible in 3D</small></div>
   <label><span id="item-color-label">Colour</span><input type="color" id="item-color"/></label><label id="item-back-color-field" hidden>Side B colour<input type="color" id="item-back-color"/></label><small id="wall-face-note" hidden>Side A and B are marked on the selected wall in plan.</small><div id="item-materials" className="mini-swatches" aria-label="Apply an item finish"/>
   <div className="two-fields"><button type="button" id="rotate-item">Rotate 90°</button><button type="button" id="mirror-item">Flip chaise</button></div>
   <div className="two-fields"><button type="button" id="duplicate-item">Duplicate</button><button type="button" id="delete-item" className="danger">Remove</button></div>
   <details id="placement-details" className="inspector-details"><summary>Height & position</summary>
    <div className="two-fields">{dimension('Height','item-height',{min:1,max:600})}</div>
    <div className="two-fields" id="position-fields">{dimension('From left','item-x')}{dimension('From top','item-y')}</div>
    <label id="rotation-label">Angle · degrees<input id="item-rotation" type="number" min="-360" max="360" step="15"/></label>
    <label id="wall-field" hidden>Attach to wall<select id="item-wall"/></label><p className="muted" id="item-note"/>
   </details>
   <details id="cost-details" className="inspector-details"><summary>Cost & supplier (optional)</summary><label>Item cost <span id="cost-currency">USD</span><input id="item-cost" type="number" min="0" max="1000000000" step="0.01" placeholder="Not specified"/></label><label>Supplier / reference<input id="item-supplier" maxLength="160" placeholder="Brand, model or reference"/></label></details>
  </form>
  <details className="inspector-bottom"><summary>Project notes</summary><textarea id="notes" rows="4" maxLength="3000" placeholder="Add a note…" aria-label="Project notes"/></details>
 </aside>;
}
