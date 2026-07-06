/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import SetupScreen from './components/SetupScreen';
import Header from './components/Header';
import DailyCheckIn from './components/DailyCheckIn';
import DashboardStats from './components/DashboardStats';
import RoadmapTimeline from './components/RoadmapTimeline';
import AnalyticsPanel from './components/AnalyticsPanel';
import InterviewReadiness from './components/InterviewReadiness';
import GitHubTracker from './components/GitHubTracker';
import ResumeBuilder from './components/ResumeBuilder';
import AIMentorView from './components/AIMentorView';
import ReportsCenter from './components/ReportsCenter';
import { DashboardData, RoadmapDay } from './types';
import { RefreshCw, Terminal, Cpu, Sparkles } from 'lucide-react';

export default function App() {
  const [isSetup, setIsSetup] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSetupState();
  }, []);

  const checkSetupState = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setIsSetup(data.isSetup);
        if (data.isSetup) {
          await fetchAllData();
        }
      }
    } catch (error) {
      console.error('Error checking setup state:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const [dashRes, roadRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/roadmap')
      ]);

      if (dashRes.ok && roadRes.ok) {
        const dashData = await dashRes.json();
        const roadData = await roadRes.json();
        setDashboardData(dashData);
        setRoadmap(roadData);
      }
    } catch (err) {
      console.error('Failed to load application data:', err);
    }
  };

  const handleSetupComplete = async () => {
    setIsSetup(true);
    setLoading(true);
    await fetchAllData();
    setLoading(false);
  };

  const handleReset = async () => {
    const confirmReset = window.confirm('Are you absolutely sure you want to trigger a factory reset? This will erase all logged commits, completed topics, streaks, and resume projects.');
    if (!confirmReset) return;

    try {
      const response = await fetch('/api/reset', { method: 'POST' });
      if (response.ok) {
        setIsSetup(false);
        setDashboardData(null);
        setRoadmap([]);
        setActiveTab('dashboard');
      }
    } catch (err) {
      console.error('Error resetting application:', err);
    }
  };

  if (loading || isSetup === null) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center font-mono text-xs gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
        <span>BOOTING_DEVOPS_MENTOR_SHELL...</span>
      </div>
    );
  }

  if (!isSetup) {
    return <SetupScreen onSetupComplete={handleSetupComplete} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30">
      
      {/* Background Matrix-like abstract grid aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(63,63,70,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(63,63,70,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Main system header */}
      <Header
        operatorName={dashboardData?.profile?.name || 'DevOps Engineer'}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={handleReset}
      />

      {/* Main Container Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        
        {/* Render tabbed layouts */}
        {activeTab === 'dashboard' && dashboardData && (
          <div className="space-y-6">
            
            {/* Top row split: check-in slider + fast statistics overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Daily questionnaire check-in */}
              {dashboardData.todayTopic && (
                <div className="lg:col-span-1">
                  <DailyCheckIn
                    todayTopic={dashboardData.todayTopic}
                    onCheckInSuccess={fetchAllData}
                  />
                </div>
              )}

              {/* Today Active Lesson detail box */}
              <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-5 rounded-xl shadow-lg relative flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.02),transparent_60%)] pointer-events-none" />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
                    <h3 className="text-xs font-mono font-bold uppercase text-emerald-400">ACTIVE LESSON BLOCK</h3>
                  </div>

                  {dashboardData.todayTopic ? (
                    <div className="space-y-3.5">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">{dashboardData.todayTopic.module}</span>
                        <h4 className="text-lg font-bold text-zinc-100 tracking-tight mt-0.5">
                          {dashboardData.todayTopic.topic.split(':').pop()?.trim()}
                        </h4>
                      </div>

                      <div className="p-3.5 bg-zinc-950 border border-zinc-850 rounded-lg text-xs leading-relaxed space-y-1.5 font-mono text-zinc-300">
                        <span className="text-[10px] text-emerald-500 font-bold uppercase block">Today's Lab Objective:</span>
                        <p>{dashboardData.todayTopic.practicalLab}</p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {dashboardData.todayTopic.subtopics.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-zinc-950 border border-zinc-850 text-[10px] font-mono rounded text-zinc-400">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 font-mono">CONGRATULATIONS! ALL ROADMAP DAYS COMPLETED SUCCESSFULLY.</p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 pt-4 mt-4 border-t border-zinc-800/60">
                  <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                  <span>TARGET SCHEDULER: {dashboardData.todayTopic?.targetDate || 'COMPLETE'}</span>
                </div>
              </div>

            </div>

            {/* General metrics widgets */}
            <DashboardStats data={dashboardData} roadmap={roadmap} />

            {/* Split bottom row: Interview Readiness index + quick motivation advisor snippet */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Readiness summary */}
              <div className="md:col-span-2">
                <InterviewReadiness scores={dashboardData.interviewReadiness} />
              </div>

              {/* Mini advisory block */}
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.02),transparent_60%)] pointer-events-none" />
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <h3 className="text-xs font-mono font-bold uppercase text-zinc-400">AI Mentor Tip</h3>
                  </div>

                  <p className="text-xs text-zinc-300 italic leading-relaxed font-sans">
                    "Transitioning from Production Support into DevOps is about swapping manual intervention for reproducible script layouts. Every time you log on to resolve a server alert manually this week, challenge yourself: can I deploy an automated cron or systemd daemon to handle this check instead?"
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('mentor')}
                  className="w-full mt-6 bg-zinc-950 border border-zinc-850 hover:border-zinc-750 text-zinc-400 hover:text-zinc-200 py-2 rounded text-xs font-mono font-bold tracking-wide cursor-pointer transition-all flex items-center justify-center gap-1"
                >
                  <span>$ enter_mentor_lounge.sh</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {activeTab === 'roadmap' && (
          <RoadmapTimeline roadmap={roadmap} />
        )}

        {activeTab === 'analytics' && dashboardData && (
          <AnalyticsPanel stats={dashboardData.analytics} />
        )}

        {activeTab === 'reports' && (
          <ReportsCenter currentDay={dashboardData?.currentDay || 1} />
        )}

        {activeTab === 'trackers' && dashboardData && (
          <div className="space-y-6">
            <GitHubTracker
              currentDay={dashboardData.currentDay}
              onCommitLogged={fetchAllData}
            />
            <div className="border-t border-zinc-800 pt-6">
              <ResumeBuilder />
            </div>
          </div>
        )}

        {activeTab === 'mentor' && (
          <AIMentorView />
        )}

      </main>

      {/* Persistent global console footer logs */}
      <footer className="bg-zinc-900 border-t border-zinc-850 py-3.5 select-none relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span>SHELL_STREAM: CONNECTED // INGRESS_ROUTING_HEALTHY</span>
          </div>
          <div>
            <span>DEV_OPS_MENTOR_SUITE // PORT_3000_STANDBY</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
