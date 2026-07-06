/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile, RoadmapDay, CommitLog, ResumeProject, WeeklyReport } from '../src/types';

export interface DatabaseSchema {
  profile: UserProfile | null;
  roadmap: RoadmapDay[];
  commits: CommitLog[];
  resumeProjects: ResumeProject[];
  weeklyReports: WeeklyReport[];
  lastUpdate: string;
}

// Load Firebase Config dynamically from root configuration
let firebaseConfig: any = {};
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
} catch (e) {
  console.error('[DatabaseManager] Failed to load firebase-applet-config.json:', e);
}

// Support loading entire Firebase Config as a JSON string from environment variables
if (process.env.FIREBASE_CONFIG) {
  try {
    firebaseConfig = {
      ...firebaseConfig,
      ...JSON.parse(process.env.FIREBASE_CONFIG)
    };
  } catch (e) {
    console.error('[DatabaseManager] Failed to parse FIREBASE_CONFIG environment variable:', e);
  }
}

// Support individual environment variables (ideal for Vercel)
firebaseConfig.apiKey = process.env.FIREBASE_API_KEY || firebaseConfig.apiKey || "";
firebaseConfig.authDomain = process.env.FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain || "";
firebaseConfig.projectId = process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId || "";
firebaseConfig.storageBucket = process.env.FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket || "";
firebaseConfig.messagingSenderId = process.env.FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId || "";
firebaseConfig.appId = process.env.FIREBASE_APP_ID || firebaseConfig.appId || "";
firebaseConfig.measurementId = process.env.FIREBASE_MEASUREMENT_ID || firebaseConfig.measurementId || "";
firebaseConfig.firestoreDatabaseId = process.env.FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId || "";

// Initialize Firebase client
const app = initializeApp(firebaseConfig);
const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export class DatabaseManager {
  private static instance: DatabaseManager;

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async registerUser(username: string, password: string): Promise<boolean> {
    const cleanUsername = username.trim().toLowerCase();
    
    if (!cleanUsername || !password) {
      return false;
    }

    try {
      const userRef = doc(db, 'users', cleanUsername);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return false; // User already exists
      }

      const initialSchema: DatabaseSchema = {
        profile: null,
        roadmap: [],
        commits: [],
        resumeProjects: [],
        weeklyReports: [],
        lastUpdate: new Date().toISOString()
      };

      await setDoc(userRef, {
        username: cleanUsername,
        password: password, // plain text as requested
        ...initialSchema
      });

      return true;
    } catch (e) {
      console.error('Error during user registration in Firestore:', e);
      return false;
    }
  }

  public async authenticateUser(username: string, password: string): Promise<boolean> {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || !password) {
      return false;
    }
    try {
      const userRef = doc(db, 'users', cleanUsername);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        return false;
      }
      const userData = userSnap.data();
      return userData.password === password;
    } catch (e) {
      console.error('Error during authentication in Firestore:', e);
      return false;
    }
  }

  public async readUser(username: string): Promise<DatabaseSchema> {
    const cleanUsername = username.trim().toLowerCase();
    try {
      const userRef = doc(db, 'users', cleanUsername);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
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
      console.error(`Error reading progress for user ${cleanUsername} from Firestore:`, error);
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

  public async writeUser(username: string, data: Partial<DatabaseSchema>): Promise<void> {
    const cleanUsername = username.trim().toLowerCase();
    try {
      const userRef = doc(db, 'users', cleanUsername);
      const current = await this.readUser(cleanUsername);
      const updated = {
        profile: data.profile !== undefined ? data.profile : current.profile,
        roadmap: data.roadmap !== undefined ? data.roadmap : current.roadmap,
        commits: data.commits !== undefined ? data.commits : current.commits,
        resumeProjects: data.resumeProjects !== undefined ? data.resumeProjects : current.resumeProjects,
        weeklyReports: data.weeklyReports !== undefined ? data.weeklyReports : current.weeklyReports,
        lastUpdate: new Date().toISOString()
      };

      await setDoc(userRef, updated, { merge: true });
    } catch (error) {
      console.error(`Error writing progress for user ${cleanUsername} to Firestore:`, error);
    }
  }

  public async resetUser(username: string): Promise<void> {
    const cleanUsername = username.trim().toLowerCase();
    const freshSchema = {
      profile: null,
      roadmap: [],
      commits: [],
      resumeProjects: [],
      weeklyReports: [],
      lastUpdate: new Date().toISOString()
    };

    try {
      const userRef = doc(db, 'users', cleanUsername);
      await setDoc(userRef, freshSchema, { merge: true });
    } catch (error) {
      console.error(`Error resetting database for user ${cleanUsername} in Firestore:`, error);
    }
  }
}
