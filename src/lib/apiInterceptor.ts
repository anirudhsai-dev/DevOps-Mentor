/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generate180DayRoadmap } from '../../server/roadmap';
import { PlannerService } from '../../server/planner';
import { ReportsService } from '../../server/reports';
import { UserProfile, RoadmapDay, CommitLog, ResumeProject, WeeklyReport, DashboardData } from '../types';

interface DatabaseSchema {
  profile: UserProfile | null;
  roadmap: RoadmapDay[];
  commits: CommitLog[];
  resumeProjects: ResumeProject[];
  weeklyReports: WeeklyReport[];
  lastUpdate: string;
}

const LOCAL_STORAGE_KEY = 'devops_mentor_local_db';

function readLocalDb(): DatabaseSchema {
  const content = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (content) {
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error('Error parsing localStorage DB, resetting.', e);
    }
  }
  const initial: DatabaseSchema = {
    profile: null,
    roadmap: [],
    commits: [],
    resumeProjects: [],
    weeklyReports: [],
    lastUpdate: new Date().toISOString()
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function writeLocalDb(data: Partial<DatabaseSchema>) {
  const current = readLocalDb();
  const updated: DatabaseSchema = {
    profile: data.profile !== undefined ? data.profile : current.profile,
    roadmap: data.roadmap !== undefined ? data.roadmap : current.roadmap,
    commits: data.commits !== undefined ? data.commits : current.commits,
    resumeProjects: data.resumeProjects !== undefined ? data.resumeProjects : current.resumeProjects,
    weeklyReports: data.weeklyReports !== undefined ? data.weeklyReports : current.weeklyReports,
    lastUpdate: new Date().toISOString()
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
}

const originalFetch = window.fetch;

// Promise resolving to whether the local fallback is active
let healthCheckPromise: Promise<boolean> | null = null;
let useLocalFallback = false;

function ensureHealthChecked(): Promise<boolean> {
  const hostname = window.location.hostname;
  const isDevContainer = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.run.app') || hostname.endsWith('.google.com');

  if (!isDevContainer) {
    useLocalFallback = true;
    return Promise.resolve(true);
  }

  if (!healthCheckPromise) {
    healthCheckPromise = (async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        // Direct call via originalFetch to bypass the proxy
        const res = await originalFetch('/api/health', { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (data && data.status === 'ok') {
            useLocalFallback = false;
            console.log('[API Interceptor] Full-Stack server running. Connecting directly.');
            return false;
          }
        }
        useLocalFallback = true;
        console.warn('[API Interceptor] Full-Stack server unreachable. Switching to client-side LocalStorage database.');
        return true;
      } catch (err) {
        useLocalFallback = true;
        console.warn('[API Interceptor] Health check failed. Switched to offline-ready mode.', err);
        return true;
      }
    })();
  }
  return healthCheckPromise;
}

const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const urlStr = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

  // Only intercept API calls
  if (urlStr.includes('/api/')) {
    const isFallback = await ensureHealthChecked();
    if (isFallback) {
      const url = new URL(urlStr, window.location.origin);
      const path = url.pathname;
      const method = (init?.method || 'GET').toUpperCase();

      let bodyObj: any = {};
      if (init && init.body) {
        try {
          if (typeof init.body === 'string') {
            bodyObj = JSON.parse(init.body);
          }
        } catch (e) {
          // Silent catch for non-JSON or other formats
        }
      }

      console.log(`[API Interceptor] [Offline Mode] [${method}] ${path}`, bodyObj);

      // 1. GET /api/health
      if (path === '/api/health') {
        return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString(), mode: 'local' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 2. GET /api/profile
      if (path === '/api/profile') {
        const data = readLocalDb();
        return new Response(JSON.stringify({
          profile: data.profile,
          isSetup: !!data.profile,
          lastUpdate: data.lastUpdate
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 3. POST /api/setup
      if (path === '/api/setup' && method === 'POST') {
        const { name, startDate, studyHoursPerDay, workingHours, preferredRevisionDay } = bodyObj;
        
        if (!name || !startDate || !studyHoursPerDay || !preferredRevisionDay) {
          return new Response(JSON.stringify({ error: 'Missing required setup parameters.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const profile: UserProfile = {
          name,
          startDate,
          studyHoursPerDay: Number(studyHoursPerDay),
          workingHours: Number(workingHours || 8),
          preferredRevisionDay,
          isSetup: true
        };

        const roadmap = generate180DayRoadmap(startDate, preferredRevisionDay);

        writeLocalDb({
          profile,
          roadmap,
          commits: [],
          resumeProjects: [],
          weeklyReports: []
        });

        return new Response(JSON.stringify({ message: 'DevOps Mentor setup completed successfully!', profile }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 4. GET /api/dashboard
      if (path === '/api/dashboard') {
        const data = readLocalDb();
        if (!data.profile) {
          return new Response(JSON.stringify({ error: 'User is not set up yet.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const sortedRoadmap = [...data.roadmap].sort((a, b) => a.dayNumber - b.dayNumber);
        const activeDay = sortedRoadmap.find(d => d.status === 'Pending') || sortedRoadmap[sortedRoadmap.length - 1];
        const currentDayNumber = activeDay ? activeDay.dayNumber : 180;

        const totalEstimatedHours = data.roadmap
          .filter(d => d.status === 'Completed')
          .reduce((sum, d) => {
            const hoursMatch = d.estimatedTime.match(/(\d+)/);
            return sum + (hoursMatch ? parseInt(hoursMatch[1], 10) : 2.5);
          }, 0) + 
          data.roadmap
          .filter(d => d.status === 'Partial')
          .reduce((sum, d) => {
            const hoursMatch = d.estimatedTime.match(/(\d+)/);
            const base = hoursMatch ? parseInt(hoursMatch[1], 10) : 2.5;
            const completion = d.progressPercent || 50;
            return sum + (base * (completion / 100));
          }, 0);

        const studyHoursCompleted = Number(totalEstimatedHours.toFixed(1));

        const analytics = PlannerService.calculateAnalytics(data.roadmap, data.profile, studyHoursCompleted);
        const interviewReadiness = PlannerService.calculateInterviewReadiness(data.roadmap);

        const remainingDays = data.roadmap.filter(d => d.status === 'Pending').length;
        const delayDays = sortedRoadmap.reduce((sum, d) => sum + (d.delay || 0), 0);
        const currentModule = activeDay ? activeDay.module : 'Completed Program';

        const completedCount = data.roadmap.filter(d => d.status === 'Completed').length;
        const partialCount = data.roadmap.filter(d => d.status === 'Partial').length;
        const elapsedCount = data.roadmap.filter(d => d.status !== 'Pending').length;
        const consistencyPercent = elapsedCount > 0 
          ? Math.round(((completedCount + partialCount * 0.5) / elapsedCount) * 100)
          : 100;

        const targetFinish = sortedRoadmap[sortedRoadmap.length - 1]?.targetDate || new Date().toISOString().split('T')[0];
        const expectedFinish = analytics.predictedFinishDate;

        const dashboard: DashboardData = {
          profile: data.profile,
          currentDay: currentDayNumber,
          todayTopic: activeDay || null,
          remainingDays,
          completionPercent: analytics.completionPercent,
          currentModule,
          targetFinishDate: targetFinish,
          expectedFinishDate: expectedFinish,
          delayDays,
          consistencyPercent,
          studyHoursCompleted,
          analytics,
          interviewReadiness
        };

        return new Response(JSON.stringify(dashboard), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 5. POST /api/complete-task
      if (path === '/api/complete-task' && method === 'POST') {
        const { dayNumber, status, partialPercent } = bodyObj;

        if (!dayNumber || !status) {
          return new Response(JSON.stringify({ error: 'Missing dayNumber or status.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const data = readLocalDb();
        if (!data.profile) {
          return new Response(JSON.stringify({ error: 'User is not set up.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const updatedRoadmap = PlannerService.rescheduleTask(
          data.roadmap,
          Number(dayNumber),
          status,
          partialPercent ? Number(partialPercent) : 0
        );

        const completedDay = updatedRoadmap.find(d => d.dayNumber === Number(dayNumber));
        let triggerProjectPrompt = false;
        let projectPlaceholder: ResumeProject | null = null;

        if (status === 'Completed' && completedDay && completedDay.topic.toLowerCase().includes('capstone') || 
           (status === 'Completed' && completedDay && (
             completedDay.topic.toLowerCase().includes('postgresql') || 
             completedDay.topic.toLowerCase().includes('dockerfile') || 
             completedDay.topic.toLowerCase().includes('jenkinsfile') || 
             completedDay.topic.toLowerCase().includes('ingress') || 
             completedDay.topic.toLowerCase().includes('terraform') || 
             completedDay.topic.toLowerCase().includes('prom-stack') ||
             completedDay.topic.toLowerCase().includes('helm chart')
           ))
        ) {
          triggerProjectPrompt = true;
          const cleanTitle = completedDay.topic.split(':').pop()?.trim() || 'DevOps Solution';
          projectPlaceholder = {
            id: `proj_${Date.now()}`,
            title: cleanTitle,
            description: completedDay.practicalLab,
            technologies: completedDay.topic.toLowerCase().includes('terraform') ? ['Terraform', 'AWS'] :
                          completedDay.topic.toLowerCase().includes('docker') ? ['Docker', 'Nginx'] :
                          completedDay.topic.toLowerCase().includes('jenkins') ? ['Jenkins', 'CI/CD'] :
                          completedDay.topic.toLowerCase().includes('kubernetes') ? ['Kubernetes', 'Helm'] : ['Linux', 'Bash'],
            addedToResume: false,
            addedDate: null,
            dayCompleted: completedDay.dayNumber
          };
        }

        writeLocalDb({ roadmap: updatedRoadmap });

        return new Response(JSON.stringify({
          message: 'Daily progress recorded and rescheduled if needed.',
          triggerProjectPrompt,
          projectPlaceholder
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 6. GET /api/roadmap
      if (path === '/api/roadmap') {
        const data = readLocalDb();
        return new Response(JSON.stringify(data.roadmap), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 7. POST /api/github-commit
      if (path === '/api/github-commit' && method === 'POST') {
        const { dayNumber, repoName, commitLink } = bodyObj;

        if (!dayNumber || !repoName || !commitLink) {
          return new Response(JSON.stringify({ error: 'Missing repository name or commit link.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const data = readLocalDb();
        const newCommit: CommitLog = {
          id: `commit_${Date.now()}`,
          dayNumber: Number(dayNumber),
          repoName,
          commitLink,
          timestamp: new Date().toISOString()
        };

        const updatedCommits = [...data.commits, newCommit];
        writeLocalDb({ commits: updatedCommits });

        return new Response(JSON.stringify({ message: 'GitHub commit logged successfully!', commit: newCommit }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 8. GET /api/github-commits
      if (path === '/api/github-commits') {
        const data = readLocalDb();
        return new Response(JSON.stringify(data.commits), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 9. GET /api/resume-projects & POST /api/resume-projects
      if (path === '/api/resume-projects') {
        const data = readLocalDb();
        if (method === 'POST') {
          const project: ResumeProject = bodyObj;
          if (!project.title || !project.description) {
            return new Response(JSON.stringify({ error: 'Missing title or description.' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          const filtered = data.resumeProjects.filter(p => p.id !== project.id);
          const updated = [...filtered, project];

          writeLocalDb({ resumeProjects: updated });
          return new Response(JSON.stringify({ message: 'Resume project saved!', projects: updated }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } else {
          return new Response(JSON.stringify(data.resumeProjects), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // 10. GET /api/mentor-advice
      if (path === '/api/mentor-advice') {
        const data = readLocalDb();
        if (!data.profile) {
          return new Response(JSON.stringify({ error: 'Profile not set up.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const completedCount = data.roadmap.filter(d => d.status === 'Completed').length;
        const partialCount = data.roadmap.filter(d => d.status === 'Partial').length;
        const totalEstimatedHours = data.roadmap
          .filter(d => d.status === 'Completed')
          .reduce((sum, d) => sum + 2.5, 0);

        const sorted = [...data.roadmap].sort((a, b) => a.dayNumber - b.dayNumber);
        let tempStreak = 0;
        let longestStreak = 0;
        for (const d of sorted) {
          if (d.status === 'Completed') {
            tempStreak++;
            if (tempStreak > longestStreak) longestStreak = tempStreak;
          } else {
            tempStreak = 0;
          }
        }

        const stats = {
          currentStreak: tempStreak,
          completionPercent: data.roadmap.length > 0 
            ? Math.round(((completedCount + partialCount * 0.5) / data.roadmap.length) * 100)
            : 0,
          averageHours: data.profile.studyHoursPerDay,
          totalStudyHours: totalEstimatedHours
        };

        const weakDays = data.roadmap.filter(d => d.status === 'Backlog');
        const activeDay = data.roadmap.find(d => d.status === 'Pending') || data.roadmap[data.roadmap.length - 1];
        const activeModule = activeDay ? activeDay.module : 'Completed Program';

        let text = 'The key to transitioning from Production Support to DevOps is moving from manual triage to automation-first thinking. Every manual task you do today should be written as a script tomorrow.';
        let type: 'motivation' | 'warning' | 'tip' | 'congratulations' = 'tip';
        let category = 'DevOps Mindset';

        if (weakDays.length > 0) {
          const firstWeak = weakDays[0];
          text = `I noticed some backlog on "${firstWeak.topic.split(':').pop()?.trim()}". In DevOps, skipping foundations leads to fragile infrastructure. Use your next Preferred Revision day to rebuild the lab for this topic before moving on.`;
          type = 'warning';
          category = 'Revision Support';
        } else if (stats.currentStreak >= 5) {
          text = `Incredible work! A streak of ${stats.currentStreak} days shows outstanding consistency. Consistency is the single most important factor when absorbing complex orchestration topics like Kubernetes and Terraform. Keep it up!`;
          type = 'congratulations';
          category = 'Consistency';
        } else if (activeModule.includes('Linux')) {
          text = 'Mastering the Linux CLI is non-negotiable for DevOps. Ensure you are comfortable with text stream editing using sed, awk, and grep. They are the utilities that power automated log troubleshooting pipelines.';
          category = 'Linux Foundations';
        } else if (activeModule.includes('Docker')) {
          text = 'When working with Docker, prioritize understanding image layer caching. Ordering your Dockerfile commands so that heavy package installations happen early allows the daemon to cache layers and cut compile times in half.';
          category = 'Docker Containers';
        } else if (activeModule.includes('AWS')) {
          text = 'When configuring your AWS VPCs, focus on the routing tables. Ensure your private subnets explicitly route outward traffic through your NAT Gateways, while keeping ingress strictly closed. Security is paramount.';
          category = 'Cloud VPC';
        }

        const advice = {
          text,
          type,
          category,
          timestamp: new Date().toISOString()
        };

        return new Response(JSON.stringify(advice), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 11. GET /api/weekly-report/:week
      if (path.startsWith('/api/weekly-report/')) {
        const weekPart = path.split('/').pop();
        const week = Number(weekPart);
        if (isNaN(week) || week < 1 || week > 26) {
          return new Response(JSON.stringify({ error: 'Invalid week number (must be 1 to 26).' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const data = readLocalDb();
        if (!data.profile) {
          return new Response(JSON.stringify({ error: 'Setup profile first.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const report = ReportsService.generateWeeklyReport(data.roadmap, week);
        return new Response(JSON.stringify(report), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 12. GET /api/monthly-report/:month
      if (path.startsWith('/api/monthly-report/')) {
        const monthPart = path.split('/').pop();
        const month = Number(monthPart);
        if (isNaN(month) || month < 1 || month > 6) {
          return new Response(JSON.stringify({ error: 'Invalid month number (must be 1 to 6).' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const data = readLocalDb();
        if (!data.profile) {
          return new Response(JSON.stringify({ error: 'Setup profile first.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const report = ReportsService.compileMonthlyReport(data.roadmap, month, data.commits, data.resumeProjects);
        return new Response(JSON.stringify(report), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
          });
      }

      // 13. POST /api/reset
      if (path === '/api/reset' && method === 'POST') {
        const freshSchema: DatabaseSchema = {
          profile: null,
          roadmap: [],
          commits: [],
          resumeProjects: [],
          weeklyReports: [],
          lastUpdate: new Date().toISOString()
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(freshSchema));
        return new Response(JSON.stringify({ message: 'DevOps Mentor reset to factory default state.' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }

  return originalFetch(input, init);
};

export function initApiInterceptor() {
  // Start probing health immediately
  ensureHealthChecked();

  try {
    Object.defineProperty(window, 'fetch', {
      value: customFetch,
      writable: true,
      configurable: true,
      enumerable: true
    });
    console.log('[API Interceptor] Successfully initialized window.fetch interception.');
  } catch (e) {
    console.warn('[API Interceptor] Failed to define window.fetch via Object.defineProperty. Falling back to direct assignment.', e);
    try {
      window.fetch = customFetch;
    } catch (err) {
      console.error('[API Interceptor] CRITICAL: Failed to override window.fetch entirely.', err);
    }
  }
}
