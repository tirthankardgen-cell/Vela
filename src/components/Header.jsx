import { useSyncExternalStore } from 'react';
import Brand from './Brand';

const defaultProject = JSON.stringify({name: 'Courtyard residence'});
function subscribe(listener) {
  document.addEventListener('vela:change', listener);
  window.addEventListener('vela:ready', listener);
  return () => {
    document.removeEventListener('vela:change', listener);
    window.removeEventListener('vela:ready', listener);
  };
}
const getProject = () => window.Vela ? JSON.stringify(window.Vela.getLayout().project) : defaultProject;

export default function Header({cloud=false,preview=false}) {
  const project = JSON.parse(useSyncExternalStore(subscribe, getProject, () => defaultProject));
  return (
    <>
      <header className="app-header">
        <Brand />
        <div className="header-project">
          <span className="project-avatar" aria-hidden="true">{project.name.charAt(0).toUpperCase()}</span>
          <div className="min-w-0"><button id="project-details" className="project-title">{project.name} <span>⌄</span></button><small id="save-state">Local workspace</small></div>
        </div>
        <div className="header-actions">
          <button id="projects-button">Projects</button><button id="open-file">Import</button><button id="save-file">Save project</button><button id="present-button" className="primary">Present <span>↗</span></button>
        </div>
      </header>
      <nav className="studio-nav" aria-label="Studio tools">
        <div><button className="active" id="design-tab">Design studio</button><button id="materials-button">Materials &amp; finishes</button><button id="schedule-button">Furniture schedule</button></div>
        <span className="local-badge"><i /> {preview?"Preview account · saved on this device":cloud?"Private cloud workspace":"Guest · saved on this device"}</span>
      </nav>
    </>
  );
}
