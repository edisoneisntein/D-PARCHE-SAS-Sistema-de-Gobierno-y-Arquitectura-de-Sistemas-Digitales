/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TEST_PHASES_DATA } from '../data';
import { CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

export const PhasesReadinessView: React.FC = () => {
  const completedPhases = TEST_PHASES_DATA.filter((p) => p.status === 'COMPLETED_PASSED');
  const roadmapPhases = TEST_PHASES_DATA.filter(
    (p) => p.status === 'ROADMAP' || p.status === 'IN_DEVELOPMENT'
  );

  const totalPassedTests = completedPhases.reduce((acc, p) => acc + p.passedTests, 0);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                AUDITORÍA DE TESTS DE INGENIERÍA (SECCIÓN 17, 18, 19, 24)
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Estado de Ingeniería: 245/245 Tests Superados & Roadmap
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Hermes cuenta con una base de gobierno y auditoría considerablemente madura. Fases 01
              a 06 tienen verificación rigurosa mediante suites automatizadas de pruebas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 border border-emerald-800/80 px-4 py-2.5 rounded-lg text-center font-mono">
              <span className="text-[10px] uppercase text-slate-400 block">Tests Superados</span>
              <span className="text-2xl font-bold text-emerald-400">{totalPassedTests} / 245</span>
              <span className="text-[10px] text-emerald-500 font-semibold block">100% PASSING</span>
            </div>
          </div>
        </div>

        {/* Section 18 Crucial Honest Alert */}
        <div className="mt-5 p-4 rounded-lg bg-rose-950/40 border border-rose-800/80 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-rose-200 uppercase tracking-wider font-mono">
              LIMITACIÓN CRÍTICA DEL EXECUTION ENGINE (SECCIÓN 18 DEL DOCUMENTO MAESTRO)
            </h4>
            <p className="text-rose-200/90 leading-relaxed">
              El archivo{' '}
              <code className="bg-rose-950 px-1 py-0.5 rounded text-rose-300 font-mono">
                src/audit/execution-engine.ts
              </code>{' '}
              existe, pero actualmente utiliza <strong>EJECUCIÓN SIMULADA</strong>. En estricto
              apego a la honestidad epistemológica,
              <strong> NO DEBE PRESENTARSE COMO EJECUCIÓN REAL</strong>. La arquitectura de Hermes
              exige distinguir formalmente entre{' '}
              <code className="font-mono text-amber-300">SIMULATED EXECUTION</code> y{' '}
              <code className="font-mono text-emerald-300">REAL EXECUTION</code> con evidencia
              verificable.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Completed Phases (Left) & Roadmap (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completed Suites (Fases 01-06) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Fases de Gobierno Completadas (245 Tests)
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              6/6 FASES SUPERADAS
            </span>
          </div>

          <div className="space-y-3">
            {completedPhases.map((phase) => (
              <div
                key={phase.id}
                className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                      {phase.name}
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">{phase.description}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-xs font-bold whitespace-nowrap">
                    {phase.passedTests}/{phase.totalTests} tests
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="text-slate-500">Módulos: {phase.modules.join(', ')}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    ✓ Evidencia: {phase.verificationEvidence}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap (Fases 07-11+) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Roadmap de Ingeniería (Fases 07 — 11+)
            </h3>
            <span className="text-xs font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
              EN PROGRESO / PENDIENTE
            </span>
          </div>

          <div className="space-y-3">
            {roadmapPhases.map((phase) => (
              <div
                key={phase.id}
                className={`bg-slate-950 border rounded-lg p-3.5 space-y-2 ${
                  phase.id === 'fase-08'
                    ? 'border-amber-600/70 shadow-sm shadow-amber-950/20'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                      {phase.name}
                      {phase.id === 'fase-08' && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px]">
                          CRÍTICA
                        </span>
                      )}
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">{phase.description}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-xs font-bold whitespace-nowrap ${
                      phase.status === 'IN_DEVELOPMENT'
                        ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {phase.status === 'IN_DEVELOPMENT' ? 'Activo' : 'Roadmap'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="text-slate-500">Módulos: {phase.modules.join(', ')}</span>
                  <span className="text-amber-400/90">{phase.verificationEvidence}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Section 19 Status Matrix */}
          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Auditoría de Áreas Específicas (Sección 19)
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">GitHub Ingestion:</span>
                <span className="text-amber-400">Incompleto</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">ZIP Ingestion:</span>
                <span className="text-rose-400">No implementado</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Persistencia:</span>
                <span className="text-amber-400">Checkpoint conceptual</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Recovery:</span>
                <span className="text-slate-400">Pendiente</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
