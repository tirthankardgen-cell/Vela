export default function DialogHost() {
  return (
    <dialog id="studio-dialog" aria-labelledby="dialog-title"><div className="dialog-heading flex items-start justify-between gap-5"><div><span className="eyebrow" id="dialog-eyebrow">VELA STUDIO</span><h2 id="dialog-title">Your workspace</h2></div><button id="close-dialog" aria-label="Close dialog">×</button></div><div id="dialog-content"></div></dialog>
  );
}
