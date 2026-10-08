'use client';

import React, { useState } from 'react';
import { Header } from '@/components/common/Header';
import { LandingPage } from '@/components/website/LandingPage';
import { AppInterface } from '@/components/app/AppInterface';

export default function Home() {
  // Default to 'app' so the user directly experiences the full application interface
  const [activeView, setActiveView] = useState<'app' | 'website'>('app');
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Header
        activePersona={activeView === 'app' ? 'owner' : 'website'}
        setActivePersona={(persona) => {
          if (persona === 'website') {
            setActiveView('website');
          } else {
            setActiveView('app');
          }
        }}
        selectedTenantId={selectedTenantId}
        setSelectedTenantId={setSelectedTenantId}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {activeView === 'app' ? (
          <AppInterface onSwitchToWebsite={() => setActiveView('website')} />
        ) : (
          <LandingPage onEnterApp={() => setActiveView('app')} />
        )}
      </main>
    </div>
  );
}
