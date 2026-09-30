/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MACRO_CYCLE_PHASES } from '../data/hermesMasterData';
import { MacroCyclePhase } from '../types/hermes';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  FileText,
  Search,
  CheckCircle,
  HelpCircle,
  Lock,
  Workflow,
  Sparkles,
} from 'lucide-react';

export const MasterCycleView: React.FC = () => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', label: 'Todas las Fases (26)' },
    { id: 'discovery', label: '1. Conceptualización & Descubrimiento (1-6)' },
    { id: 'architecture', label: '2. Arquitectura & Diseño (7-12)' },
    { id: 'implementation', label: '3. Construcción & Verificación (13-20)' },
    { id: 'release', label: '4. Release & Despliegue (21-22)' },
    { id: 'operation', label: '5. Operación & Evolución (23-26)' },
  ];

  const filteredPhases = MACRO_CYCLE_PHASES.filter((phase) => {
    const matchesCategory =
      selectedCategory === 'all' || phase.category === selectedCategory;
    const matchesSearch =
      phase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phase.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phase.id.toString() === searchTerm;
    return matchesCategory && matchesSearch;
  });

  const activePhase =
    MACRO_CYCLE_PHASES.find((p) => p.id === selectedPhaseId) ||
    MACRO_CYCLE_PHASES[0];

  const getCategoryBadge = (cat: MacroCyclePhase['category']) => {
    switch (cat) {
      case 'discovery':
        return 'bg-sky-950 text-sky-300 border-sky-800';
      case 'architecture':
        return 'bg-indigo-950 text-indigo-300 border-indigo-800';
      case 'implementation':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'release':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'operation':
        return 'bg-amber-950 text-amber-300 border-amber-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                CICLO CONCEPTUAL COMPLETO (SECCIÓN 9)
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Ciclo Maestro de Ingeniería: 26 Fases Formales
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Desde la <strong>Intención</strong> inicial hasta la <strong>Evolución</strong> continua.
              Hermes determina cuáles fases aplican a cada sistema y deja evidencia verificable en cada transición.
              No se avanza a la siguiente fase sin cumplir los criterios de salida e invariantes.
            </p>
          </div>
        </div>

        {/* Phase category filter buttons */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2.5 py-1.5 rounded-md whitespace-nowrap font-medium transition-colors ${
                selectedCategory === c.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Pipeline Flow (Left) + Phase Detail Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Phase Flow List (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Workflow className="w-4 h-4 text-indigo-400" />
              Flujo Secuencial de Fases
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {filteredPhases.length} de 26 fases
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredPhases.map((phase) => {
              const isSelected = selectedPhaseId === phase.id;
              return (
                <div
                  key={phase.id}
                  onClick={() => setSelectedPhaseId(phase.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-150 flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-950/70 border-indigo-500 shadow-md shadow-indigo-950/30'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-md bg-slate-900 border border-slate-700 font-mono font-bold text-xs text-indigo-400 flex items-center justify-center flex-shrink-0">
                      {phase.id}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2">
                        {phase.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {phase.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono border ${getCategoryBadge(
                        phase.category
                      )}`}
                    >
                      {phase.category}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-indigo-400 translate-x-1' : 'text-slate-600'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase Detail Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-mono border ${getCategoryBadge(
                  activePhase.category
                )}`}
              >
                FASE {activePhase.id} DE 26
              </span>
              <span className="text-xs font-mono text-slate-500 uppercase">
                {activePhase.category}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              {activePhase.id}. {activePhase.name}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
              {activePhase.description}
            </p>

            <div className="space-y-3.5 text-xs">
              {/* Required Inputs */}
              <div>
                <h4 className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                  <FileText className="w-3.5 h-3.5" /> Entradas Requeridas
                </h4>
                <ul className="space-y-1">
                  {activePhase.requiredInputs.map((input, idx) => (
                    <li
                      key={idx}
                      className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-300 flex items-start gap-1.5"
                    >
                      <span className="text-sky-400 font-mono">→</span>
                      <span>{input}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expected Outputs */}
              <div>
                <h4 className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                  <CheckCircle className="w-3.5 h-3.5" /> Salidas Entregables
                </h4>
                <ul className="space-y-1">
                  {activePhase.expectedOutputs.map((out, idx) => (
                    <li
                      key={idx}
                      className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-300 flex items-start gap-1.5"
                    >
                      <span className="text-emerald-400 font-mono">✓</span>
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Governance Gates */}
              <div>
                <h4 className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                  <Lock className="w-3.5 h-3.5" /> Puertas de Gobierno (Gates)
                </h4>
                <ul className="space-y-1">
                  {activePhase.governanceGates.map((gate, idx) => (
                    <li
                      key={idx}
                      className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-300 flex items-start gap-1.5"
                    >
                      <span className="text-amber-400 font-mono">🔒</span>
                      <span>{gate}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Evidence Required */}
              <div>
                <h4 className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" /> Evidencia Verificable Requerida
                </h4>
                <ul className="space-y-1">
                  {activePhase.evidenceRequired.map((ev, idx) => (
                    <li
                      key={idx}
                      className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-300 flex items-start gap-1.5"
                    >
                      <span className="text-indigo-400 font-mono">★</span>
                      <span className="font-mono text-indigo-200">{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
            Transición protegida por la Máquina de Estados de Hermes Core (Fase 06).
          </div>
        </div>
      </div>
    </div>
  );
};
