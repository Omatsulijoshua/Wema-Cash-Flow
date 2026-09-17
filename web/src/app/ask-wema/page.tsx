'use client';

import React from 'react';
import { DashboardShell } from '../../components/navigation/DashboardShell';
import { AskWemaChat } from '../../components/chat/AskWemaChat';

export default function AskWemaPage() {
  return (
    <DashboardShell>
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Ask Wema Intelligence
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Conversational interface grounded in your financial analytics engine. Zero hallucinated numbers.
        </p>
      </div>

      <AskWemaChat />
    </DashboardShell>
  );
}
