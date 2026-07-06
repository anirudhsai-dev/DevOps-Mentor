/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GitBranch, GitCommit, Link, Check, Plus, AlertCircle, Calendar } from 'lucide-react';
import { CommitLog } from '../types';

interface GitHubTrackerProps {
  currentDay: number;
  onCommitLogged: () => void;
}

export default function GitHubTracker({ currentDay, onCommitLogged }: GitHubTrackerProps) {
  const [repoName, setRepoName] = useState('');
  const [commitLink, setCommitLink] = useState('');
  const [dayNumber, setDayNumber] = useState(String(currentDay));
  const [commitLogs, setCommitLogs] = useState<CommitLog[]>([]);
  const [logging, setLogging] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCommits();
  }, []);

  const fetchCommits = async () => {
    try {
      const response = await fetch('/api/github-commits');
      if (response.ok) {
        const data = await response.json();
        setCommitLogs(data.sort((a: CommitLog, b: CommitLog) => b.dayNumber - a.dayNumber));
      }
    } catch (err) {
      console.error('Error loading commits:', err);
    }
  };

  const handleLogCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoName.trim() || !commitLink.trim()) {
      setError('Both Repository Name and Commit/File Link are required.');
      return;
    }

    setLogging(true);
    setError('');

    try {
      const response = await fetch('/api/github-commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber: Number(dayNumber),
          repoName: repoName.trim(),
          commitLink: commitLink.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to record commit log in terminal database.');
      }

      setSuccess(true);
      setRepoName('');
      setCommitLink('');
      await fetchCommits();
      onCommitLogged();

      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Server connection issue.');
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
      
      {/* Log Form column */}
      <div className="md:col-span-1 bg-zinc-900 border border-zinc-800 p-5 rounded-xl shadow-lg relative h-fit">
        <h3 className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-2 pb-3 border-b border-zinc-800/60 mb-4">
          <GitBranch className="w-4 h-4 text-emerald-500 animate-pulse" />
          Log Daily GitHub Commit
        </h3>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-400 text-xs font-mono rounded mb-4">
            [ERROR]: {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs font-mono rounded mb-4">
            [SUCCESS]: COMMIT_RECORDED_SUCCESSFULLY
          </div>
        )}

        <form onSubmit={handleLogCommit} className="space-y-4">
          {/* Day number */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase text-zinc-400">Roadmap Day Mapping</label>
            <input
              type="number"
              min="1"
              max="180"
              value={dayNumber}
              onChange={(e) => setDayNumber(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500/80 font-mono"
            />
          </div>

          {/* Repo name */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase text-zinc-400">Repository Name</label>
            <input
              type="text"
              placeholder="e.g. devops-capstone-monitoring"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 font-mono"
            />
          </div>

          {/* Commit/File Link */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase text-zinc-400">Commit/File GitHub URL</label>
            <input
              type="url"
              placeholder="https://github.com/user/repo/commit/..."
              value={commitLink}
              onChange={(e) => setCommitLink(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/80 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={logging}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-mono font-bold text-xs py-2 rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>RECORD_COMMIT_LOG</span>
          </button>
        </form>
      </div>

      {/* Commit history list */}
      <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 p-5 rounded-xl shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60 mb-4">
            <h3 className="text-xs font-mono font-bold uppercase text-zinc-300">Logged Contributions timeline</h3>
            <span className="text-[10px] font-mono text-zinc-500">{commitLogs.length} logged records</span>
          </div>

          {commitLogs.length === 0 ? (
            <div className="p-8 text-center border border-zinc-800 border-dashed rounded-lg text-zinc-600 font-mono text-xs">
              NO_GITHUB_COMMITS_RECORDED_YET // BOOTSTRAP_REQUIRED
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {commitLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 bg-zinc-950 border border-zinc-850 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                      <GitCommit className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-200">Day {log.dayNumber} Lesson</span>
                        <span className="text-[9px] text-zinc-500 px-1 py-0.5 bg-zinc-900 rounded border border-zinc-800">
                          {log.repoName}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <a
                    href={log.commitLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded flex items-center gap-1 shrink-0 self-end sm:self-center cursor-pointer transition-colors"
                  >
                    <Link className="w-3 h-3" />
                    <span>VIEW_ON_GITHUB</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio analysis metrics footer */}
        <div className="bg-zinc-950/50 p-3.5 rounded-lg border border-zinc-850/80 text-[10px] font-mono text-zinc-400 mt-5 flex items-center gap-3">
          <AlertCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 animate-pulse" />
          <p className="leading-relaxed">
            * Consistent GitHub logging builds a bulletproof DevOps transition profile. Ensure repository descriptions clearly outline VPC diagrams or Kubernetes Helm structures built!
          </p>
        </div>
      </div>

    </div>
  );
}
