/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { evaluateArchitectureDecision } from '../utils';
import { DecisionParameters } from '../types';
import { AlertTriangle, CheckCircle2, Sliders, Sparkles, FileCode } from 'lucide-react';

const PRESET_PROBLEMS: { label: string; params: DecisionParameters }[] = [
  {
    label: 'Cálculo de Impuestos y Nóminas (Determinismo Crítico)',
    params: {
      problemName: 'Cálculo de Impuestos y Nóminas',
      determinismRequired: 10,
      latencySensitivity: 9,
      costBudgetSensitivity: 8,
      securityRiskSideEffects: 9,
      autonomyRequired: 1,
      multiPartyCoordination: 1,
      dataAvailability: 10,
      failureTolerance: 1,
    },
  },
  {
    label: 'Clasificación y Síntesis de Tickets de Soporte',
    params: {
      problemName: 'Clasificación de Tickets de Soporte',
      determinismRequired: 4,
      latencySensitivity: 5,
      costBudgetSensitivity: 6,
      securityRiskSideEffects: 3,
      autonomyRequired: 8,
      multiPartyCoordination: 2,
      dataAvailability: 8,
      failureTolerance: 6,
    },
  },
  {
    label: 'Equipo Adversarial de Auditoría (Red Team vs Blue Team)',
    params: {
      problemName: 'Auditoría Adversarial Red vs Blue Team',
      determinismRequired: 5,
      latencySensitivity: 2,
      costBudgetSensitivity: 3,
      securityRiskSideEffects: 6,
      autonomyRequired: 9,
      multiPartyCoordination: 9,
      dataAvailability: 7,
      failureTolerance: 5,
    },
  },
  {
    label: 'Desarrollo de Software Crítico con Hermes Core',
    params: {
      problemName: 'Ingeniería de Software Crítica con Hermes',
      determinismRequired: 9,
      latencySensitivity: 6,
      costBudgetSensitivity: 5,
      securityRiskSideEffects: 9,
      autonomyRequired: 7,
      multiPartyCoordination: 5,
      dataAvailability: 8,
      failureTolerance: 2,
    },
  },
];

export const DecisionEngineView: React.FC = () => {
  const [params, setParams] = useState<DecisionParameters>({
    problemName: 'Diseño de Nuevo Sistema',
    determinismRequired: 8,
    latencySensitivity: 7,
    costBudgetSensitivity: 6,
    securityRiskSideEffects: 8,
    autonomyRequired: 4,
    multiPartyCoordination: 2,
    dataAvailability: 8,
    failureTolerance: 2,
  });

  const decision = useMemo(() => evaluateArchitectureDecision(params), [params]);

  const updateParam = (key: keyof DecisionParameters, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const loadPreset = (preset: (typeof PRESET_PROBLEMS)[0]) => {
    setParams(preset.params);
  };

  const getVerdictStyle = () => {
    switch (decision.verdict) {
      case 'NO_AGENT_NEEDED':
        return {
          border: 'border-emerald-600',
          bg: 'bg-emerald-950/40',
          text: 'text-emerald-300',
          badge: 'bg-emerald-950 text-emerald-300 border-emerald-700',
        };
      case 'SINGLE_AGENT_SUFFICIENT':
        return {
          border: 'border-sky-600',
          bg: 'bg-sky-950/40',
          text: 'text-sky-300',
          badge: 'bg-sky-950 text-sky-300 border-sky-700',
        };
      case 'MULTI_AGENT_REQUIRED':
        return {
          border: 'border-amber-600',
          bg: 'bg-amber-950/40',
          text: 'text-amber-300',
          badge: 'bg-amber-950 text-amber-300 border-amber-700',
        };
      case 'HYBRID_SYSTEM_REQUIRED':
        return {
          border: 'border-indigo-600',
          bg: 'bg-indigo-950/40',
          text: 'text-indigo-300',
          badge: 'bg-indigo-950 text-indigo-300 border-indigo-700',
        };
    }
  };

  const style = getVerdictStyle();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                PRINCIPIO FUNDAMENTAL (SECCIÓN 7)
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Motor de Decisión: "¿Se Necesita un Agente?"
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Hermes no "agentifica" todos los problemas por inercia o moda. Multiagente no es un
              fin en sí mismo. La decisión entre Software Tradicional, Agente Único, Multiagente o
              Sistema Híbrido se deduce rigurosamente de requisitos, determinismo, coste, latencia y
              verificabilidad.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Cargar Escenarios de Prueba:
          </span>
          {PRESET_PROBLEMS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(preset)}
              className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-mono text-[11px] transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Controls + Verdict */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls: Parameters (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Parámetros de Ingeniería del Problema
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Escala 1 — 10</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Determinism */}
            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-slate-300">Determinismo Requerido</span>
                <span className="text-indigo-400 font-bold">{params.determinismRequired} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={params.determinismRequired}
                onChange={(e) => updateParam('determinismRequired', Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
              <span className="text-[10px] text-slate-500">
                1 = Respuestas heurísticas tolerables • 10 = Cero margen de error matemático o de
                lógica.
              </span>
            </div>

            {/* Security Risk */}
            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-slate-300">Riesgo de Seguridad & Side-Effects</span>
                <span className="text-rose-400 font-bold">
                  {params.securityRiskSideEffects} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={params.securityRiskSideEffects}
                onChange={(e) => updateParam('securityRiskSideEffects', Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
              <span className="text-[10px] text-slate-500">
                1 = Solo lectura / sandbox trivial • 10 = Destrucción de datos, comandos shell,
                secretos.
              </span>
            </div>

            {/* Autonomy */}
            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-slate-300">Necesidad de Autonomía Heurística</span>
                <span className="text-sky-400 font-bold">{params.autonomyRequired} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={params.autonomyRequired}
                onChange={(e) => updateParam('autonomyRequired', Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
              <span className="text-[10px] text-slate-500">
                1 = Algoritmo determinista puro • 10 = Planificación adaptativa no estructurada.
              </span>
            </div>

            {/* Multi-party Coordination */}
            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-slate-300">Coordinación Multipartita / Especialización</span>
                <span className="text-purple-400 font-bold">
                  {params.multiPartyCoordination} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={params.multiPartyCoordination}
                onChange={(e) => updateParam('multiPartyCoordination', Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
              <span className="text-[10px] text-slate-500">
                1 = Rol único y cerrado • 10 = Múltiples entidades independientes con metas
                opuestas.
              </span>
            </div>

            {/* Cost Sensitivity */}
            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-slate-300">Sensibilidad a Coste de Tokens / Inferencia</span>
                <span className="text-amber-400 font-bold">
                  {params.costBudgetSensitivity} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={params.costBudgetSensitivity}
                onChange={(e) => updateParam('costBudgetSensitivity', Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
              <span className="text-[10px] text-slate-500">
                1 = Presupuesto ilimitado de cómputo • 10 = Restricción presupuestaria severa.
              </span>
            </div>

            {/* Latency Sensitivity */}
            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-slate-300">Sensibilidad a Latencia</span>
                <span className="text-emerald-400 font-bold">{params.latencySensitivity} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={params.latencySensitivity}
                onChange={(e) => updateParam('latencySensitivity', Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
              />
              <span className="text-[10px] text-slate-500">
                1 = Procesamiento por lotes asíncrono • 10 = Respuestas en tiempo real (&lt;100ms).
              </span>
            </div>
          </div>
        </div>

        {/* Verdict Output (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Verdict Card */}
          <div className={`bg-slate-900 border-2 rounded-xl p-5 shadow-xl ${style.border}`}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <span
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${style.badge}`}
              >
                VEREDICTO ARQUITECTÓNICO DE HERMES
              </span>
              <span className="text-xs font-mono text-slate-400">Evaluado en tiempo real</span>
            </div>

            <h3 className={`text-lg sm:text-xl font-bold tracking-tight mb-2 ${style.text}`}>
              {decision.verdictTitle}
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4 bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
              {decision.architectureSummary}
            </p>

            {/* Tradeoff Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono mb-4">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Determinismo:</span>
                <span className="text-slate-200 font-semibold">
                  {decision.tradeoffs.determinism}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Coste de Inferencia:</span>
                <span className="text-slate-200 font-semibold">{decision.tradeoffs.cost}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Latencia:</span>
                <span className="text-slate-200 font-semibold">{decision.tradeoffs.latency}</span>
              </div>
            </div>

            {/* Technical Justification */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Justificación Técnica de Ingeniería
              </h4>
              <ul className="space-y-1.5">
                {decision.technicalJustification.map((just, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/60 p-2 rounded border border-slate-800/60"
                  >
                    <span className="text-emerald-400 font-mono font-bold">✓</span>
                    <span>{just}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contraindications */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Contraindicaciones & Alertas de Riesgo
              </h4>
              <ul className="space-y-1.5">
                {decision.contraindications.map((ci, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-rose-200 flex items-start gap-2 bg-rose-950/30 p-2 rounded border border-rose-900/60"
                  >
                    <span className="text-rose-400 font-mono font-bold">✕</span>
                    <span>{ci}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Components */}
            <div>
              <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                Componentes Recomendados por Hermes Core
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {decision.recommendedComponents.map((comp, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-slate-950 text-indigo-300 border border-indigo-900/80 font-mono text-[11px]"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
