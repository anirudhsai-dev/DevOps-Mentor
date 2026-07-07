/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { RoadmapDay, UserProfile, MentorTip } from '../src/types';

export class MentorService {
  private static aiClient: GoogleGenAI | null = null;

  private static getClient(): GoogleGenAI | null {
    if (!MentorService.aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('GEMINI_API_KEY is not configured. Running AI Mentor in local advisory mode.');
        return null;
      }
      try {
        MentorService.aiClient = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      } catch (error) {
        console.error('Failed to initialize GoogleGenAI client:', error);
        return null;
      }
    }
    return MentorService.aiClient;
  }

  /**
   * Generates a tailored, highly professional motivational or educational tip using Gemini
   */
  public static async generateAdvice(
    profile: UserProfile,
    roadmap: RoadmapDay[],
    stats: { currentStreak: number; completionPercent: number; averageHours: number; totalStudyHours: number }
  ): Promise<MentorTip> {
    const ai = MentorService.getClient();

    // Identify weak topics (backlogs or partials)
    const weakDays = roadmap.filter(day => day.status === 'Backlog' || day.status === 'Partial');
    const weakTopicsText = weakDays.length > 0 
      ? weakDays.slice(0, 3).map(d => `Day ${d.dayNumber}: ${d.topic}`).join(', ')
      : 'None (Excellent consistency!)';

    // Identify current active module
    const currentDay = roadmap.find(day => day.status === 'Pending') || roadmap[0];
    const activeModule = currentDay ? currentDay.module : 'Completed 180 Days!';
    const currentTopic = currentDay ? currentDay.topic : 'N/A';

    if (!ai) {
      // High-quality local fallback tips if API key is not present
      return this.getLocalFallbackTip(weakDays, stats, activeModule, currentTopic);
    }

    try {
      const prompt = `
You are a Senior DevOps Architect and Technical Mentor with over 20 years of experience.
Your student is a former Production Support Engineer transitioning into a full-time DevOps Engineer over a 180-day roadmap.

Student Profile:
- Name: ${profile.name}
- Daily Study Target: ${profile.studyHoursPerDay} hours
- Working hours: ${profile.workingHours} hours/day
- Preferred Revision Day: ${profile.preferredRevisionDay}

Current Progress:
- Completed: ${stats.completionPercent}% of 180 days
- Current Streak: ${stats.currentStreak} days
- Average Daily Study: ${stats.averageHours} hours (Total: ${stats.totalStudyHours} hours)
- Active Module: ${activeModule}
- Today's Topic: ${currentTopic}
- Identified Weak/Delayed Topics: ${weakTopicsText}

Based on this student's current performance state:
1. Generate an impactful, highly professional motivational advice or highly specific DevOps technical study tip.
2. If they have weak/delayed topics, provide a concrete mini-drill or revision strategy for those specific tools (e.g., Linux LVM, Docker volumes, AWS VPC routing, Jenkinsfiles, Kubernetes Pods, Terraform state).
3. If they are on a high streak (>3 days), congratulate them with constructive praise. If their streak is broken, give them a supportive, structured recovery guideline.
4. Return your output strictly in JSON format matching this schema:
{
  "text": "Your advice text here (keep it focused, practical, technical, and between 3-5 sentences)",
  "type": "motivation" | "warning" | "tip" | "congratulations",
  "category": "The specific topic category e.g. Linux, Docker, AWS, Career, General"
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '';
      const parsed = JSON.parse(responseText.trim());

      return {
        text: parsed.text || 'Keep driving forward. In DevOps, automation is a practice built day by day. Tackle your practical labs cleanly!',
        type: parsed.type || 'tip',
        category: parsed.category || 'General',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating advice via Gemini API:', error);
      return this.getLocalFallbackTip(weakDays, stats, activeModule, currentTopic);
    }
  }

  private static getLocalFallbackTip(
    weakDays: RoadmapDay[],
    stats: { currentStreak: number; completionPercent: number; averageHours: number },
    activeModule: string,
    currentTopic: string
  ): MentorTip {
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

    return {
      text,
      type,
      category,
      timestamp: new Date().toISOString()
    };
  }
}
