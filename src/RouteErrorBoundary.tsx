import { Component, type ReactNode } from "react";

// A failed route or missing cached asset must not take down navigation or storage.
export class RouteErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="empty" role="alert">
        <h1>This page couldn’t load.</h1>
        <p>Reload to try again. Your saved progress stays in this browser.</p>
        <button className="button" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </section>
    );
  }
}
