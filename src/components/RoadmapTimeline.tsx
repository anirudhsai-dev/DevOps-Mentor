/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Filter, BookOpen, Clock, GitCommit, CheckCircle2, AlertTriangle, Calendar, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { RoadmapDay } from '../types';

interface RoadmapTimelineProps {
  roadmap: RoadmapDay[];
}

export default function RoadmapTimeline({ roadmap }: RoadmapTimelineProps) {
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  // Group modules for month selection
  const months = [
    { num: 1, label: 'Month 1: Linux, Networking & Git' },
    { num: 2, label: 'Month 2: Docker & Compose' },
    { num: 3, label: 'Month 3: AWS Cloud Infra' },
    { num: 4, label: 'Month 4: CI/CD Pipelines' },
    { num: 5, label: 'Month 5: Kubernetes & Helm' },
    { num: 6, label: 'Month 6: IaC & Monitoring' }
  ];

  // Filters logic
  const filteredRoadmap = roadmap.filter((day) => {
    // Search filter
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      day.topic.toLowerCase().includes(searchLower) ||
      day.module.toLowerCase().includes(searchLower) ||
      day.subtopics.some(s => s.toLowerCase().includes(searchLower));

    // Month filter
    let matchesMonth = true;
    if (selectedMonth !== 'all') {
      const startDay = (selectedMonth - 1) * 30 + 1;
      const endDay = selectedMonth * 30;
      matchesMonth = day.dayNumber >= startDay && day.dayNumber <= endDay;
    }

    // Status filter
    let matchesStatus = true;
    if (selectedStatus !== 'all') {
      matchesStatus = day.status === selectedStatus;
    }

    return matchesSearch && matchesMonth && matchesStatus;
  });

  const toggleExpand = (dayNumber: number) => {
    setExpandedDay(expandedDay === dayNumber ? null : dayNumber);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono rounded font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            COMPLETED
          </span>
        );
      case 'Partial':
        return (
          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono rounded font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            PARTIAL
          </span>
        );
      case 'Backlog':
        return (
          <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-mono rounded font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            BACKLOG
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-zinc-800 text-zinc-500 border border-zinc-700 text-[10px] font-mono rounded flex items-center gap-1">
            <Lock className="w-3 h-3 text-zinc-500" />
            PENDING
          </span>
        );
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-emerald-400';
      case 'Medium': return 'text-amber-400';
      case 'Hard': return 'text-red-400 font-semibold';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Filtering Toolbar Header */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search topics, tools, labs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/80 transition-colors"
          />
        </div>

        {/* Filter Selection Grid */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Month selector */}
          <div className="flex items-center gap-2 bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-800 text-xs font-mono">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-transparent text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Months</option>
              {months.map(m => (
                <option key={m.num} value={m.num}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-2 bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-800 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Partial">Partial</option>
              <option value="Backlog">Backlog</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

        </div>
      </div>

      {/* Grid List of Days */}
      <div className="space-y-3">
        {filteredRoadmap.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 font-mono text-xs">
            NO_ROADMAP_ITEMS_MATCH_CURRENT_FILTERS
          </div>
        ) : (
          filteredRoadmap.map((day) => {
            const isExpanded = expandedDay === day.dayNumber;
            return (
              <div
                key={day.dayNumber}
                className={`bg-zinc-900 border rounded-xl overflow-hidden shadow-md transition-all duration-200 ${
                  isExpanded ? 'border-emerald-500/40 bg-zinc-900/90' : 'border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                {/* Accordion Trigger Summary Header */}
                <div
                  onClick={() => toggleExpand(day.dayNumber)}
                  className="p-4 sm:px-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-800/20"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center font-mono shrink-0">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold leading-none">DAY</span>
                      <span className="text-sm font-bold text-emerald-400 leading-none mt-1">{day.dayNumber}</span>
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase truncate max-w-[120px] sm:max-w-xs">{day.module}</span>
                        <span className="text-[10px] font-mono text-zinc-500">•</span>
                        <span className={`text-[10px] font-mono ${getDifficultyColor(day.difficulty)}`}>{day.difficulty}</span>
                      </div>
                      <h3 className="text-sm font-bold text-zinc-100 truncate font-sans tracking-tight">
                        {day.topic.split(':').pop()?.trim()}
                      </h3>
                    </div>
                  </div>

                  {/* Status Badging & Icon */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:block">{getStatusBadge(day.status)}</div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                  </div>
                </div>

                {/* Expanded Syllabus Details Area */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-zinc-800/60 bg-zinc-950/40 space-y-5 animate-slideDown">
                    <div className="sm:hidden flex justify-start pb-1 border-b border-zinc-800/40">
                      {getStatusBadge(day.status)}
                    </div>

                    {/* Meta values */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-[11px] bg-zinc-950 p-3 rounded border border-zinc-800/80 text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Estimated Study: <strong className="text-zinc-200">{day.estimatedTime}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Commit Target: <strong className="text-zinc-200">{day.targetDate}</strong></span>
                      </div>
                      {day.completionDate && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Recorded Date: <strong className="text-zinc-200">{day.completionDate}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Subtopics Checklist & Revision */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-wider">Core Subtopics Checklist:</span>
                        <ul className="space-y-1.5 font-mono text-xs text-zinc-300">
                          {day.subtopics.map((s, idx) => (
                            <li key={idx} className="flex items-start gap-2 leading-relaxed">
                              <span className="text-emerald-500 mt-1 shrink-0">■</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold uppercase text-zinc-500 tracking-wider">Prerequisite Revision / Sync Topic:</span>
                        <p className="text-xs text-zinc-400 font-mono italic leading-relaxed bg-zinc-900/40 p-2.5 rounded border border-zinc-800">
                          {day.revisionTopic}
                        </p>
                      </div>
                    </div>

                    {/* Hands-On practical lab & Assignment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-zinc-800/40">
                      <div className="space-y-2 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/60">
                        <span className="text-[10px] font-mono font-bold uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> Hands-On Lab Objective
                        </span>
                        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                          {day.practicalLab}
                        </p>
                      </div>

                      <div className="space-y-2 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/60">
                        <span className="text-[10px] font-mono font-bold uppercase text-purple-400 tracking-wider flex items-center gap-1.5">
                          <GitCommit className="w-3.5 h-3.5" /> Mini Assignment Task
                        </span>
                        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                          {day.miniAssignment}
                        </p>
                      </div>
                    </div>

                    {/* Interview Mock Drills */}
                    {day.interviewQuestions && day.interviewQuestions.length > 0 && (
                      <div className="space-y-2.5 pt-3 border-t border-zinc-800/40">
                        <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">DevOps Interview Prep Practice:</span>
                        <div className="space-y-3 font-mono text-xs">
                          {day.interviewQuestions.map((q, idx) => (
                            <div key={idx} className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-lg space-y-1">
                              <span className="text-[10px] font-bold text-amber-500">Q{idx + 1}: {q}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Git Commit expectation */}
                    <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>Git Commit Requirement:</span>
                      <code className="px-2 py-0.5 bg-zinc-900 text-emerald-400 rounded border border-zinc-800 select-all cursor-pointer">
                        {day.githubCommit}
                      </code>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
