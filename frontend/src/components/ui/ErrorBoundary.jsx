import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './Button';
import { GlassCard } from './Card';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full pointer-events-none" />
          <GlassCard className="max-w-xl w-full border-red-500/30 p-8 text-center relative z-10">
            <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle size={36} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-[var(--color-text-primary)] mb-2">
              Something went wrong.
            </h1>
            <p className="text-[var(--color-text-secondary)] mb-6">
              An unexpected error occurred in this component. We've caught it to prevent the entire application from crashing.
            </p>
            
            {this.state.error && (
              <div className="bg-[var(--color-surface-2)]/80 p-4 rounded-xl text-left overflow-auto max-h-48 mb-6 border border-red-500/20">
                <p className="font-mono text-xs text-red-500/90 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <Button 
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                window.location.reload();
              }}
              leftIcon={<RefreshCcw size={16} />}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reload Application
            </Button>
          </GlassCard>
        </div>
      );
    }

    return this.props.children; 
  }
}
