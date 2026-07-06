/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, Calendar, AlertCircle, Percent, Compass, Hourglass } from 'lucide-react';
import { DashboardData, RoadmapDay } from '../types';

interface DashboardStatsProps {
  data: DashboardData;
  roadmap: RoadmapDay[];
}

export default function DashboardStats({ data, roadmap }: DashboardStatsProps) {
  const {
    completionPercent,
    studyHoursCompleted,
    remainingDays,
    consistencyPercent,
    delayDays,
    currentModule,
    targetFinishDate,
    expectedFinishDate,
    profile
  } = data;

  const statsItems = [
    {
      label: 'Syllabus Completion',
      value: `${completionPercent}%`,
      icon: Percent,
      color: 'text-emerald-400 border-emerald-500/10 bg-emerald-500/5',
      subtext: `180 Days // ${remainingDays} Days Left`,
      renderProgress: () => (
        <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden mt-3 border border-zinc-800">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      )
    },
    {
      label: 'Completed Study Time',
      value: `${studyHoursCompleted} hrs`,
      icon: Clock,
      color: 'text-blue-400 border-blue-500/10 bg-blue-500/5',
      subtext: `Target: ${profile.studyHoursPerDay} hours / day`,
      renderProgress: () => (
        <div className="text-[10px] font-mono text-zinc-500 mt-2.5">
          Avg: {data.analytics.averageHours} hrs/day across active modules
        </div>
      )
    },
    {
      label: 'Study Consistency',
      value: `${consistencyPercent}%`,
      icon: Compass,
      color: 'text-purple-400 border-purple-500/10 bg-purple-500/5',
      subtext: `Streak: ${data.analytics.currentStreak} days // Max: ${data.analytics.longestStreak}d`,
      renderProgress: () => (
        <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden mt-3 border border-zinc-800">
          <div
            className="bg-purple-500 h-full rounded-full transition-all duration-1000"
            style={{ width: `${consistencyPercent}%` }}
          />
        </div>
      )
    },
    {
      label: 'Syllabus Delay Index',
      value: `${delayDays} days`,
      icon: AlertCircle,
      color: delayDays > 0 ? 'text-amber-400 border-amber-500/10 bg-amber-500/5' : 'text-zinc-500 border-zinc-800 bg-zinc-950',
      subtext: `Reschedules: ${roadmap ? roadmap.reduce((sum, d) => sum + d.rescheduledCount, 0) : 0} times`,
      renderProgress: () => (
        <div className="text-[10px] font-mono text-zinc-500 mt-2.5">
          {delayDays > 0 ? 'Smart scheduler active' : 'Zero target days skipped'}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 select-none">
      
      {/* Top row primary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`p-5 rounded-xl border bg-zinc-900 shadow-lg relative overflow-hidden flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{item.label}</span>
                  <div className="text-2xl font-bold font-mono text-zinc-100">{item.value}</div>
                </div>
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${item.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-[10px] font-mono text-zinc-400">{item.subtext}</div>
                {item.renderProgress && item.renderProgress()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline schedules info box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Module Indicator */}
        <div className="md:col-span-2 p-5 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.02),transparent_60%)]" />
          <div className="w-12 h-12 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Active Module</span>
            <h3 className="text-sm font-bold text-zinc-100 truncate font-mono">{currentModule}</h3>
            <p className="text-xs text-zinc-400">
              Developing critical hands-on competence to transition away from routine ops.
            </p>
          </div>
        </div>

        {/* Calendar details */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-mono font-bold uppercase text-zinc-300">Completion Calendar</span>
          </div>
          
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-500">Commit Target:</span>
              <span className="text-zinc-300">{targetFinishDate}</span>
            </div>
            <div className="flex justify-between text-xs font-mono border-t border-zinc-800/60 pt-1.5">
              <span className="text-zinc-500">Expected Finish:</span>
              <span className={`font-bold ${delayDays > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {expectedFinishDate}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
