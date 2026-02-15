import React from 'react';

/**
 * Error Boundary — catches unhandled errors in the component tree
 * and displays a recovery UI instead of a white screen.
 *
 * PULSE-CQ-004 FIX: Prevents Web Audio API errors, rendering exceptions,
 * or state corruption from crashing the entire application.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In production, send to error reporting service
    console.error('[PULSE Error Boundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f23 100%)',
            color: '#e0e0e0',
            fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #ff3366, #ff6b35)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
            }}
          >
            PULSE encountered an error
          </h1>
          <p style={{ opacity: 0.6, fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: '400px' }}>
            Something went wrong with the audio engine or UI. Click below to restart.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '0.75rem',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              background: 'linear-gradient(145deg, #06ffa5, #00bbf9)',
              color: '#0a0a1a',
              boxShadow: '0 0 30px rgba(6, 255, 165, 0.4)',
              transition: 'transform 0.15s',
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            RESTART PULSE
          </button>
          {this.state.error && (
            <pre
              style={{
                marginTop: '2rem',
                fontSize: '0.7rem',
                opacity: 0.3,
                maxWidth: '500px',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
              }}
            >
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
