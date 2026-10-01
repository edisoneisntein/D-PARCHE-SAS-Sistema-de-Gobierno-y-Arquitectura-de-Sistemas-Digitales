/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MASTER_SECTIONS } from '../data';
import {
  Search,
  Copy,
  Check,
  Download,
  AlertTriangle,
  ShieldCheck,
  Flame,
  ArrowRight,
} from 'lucide-react';

export const DocumentMasterView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(1);

  const categories = [
    { id: 'all', label: 'Todas las Secciones (32)' },
    { id: 'context', label: 'Rol & Mentor Crítico' },
    { id: 'identity', label: 'Identidad & Qué NO es' },
    { id: 'architecture', label: 'Arquitectura & Agentes' },
    { id: 'epistemology', label: 'Epistemología & Evidencia' },
    { id: 'security', label: 'Seguridad & Secretos' },
    { id: 'phases', label: 'Fases & Tests' },
    { id: 'rules', label: 'Jerarquía & Reglas' },
  ];

  const filteredSections = MASTER_SECTIONS.filter((sec) => {
    const matchesCategory = selectedCategory === 'all' || sec.category === selectedCategory;
    const matchesSearch =
      sec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.fullText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.number.toString() === searchTerm;
    return matchesCategory && matchesSearch;
  });

  const handleCopyAll = () => {
    const fullDoc = MASTER_SECTIONS.map(
      (s) =>
        `## ${s.number}. ${s.title}\n\n${s.fullText}\n\n**Invariantes:**\n${s.invariants.map((i) => `- ${i}`).join('\n')}`
    ).join('\n\n---\n\n');

    navigator.clipboard.writeText(fullDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const fullDoc = MASTER_SECTIONS.map(
      (s) =>
        `## ${s.number}. ${s.title}\n\n${s.fullText}\n\n**Invariantes:**\n${s.invariants.map((i) => `- ${i}`).join('\n')}`
    ).join('\n\n---\n\n');

    const blob = new Blob([fullDoc], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'HERMES_DOCUMENTO_MAESTRO_V1.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Doctrine Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-indigo-950/40 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                DOCTRINA CANÓNICA
              </span>
              <span className="text-xs text-slate-400">Versión 1.0 • 11 de septiembre de 2026</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Hermes — Documento Maestro de Continuidad y Contexto
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Preserva el contexto conceptual, las decisiones, correcciones y dirección estratégica
              de Hermes para garantizar continuidad epistemológica entre sesiones sin reconstruir
              desde cero.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? 'Copiado' : 'Copiar Texto Completo'}
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar .MD
            </button>
          </div>
        </div>

        {/* Priority Rule Callout */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            Prioridad Inmutable:
          </span>
          <div className="flex items-center gap-1.5 font-mono text-[11px] overflow-x-auto text-slate-200">
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold">
              1. Corrección
            </span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300 font-bold">
              2. Evidencia
            </span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-bold">
              3. Seguridad
            </span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold">
              4. Arquitectura
            </span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300 font-bold">
              5. Utilidad
            </span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-bold">
              6. Velocidad
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por artículo, palabra clave o concepto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {filteredSections.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-sm">
            No se encontraron secciones coincidentes con los filtros actuales.
          </div>
        ) : (
          filteredSections.map((sec) => {
            const isExpanded = expandedSection === sec.number;
            return (
              <div
                key={sec.number}
                className={`bg-slate-900 border rounded-xl transition-all duration-150 ${
                  isExpanded
                    ? 'border-indigo-500/80 shadow-lg shadow-indigo-950/20'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Header click */}
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : sec.number)}
                  className="p-4 sm:p-5 cursor-pointer flex items-start justify-between gap-4 w-full text-left"
                  aria-expanded={isExpanded}
                  aria-controls={`section-${sec.number}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800 font-mono font-bold text-xs flex items-center justify-center">
                      {sec.number}
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-slate-100 flex items-center gap-2">
                        {sec.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{sec.summary}</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-indigo-400 bg-indigo-950/80 border border-indigo-900 px-2 py-0.5 rounded flex-shrink-0">
                    {isExpanded ? 'Colapsar ▲' : 'Expandir ▼'}
                  </span>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-5 sm:px-5 border-t border-slate-800/80 pt-4 space-y-4">
                    {/* Full text verbatim */}
                    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                      {sec.fullText}
                    </div>

                    {/* Key Quote if present */}
                    {sec.keyQuote && (
                      <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/70 text-indigo-300 text-xs font-mono flex items-start gap-2">
                        <Flame className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>MÁXIMA INMUTABLE:</strong> "{sec.keyQuote}"
                        </span>
                      </div>
                    )}

                    {/* Invariants */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Invariantes de Ingeniería
                      </h4>
                      <ul className="space-y-1.5">
                        {sec.invariants.map((inv, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/60 p-2 rounded border border-slate-800/60"
                          >
                            <span className="text-emerald-400 font-mono font-bold">✓</span>
                            <span>{inv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Anti-Patterns if present */}
                    {sec.antiPatterns && sec.antiPatterns.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          Anti-Patrones Prohibidos
                        </h4>
                        <ul className="space-y-1.5">
                          {sec.antiPatterns.map((ap, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-rose-200 flex items-start gap-2 bg-rose-950/30 p-2 rounded border border-rose-900/60"
                            >
                              <span className="text-rose-400 font-mono font-bold">✕</span>
                              <span>{ap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
