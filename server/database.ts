/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { UserProfile, RoadmapDay, CommitLog, ResumeProject, WeeklyReport, AnalyticsStats } from '../src/types';

const DB_DIR = path.join(process.cwd(), 'database');
const DB_FILE = path.join(DB_DIR, 'progress.json');

export interface DatabaseSchema {
  profile: UserProfile | null;
  roadmap: RoadmapDay[];
  commits: CommitLog[];
  resumeProjects: ResumeProject[];
  weeklyReports: WeeklyReport[];
  lastUpdate: string;
}

export class DatabaseManager {
  private static instance: DatabaseManager;
  private cache: DatabaseSchema | null = null;

  private constructor() {
    this.ensureDirectoryAndFile();
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private ensureDirectoryAndFile(): void {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialSchema: DatabaseSchema = {
        profile: null,
        roadmap: [],
        commits: [],
        resumeProjects: [],
        weeklyReports: [],
        lastUpdate: new Date().toISOString()
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialSchema, null, 2), 'utf-8');
    }
  }

  public read(): DatabaseSchema {
    try {
      this.ensureDirectoryAndFile();
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      this.cache = JSON.parse(content) as DatabaseSchema;
      return this.cache;
    } catch (error) {
      console.error('Error reading progress database:', error);
      // Fallback
      return {
        profile: null,
        roadmap: [],
        commits: [],
        resumeProjects: [],
        weeklyReports: [],
        lastUpdate: new Date().toISOString()
      };
    }
  }

  public write(data: Partial<DatabaseSchema>): void {
    try {
      const current = this.read();
      const updated: DatabaseSchema = {
        profile: data.profile !== undefined ? data.profile : current.profile,
        roadmap: data.roadmap !== undefined ? data.roadmap : current.roadmap,
        commits: data.commits !== undefined ? data.commits : current.commits,
        resumeProjects: data.resumeProjects !== undefined ? data.resumeProjects : current.resumeProjects,
        weeklyReports: data.weeklyReports !== undefined ? data.weeklyReports : current.weeklyReports,
        lastUpdate: new Date().toISOString()
      };

      // Atomic write using temp file to avoid file corruption
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(updated, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);

      this.cache = updated;
    } catch (error) {
      console.error('Error writing to progress database:', error);
    }
  }

  public reset(): void {
    const freshSchema: DatabaseSchema = {
      profile: null,
      roadmap: [],
      commits: [],
      resumeProjects: [],
      weeklyReports: [],
      lastUpdate: new Date().toISOString()
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(freshSchema, null, 2), 'utf-8');
    this.cache = freshSchema;
  }
}
