import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { 
    hasError: false, 
    error: null, 
    errorInfo: null,
    showDetails: false 
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, showDetails: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private toggleDetails = () => {
    this.setState(prevState => ({ showDetails: !prevState.showDetails }));
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Something went wrong
              </h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We encountered an unexpected error while running the application. 
                Please try reloading the page.
              </p>

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 mb-6 shadow-lg shadow-red-200"
              >
                <RefreshCw size={18} />
                Reload Application
              </button>

              <button 
                onClick={this.toggleDetails}
                className="text-sm text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1 mx-auto transition-colors"
              >
                {this.state.showDetails ? 'Hide' : 'Show'} Technical Details
                {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {this.state.showDetails && this.state.error && (
              <div className="bg-gray-900 p-6 border-t border-gray-800 overflow-x-auto text-left">
                <h3 className="text-red-400 font-mono text-sm font-bold mb-2">
                  {this.state.error.toString()}
                </h3>
                <pre className="text-gray-400 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                  {this.state.errorInfo?.componentStack || this.state.error.stack || 'No stack trace available'}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}