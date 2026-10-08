'use client';

import React from 'react';
import {
  Building2,
  User,
  RefreshCw,
  Smartphone,
  ShieldCheck,
  Globe,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { store } from '@/lib/store';

interface HeaderProps {
  activePersona: 'website' | 'owner' | 'tenant';
  setActivePersona: (persona: 'website' | 'owner' | 'tenant') => void;
  selectedTenantId: string;
  setSelectedTenantId: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePersona,
  setActivePersona,
  selectedTenantId,
  setSelectedTenantId,
}) => {
  const property = store.getProperty();
  const tenants = store.getTenants();

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-40 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => setActivePersona('website')}
            className="flex items-center space-x-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/30">
              <Building2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl tracking-tight text-slate-950 font-sans">
                  StaySync<span className="text-blue-600">.</span>
                </span>
                <span className="bg-blue-50 text-blue-700 border border-blue-200/60 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3 text-blue-600" /> Stitch UI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block truncate max-w-xs">
                {property.name}
              </p>
            </div>
          </div>

          {/* Stitch Segmented Controller Pill */}
          <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto py-1">
            <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center border border-slate-200/80 shadow-inner">
              {/* Website */}
              <button
                onClick={() => setActivePersona('website')}
                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-black transition-all duration-200 ${
                  activePersona === 'website'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider text-[11px]">Public Site</span>
              </button>

              {/* Owner Hub */}
              <button
                onClick={() => setActivePersona('owner')}
                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-black transition-all duration-200 ${
                  activePersona === 'owner'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider text-[11px]">Owner Hub</span>
              </button>

              {/* Tenant Portal */}
              <button
                onClick={() => setActivePersona('tenant')}
                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-black transition-all duration-200 ${
                  activePersona === 'tenant'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider text-[11px]">Resident App</span>
              </button>
            </div>

            {/* Tenant Selector Dropdown (Resident Mode) */}
            {activePersona === 'tenant' && (
              <div className="flex items-center bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs shadow-xs">
                <User className="w-3.5 h-3.5 text-blue-600 mr-2 shrink-0" />
                <select
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  className="bg-transparent text-slate-900 text-xs font-extrabold focus:outline-none cursor-pointer pr-1"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id} className="bg-white text-slate-900">
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Reset Dataset Tool */}
            <button
              onClick={() => {
                if (confirm('Reset demo dataset to initial state?')) {
                  store.resetToDefaultSeed();
                }
              }}
              title="Reset Demo Dataset"
              className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 border border-slate-200/80 transition-all hover:scale-105 shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
