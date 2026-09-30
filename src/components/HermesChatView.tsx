/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Upload,
  FileText,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Bot,
  User,
  Sparkles,
  Lock,
  Copy,
  Check,
  Loader2,
  Hash,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { streamHermesResponse } from '../services/hermesClient';

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  content: string;
  hash?: string;
  redacted?: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  attachments?: { name: string; hash?: string }[];
  sanitizedCount?: number;
}

const PRESET_INTENTIONS = [
  {
    title: 'Auditar Arquitectura de un Sistema',
    prompt:
      'Mi intención es diseñar un sistema de procesamiento de pagos que valide transacciones contra el banco en tiempo real. ¿Qué arquitectura recomienda Hermes (software determinista vs agentes)? ¿Cuáles son las invariantes críticas de seguridad que debo imponer?',
  },
  {
    title: 'Consultar sobre la Frontera de Secretos',
    prompt:
      'Explícame cómo funciona la Frontera de Secretos (Secret Boundary) de la Sección 21 del Documento Maestro y por qué originalContent jamás debe llegar a los logs ni al LLM.',
  },
  {
    title: 'Dilema: ¿Usar Agente o Software Tradicional?',
    prompt:
      'Tengo un caso de uso donde necesito parsear archivos JSON de clientes, normalizar fechas y guardarlos en una base de datos PostgreSQL. ¿Debo usar un agente de IA para esto o software tradicional? Aplica la Sección 7.',
  },
  {
    title: 'Consultar Estado Epistemológico (Fase 18)',
    prompt:
      '¿Por qué el execution-engine actual se clasifica como SIMULATED y qué evidencia técnica se requiere para que una capacidad pase a estado VERIFIED o PRODUCTION_READY?',
  },
];

export const HermesChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      content:
        '**HERMES CORE EN LÍNEA — LISTO PARA INGESTA DE INTENCIÓN (FASE 01)**\n\nBienvenido. Actúo bajo el rol de **mentor técnico, arquitecto de sistemas soberano y contraparte crítica**.\n\nPuedes formular tus dudas técnicas, solicitar la evaluación de una arquitectura o **adjuntar archivos de código, esquemas o especificaciones** usando el botón de carga inferior.\n\nTodo contenido cargado será sometido automáticamente a la **Frontera de Sanitización de Secretos** y firmado con su digest SHA-256 antes de ser procesado.\n\n*Recuerda: No protegeré decisiones defectuosas por complacencia. Protegeré la verdad y la seguridad del sistema.*',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Limit to 5MB per file
      if (file.size > 5 * 1024 * 1024) {
        alert(`El archivo ${file.name} supera el límite de 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setAttachments((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: file.name,
            size: file.size,
            content,
          },
        ]);
      };
      reader.readAsText(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt && attachments.length === 0) return;
    if (isLoading) return;

    const currentAttachments = [...attachments];
    setInputPrompt('');
    setAttachments([]);

    const userMessageId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString(),
      attachments: currentAttachments.map((a) => ({ name: a.name })),
    };

    const modelMessageId = `model-${Date.now()}`;
    const initialModelMessage: ChatMessage = {
      id: modelMessageId,
      role: 'model',
      content: '',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage, initialModelMessage]);
    setIsLoading(true);

    try {
      const historyToPass = messages
        .filter((m) => m.id !== 'welcome-msg')
        .map((m) => ({ role: m.role, content: m.content }));

      const attachmentsToPass = currentAttachments.map((a) => ({
        name: a.name,
        content: a.content,
      }));

      let accumulatedText = '';
      let metaSanitizedCount = 0;

      for await (const chunk of streamHermesResponse(prompt, historyToPass, attachmentsToPass)) {
        if (chunk.type === 'meta') {
          metaSanitizedCount = chunk.sanitizedCount || 0;
        } else if (chunk.type === 'chunk' && chunk.text) {
          accumulatedText += chunk.text;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === modelMessageId
                ? {
                    ...msg,
                    content: accumulatedText,
                    sanitizedCount: metaSanitizedCount,
                  }
                : msg
            )
          );
        }
      }
    } catch (error: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === modelMessageId
            ? {
                ...msg,
                content: `⚠️ **ERROR EN HERMES CORE:** ${error.message || 'Error de procesamiento.'}`,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] min-h-[550px] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
      {/* Chat Top Banner */}
      <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-950">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              CANAL DIRECTO CON HERMES CORE
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                LISTO PARA PREGUNTAS & DOCUMENTOS
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Mentor técnico, arquitecto y auditor sin complacencia • Filtro de Secretos Activo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-amber-300">
            <Lock className="w-3 h-3 text-amber-400" />
            Secret Boundary Sanitizer v1.0
          </span>
        </div>
      </div>

      {/* Preset Intentions Chips */}
      <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
        <span className="text-slate-500 font-mono text-[10px] uppercase font-bold flex items-center gap-1 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-amber-400" /> Ejemplos Rápidos:
        </span>
        {PRESET_INTENTIONS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(preset.prompt)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-mono text-[11px] whitespace-nowrap transition-colors disabled:opacity-50"
          >
            {preset.title}
          </button>
        ))}
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-4xl ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-md ${
                  isUser
                    ? 'bg-indigo-600'
                    : 'bg-gradient-to-br from-purple-700 to-indigo-900 border border-purple-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Box */}
              <div
                className={`relative group rounded-xl p-4 text-xs sm:text-sm leading-relaxed max-w-[85%] border shadow-lg ${
                  isUser
                    ? 'bg-indigo-950/80 border-indigo-700/60 text-slate-100 rounded-tr-none'
                    : 'bg-slate-950 border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-slate-800/80 font-mono text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-300">
                    {isUser ? 'TÚ (OPERADOR)' : 'HERMES CORE (ARQUITECTO & MENTOR)'}
                  </span>
                  <div className="flex items-center gap-2">
                    {msg.sanitizedCount !== undefined && msg.sanitizedCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> {msg.sanitizedCount} secretos sanitizados
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition-opacity"
                      title="Copiar mensaje"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Attachments chips inside user message */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mb-2.5 pb-2 border-b border-indigo-800/40 flex flex-wrap gap-1.5">
                    {msg.attachments.map((att, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-indigo-900/60 border border-indigo-700 text-indigo-200 text-[11px] font-mono flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        {att.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Message Content rendered */}
                <div className="whitespace-pre-line font-sans space-y-2">
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3 max-w-2xl mr-auto">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-700 to-indigo-900 border border-purple-500/30 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl rounded-tl-none p-3.5 text-xs text-slate-400 flex items-center gap-2 font-mono">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              Hermes evaluando intención bajo la prioridad inmutable...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Preview Bar */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-mono text-slate-400 font-semibold flex items-center gap-1">
            <Hash className="w-3 h-3 text-indigo-400" /> Adjuntos para escaneo ({attachments.length}):
          </span>
          {attachments.map((file) => (
            <div
              key={file.id}
              className="px-2 py-1 rounded bg-slate-900 border border-indigo-800/60 text-slate-200 text-xs font-mono flex items-center gap-2 flex-shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span className="max-w-[140px] truncate">{file.name}</span>
              <span className="text-[10px] text-slate-500">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
              <button
                onClick={() => removeAttachment(file.id)}
                className="text-slate-400 hover:text-rose-400 transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Form Bar */}
      <div className="p-3.5 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* File Upload Hidden Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept=".txt,.md,.json,.ts,.js,.tsx,.jsx,.yaml,.yml,.py,.sql,.csv"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex-shrink-0 flex items-center gap-1.5 text-xs font-mono"
            title="Cargar archivos de código o especificaciones a Hermes"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Cargar Archivos</span>
          </button>

          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Pregúntale a Hermes o describe tu intención, duda o arquitectura..."
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
          />

          <button
            type="submit"
            disabled={isLoading || (!inputPrompt.trim() && attachments.length === 0)}
            className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-mono text-xs flex items-center gap-1.5 transition-colors shadow-md flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline font-bold">Enviar</span>
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
          <span>
            Prioridad: <strong>corrección → evidencia → seguridad → arquitectura → utilidad</strong>
          </span>
          <span className="hidden sm:inline">
            Archivos soportados: .ts, .json, .md, .txt, .sql, .yaml (hasta 5MB)
          </span>
        </div>
      </div>
    </div>
  );
};
