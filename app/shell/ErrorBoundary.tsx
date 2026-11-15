import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Message } from './Message';

interface State {
  error: Error | null;
}

/** Catches render errors (including invalid content from loadCourse) and shows a friendly page. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Lumio crashed:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="column">
        <Message
          icon="alert"
          title="Something went sideways"
          body="Lumio hit an unexpected error. Your progress is safe. Try going back to the path."
          detail={import.meta.env.DEV ? this.state.error.message : undefined}
          action={{
            label: 'Back to the path',
            onClick: () => {
              this.setState({ error: null });
              window.location.hash = '#/';
            },
          }}
        />
      </main>
    );
  }
}
