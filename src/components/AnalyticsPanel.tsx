/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, Zap, ShieldAlert, BarChart3, Hourglass, Calendar, CheckSquare, Target } from 'lucide-react';
import { AnalyticsStats } from '../types';

interface AnalyticsPanelProps {
  stats: AnalyticsStats;
}

export default function AnalyticsPanel({ stats }: AnalyticsPanelProps) {
  const {
    currentStreak,
    longestStreak,
    totalStudyHours,
    averageHours,
    skippedDays,
    delayedDays,
    recoveryDays,
    timeWasted,
    productivityScore,
    predictedFinishDate
  } = stats;

  // Custom SVG render for a circular speed gauge
  const renderGauge = (score: number) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center w-36 h-36">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="stroke-zinc-800 fill-none"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="stroke-emerald-500 fill-none transition-all duration-1000"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold font-mono text-zinc-100">{score}</span>
          <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 mt-1">PRODUCTIVITY</span>
        </div>
      </div>
    );
  };

  // Mock static SVG sparkline for visual aesthetic rhythm
  const renderSparkline = () => {
    return (
      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Historical Study Sparkline (Last 7 Active Days)</span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">Stable Trend</span>
        </div>
        <div className="h-16 w-full mt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 60">
            {/* Grid Lines */}
            <line x1="0" y1="10" x2="300" y2="10" className="stroke-zinc-900" strokeWidth="1" strokeDasharray="3" />
            <line x1="0" y1="30" x2="300" y2="30" className="stroke-zinc-900" strokeWidth="1" strokeDasharray="3" />
            <line x1="0" y1="50" x2="300" y2="50" className="stroke-zinc-900" strokeWidth="1" strokeDasharray="3" />
            
            {/* Smooth vector path */}
            <path
              d="M 10 40 Q 50 15 90 35 T 170 10 T 250 45 T 290 20"
              className="fill-none stroke-emerald-500"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Area under curve gradient fill */}
            <path
              d="M 10 40 Q 50 15 90 35 T 170 10 T 250 45 T 290 20 L 290 60 L 10 60 Z"
              className="fill-emerald-500/5 stroke-none"
            />
          </svg>
        </div>
        <div className="flex justify-between text-[8px] font-mono text-zinc-600 px-1">
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
          <span>SUN</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Primary Analytics Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Productivity Score Gauge */}
        <div className="bg-zinc-900 p-6 border border-zinc-800 rounded-xl shadow-lg flex flex-col items-center justify-center text-center space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">Productivity Score</h3>
          {renderGauge(productivityScore)}
          <p className="text-[11px] text-zinc-400 max-w-xs font-mono leading-relaxed">
            Composite index of syllabus completion rate, total consistency, and daily study target execution. Keep score &gt; 80 to hit transition targets.
          </p>
        </div>

        {/* Core numbers list */}
        <div className="md:col-span-2 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Streak Metrics Card */}
            <div className="bg-zinc-900 p-5 border border-zinc-800 rounded-xl shadow-md flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Current Streaks</span>
                <div className="text-xl font-bold text-zinc-100 font-mono">{currentStreak} Days</div>
                <div className="text-[10px] font-mono text-zinc-400">Longest Streak: {longestStreak} days</div>
              </div>
            </div>

            {/* Total Study Hours */}
            <div className="bg-zinc-900 p-5 border border-zinc-800 rounded-xl shadow-md flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Overall Study</span>
                <div className="text-xl font-bold text-zinc-100 font-mono">{totalStudyHours} Hours</div>
                <div className="text-[10px] font-mono text-zinc-400">Average: {averageHours} hrs/day</div>
              </div>
            </div>

            {/* Backlog stats */}
            <div className="bg-zinc-900 p-5 border border-zinc-800 rounded-xl shadow-md flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-400 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Skipped Days</span>
                <div className="text-xl font-bold text-zinc-100 font-mono">{skippedDays} Days</div>
                <div className="text-[10px] font-mono text-zinc-400">Time Wasted: {timeWasted} hours</div>
              </div>
            </div>

            {/* Recovery Days */}
            <div className="bg-zinc-900 p-5 border border-zinc-800 rounded-xl shadow-md flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/5 border border-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Recovery Rate</span>
                <div className="text-xl font-bold text-zinc-100 font-mono">{recoveryDays} Days</div>
                <div className="text-[10px] font-mono text-zinc-400">Delayed Lessons: {delayedDays} items</div>
              </div>
            </div>

          </div>

          {/* Sparkline trend representation */}
          {renderSparkline()}

        </div>

      </div>

      {/* Target Timeline Diagnostics summary footer */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-emerald-500" />
          <h3 className="text-xs font-mono font-bold uppercase text-zinc-300">Target Timeline & Career Predictor</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs font-mono text-zinc-400">
          <div className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-lg space-y-1">
            <span className="text-zinc-500">Predicted Readiness Window:</span>
            <p className="text-zinc-200 leading-normal">
              Based on your consistency index, you will complete the core portfolio and be ready to trigger job interviews by: <strong className="text-emerald-400 font-bold">{predictedFinishDate}</strong>.
            </p>
          </div>
          <div className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-lg space-y-1">
            <span className="text-zinc-500">DevOps transition timeline health:</span>
            <p className="text-zinc-200 leading-normal">
              {delayedDays > 0 
                ? `You have encountered ${delayedDays} delayed milestones. The smart scheduler is currently managing dependencies and buffer days.` 
                : 'Excellent execution! You are tracking perfectly on time with zero delay on the core 180-day target calendar.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
