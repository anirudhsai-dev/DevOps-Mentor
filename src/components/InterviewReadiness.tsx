/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, ShieldCheck, ShieldAlert, Cpu, Terminal, Layers, Cloud, Code, Network, Activity } from 'lucide-react';

interface InterviewReadinessProps {
  scores: Record<string, number> & { overall: number; isReady: boolean };
}

export default function InterviewReadiness({ scores }: InterviewReadinessProps) {
  const { overall, isReady } = scores;

  const categories = [
    { name: 'Linux', icon: Terminal, score: scores.Linux || 0, desc: 'FS, Processes, Shell Automation, systemd' },
    { name: 'Docker', icon: Layers, score: scores.Docker || 0, desc: 'Images, Multi-Stage Builds, Networks, Volumes' },
    { name: 'AWS', icon: Cloud, score: scores.AWS || 0, desc: 'IAM, EC2, VPC Networking, Storage, Logs' },
    { name: 'Jenkins', icon: Code, score: scores.Jenkins || 0, desc: 'Pipelines, Webhooks, Actions, Runners' },
    { name: 'Kubernetes', icon: Network, score: scores.Kubernetes || 0, desc: 'Pods, Deployments, Services, Storage, Ingress, Helm' },
    { name: 'Terraform', icon: Cpu, score: scores.Terraform || 0, desc: 'Providers, S3 Remote Backends, Custom Modules' },
    { name: 'Monitoring', icon: Activity, score: scores.Monitoring || 0, desc: 'Prometheus Scraping, Grafana Dashboards, Loki Logging' }
  ];

  const getEvaluationMessage = () => {
    if (overall >= 90) {
      return {
        title: 'Elite Production DevOps Engineer Ready',
        text: 'Outstanding technical score! Your portfolio, commit history, and technical labs show clear competence to handle high-level infrastructure design and live production system outages. Trigger interview campaigns immediately.',
        color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
      };
    } else if (overall >= 80) {
      return {
        title: 'Junior/Mid DevOps Associate Ready',
        text: 'Excellent foundations across all core DevOps silos. You have surpassed the 80% barrier and can comfortably answer scenario-based interview questions on Docker networks, AWS routing, CI/CD webhooks, and Kubernetes controllers.',
        color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
      };
    } else if (overall >= 50) {
      return {
        title: 'Foundations Emerging // Not Interview Ready',
        text: 'Your learning targets are progressing well, but critical modules remain locked or partially finished. Prioritize completing AWS VPC, Jenkins pipelines, and Docker Volumes labs to establish solid production support transition credentials.',
        color: 'text-amber-400 border-amber-500/20 bg-amber-500/5'
      };
    } else {
      return {
        title: 'Bootstrapping Core Skills',
        text: 'You are currently in the early stages of building production-grade DevOps competencies. Focus on mastering Linux CLI tools, bash scripting structures, and Git branching workflows before proceeding to complex cloud resources.',
        color: 'text-zinc-500 border-zinc-800 bg-zinc-950'
      };
    }
  };

  const evalMsg = getEvaluationMessage();

  return (
    <div className="space-y-6 select-none">
      
      {/* Overall evaluation block */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent_60%)] pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-5 border-b border-zinc-800/60">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isReady ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>
              {isReady ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Overall Career Assessment</span>
              <h2 className="text-xl font-bold font-mono text-zinc-100 flex items-center gap-2">
                Interview Ready? 
                <span className={`font-bold ${isReady ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {isReady ? 'YES' : 'NO'}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center text-center font-mono">
            <span className="text-4xl font-extrabold text-emerald-400 leading-none">{overall}%</span>
            <span className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">Readiness Quotient</span>
          </div>
        </div>

        {/* Evaluation text summary */}
        <div className={`mt-5 p-4 rounded-lg border ${evalMsg.color} space-y-2`}>
          <h3 className="text-xs font-mono font-bold uppercase flex items-center gap-1.5">
            <Award className="w-4 h-4" /> {evalMsg.title}
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">{evalMsg.text}</p>
        </div>
      </div>

      {/* Grid listing category bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const CatIcon = cat.icon;
          return (
            <div
              key={cat.name}
              className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl shadow-md space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-950 border border-zinc-800/80 rounded-lg flex items-center justify-center text-zinc-400">
                    <CatIcon className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold font-mono text-zinc-100">{cat.name} Scope</span>
                    <p className="text-[9px] font-mono text-zinc-500 truncate max-w-[180px] sm:max-w-xs">{cat.desc}</p>
                  </div>
                </div>

                <div className="text-sm font-bold font-mono text-emerald-400">{cat.score}%</div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-850">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-zinc-600">
                  <span>FOUNDATIONS</span>
                  <span>PRODUCTION ARCHITECT</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
