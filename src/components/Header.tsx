/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Terminal, RefreshCw, BarChart2, Calendar, FileText, Code2, Cpu, Sparkles, LogOut } from 'lucide-react';

interface HeaderProps {
  operatorName: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onReset: () => void;
  onLogout: () => void;
}

export default function Header({ operatorName, activeTab, setActiveTab, onReset, onLogout }: HeaderProps) {
  const navItems = [
    { id: 'dashboard', label: 'Console', icon: Cpu },
    { id: 'roadmap', label: '180-Day Syllabus', icon: Calendar },
    { id: 'analytics', label: 'Metrics', icon: BarChart2 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'trackers', label: 'Portfolio & Logs', icon: Code2 },
    { id: 'mentor', label: 'AI Mentor', icon: Sparkles }
  ];

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 relative z-30 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
          
          {/* Brand/Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Terminal className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-mono tracking-tight text-zinc-100 flex items-center gap-2">
                DevOps Mentor
                <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded border border-emerald-500/20 font-semibold uppercase">
                  ACTIVE
                </span>
              </h1>
              <p className="text-xs font-mono text-zinc-500">
                Transition Protocol // Operator: <span className="text-zinc-300 font-semibold">{operatorName}</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex flex-wrap items-center justify-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded font-mono text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-zinc-950 shadow-md shadow-emerald-950/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Utilities: Reset & Logout */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-2.5 py-1.5 border border-zinc-800 hover:border-red-900/50 hover:bg-red-950/20 text-zinc-500 hover:text-red-400 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
              title="Reset configuration and erase all logged metrics"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
            <button
              onClick={onLogout}
              className="px-2.5 py-1.5 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
              title="Logout session"
            >
              <LogOut className="w-3.5 h-3.5 text-emerald-500" />
              <span>LOGOUT</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
