/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Briefcase, CheckSquare, Square, FileText, BadgePlus, Star, Calendar, RefreshCcw } from 'lucide-react';
import { ResumeProject } from '../types';

export default function ResumeBuilder() {
  const [projects, setProjects] = useState<ResumeProject[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Custom project form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techString, setTechString] = useState('');
  const [dayCompleted, setDayCompleted] = useState('45');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/resume-projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Error fetching resume projects:', err);
    }
  };

  const handleToggleAdded = async (project: ResumeProject) => {
    try {
      const updated = {
        ...project,
        addedToResume: !project.addedToResume,
        addedDate: !project.addedToResume ? new Date().toISOString().split('T')[0] : null
      };

      const response = await fetch('/api/resume-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });

      if (response.ok) {
        await fetchProjects();
      }
    } catch (err) {
      console.error('Error updating project status:', err);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Project Title and Technical Scope Description are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newProj: ResumeProject = {
        id: `proj_${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        technologies: techString.split(',').map(s => s.trim()).filter(Boolean),
        addedToResume: false,
        addedDate: null,
        dayCompleted: Number(dayCompleted)
      };

      const response = await fetch('/api/resume-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProj)
      });

      if (!response.ok) {
        throw new Error('Failed to save project.');
      }

      setTitle('');
      setDescription('');
      setTechString('');
      await fetchProjects();
    } catch (err: any) {
      setError(err.message || 'Database error.');
    } finally {
      setLoading(false);
    }
  };

  const addedCount = projects.filter(p => p.addedToResume).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
      
      {/* Add custom project column */}
      <div className="md:col-span-1 bg-zinc-900 border border-zinc-800 p-5 rounded-xl shadow-lg relative h-fit">
        <h3 className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-2 pb-3 border-b border-zinc-800/60 mb-4">
          <BadgePlus className="w-4 h-4 text-emerald-500" />
          Log Architectural Project
        </h3>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-400 text-xs font-mono rounded mb-4">
            [ERROR]: {error}
          </div>
        )}

        <form onSubmit={handleAddProject} className="space-y-4 font-mono text-xs text-zinc-400">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase">Project Title</label>
            <input
              type="text"
              placeholder="e.g. 3-Tier Web App on AWS ECS"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase">Technical Scope & Description</label>
            <textarea
              placeholder="e.g. Provisioned public/private VPC subnets and NAT Gateways. Packaged Node app inside multi-stage Dockerfiles and deployed onto ECS cluster..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase">Technologies Used (Comma Separated)</label>
            <input
              type="text"
              placeholder="AWS, Docker, ECS, Terraform"
              value={techString}
              onChange={(e) => setTechString(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase">Completed Roadmap Day</label>
            <input
              type="number"
              min="1"
              max="180"
              value={dayCompleted}
              onChange={(e) => setDayCompleted(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500/80"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-mono font-bold text-xs py-2 rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            RECORD_RESUME_PROJECT
          </button>
        </form>
      </div>

      {/* Resume database projects list */}
      <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 p-5 rounded-xl shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60 mb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-mono font-bold uppercase text-zinc-300">Resume project database</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">{addedCount} / {projects.length} included on resume</span>
          </div>

          {projects.length === 0 ? (
            <div className="p-8 text-center border border-zinc-800 border-dashed rounded-lg text-zinc-600 font-mono text-xs">
              NO_RESUME_PROJECTS_REGISTERED_YET // COMPLETE_MILESTONE_PRACTICALS
            </div>
          ) : (
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl space-y-3 shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="text-sm font-bold text-zinc-100 font-sans tracking-tight">{proj.title}</h4>
                        <span className="text-[9px] font-mono text-zinc-500 px-1 py-0.5 bg-zinc-900 rounded border border-zinc-800">
                          Day {proj.dayCompleted} Milestone
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans mt-1">
                        {proj.description}
                      </p>
                    </div>

                    {/* Checkbox selector */}
                    <button
                      type="button"
                      onClick={() => handleToggleAdded(proj)}
                      className={`p-1 rounded border shrink-0 transition-colors cursor-pointer ${
                        proj.addedToResume 
                          ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' 
                          : 'border-zinc-800 text-zinc-600 hover:border-zinc-700 bg-zinc-900'
                      }`}
                      title={proj.addedToResume ? 'Remove from active resume portfolio logs' : 'Add to active resume portfolio logs'}
                    >
                      {proj.addedToResume ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Tech badging & date added summary */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-zinc-900 text-[10px] font-mono">
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded">
                          {t}
                        </span>
                      ))}
                    </div>

                    {proj.addedToResume && proj.addedDate && (
                      <span className="text-emerald-500 flex items-center gap-1 shrink-0">
                        <Calendar className="w-3.5 h-3.5" /> Added to profile: {proj.addedDate}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio guidelines text */}
        <div className="bg-zinc-950/50 p-3.5 rounded-lg border border-zinc-850/80 text-[10px] font-mono text-zinc-400 mt-5 flex items-center gap-3">
          <FileText className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
          <p className="leading-relaxed">
            * Adding completed labs to your resume translates practical exercises directly into job-ready professional achievements. Check items off to log them into your printable Career Reports.
          </p>
        </div>
      </div>

    </div>
  );
}
