/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { UserProfile, RoadmapDay, CommitLog, ResumeProject, WeeklyReport } from '../src/types';

export interface DatabaseSchema {
  profile: UserProfile | null;
  roadmap: RoadmapDay[];
  commits: CommitLog[];
  resumeProjects: ResumeProject[];
  weeklyReports: WeeklyReport[];
  lastUpdate: string;
}

const DATA_DIR = path.join(process.cwd(), 'users-data');

// Synchronously ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export class DatabaseManager {
  private static instance: DatabaseManager;

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private getUserFilePath(username: string): string {
    const cleanUsername = username.trim().toLowerCase();
    return path.join(DATA_DIR, `${cleanUsername}.json`);
  }

  public userExists(username: string): boolean {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) return false;
    const filePath = this.getUserFilePath(cleanUsername);
    return fs.existsSync(filePath);
  }

  public async registerUser(username: string, password: string): Promise<boolean> {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || !password) {
      return false;
    }

    const filePath = this.getUserFilePath(cleanUsername);
    try {
      if (fs.existsSync(filePath)) {
        return false; // User already exists
      }

      const initialData = {
        username: cleanUsername,
        password: password, // plain text as requested
        profile: null,
        roadmap: [],
        commits: [],
        resumeProjects: [],
        weeklyReports: [],
        lastUpdate: new Date().toISOString()
      };

      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf-8');
      console.log(`[DatabaseManager] Successfully registered user and created JSON: ${cleanUsername}`);
      return true;
    } catch (e) {
      console.error(`Error registering user ${cleanUsername} in JSON file:`, e);
      throw e;
    }
  }

  public async authenticateUser(username: string, password: string): Promise<boolean> {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || !password) {
      return false;
    }

    const filePath = this.getUserFilePath(cleanUsername);
    try {
      if (!fs.existsSync(filePath)) {
        return false;
      }

      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      return data.password === password;
    } catch (e) {
      console.error(`Error authenticating user ${cleanUsername} in JSON file:`, e);
      throw e;
    }
  }

  public async readUser(username: string): Promise<DatabaseSchema> {
    const cleanUsername = username.trim().toLowerCase();
    const filePath = this.getUserFilePath(cleanUsername);
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);
        return {
          profile: data.profile || null,
          roadmap: data.roadmap || [],
          commits: data.commits || [],
          resumeProjects: data.resumeProjects || [],
          weeklyReports: data.weeklyReports || [],
          lastUpdate: data.lastUpdate || new Date().toISOString()
        };
      }
    } catch (error) {
      console.error(`Error reading data for user ${cleanUsername} from JSON file:`, error);
    }

    // Return empty default state if not found (but registration handles this)
    return {
      profile: null,
      roadmap: [],
      commits: [],
      resumeProjects: [],
      weeklyReports: [],
      lastUpdate: new Date().toISOString()
    };
  }

  public async writeUser(username: string, data: Partial<DatabaseSchema>): Promise<void> {
    const cleanUsername = username.trim().toLowerCase();
    const filePath = this.getUserFilePath(cleanUsername);
    try {
      let current: any = {};
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        current = JSON.parse(raw);
      } else {
        // Fallback user container
        current = {
          username: cleanUsername,
          password: 'password', // default password
        };
      }

      const updated = {
        ...current,
        profile: data.profile !== undefined ? data.profile : current.profile,
        roadmap: data.roadmap !== undefined ? data.roadmap : current.roadmap,
        commits: data.commits !== undefined ? data.commits : current.commits,
        resumeProjects: data.resumeProjects !== undefined ? data.resumeProjects : current.resumeProjects,
        weeklyReports: data.weeklyReports !== undefined ? data.weeklyReports : current.weeklyReports,
        lastUpdate: new Date().toISOString()
      };

      fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8');
      console.log(`[DatabaseManager] Successfully updated JSON for user: ${cleanUsername}`);
    } catch (error) {
      console.error(`Error writing data for user ${cleanUsername} to JSON file:`, error);
    }
  }

  public async resetUser(username: string): Promise<void> {
    const cleanUsername = username.trim().toLowerCase();
    const filePath = this.getUserFilePath(cleanUsername);
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const current = JSON.parse(raw);
        
        const resetData = {
          ...current,
          profile: null,
          roadmap: [],
          commits: [],
          resumeProjects: [],
          weeklyReports: [],
          lastUpdate: new Date().toISOString()
        };

        fs.writeFileSync(filePath, JSON.stringify(resetData, null, 2), 'utf-8');
        console.log(`[DatabaseManager] Successfully reset JSON file for user: ${cleanUsername}`);
      }
    } catch (error) {
      console.error(`Error resetting JSON file for user ${cleanUsername}:`, error);
    }
  }
}
