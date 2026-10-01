/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useCallback } from 'react';
import { CAPABILITY_AUDIT_UNIVERSE } from '../data';
import type { CapabilityItem, EpistemologicalState, CapabilityOrigin } from '../types';

interface UseCapabilityFilterResult {
  filteredCapabilities: CapabilityItem[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStateFilter: EpistemologicalState | 'all';
  setSelectedStateFilter: (state: EpistemologicalState | 'all') => void;
  selectedOriginFilter: CapabilityOrigin | 'all';
  setSelectedOriginFilter: (origin: CapabilityOrigin | 'all') => void;
  selectedCapability: string;
  setSelectedCapability: (id: string) => void;
  activeCapData: CapabilityItem;
  filteredCount: number;
  totalCount: number;
}

export function useCapabilityFilter(): UseCapabilityFilterResult {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState<EpistemologicalState | 'all'>(
    'all'
  );
  const [selectedOriginFilter, setSelectedOriginFilter] = useState<CapabilityOrigin | 'all'>('all');
  const [selectedCapability, setSelectedCapability] = useState<string>(() => {
    // Initialize with first capability ID from the universe
    return CAPABILITY_AUDIT_UNIVERSE[0]?.id ?? '';
  });

  const filteredCapabilities = useMemo(() => {
    return CAPABILITY_AUDIT_UNIVERSE.filter((cap) => {
      const matchesSearch =
        cap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cap.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cap.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesState =
        selectedStateFilter === 'all' || cap.epistemologicalState === selectedStateFilter;
      const matchesOrigin = selectedOriginFilter === 'all' || cap.origin === selectedOriginFilter;
      return matchesSearch && matchesState && matchesOrigin;
    });
  }, [searchTerm, selectedStateFilter, selectedOriginFilter]);

  const activeCapData =
    CAPABILITY_AUDIT_UNIVERSE.find((c) => c.id === selectedCapability) ??
    CAPABILITY_AUDIT_UNIVERSE[0] ??
    ({} as any);

  const handleSelectCapability = useCallback((id: string) => {
    setSelectedCapability(id);
  }, []);

  return {
    filteredCapabilities,
    searchTerm,
    setSearchTerm,
    selectedStateFilter,
    setSelectedStateFilter,
    selectedOriginFilter,
    setSelectedOriginFilter,
    selectedCapability,
    setSelectedCapability: handleSelectCapability,
    activeCapData,
    filteredCount: filteredCapabilities.length,
    totalCount: CAPABILITY_AUDIT_UNIVERSE.length,
  };
}
