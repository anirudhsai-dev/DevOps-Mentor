/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RoadmapDay, AnalyticsStats, UserProfile, ResumeProject, InterviewReadinessData } from '../src/types';

export class PlannerService {
  /**
   * Calculates dashboard statistics and metrics based on current roadmap state
   */
  public static calculateAnalytics(
    roadmap: RoadmapDay[],
    profile: UserProfile,
    studyHoursCompleted: number
  ): AnalyticsStats {
    const todayStr = new Date().toISOString().split('T')[0];

    // Filter days up to today
    const elapsedDays = roadmap.filter(day => day.targetDate <= todayStr || day.status !== 'Pending');
    const totalDays = roadmap.length;
    const completedDays = roadmap.filter(day => day.status === 'Completed').length;
    const partialDays = roadmap.filter(day => day.status === 'Partial').length;

    // Completion percentage
    const completionPercent = totalDays > 0 ? Math.round(((completedDays + partialDays * 0.5) / totalDays) * 100) : 0;

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // To compute streak, sort roadmap by day number
    const sortedRoadmap = [...roadmap].sort((a, b) => a.dayNumber - b.dayNumber);

    for (const day of sortedRoadmap) {
      if (day.status === 'Completed') {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }

    // Current streak (looking backwards from yesterday or today)
    // Find the current active day index
    let activeDayIndex = sortedRoadmap.findIndex(day => day.targetDate === todayStr);
    if (activeDayIndex === -1) {
      // Find the first pending day
      activeDayIndex = sortedRoadmap.findIndex(day => day.status === 'Pending');
    }
    if (activeDayIndex === -1) activeDayIndex = sortedRoadmap.length - 1;

    let streakCursor = activeDayIndex;
    while (streakCursor >= 0) {
      const day = sortedRoadmap[streakCursor];
      // If day is in future and pending, ignore
      if (day.targetDate > todayStr && day.status === 'Pending') {
        streakCursor--;
        continue;
      }
      if (day.status === 'Completed') {
        currentStreak++;
      } else if (day.status === 'Pending' && day.targetDate === todayStr) {
        // Today is pending, streak could still be alive from yesterday
      } else {
        // Streak broken
        break;
      }
      streakCursor--;
    }

    // Delayed days
    const delayedDays = roadmap.filter(day => day.delay > 0).length;

    // Skipped/No days
    const skippedDays = roadmap.filter(day => day.status === 'Backlog').length;

    // Average study hours
    const daysWithHours = elapsedDays.filter(day => day.status === 'Completed' || day.status === 'Partial').length;
    const averageHours = daysWithHours > 0 ? Number((studyHoursCompleted / daysWithHours).toFixed(1)) : 0;

    // Predicted finish date (target date of the last day in roadmap)
    const lastDay = sortedRoadmap[sortedRoadmap.length - 1];
    const predictedFinishDate = lastDay ? lastDay.targetDate : todayStr;

    // Time wasted (based on estimated study hours of missed/skipped tasks)
    let timeWasted = 0;
    roadmap.forEach(day => {
      if (day.status === 'Backlog') {
        const match = day.estimatedTime.match(/(\d+)/);
        if (match) {
          timeWasted += parseInt(match[1], 10);
        } else {
          timeWasted += 2; // Default 2 hours wasted for skipped day
        }
      }
    });

    // Recovery days (days where backlog item was completed)
    const recoveryDays = roadmap.filter(day => day.status === 'Completed' && day.rescheduledCount > 0).length;

    // Productivity Score (formula based on completion, consistency, and study hours)
    const baseConsistency = elapsedDays.length > 0 
      ? Math.round(((completedDays + partialDays * 0.5) / elapsedDays.length) * 100) 
      : 100;
    const productivityScore = Math.min(
      100,
      Math.max(0, Math.round(baseConsistency * 0.8 + (averageHours / (profile.studyHoursPerDay || 1)) * 20))
    );

    return {
      currentStreak,
      longestStreak,
      totalStudyHours: studyHoursCompleted,
      averageHours,
      skippedDays,
      delayedDays,
      recoveryDays,
      completionPercent,
      predictedFinishDate,
      timeWasted,
      productivityScore
    };
  }

  /**
   * Calculates overall and specific topic interview readiness percentage
   */
  public static calculateInterviewReadiness(roadmap: RoadmapDay[]): InterviewReadinessData {
    const categories = {
      'Linux': ['Linux'],
      'Docker': ['Docker'],
      'AWS': ['AWS', 'IAM', 'EC2', 'VPC', 'S3', 'CloudWatch'],
      'Jenkins': ['Jenkins', 'GitHub Actions', 'CI/CD'],
      'Kubernetes': ['Kubernetes', 'Helm'],
      'Terraform': ['Terraform'],
      'Monitoring': ['Prometheus', 'Grafana', 'Monitoring', 'Logging']
    };

    const scores: Record<string, number> = {};
    let overallSum = 0;
    let categoryCount = 0;

    for (const [key, keywords] of Object.entries(categories)) {
      // Find all days corresponding to this category
      const catDays = roadmap.filter(day => {
        const topicLower = day.topic.toLowerCase();
        const moduleLower = day.module.toLowerCase();
        return keywords.some(kw => topicLower.includes(kw.toLowerCase()) || moduleLower.includes(kw.toLowerCase()));
      });

      if (catDays.length === 0) {
        scores[key] = 0;
        continue;
      }

      const completed = catDays.filter(day => day.status === 'Completed').length;
      const partial = catDays.filter(day => day.status === 'Partial').length;

      const percent = Math.round(((completed + partial * 0.5) / catDays.length) * 100);
      scores[key] = percent;
      overallSum += percent;
      categoryCount++;
    }

    const overall = categoryCount > 0 ? Math.round(overallSum / categoryCount) : 0;
    const isReady = overall >= 80; // Standard 80% to be considered interview-ready

    return {
      Linux: scores['Linux'] || 0,
      Docker: scores['Docker'] || 0,
      AWS: scores['AWS'] || 0,
      Jenkins: scores['Jenkins'] || 0,
      Kubernetes: scores['Kubernetes'] || 0,
      Terraform: scores['Terraform'] || 0,
      Monitoring: scores['Monitoring'] || 0,
      overall,
      isReady
    };
  }

  /**
   * Reschedules unfinished tasks.
   * If a task is missed (Partial or No), we move the remaining roadmap out, or place it in the next available revision slot.
   */
  public static rescheduleTask(
    roadmap: RoadmapDay[],
    dayNumber: number,
    status: 'Completed' | 'Partial' | 'No',
    partialPercent: number = 0
  ): RoadmapDay[] {
    const updatedRoadmap = [...roadmap];
    const targetDayIndex = updatedRoadmap.findIndex(d => d.dayNumber === dayNumber);
    if (targetDayIndex === -1) return updatedRoadmap;

    const day = updatedRoadmap[targetDayIndex];

    if (status === 'Completed') {
      day.status = 'Completed';
      day.completionDate = new Date().toISOString().split('T')[0];
      return updatedRoadmap;
    }

    // If Partial or No
    if (status === 'Partial') {
      day.status = 'Partial';
      day.progressPercent = partialPercent;
      day.completionDate = new Date().toISOString().split('T')[0];
    } else {
      day.status = 'Backlog';
      day.completionDate = null;
    }

    // Increment reschedule count
    day.rescheduledCount += 1;

    // Find the next available revision slot
    // A revision slot is a day that contains "Weekly Review" or "Revision" in the topic and is status "Pending"
    const nextRevisionIndex = updatedRoadmap.findIndex(
      (d, idx) => idx > targetDayIndex && d.status === 'Pending' && (d.topic.includes('Weekly Review') || d.topic.includes('Revision'))
    );

    if (nextRevisionIndex !== -1) {
      // Add the unfinished item to the subtopics list of that revision day!
      const revisionDay = updatedRoadmap[nextRevisionIndex];
      const backlogTopicRef = `Backlog: Day ${day.dayNumber} - ${day.topic.split(':').pop()?.trim()} (${status === 'Partial' ? 'Partial ' + partialPercent + '%' : 'Not Started'})`;
      
      if (!revisionDay.subtopics.includes(backlogTopicRef)) {
        revisionDay.subtopics.push(backlogTopicRef);
      }
    }

    // Smart shift rule: Since the task is incomplete, we shift target dates of ALL subsequent pending standard tasks out by 1 day!
    // This correctly recalculates target dates and tracks the real delay.
    let shiftDays = 1;
    for (let i = targetDayIndex; i < updatedRoadmap.length; i++) {
      const nextDay = updatedRoadmap[i];
      if (nextDay.status === 'Pending' || i === targetDayIndex) {
        // Adjust delay metrics
        if (i > targetDayIndex) {
          nextDay.delay += shiftDays;
        } else {
          day.delay += shiftDays;
        }

        // Shift target date
        const originalDate = new Date(nextDay.targetDate);
        originalDate.setDate(originalDate.getDate() + shiftDays);
        nextDay.targetDate = originalDate.toISOString().split('T')[0];
      }
    }

    return updatedRoadmap;
  }
}
