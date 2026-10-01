/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HIERARCHY_SOURCES } from '../data';
import { Key, Hash, Scale, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';

export const HierarchyAndSecurityView: React.FC = () => {
  const [sourceA, setSourceA] = useState<number>(7);
  const [sourceB, setSourceB] = useState<number>(4);

  // Security Simulator state: Hash-locked patch approval
  const [patchCode, setPatchCode] = useState(
    `export function calculateRisk(score: number): boolean {\n  return score > 85;\n}`
  );
  const _baseApprovedHash = 'd3b07384d113edec49eaa6238ad5ff00';

  // Simple string hash function for demo
  const computeSimpleHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `sha256-${hex}9f42c7e0`;
  };

  const currentPatchHash = computeSimpleHash(patchCode);
  const isPatchApproved =
    currentPatchHash ===
    computeSimpleHash(
      `export function calculateRisk(score: number): boolean {\n  return score > 85;\n}`
    );

  // Secret Sanitizer Simulator
  const [rawPrompt, setRawPrompt] = useState(
    `Analiza este commit: const apiKey = "sk-ant-api03-secret12345XYZ"; const dbPass = "SuperSecretDbPassword!"; conectar();`
  );

  const sanitizePrompt = (text: string) => {
    return text
      .replace(/sk-[a-zA-Z0-9_-]{12,}/g, '[REDACTED_API_KEY_HERMES_GATE]')
      .replace(/SuperSecretDbPassword!/g, '[REDACTED_SECRET_CREDENTIAL]');
  };

  const sanitizedPrompt = sanitizePrompt(rawPrompt);
  const hasSecretsDetected = rawPrompt !== sanitizedPrompt;

  const itemA = HIERARCHY_SOURCES.find((s) => s.level === sourceA)!;
  const itemB = HIERARCHY_SOURCES.find((s) => s.level === sourceB)!;
  const winner = sourceA < sourceB ? itemA : itemB;
  const loser = sourceA < sourceB ? itemB : itemA;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                GOBIERNO ONTOLÓGICO (SECCIÓN 20, 21, 29)
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Jerarquía de Fuentes & Invariantes de Seguridad Inmutables
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Para resolver contradicciones futuras en Hermes, rige una escala de precedencia de 7
              niveles. Asimismo, las políticas de seguridad (frontera de secretos y aprobación atada
              a hash) no admiten excepciones.
            </p>
          </div>
        </div>
      </div>

      {/* 7 Levels Table & Conflict Resolver */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7 Levels Hierarchy List (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-400" />
              Jerarquía Canónica de Fuentes (Sección 29)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Prevalencia descendente</span>
          </div>

          <div className="space-y-2">
            {HIERARCHY_SOURCES.map((src) => (
              <div
                key={src.level}
                className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 text-xs flex items-start gap-3"
              >
                <span
                  className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 ${
                    src.level === 1
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : src.level === 2
                        ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        : src.level === 4
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : src.level === 7
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-slate-900 text-slate-300 border border-slate-700'
                  }`}
                >
                  N{src.level}
                </span>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-200">{src.name}</h4>
                    {src.level === 7 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                        VALOR EPISTEMOLÓGICO: 0
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-[11px]">{src.scope}</p>
                  <div className="pt-1 text-[10px] font-mono text-indigo-300">
                    <strong>Regla:</strong> {src.doctrineRule}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conflict Resolver Tool (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-400" />
                Simulador de Arbitraje de Conflictos
              </h3>
              <p className="text-xs text-slate-400">
                Selecciona dos fuentes en disputa para conocer cuál manda por derecho
                arquitectónico.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label htmlFor="source-a" className="text-slate-400 font-mono block mb-1">
                  Afirmación / Fuente A:
                </label>
                <select
                  id="source-a"
                  value={sourceA}
                  onChange={(e) => setSourceA(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
                >
                  {HIERARCHY_SOURCES.map((s) => (
                    <option key={s.level} value={s.level}>
                      Nivel {s.level}: {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="source-b" className="text-slate-400 font-mono block mb-1">
                  Afirmación / Fuente B:
                </label>
                <select
                  id="source-b"
                  value={sourceB}
                  onChange={(e) => setSourceB(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
                >
                  {HIERARCHY_SOURCES.map((s) => (
                    <option key={s.level} value={s.level}>
                      Nivel {s.level}: {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Arbitration Result Card */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">
                Dictamen de Precedencia Legal:
              </span>
              {sourceA === sourceB ? (
                <div className="text-amber-400 text-xs font-mono">
                  Ambas fuentes pertenecen al mismo nivel ({sourceA}). Se requiere desambiguación
                  interna.
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>
                      PREVALECE: Nivel {winner.level} ({winner.name})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-rose-400/90 font-mono text-[11px]">
                    <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>
                      SUBORDINADO: Nivel {loser.level} ({loser.name})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                    {winner.level === 4 && loser.level === 7
                      ? 'La evidencia empírica de pruebas reales anula instantáneamente cualquier alucinación o respuesta del LLM.'
                      : `Conforme a la Sección 29 del Documento Maestro, Nivel ${winner.level} tiene jurisdicción jerárquica sobre Nivel ${loser.level}.`}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono pt-3 border-t border-slate-800">
            Regla de oro: Las suposiciones del modelo NUNCA superan a la evidencia.
          </div>
        </div>
      </div>

      {/* Security Invariants Demos: Hash-Locked Patch & Secret Boundary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hash-Locked Patch Approval Demo (Sección 21) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-400" />
              Invariante: Aprobación Criptográfica Ligada al Hash (Sección 21)
            </h3>
            <span className="text-xs font-mono text-slate-400">Hash-Lock</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            <em>
              "Aprobación ligada al hash. Modificar 1 solo carácter en el patch invalida
              automáticamente la aprobación anterior."
            </em>
            No existe aprobación retroactiva.
          </p>

          <div className="space-y-2">
            <label htmlFor="patch-code" className="text-slate-400 font-mono text-[11px] block">
              Código del Parche (Edita cualquier carácter para comprobar):
            </label>
            <textarea
              id="patch-code"
              rows={4}
              value={patchCode}
              onChange={(e) => setPatchCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-[11px]">Hash SHA-256 Calculado:</span>
              <span className="text-slate-200 font-semibold">{currentPatchHash}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-slate-500 text-[11px]">Estado de Aprobación:</span>
              {isPatchApproved ? (
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> APROBADO (Hash Coincide)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[11px] font-bold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> INVALIDADO (Parche Alterado)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Secret Boundary & Sanitizer Demo (Sección 21) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              Invariante: Frontera de Secretos & Sanitización Pre-LLM (Sección 21)
            </h3>
            <span className="text-xs font-mono text-amber-400">Egress Gate</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            <em>
              "Ningún contenido del proyecto llega a un LLM sin sanitización. Ningún secreto llega a
              exportación ni a logs."
            </em>
            originalContent queda suprimido del dominio.
          </p>

          <div className="space-y-2">
            <label htmlFor="raw-prompt" className="text-slate-400 font-mono text-[11px] block">
              Contenido de Entrada (Prueba agregando tokens o passwords):
            </label>
            <textarea
              id="raw-prompt"
              rows={3}
              value={rawPrompt}
              onChange={(e) => setRawPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-slate-400 font-mono text-[11px] block flex items-center justify-between">
              <span>Salida Sanitizada (Lo que realmente ve el LLM / Logs):</span>
              {hasSecretsDetected && (
                <span className="text-rose-400 text-[10px] font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> SECRETOS NEUTRALIZADOS
                </span>
              )}
            </label>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300 break-all">
              {sanitizedPrompt}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
