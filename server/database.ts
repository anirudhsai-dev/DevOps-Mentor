/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { UserProfile, RoadmapDay, CommitLog, ResumeProject, WeeklyReport } from '../src/types';

const DB_DIR = path.join(process.cwd(), 'database');
const USERS_DIR = path.join(DB_DIR, 'users');

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

  private constructor() {
    this.ensureDirectories();
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private ensureDirectories(): void {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_DIR)) {
      fs.mkdirSync(USERS_DIR, { recursive: true });
    }
  }

  public registerUser(username: string, password: string): boolean {
    this.ensureDirectories();
    const cleanUsername = username.trim().toLowerCase();
    
    if (!cleanUsername || !password) {
      return false;
    }

    const authFile = path.join(USERS_DIR, `${cleanUsername}_auth.json`);
    if (fs.existsSync(authFile)) {
      return false; // User already exists
    }

    const authData = {
      username: cleanUsername,
      password: password // simple plain text password as requested
    };

    const initialSchema: DatabaseSchema = {
      profile: null,
      roadmap: [],
      commits: [],
      resumeProjects: [],
      weeklyReports: [],
      lastUpdate: new Date().toISOString()
    };

    const progressFile = path.join(USERS_DIR, `${cleanUsername}_progress.json`);

    try {
      fs.writeFileSync(authFile, JSON.stringify(authData, null, 2), 'utf-8');
      fs.writeFileSync(progressFile, JSON.stringify(initialSchema, null, 2), 'utf-8');
      return true;
    } catch (e) {
      console.error('Error during user registration:', e);
      return false;
    }
  }

  public authenticateUser(username: string, password: string): boolean {
    this.ensureDirectories();
    const cleanUsername = username.trim().toLowerCase();
    const authFile = path.join(USERS_DIR, `${cleanUsername}_auth.json`);

    if (!fs.existsSync(authFile)) {
      return false;
    }

    try {
      const authContent = fs.readFileSync(authFile, 'utf-8');
      const authData = JSON.parse(authContent);
      return authData.password === password;
    } catch (e) {
      console.error('Error during authentication:', e);
      return false;
    }
  }

  public readUser(username: string): DatabaseSchema {
    this.ensureDirectories();
    const cleanUsername = username.trim().toLowerCase();
    const progressFile = path.join(USERS_DIR, `${cleanUsername}_progress.json`);

    try {
      if (fs.existsSync(progressFile)) {
        const content = fs.readFileSync(progressFile, 'utf-8');
        return JSON.parse(content) as DatabaseSchema;
      }
    } catch (error) {
      console.error(`Error reading progress for user ${cleanUsername}:`, error);
    }

    return {
      profile: null,
      roadmap: [],
      commits: [],
      resumeProjects: [],
      weeklyReports: [],
      lastUpdate: new Date().toISOString()
    };
  }

  public writeUser(username: string, data: Partial<DatabaseSchema>): void {
    this.ensureDirectories();
    const cleanUsername = username.trim().toLowerCase();
    const progressFile = path.join(USERS_DIR, `${cleanUsername}_progress.json`);

    try {
      const current = this.readUser(cleanUsername);
      const updated: DatabaseSchema = {
        profile: data.profile !== undefined ? data.profile : current.profile,
        roadmap: data.roadmap !== undefined ? data.roadmap : current.roadmap,
        commits: data.commits !== undefined ? data.commits : current.commits,
        resumeProjects: data.resumeProjects !== undefined ? data.resumeProjects : current.resumeProjects,
        weeklyReports: data.weeklyReports !== undefined ? data.weeklyReports : current.weeklyReports,
        lastUpdate: new Date().toISOString()
      };

      const tempFile = `${progressFile}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(updated, null, 2), 'utf-8');
      fs.renameSync(tempFile, progressFile);
    } catch (error) {
      console.error(`Error writing progress for user ${cleanUsername}:`, error);
    }
  }

  public resetUser(username: string): void {
    this.ensureDirectories();
    const cleanUsername = username.trim().toLowerCase();
    const progressFile = path.join(USERS_DIR, `${cleanUsername}_progress.json`);

    const freshSchema: DatabaseSchema = {
      profile: null,
      roadmap: [],
      commits: [],
      resumeProjects: [],
      weeklyReports: [],
      lastUpdate: new Date().toISOString()
    };

    try {
      fs.writeFileSync(progressFile, JSON.stringify(freshSchema, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Error resetting database for user ${cleanUsername}:`, error);
    }
  }
}
