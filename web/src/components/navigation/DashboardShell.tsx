'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { OnboardingModal } from '../onboarding/OnboardingModal';

export const DashboardShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>

      {/* Onboarding Dialog */}
      <OnboardingModal />
    </div>
  );
};
