import { Component } from 'react';
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <main id="main-content" className="container error-page"><p className="eyebrow">SYSTEM PAUSED</p><h1>Something went wrong.</h1><p>Your next move: reload the page and try again.</p><button className="button primary" onClick={() => window.location.reload()}>Reload portfolio</button><a className="button secondary" href="/">Return home</a></main>;
    return this.props.children;
  }
}
