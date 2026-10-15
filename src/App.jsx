import { Component, useLayoutEffect, useEffect, useState } from 'react';
import { initializePlanner } from '../planner/app';
import Header from './components/Header';
import Library from './components/Library';
import DesignCanvas from './components/DesignCanvas';
import Inspector from './components/Inspector';
import DialogHost from './components/DialogHost';
import './studio.css';
import Icon from './components/Icon';

// React owns the workspace structure. The geometry engine owns its canvas,
// form bindings and dialog contents; every listener and renderer is disposed on unmount.
function Studio(props) {
  const [library,setLibrary]=useState(true),[properties,setProperties]=useState(false);
  useEffect(()=>{const small=matchMedia('(max-width: 780px)');const adapt=()=>{if(small.matches){setLibrary(false);setProperties(false);}};adapt();small.addEventListener('change',adapt);
    const show=()=>{setLibrary(true);if(small.matches)setProperties(false);};
    let previous=null;
    const selection=e=>{if(e.detail?.interacting)return;const id=e.detail?.id;if(id&&id!==previous){if(small.matches)setLibrary(false);setProperties(true);}previous=id;};
    document.addEventListener('vela:library',show);document.addEventListener('vela:selection',selection);
    return()=>{small.removeEventListener('change',adapt);document.removeEventListener('vela:library',show);document.removeEventListener('vela:selection',selection);};
  },[]);
  useEffect(()=>{document.dispatchEvent(new Event('vela:viewport'));},[library,properties]);
  const closeLibrary=()=>{setLibrary(false);document.querySelector('[aria-controls="studio-objects"]')?.focus();};
  const closeProperties=()=>{setProperties(false);document.querySelector('[aria-controls="studio-properties"]')?.focus();};
  const toggleLibrary=()=>{setLibrary(v=>!v);if(matchMedia('(max-width:780px)').matches)setProperties(false);};
  const toggleProperties=()=>{setProperties(v=>!v);if(matchMedia('(max-width:780px)').matches)setLibrary(false);};
  useLayoutEffect(() => initializePlanner(props), []);
  return (
    <>
      <Header cloud={Boolean(props.store)} preview={props.store?.isDemo} />
      <nav className="panel-dock" aria-label="Studio panels"><button aria-controls="studio-objects" aria-expanded={library} onClick={toggleLibrary}><Icon name="library"/>Library</button><button aria-controls="studio-properties" aria-expanded={properties} onClick={toggleProperties}><Icon name="sliders"/>Properties</button><button title="Focus on canvas" onClick={()=>{setLibrary(false);setProperties(false);}}><Icon name="fit"/>Focus</button></nav>
      <main className="workspace"><Library guest={!props.store} open={library} onClose={closeLibrary}/><DesignCanvas/><Inspector open={properties} onClose={closeProperties}/></main>
      <DialogHost />
      <section id="presentation" hidden />
      <input type="file" id="file-input" accept=".json,application/json" hidden />
      <div id="toast" role="status" aria-live="polite" />
    </>
  );
}

export default class App extends Component {
  state = {failed: false};
  static getDerivedStateFromError() { return {failed: true}; }
  render() {
    if (this.state.failed) return (
      <main className="grid min-h-screen place-items-center bg-olive p-8 text-white">
        <section className="max-w-md rounded-2xl border border-white/10 p-8">
          <span className="text-sm tracking-[0.25em] text-gold">VELA STUDIO</span>
          <h1 className="mt-6 text-3xl text-white">Let’s reopen your workspace.</h1>
          <p className="mt-4 text-sm text-stone-300">The studio couldn’t start. Reload to try again. Your saved browser projects are kept.</p>
          <button className="mt-6 rounded-lg bg-gold px-5 py-3 text-white" onClick={() => window.location.reload()}>Reload studio</button>
        </section>
      </main>
    );
    return <Studio {...this.props} />;
  }
}
