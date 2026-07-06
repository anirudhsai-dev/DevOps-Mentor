/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, RefreshCw, AlertTriangle, CheckCircle, Compass, BarChart3, Star, Sparkles } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { WeeklyReport } from '../types';

interface ReportsCenterProps {
  currentDay: number;
}

export default function ReportsCenter({ currentDay }: ReportsCenterProps) {
  // Current active tabs: 'weekly' or 'monthly'
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');
  
  // Weekly selection state
  const currentWeekNum = Math.min(26, Math.max(1, Math.ceil(currentDay / 7)));
  const [selectedWeek, setSelectedWeek] = useState<number>(currentWeekNum);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [loadingWeek, setLoadingWeek] = useState(false);

  // Monthly selection state
  const currentMonthNum = Math.min(6, Math.max(1, Math.ceil(currentDay / 30)));
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonthNum);
  const [monthlyReport, setMonthlyReport] = useState<any | null>(null);
  const [loadingMonth, setLoadingMonth] = useState(false);

  const [pdfGenerating, setPdfGenerating] = useState(false);

  useEffect(() => {
    if (reportType === 'weekly') {
      fetchWeeklyReport(selectedWeek);
    } else {
      fetchMonthlyReport(selectedMonth);
    }
  }, [reportType, selectedWeek, selectedMonth]);

  const fetchWeeklyReport = async (week: number) => {
    setLoadingWeek(true);
    try {
      const response = await fetch(`/api/weekly-report/${week}`);
      if (response.ok) {
        const data = await response.json();
        setWeeklyReport(data);
      }
    } catch (err) {
      console.error('Error loading weekly report:', err);
    } finally {
      setLoadingWeek(false);
    }
  };

  const fetchMonthlyReport = async (month: number) => {
    setLoadingMonth(true);
    try {
      const response = await fetch(`/api/monthly-report/${month}`);
      if (response.ok) {
        const data = await response.json();
        setMonthlyReport(data);
      }
    } catch (err) {
      console.error('Error loading monthly report:', err);
    } finally {
      setLoadingMonth(false);
    }
  };

  const getPerformanceBadge = (grade: string) => {
    switch (grade) {
      case 'Excellent':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Good':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Fair':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  // PDF generation algorithm using jsPDF vector capabilities
  const handleDownloadPDF = async () => {
    if (!weeklyReport && !monthlyReport) return;
    setPdfGenerating(true);

    try {
      // Create a standard A4 portrait PDF document (210mm x 297mm)
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Fetch dynamic profile details to brand the report
      let profileName = 'DevOps Operator';
      let studyHoursTarget = 3;
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const profData = await res.json();
          if (profData.profile) {
            profileName = profData.profile.name;
            studyHoursTarget = profData.profile.studyHoursPerDay;
          }
        }
      } catch (err) {
        console.error(err);
      }

      // 1. Cover Page / Title Block
      doc.setFillColor(18, 18, 18); // Zinc 950 base background
      doc.rect(0, 0, 210, 297, 'F');

      // Top Header Glowing lines
      doc.setDrawColor(16, 185, 129); // Emerald 500
      doc.setLineWidth(1.5);
      doc.line(15, 20, 195, 20);

      doc.setTextColor(244, 244, 245); // Zinc 100 text
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(24);
      doc.text('DEVOPS MENTOR', 15, 35);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(113, 113, 122); // Zinc 500
      doc.text('180-DAY SYLLABUS & TRANSITION PROTOCOL REPORT', 15, 42);

      // Card outline for metadata
      doc.setDrawColor(39, 39, 42); // Zinc 800
      doc.setFillColor(24, 24, 27); // Zinc 900
      doc.rect(15, 50, 180, 45, 'FD');

      doc.setTextColor(244, 244, 245);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('OPERATIONAL METRIC SUMMARY', 25, 60);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(161, 161, 170); // Zinc 400
      doc.text(`Active Operator: ${profileName}`, 25, 70);
      doc.text(`Daily Target Study Time: ${studyHoursTarget} Hours / day`, 25, 76);
      doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 25, 82);

      // Section: Report Body Details
      if (reportType === 'weekly' && weeklyReport) {
        // Render Weekly Section
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(16, 185, 129); // Emerald 400
        doc.text(`WEEKLY REPORT: WEEK ${weeklyReport.weekNumber}`, 15, 110);
        
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(161, 161, 170);
        doc.text(`Calendar Window: ${weeklyReport.startDate} to ${weeklyReport.endDate}`, 15, 116);

        // Grid split stats
        doc.setFillColor(30, 30, 36);
        doc.rect(15, 122, 180, 25, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('Helvetica', 'bold');
        doc.text('Consistency', 25, 132);
        doc.text(`${weeklyReport.consistency}%`, 25, 139);

        doc.text('Avg Study Time', 80, 132);
        doc.text(`${weeklyReport.avgStudyTime} hrs/day`, 80, 139);

        doc.text('Performance Grade', 140, 132);
        doc.text(`${weeklyReport.performance}`, 140, 139);

        // Covered topics
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(244, 244, 245);
        doc.text('Syllabus Completed Lessons:', 15, 160);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(161, 161, 170);
        let startY = 168;
        if (weeklyReport.completedTopics.length === 0) {
          doc.text('No lessons completed during this target slot window.', 20, startY);
          startY += 8;
        } else {
          weeklyReport.completedTopics.forEach(t => {
            doc.text(`[x] ${t}`, 20, startY);
            startY += 7;
          });
        }

        // Backlog/Missed topics
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(239, 68, 68); // Red 500
        doc.text('Syllabus Rescheduled Backlog Items:', 15, startY + 5);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(161, 161, 170);
        startY += 13;
        if (weeklyReport.missedTopics.length === 0) {
          doc.text('Perfect execution! No backlog items generated this week.', 20, startY);
          startY += 7;
        } else {
          weeklyReport.missedTopics.forEach(t => {
            doc.text(`[ ] ${t}`, 20, startY);
            startY += 7;
          });
        }

        // Mentor recommendations
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(16, 185, 129);
        doc.text('Strategic Transition Recommendations:', 15, startY + 5);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(161, 161, 170);
        startY += 13;
        weeklyReport.recommendations.forEach(r => {
          doc.text(`* ${r}`, 20, startY);
          startY += 7;
        });

      } else if (reportType === 'monthly' && monthlyReport) {
        // Render Monthly Section
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(16, 185, 129);
        doc.text(`MONTHLY MILESTONE REPORT: MONTH ${monthlyReport.monthNumber}`, 15, 110);
        
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(161, 161, 170);
        doc.text(`Active Module: ${monthlyReport.moduleName}`, 15, 116);

        // Grid summaries
        doc.setFillColor(24, 24, 27);
        doc.rect(15, 122, 180, 25, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('Helvetica', 'bold');
        doc.text('Completion Rate', 25, 132);
        doc.text(`${monthlyReport.completionRate}%`, 25, 139);

        doc.text('Interview Readiness', 80, 132);
        doc.text(`${monthlyReport.interviewReadiness}%`, 80, 139);

        doc.text('GitHub Commits', 140, 132);
        doc.text(`${monthlyReport.githubCommitsCount} Commits`, 140, 139);

        // Skills learned list
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(244, 244, 245);
        doc.text('Acquired DevOps Technical Proficiencies:', 15, 160);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(161, 161, 170);
        let startY = 168;
        if (monthlyReport.skillsLearned.length === 0) {
          doc.text('Bootstrap active lessons to log core technical competencies.', 20, startY);
          startY += 7;
        } else {
          monthlyReport.skillsLearned.forEach((s: string) => {
            doc.text(`• ${s}`, 20, startY);
            startY += 7;
          });
        }

        // Milestone projects built
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(16, 185, 129);
        doc.text('Milestone Architectural Projects Built:', 15, startY + 5);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(161, 161, 170);
        startY += 13;
        if (monthlyReport.projectsBuilt.length === 0) {
          doc.text('No major projects added to resume this month. complete capstones to unlock logs.', 20, startY);
        } else {
          monthlyReport.projectsBuilt.forEach((p: any) => {
            doc.text(`[x] ${p.title} (${p.tech.join(', ')})`, 20, startY);
            startY += 7;
          });
        }
      }

      // Footer branding sign-off
      doc.setLineWidth(0.5);
      doc.setDrawColor(39, 39, 42);
      doc.line(15, 275, 195, 275);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(113, 113, 122);
      doc.text('CONFIDENTIAL DEVOPS MENTOR TRANSITION METRIC DATABASE // PORT 3000 INGRESS', 15, 282);

      // Save PDF output
      doc.save(`devops-mentor-${reportType}-report-${Date.now()}.pdf`);

    } catch (error) {
      console.error('PDF Generation Failure:', error);
    } finally {
      setPdfGenerating(false);
    }
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Selector tab row header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex gap-2 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          <button
            type="button"
            onClick={() => setReportType('weekly')}
            className={`px-3 py-1.5 rounded font-mono text-xs font-semibold tracking-wide cursor-pointer transition-all ${
              reportType === 'weekly' ? 'bg-zinc-900 text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Weekly Review
          </button>
          <button
            type="button"
            onClick={() => setReportType('monthly')}
            className={`px-3 py-1.5 rounded font-mono text-xs font-semibold tracking-wide cursor-pointer transition-all ${
              reportType === 'monthly' ? 'bg-zinc-900 text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Monthly Portfolio
          </button>
        </div>

        {/* Dynamic PDF Trigger */}
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={pdfGenerating}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-mono font-bold text-xs rounded shadow transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          {pdfGenerating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>COMPILING_PDF_SHEETS...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD_REPORT_PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Main Report viewer container */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl min-h-[400px]">
        
        {reportType === 'weekly' ? (
          <div className="space-y-5 p-5 sm:p-6">
            
            {/* Week navigation selection selector */}
            <div className="flex items-center gap-3 font-mono text-xs bg-zinc-950 p-3 rounded-lg border border-zinc-800 h-fit w-fit">
              <span className="text-zinc-500 uppercase font-bold">Choose Week Block:</span>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer"
              >
                {Array.from({ length: 26 }).map((_, idx) => (
                  <option key={idx + 1} value={idx + 1}>Week {idx + 1}</option>
                ))}
              </select>
            </div>

            {loadingWeek ? (
              <div className="flex flex-col items-center justify-center p-20 space-y-3 font-mono text-xs text-zinc-500">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
                <span>RETRIEVING_WEEKLY_DIAGNOSTICS_DATA...</span>
              </div>
            ) : weeklyReport ? (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Meta summary card */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Performance indicator card */}
                  <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-lg space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Performance Rating</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${getPerformanceBadge(weeklyReport.performance)}`}>
                        {weeklyReport.performance.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Consistency card */}
                  <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-lg space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Target Consistency</span>
                    <div className="text-lg font-bold font-mono text-zinc-100 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-emerald-500" />
                      {weeklyReport.consistency}%
                    </div>
                  </div>

                  {/* Average study time card */}
                  <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-lg space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Avg Daily Study</span>
                    <div className="text-lg font-bold font-mono text-zinc-100 flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-emerald-500" />
                      {weeklyReport.avgStudyTime} hrs
                    </div>
                  </div>

                  {/* Dates window card */}
                  <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-lg space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Calendar Window</span>
                    <div className="text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      {weeklyReport.startDate || 'TBD'} - {weeklyReport.endDate || 'TBD'}
                    </div>
                  </div>
                </div>

                {/* Grid Split Completed vs Missed */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Completed lessons */}
                  <div className="bg-zinc-950/60 p-5 rounded-xl border border-zinc-850 space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-2">
                      <CheckCircle className="w-4.5 h-4.5 text-emerald-500" /> Completed Topics List:
                    </h4>
                    
                    {weeklyReport.completedTopics.length === 0 ? (
                      <p className="text-xs font-mono text-zinc-600 italic">No syllabus topics completed during this weekly interval window.</p>
                    ) : (
                      <ul className="space-y-2 font-mono text-xs text-zinc-350">
                        {weeklyReport.completedTopics.map((topic, index) => (
                          <li key={index} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-emerald-500 font-bold shrink-0">[x]</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Missed lessons/Rescheduled backlog */}
                  <div className="bg-zinc-950/60 p-5 rounded-xl border border-zinc-850 space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase text-red-400 tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-4.5 h-4.5 text-red-500 animate-pulse" /> Rescheduled Backlog Items:
                    </h4>

                    {weeklyReport.missedTopics.length === 0 ? (
                      <p className="text-xs font-mono text-emerald-500 bg-emerald-500/5 px-2.5 py-1.5 rounded border border-emerald-500/10">Perfect Execution! Zero rescheduled topics created this week.</p>
                    ) : (
                      <ul className="space-y-2 font-mono text-xs text-zinc-350">
                        {weeklyReport.missedTopics.map((topic, index) => (
                          <li key={index} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-red-500 font-bold shrink-0">[ ]</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-zinc-950/80 p-5 rounded-xl border border-zinc-850 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.02),transparent_60%)] pointer-events-none" />
                  
                  <h4 className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-emerald-500" /> Dynamic Transition Recommendations:
                  </h4>
                  <ul className="space-y-2 font-mono text-xs text-zinc-300">
                    {weeklyReport.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-500 font-semibold mt-1 shrink-0">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-zinc-600 font-mono text-xs">
                WEEKLY_REPORT_UNAVAILABLE_OR_LOCKED
              </div>
            )}

          </div>
        ) : (
          <div className="space-y-5 p-5 sm:p-6 animate-fadeIn">
            
            {/* Month selection selector */}
            <div className="flex items-center gap-3 font-mono text-xs bg-zinc-950 p-3 rounded-lg border border-zinc-800 h-fit w-fit">
              <span className="text-zinc-500 uppercase font-bold">Choose Month Block:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value="1">Month 1: Linux, Networking & Git</option>
                <option value="2">Month 2: Docker & Compose</option>
                <option value="3">Month 3: AWS Cloud Infra</option>
                <option value="4">Month 4: CI/CD Pipelines</option>
                <option value="5">Month 5: Kubernetes & Helm</option>
                <option value="6">Month 6: IaC & Monitoring</option>
              </select>
            </div>

            {loadingMonth ? (
              <div className="flex flex-col items-center justify-center p-20 space-y-3 font-mono text-xs text-zinc-500">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
                <span>RETRIEVING_MONTHLY_DIAGNOSTICS_DATA...</span>
              </div>
            ) : monthlyReport ? (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Meta block */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-lg space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Completion Rate</span>
                    <div className="text-lg font-bold font-mono text-emerald-400">
                      {monthlyReport.completionRate}%
                    </div>
                  </div>

                  <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-lg space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Interview Readiness</span>
                    <div className="text-lg font-bold font-mono text-emerald-400">
                      {monthlyReport.interviewReadiness}%
                    </div>
                  </div>

                  <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-lg space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">GitHub Commits</span>
                    <div className="text-lg font-bold font-mono text-zinc-100">
                      {monthlyReport.githubCommitsCount} Commits
                    </div>
                  </div>

                  <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-lg space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Active Modules</span>
                    <div className="text-[10px] font-mono text-zinc-400 truncate font-semibold" title={monthlyReport.moduleName}>
                      {monthlyReport.moduleName}
                    </div>
                  </div>
                </div>

                {/* Split lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Proficiencies learned */}
                  <div className="bg-zinc-950/60 p-5 rounded-xl border border-zinc-850 space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-2">
                      <Star className="w-4.5 h-4.5 text-emerald-500" /> Acquired Technical Proficiencies:
                    </h4>

                    {monthlyReport.skillsLearned.length === 0 ? (
                      <p className="text-xs font-mono text-zinc-650 italic">Log completed days to unlock listed technical proficiencies.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {monthlyReport.skillsLearned.map((s: string, idx: number) => (
                          <span key={idx} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Portfolio Projects built */}
                  <div className="bg-zinc-950/60 p-5 rounded-xl border border-zinc-850 space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-2">
                      <Compass className="w-4.5 h-4.5 text-emerald-500" /> Milestone Portfolio Projects Built:
                    </h4>

                    {monthlyReport.projectsBuilt.length === 0 ? (
                      <p className="text-xs font-mono text-zinc-650 italic leading-relaxed">No major capstone projects added to resume this month. complete syllabus milestones to unlock resume project cards.</p>
                    ) : (
                      <ul className="space-y-2 font-mono text-xs text-zinc-350">
                        {monthlyReport.projectsBuilt.map((p: any, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-emerald-500 font-bold shrink-0">[x]</span>
                            <span>{p.title} <strong className="text-zinc-500">({p.tech.join(', ')})</strong></span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-zinc-600 font-mono text-xs">
                MONTHLY_REPORT_UNAVAILABLE_OR_LOCKED
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
