import Icon from './Icon';
export default function DesignCanvas() {
  return (
    <section className="studio" id="studio-canvas" tabIndex={-1} aria-label="Room design canvas"><div className="studio-toolbar"><div><h2 id="room-title">Your room</h2><span id="room-dimensions" className="muted"/></div><div className="view-switch" role="tablist" aria-label="View"><button id="plan-mode" className="active" role="tab" aria-selected="true"><Icon name="plan" size={16}/>2D</button><button id="view-mode" role="tab" aria-selected="false"><Icon name="cube" size={16}/>3D</button></div></div>
<div className="canvas-tools"><div className="tool-group"><button id="undo" title="Undo (Ctrl+Z)" aria-label="Undo"><Icon name="undo"/></button><button id="redo" title="Redo (Ctrl+Shift+Z)" aria-label="Redo"><Icon name="redo"/></button><span className="divider"/><label className="check"><input type="checkbox" id="snap" defaultChecked/>Snap · 5 cm</label></div><div className="tool-group"><button id="zoom-out" title="Zoom out" aria-label="Zoom out"><Icon name="minus"/></button><button id="zoom-in" title="Zoom in" aria-label="Zoom in"><Icon name="plus"/></button><button id="fit" title="Fit room" aria-label="Fit room"><Icon name="fit"/></button><button id="export-image"><Icon name="download" size={16}/><span id="export-label">Plan SVG</span></button></div></div>
<div className="stage" id="stage"><svg id="plan" xmlns="http://www.w3.org/2000/svg" aria-label="Interactive floor plan"/><div id="three-view" hidden/><div className="stage-tag"><span id="stage-tag">Drag to move · R to rotate</span></div><div id="camera-buttons" hidden><button data-camera="entry">Entry</button><button data-camera="tv">Side</button><button data-camera="top">Top</button><label className="check"><input type="checkbox" id="show-walls" defaultChecked/>Walls</label></div></div>
<div className="studio-footer"><span id="item-count"/><span id="status-message" role="status" aria-live="polite"/></div>
</section>
  );
}
