/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Bug, Terminal } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorId: '',
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `err-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('🚨 ErrorBoundary caught:', error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null, errorId: '' });
  };

  private handleReport = (): void => {
    const reportUrl = `https://github.com/hermes-agent/dparche-sas/issues/new?title=[ErrorBoundary]%20${encodeURIComponent(this.state.error?.message ?? 'Unknown')}&body=${encodeURIComponent(
      `**Error ID:** ${this.state.errorId}\n\n**Message:** ${this.state.error?.message}\n\n**Stack:**\n\`\`\`\n${this.state.error?.stack}\n\`\`\`\n\n**Component Stack:**\n\`\`\`\n(this would be filled by react-error-overlay in dev)\n\`\`\``
    )}`;
    window.open(reportUrl, '_blank');
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-slate-900 border border-rose-600/50 rounded-xl p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-8 h-8 flex-shrink-0" />
              <div>
                <h1 className="text-xl font-bold text-rose-300">Error Crítico en Hermes Console</h1>
                <p className="text-sm text-slate-400 mt-1">
                  El componente falló y fue contenido por el ErrorBoundary.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2 text-slate-500">
                <Bug className="w-4 h-4" /> Error ID:{' '}
                <code className="text-rose-300">{this.state.errorId}</code>
              </div>
              <div>
                <span className="text-slate-500">Mensaje:</span>
                <pre className="mt-1 text-rose-200 whitespace-pre-wrap break-all">
                  {this.state.error?.message ?? 'Desconocido'}
                </pre>
              </div>
              <details className="border-t border-slate-800 pt-3">
                <summary className="text-slate-500 cursor-pointer font-mono text-[11px]">
                  Stack Trace (click para expandir)
                </summary>
                <pre className="mt-2 text-[10px] text-slate-400 whitespace-pre-wrap break-all overflow-auto max-h-64">
                  {this.state.error?.stack ?? 'No stack trace'}
                </pre>
              </details>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-sm rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Reintentar
              </button>
              <button
                onClick={this.handleReport}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-sm rounded-lg border border-slate-700 transition-colors"
              >
                <Terminal className="w-4 h-4" /> Reportar en GitHub
              </button>
            </div>

            <p className="text-[11px] text-slate-500 text-center border-t border-slate-800 pt-4 font-mono">
              Regla Final:{' '}
              <strong>No proteger la narrativa. Proteger la verdad del sistema.</strong>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
