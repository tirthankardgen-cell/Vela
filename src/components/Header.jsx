import { useSyncExternalStore } from 'react';
import Brand from './Brand';
import Icon from './Icon';

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
          <div className="min-w-0"><button id="project-details" className="project-title">{project.name} <Icon name="chevron" size={14}/></button><small id="save-state" role="status" aria-live="polite">{cloud?'Opening cloud workspace…':'Local workspace'}</small><button id="retry-save" hidden>Retry save</button><a id="recover-draft" href="/projects" hidden>Recover draft</a></div>
        </div>
        <div className="header-actions">
          <button id="projects-button"><Icon name="folder"/>Projects</button><button id="open-file"><Icon name="upload"/>Import</button><button id="save-file"><Icon name="save"/>Save project</button><button id="present-button" className="primary"><Icon name="present"/>Present</button>
        </div>
      </header>
      <nav className="studio-nav" aria-label="Studio tools">
        <div><button id="build-tab"><Icon name="plan"/>Build</button><button className="active" id="design-tab"><Icon name="library"/>Furnish</button><button id="materials-button"><Icon name="palette"/>Finishes</button><button id="schedule-button"><Icon name="list"/>Schedule</button></div>
        <span className="local-badge"><i /> {preview?"Preview · local saves":cloud?"Cloud workspace":"Guest · local saves"}</span>
      </nav>
    </>
  );
}
