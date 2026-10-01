/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { MACRO_CYCLE_PHASES } from '../data';
import type { MacroCyclePhase } from '../types';

export function usePhaseFilter(): {
  filteredPhases: MacroCyclePhase[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedPhaseId: number;
  setSelectedPhaseId: (id: number) => void;
  activePhase: MacroCyclePhase;
  categories: { id: string; label: string }[];
} {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhaseId, setSelectedPhaseId] = useState<number>(1);

  const filteredPhases = useMemo(() => {
    return MACRO_CYCLE_PHASES.filter((phase) => {
      const matchesCategory = selectedCategory === 'all' || phase.category === selectedCategory;
      const matchesSearch =
        phase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phase.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phase.id.toString() === searchTerm;
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const activePhase =
    MACRO_CYCLE_PHASES.find((p) => p.id === selectedPhaseId) ??
    (MACRO_CYCLE_PHASES[0] as MacroCyclePhase);

  const categories = useMemo(
    () => [
      { id: 'all', label: 'Todas las Fases (26)' },
      { id: 'discovery', label: '1. Conceptualización & Descubrimiento (1-6)' },
      { id: 'architecture', label: '2. Arquitectura & Diseño (7-12)' },
      { id: 'implementation', label: '3. Construcción & Verificación (13-20)' },
      { id: 'release', label: '4. Release & Despliegue (21-22)' },
      { id: 'operation', label: '5. Operación & Evolución (23-26)' },
    ],
    []
  );

  return {
    filteredPhases,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    selectedPhaseId,
    setSelectedPhaseId,
    activePhase,
    categories,
  };
}
