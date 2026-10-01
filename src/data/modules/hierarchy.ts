/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HierarchySource } from '../../types/hermes';

export const HIERARCHY_SOURCES: HierarchySource[] = [
  {
    level: 1,
    name: 'Decisiones Explícitas del Usuario sobre el Producto',
    scope:
      'Requisitos de negocio, alcance funcional, restricciones humanas directas y preferencias.',
    canOverride: ['Nivel 2', 'Nivel 3', 'Nivel 4', 'Nivel 5', 'Nivel 6', 'Nivel 7'],
    cannotOverride: ['Invariantes matemáticas absolutas de seguridad de datos'],
    doctrineRule:
      'La autoridad humana soberana rige las decisiones del producto, siempre que no viole la integridad de seguridad.',
  },
  {
    level: 2,
    name: 'Architecture Contract V1 (Congelado)',
    scope:
      'Estructura congelada de Hermes, fronteras de aislamiento, invariantes de estado y de parches.',
    canOverride: ['Nivel 3', 'Nivel 4', 'Nivel 5', 'Nivel 6', 'Nivel 7'],
    cannotOverride: ['Nivel 1 (salvo si el usuario contradice la seguridad de forma inviable)'],
    doctrineRule:
      'No se reabre salvo P0, contradicción insalvable de requisitos o imposibilidad técnica demostrable.',
  },
  {
    level: 3,
    name: 'Master Context / Continuity Document (V1.0)',
    scope:
      'Doctrina de continuidad, objetivos maestros, qué NO es Hermes, epistemología y reglas de no complacencia.',
    canOverride: ['Nivel 4', 'Nivel 5', 'Nivel 6', 'Nivel 7'],
    cannotOverride: ['Nivel 1', 'Nivel 2'],
    doctrineRule:
      'Preserva la verdad del sistema entre sesiones de trabajo y evita reconstruir desde cero.',
  },
  {
    level: 4,
    name: 'Implementación Real y Evidencia de Pruebas',
    scope:
      '245/245 tests superados, código TypeScript verificado, compilaciones con código de salida 0.',
    canOverride: ['Nivel 5', 'Nivel 6', 'Nivel 7'],
    cannotOverride: ['Nivel 1', 'Nivel 2', 'Nivel 3'],
    doctrineRule:
      'La evidencia tangible de ejecución real siempre supera a la memoria histórica o suposiciones.',
  },
  {
    level: 5,
    name: 'Memoria e Historial de Hermes',
    scope: 'Logs de auditoría previa, state.db, historial de conversaciones y decisiones pasadas.',
    canOverride: ['Nivel 6', 'Nivel 7'],
    cannotOverride: ['Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4'],
    doctrineRule:
      'Sirve como referencia contextual, pero debe invalidarse si contradice pruebas o contratos.',
  },
  {
    level: 6,
    name: 'Skills, Manifests, Plugins, MCP y Registros',
    scope:
      'Catálogos declarados (.bundled_manifest, auth.json, definiciones de herramientas externas).',
    canOverride: ['Nivel 7'],
    cannotOverride: ['Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Nivel 5'],
    doctrineRule:
      'Un archivo manifest demuestra registro, pero no disponibilidad ni autorización de ejecución.',
  },
  {
    level: 7,
    name: 'Suposiciones y Alucinaciones del Modelo de IA',
    scope: 'Respuestas probabilísticas, extrapolaciones y propuestas del LLM.',
    canOverride: [],
    cannotOverride: ['Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Nivel 5', 'Nivel 6'],
    doctrineRule:
      'Rango epistemológico CERO frente a cualquier evidencia comprobable. Una respuesta de LLM no es evidencia.',
  },
];
