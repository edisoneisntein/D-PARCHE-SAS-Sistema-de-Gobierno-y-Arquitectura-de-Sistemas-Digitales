/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Terminal,
  BookOpen,
  Cpu,
  Layers,
  Activity,
  Award,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export type ActiveTab =
  | 'chat'
  | 'document'
  | 'epistemology'
  | 'decision'
  | 'cycle'
  | 'readiness'
  | 'critic'
  | 'hierarchy';

interface TabConfig {
  path: string;
  label: ActiveTab;
  icon: React.ReactNode;
  title: string;
  className?: string;
}

const TABS: TabConfig[] = [
  {
    path: '/chat',
    label: 'chat',
    icon: <Terminal className="w-3.5 h-3.5 text-indigo-400" />,
    title: 'Chat Hermes Core ⚡',
  },
  {
    path: '/document',
    label: 'document',
    icon: <BookOpen className="w-3.5 h-3.5" />,
    title: 'Documento Maestro',
  },
  {
    path: '/epistemology',
    label: 'epistemology',
    icon: <Award className="w-3.5 h-3.5" />,
    title: 'Epistemología & 125 Caps',
  },
  {
    path: '/decision',
    label: 'decision',
    icon: <Cpu className="w-3.5 h-3.5" />,
    title: '¿Usar Agente?',
  },
  {
    path: '/cycle',
    label: 'cycle',
    icon: <Layers className="w-3.5 h-3.5" />,
    title: 'Ciclo (26 Fases)',
  },
  {
    path: '/readiness',
    label: 'readiness',
    icon: <Activity className="w-3.5 h-3.5" />,
    title: '245 Tests & Fases',
  },
  {
    path: '/critic',
    label: 'critic',
    icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />,
    title: 'Mentor Crítico',
    className: 'text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 border border-rose-900/50',
  },
  {
    path: '/hierarchy',
    label: 'hierarchy',
    icon: <Lock className="w-3.5 h-3.5" />,
    title: 'Jerarquía & Reglas',
  },
];

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-slate-950 text-slate-100 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Top Bar with System Status & Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-emerald-400 font-semibold tracking-wider">
              HERMES CORE
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-mono text-[11px] flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-amber-400" />
            CONTRACT V1: CONGELADO
          </span>
          <span className="hidden md:inline-flex px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/80 text-rose-300 font-mono text-[11px] items-center gap-1.5">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            EXECUTION ENGINE: SIMULADO
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-slate-400 text-[11px]">
          <span className="hidden sm:flex items-center gap-1 text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            TESTS: 245/245 PASSED
          </span>
          <span className="text-slate-500">
            DOCTRINA: <strong className="text-slate-200">NO COMPLACENCIA</strong>
          </span>
        </div>
      </div>

      {/* Main Title & Nav Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-950 border border-indigo-400/30">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              HERMES{' '}
              <span className="text-indigo-400 font-normal text-xs uppercase tracking-widest px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-800">
                Agent V1.0
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Sistema de Ingeniería, Gobierno y Operación de Sistemas Digitales Complejos
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-medium">
          {TABS.map((tab) => (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 whitespace-nowrap transition-colors font-bold ${
                location.pathname === tab.path
                  ? tab.className
                    ? `bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md ${tab.className}`
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : tab.className
                    ? 'text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 border border-rose-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.icon}
              {tab.title}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
