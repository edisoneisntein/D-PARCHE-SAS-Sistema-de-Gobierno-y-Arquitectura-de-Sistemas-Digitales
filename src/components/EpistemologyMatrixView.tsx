/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CAPABILITY_AUDIT_UNIVERSE } from '../data/hermesMasterData';
import { EpistemologicalState } from '../types/hermes';
import {
  Award,
  AlertOctagon,
  ShieldCheck,
  Search,
  CheckCircle,
  HelpCircle,
  Lock,
  ArrowRight,
  Database,
  FileCheck,
  Info,
} from 'lucide-react';

const EPISTEMOLOGY_STEPS: {
  state: EpistemologicalState;
  label: string;
  definition: string;
  evidenceRequired: string;
  color: string;
}[] = [
  {
    state: 'DISCOVERED',
    label: '1. DISCOVERED',
    definition: 'Detectado en fuentes (manifest, catálogo, filesystem o mención).',
    evidenceRequired: 'Ruta o identificador registrado en disco o manifest.',
    color: 'border-slate-700 bg-slate-900 text-slate-300',
  },
  {
    state: 'INSTALLED',
    label: '2. INSTALLED',
    definition: 'Archivos físicos presentes en ~/.hermes o en repositorio local.',
    evidenceRequired: 'Presencia física verificable en el árbol de archivos.',
    color: 'border-sky-800 bg-sky-950 text-sky-300',
  },
  {
    state: 'AVAILABLE',
    label: '3. AVAILABLE',
    definition: 'Dependencias de runtime satisfechas y sintaxis de manifiesto válida.',
    evidenceRequired: 'Check de dependencias resueltas sin errores de importación.',
    color: 'border-cyan-800 bg-cyan-950 text-cyan-300',
  },
  {
    state: 'EXECUTABLE',
    label: '4. EXECUTABLE',
    definition: 'Capacidad de correr código sin crashear en ambiente local o simulado.',
    evidenceRequired: 'Prueba de ejecución básica con salida retornada.',
    color: 'border-amber-800 bg-amber-950 text-amber-300',
  },
  {
    state: 'AUTHORIZED',
    label: '5. AUTHORIZED',
    definition: 'Política de seguridad concede permiso explícito para su invocación.',
    evidenceRequired: 'Firma de autorización del Policy Engine de Hermes Core.',
    color: 'border-indigo-800 bg-indigo-950 text-indigo-300',
  },
  {
    state: 'GOVERNED',
    label: '6. GOVERNED',
    definition: 'Aislada bajo sandbox, cuotas de tokens, límites de tiempo y auditoría.',
    evidenceRequired: 'Contenedor sandbox activo y sanitizador de secretos acoplado.',
    color: 'border-purple-800 bg-purple-950 text-purple-300',
  },
  {
    state: 'VERIFIED',
    label: '7. VERIFIED',
    definition: 'Comportamiento validado mediante especificación SKILL.md y tests.',
    evidenceRequired: 'Especificación SKILL.md completa y suite de pruebas unitarias superadas.',
    color: 'border-emerald-800 bg-emerald-950 text-emerald-300',
  },
  {
    state: 'PRODUCTION_READY',
    label: '8. PROD_READY',
    definition: 'Lista para sistemas críticos con telemetría en vivo y rollback.',
    evidenceRequired: 'Pruebas e2e en ambiente real y firma criptográfica de release.',
    color: 'border-green-600 bg-green-950 text-green-200',
  },
];

export const EpistemologyMatrixView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');
  const [selectedCapability, setSelectedCapability] = useState<string>(
    CAPABILITY_AUDIT_UNIVERSE[0].id
  );

  const filteredCapabilities = CAPABILITY_AUDIT_UNIVERSE.filter((cap) => {
    const matchesSearch =
      cap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cap.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cap.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState =
      selectedStateFilter === 'all' || cap.epistemologicalState === selectedStateFilter;
    return matchesSearch && matchesState;
  });

  const activeCapData = CAPABILITY_AUDIT_UNIVERSE.find((c) => c.id === selectedCapability) || CAPABILITY_AUDIT_UNIVERSE[0];

  return (
    <div className="space-y-6">
      {/* Epistemological Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                EPISTEMOLOGÍA FORENSE (SECCIÓN 12, 13, 14, 30)
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Matriz de Estados Epistemológicos & Auditoría de Capacidades
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              En Hermes: <em>"Discovered ≠ Installed ≠ Available ≠ Executable ≠ Authorized ≠ Governed ≠ Verified ≠ Production_Ready"</em>.
              Una afirmación de LLM o una entrada en un manifest no constituye evidencia técnica.
            </p>
          </div>

          <div className="flex-shrink-0 p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 max-w-xs">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-bold mb-1">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              1900+ SKILLS = CLAIM_UNVERIFIED
            </div>
            <p className="text-[11px] text-rose-200/80 leading-normal">
              Sin prueba reproducible local, esa cifra queda clasificada como afirmación no verificada (Sección 14).
            </p>
          </div>
        </div>

        {/* Forensic Audit Metric Tiles */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Universo Descubierto</span>
            <span className="text-xl font-bold font-mono text-indigo-400">125</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">capacidades totales</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Instaladas Físicas</span>
            <span className="text-xl font-bold font-mono text-sky-400">43</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">13 builtin + 30 locales</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Verificadas SKILL.md</span>
            <span className="text-xl font-bold font-mono text-emerald-400">25</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">con spec demostrable</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Parciales / Dudas</span>
            <span className="text-xl font-bold font-mono text-amber-400">18</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">sin evidencia completa</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Activables (Manifest)</span>
            <span className="text-xl font-bold font-mono text-purple-400">82</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">60 manifest + 22 opt</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Plugins / MCP / Cron</span>
            <span className="text-xl font-bold font-mono text-slate-200">0 / 0 / 1</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">plugins / mcp / cron</span>
          </div>
        </div>
      </div>

      {/* Epistemological Pipeline Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-400" />
          Cadena de Aserción Epistemológica (No se puede saltar ningún estado)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {EPISTEMOLOGY_STEPS.map((step, idx) => (
            <div
              key={step.state}
              className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${step.color}`}
            >
              <div>
                <div className="flex items-center justify-between font-mono font-bold text-[11px] mb-1">
                  <span>{step.label}</span>
                  <span className="text-[10px] opacity-70">Paso {idx + 1}/8</span>
                </div>
                <p className="text-[11px] leading-relaxed mb-2 opacity-90">{step.definition}</p>
              </div>
              <div className="pt-2 border-t border-slate-700/50 text-[10px] font-mono">
                <span className="font-semibold block opacity-75">Evidencia Requerida:</span>
                <span className="opacity-90">{step.evidenceRequired}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Capabilities Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Capabilities List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                Catálogo Forense de Capacidades Hermes
              </h3>
              <p className="text-xs text-slate-400">
                Selecciona una capacidad para auditar su estado y requerimiento de sandbox.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrar por nombre o notas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono w-full sm:w-48"
              />
            </div>
          </div>

          {/* State Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-3 scrollbar-none text-[11px] font-mono">
            <button
              onClick={() => setSelectedStateFilter('all')}
              className={`px-2 py-1 rounded transition-colors ${
                selectedStateFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos
            </button>
            {['VERIFIED', 'GOVERNED', 'AVAILABLE', 'INSTALLED', 'DISCOVERED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStateFilter(st)}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                  selectedStateFilter === st
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1 border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Capacidad</th>
                  <th className="py-2.5 px-3">Origen</th>
                  <th className="py-2.5 px-3">Estado Epistemológico</th>
                  <th className="py-2.5 px-3">SKILL.md</th>
                  <th className="py-2.5 px-3">Sandbox</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {filteredCapabilities.map((cap) => {
                  const isSelected = selectedCapability === cap.id;
                  return (
                    <tr
                      key={cap.id}
                      onClick={() => setSelectedCapability(cap.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-indigo-950/60 text-white'
                          : 'hover:bg-slate-800/50 text-slate-300'
                      }`}
                    >
                      <td className="py-2 px-3 font-semibold text-slate-200 flex items-center gap-1.5">
                        {cap.name}
                      </td>
                      <td className="py-2 px-3 text-[11px] text-slate-400 uppercase">
                        {cap.origin}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            cap.epistemologicalState === 'VERIFIED'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : cap.epistemologicalState === 'GOVERNED'
                              ? 'bg-purple-950 text-purple-300 border border-purple-800'
                              : cap.epistemologicalState === 'AVAILABLE'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : cap.epistemologicalState === 'INSTALLED'
                              ? 'bg-sky-950 text-sky-300 border border-sky-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {cap.epistemologicalState}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        {cap.hasSkillMd ? (
                          <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                            <CheckCircle className="w-3 h-3" /> Sí
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">No</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {cap.hasSandbox ? (
                          <span className="text-emerald-400 text-[11px]">Aislado</span>
                        ) : (
                          <span className="text-rose-400 text-[11px] font-bold">REQUERIDO</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Capability Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                AUDITORÍA DETALLADA
              </span>
              <span className="text-xs text-slate-500 font-mono">{activeCapData.id}</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              {activeCapData.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Categoría: <strong className="text-slate-200 capitalize">{activeCapData.category}</strong>
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                  Estado Epistemológico Actual
                </span>
                <span className="font-mono font-bold text-sm text-indigo-300">
                  {activeCapData.epistemologicalState}
                </span>
                <p className="text-slate-400 text-[11px] mt-1">
                  {activeCapData.epistemologicalState === 'VERIFIED'
                    ? 'Comprobado con especificación formal y pruebas funcionales.'
                    : activeCapData.epistemologicalState === 'DISCOVERED'
                    ? 'Solo registrado nominalmente. No se permite invocación en producción.'
                    : 'En proceso de integración y validación formal.'}
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                  Fuente Forense / Evidencia
                </span>
                <p className="font-mono text-emerald-400 text-[11px] break-all">
                  {activeCapData.evidenceSource}
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                  Notas de Ingeniería & Hallazgo
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {activeCapData.notes}
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                  Frontera de Sandbox (Sección 15)
                </span>
                <div className="flex items-center gap-2 mt-1">
                  {activeCapData.hasSandbox ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-mono flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Sandbox Verificado
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[11px] font-mono flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> BLOQUEADO: Requiere Sandbox
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Regla Sección 16:</strong> Antes de escribir código para esta capacidad, consultar si ya está implementada y si tiene evidencia fresca.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
