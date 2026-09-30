/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PRESET_CRITIQUE_SCENARIOS } from '../data/hermesMasterData';
import { critiqueArchitectureProposal } from '../utils/hermesEngine';
import { CritiqueResult } from '../types/hermes';
import {
  ShieldAlert,
  Flame,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Send,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export const CriticalCounterpartView: React.FC = () => {
  const [proposalInput, setProposalInput] = useState(PRESET_CRITIQUE_SCENARIOS[0].proposal);
  const [critiqueResult, setCritiqueResult] = useState<CritiqueResult | null>(() =>
    critiqueArchitectureProposal(PRESET_CRITIQUE_SCENARIOS[0].proposal)
  );

  const handleEvaluate = (text: string) => {
    const res = critiqueArchitectureProposal(text);
    setCritiqueResult(res);
  };

  const handleSelectPreset = (p: typeof PRESET_CRITIQUE_SCENARIOS[0]) => {
    setProposalInput(p.proposal);
    handleEvaluate(p.proposal);
  };

  const getVerdictStyle = (v: CritiqueResult['verdict']) => {
    switch (v) {
      case 'RECHAZADO':
        return {
          border: 'border-rose-600',
          bg: 'bg-rose-950/40',
          text: 'text-rose-400',
          badge: 'bg-rose-950 text-rose-300 border-rose-700',
          icon: <XCircle className="w-5 h-5 text-rose-400" />,
        };
      case 'CORRECCION_OBLIGATORIA':
        return {
          border: 'border-amber-600',
          bg: 'bg-amber-950/40',
          text: 'text-amber-400',
          badge: 'bg-amber-950 text-amber-300 border-amber-700',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        };
      case 'APROBADO_CON_CONDICIONES':
        return {
          border: 'border-emerald-600',
          bg: 'bg-emerald-950/40',
          text: 'text-emerald-400',
          badge: 'bg-emerald-950 text-emerald-300 border-emerald-700',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        };
    }
  };

  const verdictStyle = critiqueResult ? getVerdictStyle(critiqueResult.verdict) : null;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                CONTRAPARTE CRÍTICA (SECCIÓN 1 & 22)
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Mentor Crítico & Auditor de Ideas sin Complacencia
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              <em>"Si una idea es técnicamente mala, irrealista, innecesariamente compleja, contradictoria,
              una falacia, un eufemismo o una fantasía, debe decirse explícitamente."</em> No se protege una
              decisión simplemente porque ya se haya invertido trabajo en ella.
            </p>
          </div>

          <div className="flex-shrink-0 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono max-w-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Criterio Inmutable:</span>
            <span className="text-slate-200">
              Corrección → Evidencia → Seguridad → Arquitectura → Utilidad → Velocidad
            </span>
          </div>
        </div>

        {/* Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold font-mono flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Dilemas de Arquitectura:
          </span>
          {PRESET_CRITIQUE_SCENARIOS.map((scenario, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(scenario)}
              className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-mono text-[11px] transition-colors"
            >
              {scenario.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input + Unsparing Review Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Proposal Input (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Ingresa una Propuesta Técnica o Decisión a Someter a Juicio
            </h3>
            <p className="text-xs text-slate-400">
              Describe el diseño, uso de agentes, permisos, modelo o integración. Hermes emitirá un dictamen inflexible.
            </p>

            <textarea
              rows={9}
              value={proposalInput}
              onChange={(e) => setProposalInput(e.target.value)}
              placeholder="Ejemplo: Queremos un agente que modifique la base de datos de producción mediante consultas SQL directas generadas por un LLM..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs sm:text-sm text-slate-200 font-mono focus:outline-none focus:border-rose-500 leading-relaxed resize-none"
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleEvaluate(proposalInput)}
              className="w-full py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
              Ejecutar Dictamen Crítico Hermes
            </button>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-300">Regla Sección 22:</strong> El auditor tiene prohibido emitir halagos vacíos o aprobar propuestas con fallas de seguridad para complacer al operador.
            </div>
          </div>
        </div>

        {/* Critique Report (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {critiqueResult && verdictStyle && (
            <div className={`bg-slate-900 border-2 rounded-xl p-5 shadow-xl ${verdictStyle.border}`}>
              {/* Verdict Header */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border flex items-center gap-1.5 ${verdictStyle.badge}`}>
                  {verdictStyle.icon}
                  VEREDICTO: {critiqueResult.verdict}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Rigor: <strong className="text-slate-200">{critiqueResult.confidenceScore}%</strong>
                </span>
              </div>

              <h3 className={`text-base sm:text-lg font-bold tracking-tight mb-3 ${verdictStyle.text}`}>
                {critiqueResult.summary}
              </h3>

              {/* Unforgiving Analysis */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  Análisis Implacable de Ingeniería
                </h4>
                <div className="space-y-2">
                  {critiqueResult.unforgivingAnalysis.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Detected Anti-Patterns */}
              {critiqueResult.detectedAntiPatterns.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    Anti-Patrones Detectados
                  </h4>
                  <ul className="space-y-1.5">
                    {critiqueResult.detectedAntiPatterns.map((ap, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-rose-200 flex items-start gap-2 bg-rose-950/30 p-2.5 rounded border border-rose-900/60"
                      >
                        <span className="text-rose-400 font-mono font-bold">✕</span>
                        <span>{ap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Priority Violations */}
              {critiqueResult.priorityViolations.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Violaciones a la Prioridad Inmutable
                  </h4>
                  <ul className="space-y-1.5">
                    {critiqueResult.priorityViolations.map((pv, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-amber-200 flex items-start gap-2 bg-amber-950/30 p-2 rounded border border-amber-900/60"
                      >
                        <span className="text-amber-400 font-mono font-bold">!</span>
                        <span>{pv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Required Remediations */}
              <div>
                <h4 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Remediaciones Obligatorias de Arquitectura
                </h4>
                <ul className="space-y-1.5">
                  {critiqueResult.requiredRemediations.map((rem, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-emerald-200 flex items-start gap-2 bg-emerald-950/30 p-2 rounded border border-emerald-900/60"
                    >
                      <span className="text-emerald-400 font-mono font-bold">✓</span>
                      <span>{rem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Referencia: {critiqueResult.sourceReference}</span>
                <span className="text-slate-500">Hermes Core Governance Guard</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
