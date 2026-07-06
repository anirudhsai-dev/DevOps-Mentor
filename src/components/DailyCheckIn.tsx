/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, Check, Play, AlertTriangle, Star, CheckSquare, PlusSquare } from 'lucide-react';
import { RoadmapDay, ResumeProject } from '../types';

interface DailyCheckInProps {
  todayTopic: RoadmapDay;
  onCheckInSuccess: () => void;
}

export default function DailyCheckIn({ todayTopic, onCheckInSuccess }: DailyCheckInProps) {
  const [selectedStatus, setSelectedStatus] = useState<'Completed' | 'Partial' | 'No' | null>(null);
  const [partialPercent, setPartialPercent] = useState<number>(50);
  const [checkingIn, setCheckingIn] = useState(false);
  const [success, setSuccess] = useState(false);

  // Resume builder modal state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectData, setProjectData] = useState<ResumeProject | null>(null);

  const handleCheckIn = async () => {
    if (!selectedStatus) return;

    setCheckingIn(true);
    try {
      const response = await fetch('/api/complete-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber: todayTopic.dayNumber,
          status: selectedStatus,
          partialPercent: selectedStatus === 'Partial' ? partialPercent : 0
        })
      });

      if (!response.ok) {
        throw new Error('Failed to record check-in.');
      }

      const data = await response.json();

      if (data.triggerProjectPrompt && data.projectPlaceholder) {
        // Show resume suggestion modal!
        setProjectData(data.projectPlaceholder);
        setShowProjectModal(true);
      } else {
        setSuccess(true);
        setTimeout(() => {
          onCheckInSuccess();
          setSuccess(false);
          setSelectedStatus(null);
        }, 1500);
      }
    } catch (error) {
      console.error('Error logging daily progress:', error);
    } finally {
      setCheckingIn(false);
    }
  };

  const handleSaveProjectToResume = async (addToResume: boolean) => {
    if (!projectData) return;

    try {
      const updatedProject = {
        ...projectData,
        addedToResume: addToResume,
        addedDate: addToResume ? new Date().toISOString().split('T')[0] : null
      };

      const response = await fetch('/api/resume-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject)
      });

      if (!response.ok) {
        throw new Error('Failed to save resume project.');
      }

      setShowProjectModal(false);
      setProjectData(null);
      setSuccess(true);
      setTimeout(() => {
        onCheckInSuccess();
        setSuccess(false);
        setSelectedStatus(null);
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden select-none shadow-xl relative">
      {/* Visual background decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent_60%)] pointer-events-none" />

      {/* Panel Header */}
      <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4 animate-pulse text-emerald-500" />
          Active Check-In Questionnaire
        </h2>
        <span className="font-mono text-[10px] text-zinc-500">Day {todayTopic.dayNumber} Block</span>
      </div>

      {/* Panel Body */}
      <div className="p-5 sm:p-6 space-y-5">
        <div className="space-y-1">
          <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Yesterday's Lesson Target:</p>
          <h3 className="text-base font-bold text-zinc-100 font-sans tracking-tight">
            Day {todayTopic.dayNumber}: {todayTopic.topic.split(':').pop()?.trim()}
          </h3>
          <p className="text-xs font-mono text-emerald-500 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1 rounded inline-block mt-2">
            Target Completion Date: {todayTopic.targetDate}
          </p>
        </div>

        {success ? (
          <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-lg text-emerald-400 font-mono text-xs flex items-center justify-center gap-3 animate-pulse">
            <CheckSquare className="w-5 h-5 text-emerald-500" />
            <span>PROGRESS LOGGED. SMART SCHEDULER UPDATE COMPLETED SUCCESSFULLY.</span>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-mono text-zinc-400">Did you complete all syllabus subtopics, assignments, and commits for this lesson?</p>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option: Yes */}
              <button
                type="button"
                onClick={() => setSelectedStatus('Completed')}
                className={`p-3 border rounded font-mono text-xs font-bold tracking-wide transition-all flex items-center gap-3 cursor-pointer ${
                  selectedStatus === 'Completed'
                    ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-950/20'
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${selectedStatus === 'Completed' ? 'border-emerald-400' : 'border-zinc-700'}`}>
                  {selectedStatus === 'Completed' && <Check className="w-3 h-3 text-emerald-400" />}
                </div>
                <span>1 // YES, FULLY</span>
              </button>

              {/* Option: Partial */}
              <button
                type="button"
                onClick={() => setSelectedStatus('Partial')}
                className={`p-3 border rounded font-mono text-xs font-bold tracking-wide transition-all flex items-center gap-3 cursor-pointer ${
                  selectedStatus === 'Partial'
                    ? 'bg-amber-600/10 border-amber-500 text-amber-400 shadow-md shadow-amber-950/20'
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${selectedStatus === 'Partial' ? 'border-amber-400' : 'border-zinc-700'}`}>
                  {selectedStatus === 'Partial' && <Play className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />}
                </div>
                <span>2 // PARTIALLY</span>
              </button>

              {/* Option: No */}
              <button
                type="button"
                onClick={() => setSelectedStatus('No')}
                className={`p-3 border rounded font-mono text-xs font-bold tracking-wide transition-all flex items-center gap-3 cursor-pointer ${
                  selectedStatus === 'No'
                    ? 'bg-red-600/10 border-red-500 text-red-400 shadow-md shadow-red-950/20'
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${selectedStatus === 'No' ? 'border-red-400' : 'border-zinc-700'}`}>
                  {selectedStatus === 'No' && <AlertTriangle className="w-3 h-3 text-red-400" />}
                </div>
                <span>3 // NO, SKIPPED</span>
              </button>
            </div>

            {/* Partial Slider */}
            {selectedStatus === 'Partial' && (
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Specify Completion Percentage:</span>
                  <span className="text-amber-400 font-bold">{partialPercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="10"
                  value={partialPercent}
                  onChange={(e) => setPartialPercent(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                />
                <p className="text-[10px] font-mono text-zinc-500 leading-normal">
                  * Note: The remaining {100 - partialPercent}% of this topic will be automatically appended to your backlog list for the upcoming Preferred Revision Day slot.
                </p>
              </div>
            )}

            {/* Submit Button */}
            {selectedStatus && (
              <button
                type="button"
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-mono font-bold text-xs py-2.5 rounded transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {checkingIn ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    RECORDING_LOGS...
                  </>
                ) : (
                  'SUBMIT DAILY REPORT'
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Resume Project Recommendation Modal popup */}
      {showProjectModal && projectData && (
        <div className="fixed inset-0 bg-zinc-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl animate-scaleIn">
            <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-2">
                <PlusSquare className="w-4 h-4 text-emerald-500" />
                Resume Tracker Integration
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">Milestone Met!</span>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Milestone Project Completed</span>
                <h4 className="text-lg font-bold text-zinc-100">{projectData.title}</h4>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-400 space-y-2">
                <span className="font-mono text-zinc-500">Project Lab Scope:</span>
                <p className="leading-relaxed text-zinc-300 font-mono">{projectData.description}</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {projectData.technologies.map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-mono rounded">
                    {t}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveProjectToResume(true)}
                  className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-mono font-bold text-xs py-2.5 rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Star className="w-4 h-4 text-zinc-950" />
                  ADD TO RESUME DATABASE
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveProjectToResume(false)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 font-mono text-xs rounded transition-all cursor-pointer"
                >
                  Skip for Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
