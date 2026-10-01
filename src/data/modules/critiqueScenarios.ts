/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const PRESET_CRITIQUE_SCENARIOS = [
  {
    title: 'Agente autónomo con acceso directo a Base de Datos sin pasar por Gate',
    proposal:
      'Queremos acelerar el desarrollo permitiendo que un agente con LLM ejecute consultas SQL directas de mutación (UPDATE/DELETE/ALTER) en la base de datos principal, basándose en lo que pida el usuario por chat, para que sea "completamente autónomo".',
    category: 'Seguridad & Gobierno',
  },
  {
    title: 'Usar 7 agentes especializados comunicándose en bucle para escribir código simple',
    proposal:
      'Para hacer una calculadora de impuestos estándar, vamos a instanciar 7 agentes (Planner, Architect, Coder, Reviewer, Tester, Security, Manager) que conversen entre sí en rondas infinitas hasta llegar a un consenso semántico.',
    category: 'Arquitectura & Costos',
  },
  {
    title: 'Afirmar que Hermes tiene 2.000 herramientas listas porque están en un manifest',
    proposal:
      'Podemos promocionar y asegurar a los usuarios que Hermes ya dispone de 2.000 capacidades de ingeniería de software listas para producción, citando el número declarado en el repositorio.',
    category: 'Epistemología & Verdad',
  },
  {
    title: 'Pipeline determinista con verificación estricta de tipos y sandbox para scripts',
    proposal:
      'Diseñar un sistema de transformación de datos mediante un workflow determinista en TypeScript, con validación de esquemas Zod en los límites, escaneo de secretos antes de exportar y ejecución de scripts auxiliares dentro de un contenedor aislado con permisos de solo lectura.',
    category: 'Diseño Correcto',
  },
];
