/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  name: string;
  startDate: string;
  studyHoursPerDay: number;
  workingHours: number;
  preferredRevisionDay: string; // e.g., "Sunday", "Saturday"
  isSetup: boolean;
}

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type TaskStatus = 'Pending' | 'Completed' | 'Partial' | 'Backlog';

export interface RoadmapDay {
  dayNumber: number;
  module: string;
  topic: string;
  subtopics: string[];
  estimatedTime: string; // e.g. "2-3 hours"
  practicalLab: string;
  miniAssignment: string;
  revisionTopic: string;
  interviewQuestions: string[];
  githubCommit: string;
  difficulty: DifficultyLevel;
  status: TaskStatus;
  targetDate: string; // ISO String (YYYY-MM-DD)
  completionDate: string | null; // ISO String or null
  rescheduledCount: number;
  delay: number; // in days
  progressPercent?: number; // percentage completed for 'Partial' status
}

export interface CommitLog {
  id: string;
  dayNumber: number;
  repoName: string;
  commitLink: string;
  timestamp: string;
}

export interface ResumeProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  addedToResume: boolean;
  addedDate: string | null;
  dayCompleted: number;
}

export interface WeeklyReport {
  weekNumber: number;
  startDate: string;
  endDate: string;
  completedTopics: string[];
  missedTopics: string[];
  avgStudyTime: number;
  consistency: number; // percentage
  performance: 'Excellent' | 'Good' | 'Fair' | 'Critical';
  recommendations: string[];
}

export interface AnalyticsStats {
  currentStreak: number;
  longestStreak: number;
  totalStudyHours: number;
  averageHours: number;
  skippedDays: number;
  delayedDays: number;
  recoveryDays: number;
  completionPercent: number;
  predictedFinishDate: string;
  timeWasted: number; // hours
  productivityScore: number; // 0-100
}

export interface MentorTip {
  text: string;
  type: 'motivation' | 'warning' | 'tip' | 'congratulations';
  category: string;
  timestamp: string;
}

export interface InterviewReadinessData {
  Linux: number;
  Docker: number;
  AWS: number;
  Jenkins: number;
  Kubernetes: number;
  Terraform: number;
  Monitoring: number;
  overall: number;
  isReady: boolean;
}

export interface DashboardData {
  profile: UserProfile;
  currentDay: number;
  todayTopic: RoadmapDay | null;
  remainingDays: number;
  completionPercent: number;
  currentModule: string;
  targetFinishDate: string;
  expectedFinishDate: string;
  delayDays: number;
  consistencyPercent: number;
  studyHoursCompleted: number;
  analytics: AnalyticsStats;
  interviewReadiness: InterviewReadinessData;
}

