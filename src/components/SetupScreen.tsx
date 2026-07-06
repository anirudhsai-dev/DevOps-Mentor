/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Terminal, Calendar, Clock, Briefcase, Star } from 'lucide-react';

interface SetupScreenProps {
  onSetupComplete: () => void;
}

export default function SetupScreen({ onSetupComplete }: SetupScreenProps) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [studyHours, setStudyHours] = useState('3');
  const [workingHours, setWorkingHours] = useState('8');
  const [revisionDay, setRevisionDay] = useState('Sunday');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Operator Name is required to initialize terminal.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          startDate,
          studyHoursPerDay: Number(studyHours),
          workingHours: Number(workingHours),
          preferredRevisionDay: revisionDay
        })
      });

      if (!response.ok) {
        throw new Error('Terminal failed to initialize DevOps syllabus configuration database.');
      }

      onSetupComplete();
    } catch (err: any) {
      setError(err.message || 'Connection timeout. Check engine status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 font-sans select-none selection:bg-emerald-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05),transparent_60%)] pointer-events-none" />
      
      <div className="w-full max-w-xl bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md relative z-10">
        {/* Terminal Title Bar */}
        <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="font-mono text-xs text-zinc-500 ml-2">sys_init.sh</span>
          </div>
          <span className="font-mono text-xs text-emerald-500 font-semibold tracking-wide">DEVOPS_MENTOR v1.0.0</span>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-2xl font-bold font-mono text-emerald-400 tracking-tight flex items-center justify-center sm:justify-start gap-3">
              <Terminal className="w-6 h-6 animate-pulse" />
              Initialize DevOps Mentor
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Transition from Production Support into a world-class DevOps Engineer over 180 days. Configure your local parameters to compile your custom syllabus engine.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800 text-red-400 text-xs font-mono rounded">
              [SYSTEM ERROR]: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Operator Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-emerald-400" /> Operator Name
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe, Cloud Architect"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/80 transition-colors font-mono"
              />
            </div>

            {/* Start Date & Revision Day */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Roadmap Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={loading}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/80 transition-colors font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-emerald-400" /> Weekly Revision Day
                </label>
                <select
                  value={revisionDay}
                  onChange={(e) => setRevisionDay(e.target.value)}
                  disabled={loading}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/80 transition-colors font-mono"
                >
                  <option value="Sunday">Sunday (Recommended)</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Monday">Monday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>
            </div>

            {/* Study Target Hours & Work Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> Target Study (Hours/Day)
                </label>
                <select
                  value={studyHours}
                  onChange={(e) => setStudyHours(e.target.value)}
                  disabled={loading}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/80 transition-colors font-mono"
                >
                  <option value="1">1 Hour (Casual)</option>
                  <option value="2">2 Hours (Moderate)</option>
                  <option value="3">3 Hours (Intense - Recommended)</option>
                  <option value="4">4+ Hours (Hardcore)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" /> Current Job (Hours/Day)
                </label>
                <select
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  disabled={loading}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/80 transition-colors font-mono"
                >
                  <option value="0">0 Hours (Full-Time Study)</option>
                  <option value="4">4 Hours (Part-Time Job)</option>
                  <option value="8">8 Hours (Full-Time Shift)</option>
                  <option value="10">10+ Hours (Overtime Shift)</option>
                </select>
              </div>
            </div>

            {/* CLI Console Simulation Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-zinc-950 font-mono font-bold text-sm py-3 rounded shadow-lg shadow-emerald-950/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  COMPILING_ROADMAP_DATABASE...
                </>
              ) : (
                <>
                  <span>EXECUTE bootstrap_engine.sh</span>
                </>
              )}
            </button>
          </form>

          {/* Console Output Footer */}
          <div className="bg-zinc-950/80 p-3 rounded border border-zinc-800 font-mono text-[10px] text-zinc-500 space-y-1">
            <div>$ echo "Ready to provision virtual learning nodes."</div>
            <div>STATUS: STANDBY // NO_ROADMAP_FOUND_IN_PROGRESS_DB</div>
            <div>EXECUTION POLICY: STRICT_COMPLIANCE_180_DAYS_GOAL</div>
          </div>
        </div>
      </div>
    </div>
  );
}
