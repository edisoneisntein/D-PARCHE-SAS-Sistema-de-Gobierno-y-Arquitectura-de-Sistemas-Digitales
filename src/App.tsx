/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar, ActiveTab } from './components/Navbar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Terminal, Lock } from 'lucide-react';

const HermesChatView = lazy(() =>
  import('./components/HermesChatView').then((m) => ({ default: m.HermesChatView }))
);
const DocumentMasterView = lazy(() =>
  import('./components/DocumentMasterView').then((m) => ({ default: m.DocumentMasterView }))
);
const EpistemologyMatrixView = lazy(() =>
  import('./components/EpistemologyMatrixView').then((m) => ({ default: m.EpistemologyMatrixView }))
);
const DecisionEngineView = lazy(() =>
  import('./components/DecisionEngineView').then((m) => ({ default: m.DecisionEngineView }))
);
const MasterCycleView = lazy(() =>
  import('./components/MasterCycleView').then((m) => ({ default: m.MasterCycleView }))
);
const PhasesReadinessView = lazy(() =>
  import('./components/PhasesReadinessView').then((m) => ({ default: m.PhasesReadinessView }))
);
const CriticalCounterpartView = lazy(() =>
  import('./components/CriticalCounterpartView').then((m) => ({
    default: m.CriticalCounterpartView,
  }))
);
const HierarchyAndSecurityView = lazy(() =>
  import('./components/HierarchyAndSecurityView').then((m) => ({
    default: m.HierarchyAndSecurityView,
  }))
);

const tabRoutes: {
  path: string;
  label: ActiveTab;
  Component: React.LazyExoticComponent<React.ComponentType<any>>;
}[] = [
  { path: '/chat', label: 'chat', Component: HermesChatView },
  { path: '/document', label: 'document', Component: DocumentMasterView },
  { path: '/epistemology', label: 'epistemology', Component: EpistemologyMatrixView },
  { path: '/decision', label: 'decision', Component: DecisionEngineView },
  { path: '/cycle', label: 'cycle', Component: MasterCycleView },
  { path: '/readiness', label: 'readiness', Component: PhasesReadinessView },
  { path: '/critic', label: 'critic', Component: CriticalCounterpartView },
  { path: '/hierarchy', label: 'hierarchy', Component: HierarchyAndSecurityView },
];

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
          {/* Navigation & Header */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {tabRoutes.map(({ path, Component }) => (
                  <Route key={path} path={path} element={<Component />} />
                ))}
                <Route path="/" element={<Navigate to="/chat" replace />} />
                <Route path="*" element={<Navigate to="/chat" replace />} />
              </Routes>
            </Suspense>
          </main>

          {/* Footer & Canonical Definition */}
          <footer className="bg-slate-950 border-t border-slate-800/80 text-xs text-slate-400 mt-12 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {/* Canonical Definition Box (Sección 31) */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 space-y-2">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  <Terminal className="w-3.5 h-3.5" />
                  Definición Canónica de Hermes (Sección 31 del Documento Maestro)
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans italic">
                  "Hermes es un sistema de ingeniería, gobierno y operación de sistemas digitales
                  complejos. Puede recibir cualquier intención, requisito, artefacto o sistema
                  existente y determinar qué arquitectura necesita —software tradicional, agentes,
                  sistemas multiagente, workflows, humanos o combinaciones de estos— para satisfacer
                  esa necesidad. Debe poder diseñar, construir, validar, desplegar, operar, mantener
                  y evolucionar esos sistemas bajo reglas de seguridad, autorización, evidencia,
                  trazabilidad y verificación. Los modelos de IA, agentes, Skills, Plugins, MCP y
                  proveedores son componentes subordinados; Hermes Core conserva la autoridad."
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/60 text-[11px] font-mono text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-semibold">HERMES AGENT CONTINUITY V1.0</span>
                  <span>•</span>
                  <span>Versión congelada: 11 de septiembre de 2026</span>
                  <span>•</span>
                  <span className="text-amber-400">Architecture Contract V1</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>
                    Regla Final:{' '}
                    <strong>No proteger la narrativa. Proteger la verdad del sistema.</strong>
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
