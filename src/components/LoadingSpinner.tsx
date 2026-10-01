/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4 text-slate-400">
      <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
      <p className="text-xs font-mono text-slate-500">Cargando vista...</p>
    </div>
  </div>
);
