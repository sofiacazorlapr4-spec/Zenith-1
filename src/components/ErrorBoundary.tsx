import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Handled via fallback UI
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="container" style={{ paddingBlock: '120px' }}>
          <h2 className="section-title">Se produjo un error de visualización.</h2>
          <p className="section-sub">
            Recarga la vista para restablecer los módulos interactivos.
          </p>
          <div style={{ marginTop: '24px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                this.setState({ hasError: false });
                this.props.onReset?.();
              }}
            >
              Volver al inicio
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
