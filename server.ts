/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { DatabaseManager } from './server/database';
import { generate180DayRoadmap } from './server/roadmap';
import { PlannerService } from './server/planner';
import { MentorService } from './server/mentor';
import { ReportsService } from './server/reports';
import { UserProfile, RoadmapDay, CommitLog, ResumeProject, DashboardData } from './src/types';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

export function createExpressApp() {
  const app = express();
  const db = DatabaseManager.getInstance();

  app.use(express.json());

  // Middleware: Authenticate requests using a Bearer token containing the username
  const authenticate = (req: Request, res: Response, next: () => void) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Missing or invalid authentication token.' });
      return;
    }
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    if (!token.startsWith('token_')) {
      res.status(401).json({ error: 'Unauthorized: Invalid token format.' });
      return;
    }
    const username = token.substring(6); // Remove "token_" prefix
    (req as any).username = username;
    next();
  };

  // API: Health Check (Unauthenticated)
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API: User Registration (Unauthenticated)
  app.post('/api/register', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required.' });
        return;
      }

      const registered = await db.registerUser(username, password);
      if (registered) {
        res.json({ message: 'User registered successfully!' });
      } else {
        res.status(400).json({ error: 'Username already exists.' });
      }
    } catch (error) {
      console.error('Error during user registration:', error);
      res.status(500).json({ error: 'Internal server error during registration.' });
    }
  });

  // API: User Login (Unauthenticated)
  app.post('/api/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required.' });
        return;
      }

      const authenticated = await db.authenticateUser(username, password);
      if (authenticated) {
        const cleanUsername = username.trim().toLowerCase();
        res.json({ 
          token: `token_${cleanUsername}`, 
          username: cleanUsername 
        });
      } else {
        res.status(401).json({ error: 'Invalid username or password.' });
      }
    } catch (error) {
      console.error('Error during user login:', error);
      res.status(500).json({ error: 'Internal server error during login.' });
    }
  });

  // API: Get Profile & Setup state
  app.get('/api/profile', authenticate, async (req: Request, res: Response) => {
    const username = (req as any).username;
    const data = await db.readUser(username);
    res.json({
      profile: data.profile,
      isSetup: !!data.profile,
      lastUpdate: data.lastUpdate
    });
  });

  // API: Initial Setup (Name, Start Date, Hours, Revision Day)
  app.post('/api/setup', authenticate, async (req: Request, res: Response) => {
    try {
      const username = (req as any).username;
      const { name, startDate, studyHoursPerDay, workingHours, preferredRevisionDay } = req.body;

      if (!name || !startDate || !studyHoursPerDay || !preferredRevisionDay) {
        res.status(400).json({ error: 'Missing required setup parameters.' });
        return;
      }

      const profile: UserProfile = {
        name,
        startDate,
        studyHoursPerDay: Number(studyHoursPerDay),
        workingHours: Number(workingHours || 8),
        preferredRevisionDay,
        isSetup: true
      };

      // Generate the complete 180-day roadmap automatically
      const roadmap = generate180DayRoadmap(startDate, preferredRevisionDay);

      // Save to database
      await db.writeUser(username, {
        profile,
        roadmap,
        commits: [],
        resumeProjects: [],
        weeklyReports: []
      });

      res.json({ message: 'DevOps Mentor setup completed successfully!', profile });
    } catch (error) {
      console.error('Error during setup:', error);
      res.status(500).json({ error: 'Internal server error during setup orchestration.' });
    }
  });

  // API: Get Dashboard Metrics
  app.get('/api/dashboard', authenticate, async (req: Request, res: Response) => {
    try {
      const username = (req as any).username;
      const data = await db.readUser(username);
      if (!data.profile) {
        res.status(400).json({ error: 'User is not set up yet.' });
        return;
      }

      const sortedRoadmap = [...data.roadmap].sort((a, b) => a.dayNumber - b.dayNumber);
      
      // The current day is the first day that has status === 'Pending'
      // If none, they completed the roadmap!
      const activeDay = sortedRoadmap.find(d => d.status === 'Pending') || sortedRoadmap[sortedRoadmap.length - 1];
      const currentDayNumber = activeDay ? activeDay.dayNumber : 180;

      // Calculate elapsed statistics
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

      // Deduce remaining days
      const remainingDays = data.roadmap.filter(d => d.status === 'Pending').length;

      // Calculate total delay days
      const delayDays = sortedRoadmap.reduce((sum, d) => sum + (d.delay || 0), 0);

      // Current module name
      const currentModule = activeDay ? activeDay.module : 'Completed Program';

      // Calculated consistency
      const completedCount = data.roadmap.filter(d => d.status === 'Completed').length;
      const partialCount = data.roadmap.filter(d => d.status === 'Partial').length;
      const elapsedCount = data.roadmap.filter(d => d.status !== 'Pending').length;
      const consistencyPercent = elapsedCount > 0 
        ? Math.round(((completedCount + partialCount * 0.5) / elapsedCount) * 100)
        : 100;

      // Dates tracking
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

      res.json(dashboard);
    } catch (error) {
      console.error('Error fetching dashboard details:', error);
      res.status(500).json({ error: 'Internal server error compiles dashboard stats.' });
    }
  });

  // API: Update daily progress (yesterday's status check-in)
  app.post('/api/complete-task', authenticate, async (req: Request, res: Response) => {
    try {
      const username = (req as any).username;
      const { dayNumber, status, partialPercent } = req.body;

      if (!dayNumber || !status) {
        res.status(400).json({ error: 'Missing dayNumber or status.' });
        return;
      }

      const data = await db.readUser(username);
      if (!data.profile) {
        res.status(400).json({ error: 'User is not set up.' });
        return;
      }

      const updatedRoadmap = PlannerService.rescheduleTask(
        data.roadmap,
        Number(dayNumber),
        status,
        partialPercent ? Number(partialPercent) : 0
      );

      // Check if project added prompt is applicable on complete
      const completedDay = updatedRoadmap.find(d => d.dayNumber === Number(dayNumber));
      let triggerProjectPrompt = false;
      let projectPlaceholder: ResumeProject | null = null;

      // If they completed a major lab, suggest adding to resume
      if (status === 'Completed' && completedDay && (
          completedDay.topic.toLowerCase().includes('capstone') || 
          completedDay.topic.toLowerCase().includes('postgresql') || 
          completedDay.topic.toLowerCase().includes('dockerfile') || 
          completedDay.topic.toLowerCase().includes('jenkinsfile') || 
          completedDay.topic.toLowerCase().includes('ingress') || 
          completedDay.topic.toLowerCase().includes('terraform') || 
          completedDay.topic.toLowerCase().includes('prom-stack') ||
          completedDay.topic.toLowerCase().includes('helm chart')
         )
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

      await db.writeUser(username, { roadmap: updatedRoadmap });

      res.json({
        message: 'Daily progress recorded and rescheduled if needed.',
        triggerProjectPrompt,
        projectPlaceholder
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).json({ error: 'Internal server error logging check-in.' });
    }
  });

  // API: Get full roadmap
  app.get('/api/roadmap', authenticate, async (req: Request, res: Response) => {
    const username = (req as any).username;
    const data = await db.readUser(username);
    res.json(data.roadmap);
  });

  // API: Post GitHub commit history
  app.post('/api/github-commit', authenticate, async (req: Request, res: Response) => {
    try {
      const username = (req as any).username;
      const { dayNumber, repoName, commitLink } = req.body;

      if (!dayNumber || !repoName || !commitLink) {
        res.status(400).json({ error: 'Missing repository name or commit link.' });
        return;
      }

      const data = await db.readUser(username);
      const newCommit: CommitLog = {
        id: `commit_${Date.now()}`,
        dayNumber: Number(dayNumber),
        repoName,
        commitLink,
        timestamp: new Date().toISOString()
      };

      const updatedCommits = [...data.commits, newCommit];
      await db.writeUser(username, { commits: updatedCommits });

      res.json({ message: 'GitHub commit logged successfully!', commit: newCommit });
    } catch (error) {
      console.error('Error logging github commit:', error);
      res.status(500).json({ error: 'Server error saving commit.' });
    }
  });

  // API: Get GitHub logs
  app.get('/api/github-commits', authenticate, async (req: Request, res: Response) => {
    const username = (req as any).username;
    const data = await db.readUser(username);
    res.json(data.commits);
  });

  // API: Get Resume Projects
  app.get('/api/resume-projects', authenticate, async (req: Request, res: Response) => {
    const username = (req as any).username;
    const data = await db.readUser(username);
    res.json(data.resumeProjects);
  });

  // API: Save Resume Project
  app.post('/api/resume-projects', authenticate, async (req: Request, res: Response) => {
    try {
      const username = (req as any).username;
      const project: ResumeProject = req.body;
      if (!project.title || !project.description) {
        res.status(400).json({ error: 'Missing title or description.' });
        return;
      }

      const data = await db.readUser(username);
      // Remove if duplicate ID, then add
      const filtered = data.resumeProjects.filter(p => p.id !== project.id);
      const updated = [...filtered, project];

      await db.writeUser(username, { resumeProjects: updated });
      res.json({ message: 'Resume project saved!', projects: updated });
    } catch (error) {
      console.error('Error saving resume project:', error);
      res.status(500).json({ error: 'Server error saving project.' });
    }
  });

  // API: Trigger AI Mentor Custom Advice
  app.get('/api/mentor-advice', authenticate, async (req: Request, res: Response) => {
    try {
      const username = (req as any).username;
      const data = await db.readUser(username);
      if (!data.profile) {
        res.status(400).json({ error: 'Profile not set up.' });
        return;
      }

      const completedCount = data.roadmap.filter(d => d.status === 'Completed').length;
      const partialCount = data.roadmap.filter(d => d.status === 'Partial').length;
      const totalEstimatedHours = data.roadmap
        .filter(d => d.status === 'Completed')
        .reduce((sum, d) => sum + 2.5, 0);

      const stats = {
        currentStreak: 0,
        completionPercent: data.roadmap.length > 0 
          ? Math.round(((completedCount + partialCount * 0.5) / data.roadmap.length) * 100)
          : 0,
        averageHours: data.profile.studyHoursPerDay,
        totalStudyHours: totalEstimatedHours
      };

      // Recalculate streak
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
      stats.currentStreak = tempStreak;

      const advice = await MentorService.generateAdvice(data.profile, data.roadmap, stats);
      res.json(advice);
    } catch (error) {
      console.error('Error generating AI advice:', error);
      res.status(500).json({ error: 'Failed to generate AI mentor tip.' });
    }
  });

  // API: Get Specific Weekly Report
  app.get('/api/weekly-report/:week', authenticate, async (req: Request, res: Response) => {
    try {
      const username = (req as any).username;
      const week = Number(req.params.week);
      if (isNaN(week) || week < 1 || week > 26) {
        res.status(400).json({ error: 'Invalid week number (must be 1 to 26).' });
        return;
      }

      const data = await db.readUser(username);
      if (!data.profile) {
        res.status(400).json({ error: 'Setup profile first.' });
        return;
      }

      const report = ReportsService.generateWeeklyReport(data.roadmap, week);
      res.json(report);
    } catch (error) {
      console.error('Error generating weekly report:', error);
      res.status(500).json({ error: 'Server error compiles weekly progress.' });
    }
  });

  // API: Get Specific Monthly Report
  app.get('/api/monthly-report/:month', authenticate, async (req: Request, res: Response) => {
    try {
      const username = (req as any).username;
      const month = Number(req.params.month);
      if (isNaN(month) || month < 1 || month > 6) {
        res.status(400).json({ error: 'Invalid month number (must be 1 to 6).' });
        return;
      }

      const data = await db.readUser(username);
      if (!data.profile) {
        res.status(400).json({ error: 'Setup profile first.' });
        return;
      }

      const report = ReportsService.compileMonthlyReport(data.roadmap, month, data.commits, data.resumeProjects);
      res.json(report);
    } catch (error) {
      console.error('Error compiling monthly report:', error);
      res.status(500).json({ error: 'Server error compiles monthly aggregates.' });
    }
  });

  // API: Reset Application
  app.post('/api/reset', authenticate, async (req: Request, res: Response) => {
    const username = (req as any).username;
    await db.resetUser(username);
    res.json({ message: 'DevOps Mentor reset to factory default state.' });
  });

  return app;
}

async function startServer() {
  const app = createExpressApp();
  const PORT = 3000;

  // --- Mount Vite / Frontend Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DevOps Mentor] Full-Stack server running on http://0.0.0.0:${PORT}`);
  });
}

// Only start the server if not running in Vercel Serverless environment
if (!process.env.VERCEL) {
  startServer();
}
