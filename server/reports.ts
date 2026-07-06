/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RoadmapDay, WeeklyReport, CommitLog, ResumeProject } from '../src/types';

export class ReportsService {
  /**
   * Generates a structural weekly report based on the provided week number (1 to 26)
   */
  public static generateWeeklyReport(roadmap: RoadmapDay[], weekNumber: number): WeeklyReport {
    const sortedRoadmap = [...roadmap].sort((a, b) => a.dayNumber - b.dayNumber);
    
    // Each week covers 7 days. Day numbers: (weekNumber-1)*7 + 1 to weekNumber*7
    const startDay = (weekNumber - 1) * 7 + 1;
    const endDay = weekNumber * 7;
    
    const weekDays = sortedRoadmap.filter(d => d.dayNumber >= startDay && d.dayNumber <= endDay);
    
    const completedDays = weekDays.filter(d => d.status === 'Completed');
    const partialDays = weekDays.filter(d => d.status === 'Partial');
    const missedDays = weekDays.filter(d => d.status === 'Backlog');
    
    const completedTopics = [
      ...completedDays.map(d => `Day ${d.dayNumber}: ${d.topic.split(':').pop()?.trim()}`),
      ...partialDays.map(d => `Day ${d.dayNumber}: ${d.topic.split(':').pop()?.trim()} (Partial)`)
    ];
    
    const missedTopics = missedDays.map(d => `Day ${d.dayNumber}: ${d.topic.split(':').pop()?.trim()}`);
    
    // Consistency calculation: (completed + 0.5 * partial) / total scheduled days for the week
    const consistency = weekDays.length > 0 
      ? Math.round(((completedDays.length + partialDays.length * 0.5) / weekDays.length) * 100) 
      : 0;
      
    // Average study hours (mock estimate based on completed/partial tasks)
    let totalEstimatedHours = 0;
    completedDays.forEach(d => {
      const match = d.estimatedTime.match(/(\d+)/);
      totalEstimatedHours += match ? parseInt(match[1], 10) : 2.5;
    });
    partialDays.forEach(d => {
      const match = d.estimatedTime.match(/(\d+)/);
      totalEstimatedHours += match ? parseInt(match[1], 10) * 0.5 : 1.25;
    });
    
    const avgStudyTime = weekDays.length > 0 ? Number((totalEstimatedHours / weekDays.length).toFixed(1)) : 0;
    
    // Performance Grade
    let performance: 'Excellent' | 'Good' | 'Fair' | 'Critical' = 'Critical';
    if (consistency >= 90) performance = 'Excellent';
    else if (consistency >= 75) performance = 'Good';
    else if (consistency >= 50) performance = 'Fair';
    
    // Tailored Recommendations
    const recommendations: string[] = [];
    if (performance === 'Excellent') {
      recommendations.push('Superb consistency! You are fully on track. Try digging deeper into optional subtopics in the upcoming week.');
      recommendations.push('Maintain your current study rhythm and log your GitHub commits daily to show a strong public portfolio.');
    } else if (performance === 'Good') {
      recommendations.push('Good progress. Try to review the partial topics during your Preferred Revision Day to convert them to Completed.');
      recommendations.push('Set a calendar alert 15 minutes prior to your scheduled study hours to avoid delayed starts.');
    } else if (performance === 'Fair') {
      recommendations.push('You are falling slightly behind the target timeline. Consider blocking off dedicated focus windows with absolute silence.');
      recommendations.push('Reach out to your AI Mentor for a specific micro-drill on topics that caused bottlenecks this week.');
    } else {
      recommendations.push('CRITICAL ACTION REQUIRED: Schedule a full review day. Re-examine your base study targets and adjust study slot alignments.');
      recommendations.push('Focus exclusively on completing backlog items before introducing new complex tools to avoid cognitive overload.');
    }
    
    // Deduce dates from the week days
    const startDate = weekDays.length > 0 ? weekDays[0].targetDate : '';
    const endDate = weekDays.length > 0 ? weekDays[weekDays.length - 1].targetDate : '';
    
    return {
      weekNumber,
      startDate,
      endDate,
      completedTopics,
      missedTopics,
      avgStudyTime,
      consistency,
      performance,
      recommendations
    };
  }

  /**
   * Compiles monthly performance aggregates
   */
  public static compileMonthlyReport(
    roadmap: RoadmapDay[],
    monthNumber: number, // 1 to 6
    commits: CommitLog[],
    resumeProjects: ResumeProject[]
  ) {
    const sortedRoadmap = [...roadmap].sort((a, b) => a.dayNumber - b.dayNumber);
    
    // Each month covers 30 days. Day numbers: (monthNumber-1)*30 + 1 to monthNumber*30
    const startDay = (monthNumber - 1) * 30 + 1;
    const endDay = monthNumber * 30;
    
    const monthDays = sortedRoadmap.filter(d => d.dayNumber >= startDay && d.dayNumber <= endDay);
    const completedDays = monthDays.filter(d => d.status === 'Completed');
    const partialDays = monthDays.filter(d => d.status === 'Partial');
    
    const coveredCount = completedDays.length + partialDays.length;
    
    // Extrapolate module name
    let moduleName = `Month ${monthNumber} Module`;
    if (monthDays.length > 0) {
      moduleName = monthDays[0].module;
    }
    
    // Built projects this month (assume projects matched to active days)
    const projectsBuilt = resumeProjects.filter(p => p.dayCompleted >= startDay && p.dayCompleted <= endDay);
    
    // Core skills learned
    const skillsLearnedSet = new Set<string>();
    completedDays.slice(0, 10).forEach(d => {
      if (d.subtopics && d.subtopics.length > 0) {
        skillsLearnedSet.add(d.subtopics[0]);
        if (d.subtopics[1]) skillsLearnedSet.add(d.subtopics[1]);
      }
    });
    const skillsLearned = Array.from(skillsLearnedSet).slice(0, 8);
    
    // Calculate category-specific interview readiness for this month
    const completionRate = monthDays.length > 0 
      ? Math.round(((completedDays.length + partialDays.length * 0.5) / monthDays.length) * 100)
      : 0;
      
    // Calculate GitHub contributions this month
    const monthCommits = commits.filter(c => c.dayNumber >= startDay && c.dayNumber <= endDay);
    
    return {
      monthNumber,
      moduleName,
      daysTotal: monthDays.length,
      daysCompleted: completedDays.length,
      daysPartial: partialDays.length,
      completionRate,
      skillsLearned,
      projectsBuilt: projectsBuilt.map(p => ({ title: p.title, tech: p.technologies })),
      githubCommitsCount: monthCommits.length,
      interviewReadiness: Math.min(100, Math.round(completionRate * 0.95))
    };
  }
}
