import { Component, useLayoutEffect } from 'react';
import { initializePlanner } from '../planner/app';
import Header from './components/Header';
import Library from './components/Library';
import DesignCanvas from './components/DesignCanvas';
import Inspector from './components/Inspector';
import DialogHost from './components/DialogHost';

// React owns the workspace structure. The geometry engine owns its canvas,
// form bindings and dialog contents; every listener and renderer is disposed on unmount.
function Studio(props) {
  useLayoutEffect(() => initializePlanner(props), []);
  return (
    <>
      <Header cloud={Boolean(props.store)} preview={props.store?.isDemo} />
      <main className="workspace"><Library /><DesignCanvas /><Inspector /></main>
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
