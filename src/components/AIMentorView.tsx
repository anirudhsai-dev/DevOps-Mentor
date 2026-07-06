/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, MessageSquare, Flame, HelpCircle, CheckSquare, RefreshCw } from 'lucide-react';
import { MentorTip } from '../types';

export default function AIMentorView() {
  const [advice, setAdvice] = useState<MentorTip | null>(null);
  const [loading, setLoading] = useState(false);
  const [interactionMode, setInteractionMode] = useState<'tips' | 'quiz' | 'stuck'>('tips');
  
  // Local state for interactive tools
  const [quizQuestion, setQuizQuestion] = useState<string | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetchAdvice();
  }, []);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mentor-advice');
      if (response.ok) {
        const data = await response.json();
        setAdvice(data);
      }
    } catch (err) {
      console.error('Error fetching AI advisor tip:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerQuiz = () => {
    setInteractionMode('quiz');
    setShowAnswer(false);
    
    // Quick high-quality scenario-based quiz questions matching typical DevOps interviews
    const quizBank = [
      {
        q: "Scenario: A server is throwing disk-space full alerts but 'df -h' shows 20GB free, while 'df -i' shows 100% inode usage. How do you resolve this?",
        a: "A 100% inode usage means the filesystem has run out of index entries because of millions of tiny files (often session/log caches), despite having block storage free. Resolve by finding directories with high file counts using 'find . -xdev -type f | cut -d/ -f2 | sort | uniq -c' and purging cached temporary files."
      },
      {
        q: "Scenario: A containerized Node application can't reach a PostgreSQL container running on the same host. The connection throws 'Connection Refused'. How do you troubleshoot?",
        a: "First check if the database container exposes the port to the correct interface or if they are in separate isolated networks. Best practice is to run both containers in the same custom user-defined Docker Network, allowing DNS resolution of the database container using its container name as the host address (e.g. 'postgres://db_container:5432')."
      },
      {
        q: "Scenario: An EC2 instance inside a private subnet cannot download packages via yum update. Security groups allow port 80/443 outbound. What is missing?",
        a: "An instance in a private subnet does not have a public IP and cannot reach the public internet directly. It requires a Route inside its Subnet Route Table that points 0.0.0.0/0 traffic toward an active NAT Gateway running inside a Public Subnet."
      },
      {
        q: "Scenario: A Kubernetes deployment has Pods stuck in 'ImagePullBackOff'. What are the 3 most common reasons?",
        a: "1) The image tag does not exist or has a typo. 2) The repository is private and the cluster lacks proper 'imagePullSecrets' configuration. 3) The worker node cannot resolve the container registry address due to DNS or NAT gateway outages."
      }
    ];

    const randomQuiz = quizBank[Math.floor(Math.random() * quizBank.length)];
    setQuizQuestion(randomQuiz.q);
    setQuizAnswer(randomQuiz.a);
  };

  const handleStuckHelp = () => {
    setInteractionMode('stuck');
    setAdvice({
      text: "Feeling overwhelmed is completely normal when moving from Support to DevOps. The scope is massive. Action Plan: 1) Stop trying to read ahead. 2) Turn off all notifications and write just ONE simple 5-line bash script. 3) Re-run a single Docker bridge container. Small, micro-achievements compile into massive structural confidence. I am here with you.",
      type: 'motivation',
      category: 'Mental Fatigue Recovery',
      timestamp: new Date().toISOString()
    });
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'motivation': return 'text-purple-400 border-purple-500/20 bg-purple-500/5';
      case 'warning': return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      case 'congratulations': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      default: return 'text-blue-400 border-blue-500/20 bg-blue-500/5';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
      
      {/* Mentor commands left rail */}
      <div className="md:col-span-1 bg-zinc-900 border border-zinc-800 p-5 rounded-xl shadow-lg space-y-3 h-fit">
        <h3 className="text-xs font-mono font-bold uppercase text-zinc-300 tracking-wider flex items-center gap-2 pb-3 border-b border-zinc-800/60 mb-2">
          <Terminal className="w-4 h-4 text-emerald-500" />
          Mentor Lounge Terminal
        </h3>

        <div className="flex flex-col gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => { setInteractionMode('tips'); fetchAdvice(); }}
            className={`w-full p-2.5 rounded border text-left cursor-pointer flex items-center justify-between transition-all ${
              interactionMode === 'tips' 
                ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400' 
                : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-950 text-zinc-400'
            }`}
          >
            <span>$ request_ai_advisory.sh</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleTriggerQuiz}
            className={`w-full p-2.5 rounded border text-left cursor-pointer flex items-center justify-between transition-all ${
              interactionMode === 'quiz' 
                ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400' 
                : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-950 text-zinc-400'
            }`}
          >
            <span>$ mock_scenario_quiz.sh</span>
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleStuckHelp}
            className={`w-full p-2.5 rounded border text-left cursor-pointer flex items-center justify-between transition-all ${
              interactionMode === 'stuck' 
                ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400' 
                : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-950 text-zinc-400'
            }`}
          >
            <span>$ stuck_recovery_drill.sh</span>
            <Flame className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Advisor summary details */}
        <div className="bg-zinc-950 p-3 rounded border border-zinc-800/80 font-mono text-[10px] text-zinc-500 leading-normal space-y-1">
          <div>CONNECTION: SECURE_SOCKET</div>
          <div>MAPPING ENGINE: GEMINI_FLASH_3_5</div>
          <div>KNOWLEDGE_GRAPH: PRODUCTION_DEVOPS_V2</div>
        </div>
      </div>

      {/* Advice Display screen */}
      <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg min-h-[320px] flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.02),transparent_60%)] pointer-events-none" />

        {interactionMode === 'tips' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 text-emerald-500" />
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-300">Live Advisor Guidance</h4>
              </div>
              
              {advice && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-500 uppercase">
                  {advice.category}
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3 font-mono text-xs text-zinc-500">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
                <span>QUERYING_AI_MENTOR_SERVER...</span>
              </div>
            ) : advice ? (
              <div className={`p-5 rounded-xl border ${getTypeStyle(advice.type)} space-y-3 animate-fadeIn`}>
                <p className="text-sm text-zinc-200 leading-relaxed font-sans">
                  "{advice.text}"
                </p>
                <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-zinc-500">
                  <span>SYSTEM FEEDBACK: {advice.type.toUpperCase()}</span>
                  <span>{new Date(advice.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-600 font-mono text-xs">
                AI_MENTOR_OFFLINE // TRIGGER_MANUAL_ADVISORY
              </div>
            )}
          </div>
        )}

        {interactionMode === 'quiz' && quizQuestion && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4.5 h-4.5 text-emerald-500" />
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-300">Scenario Mock Interview Quiz</h4>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-amber-500 uppercase">
                SCENARIO_TEST
              </span>
            </div>

            <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4 font-mono text-xs">
              <div className="text-zinc-200 leading-relaxed font-bold">
                {quizQuestion}
              </div>

              {showAnswer ? (
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 text-zinc-300 rounded-lg leading-relaxed animate-fadeIn pt-3">
                  <span className="text-[9px] text-emerald-400 font-bold uppercase block mb-1">Mentor Suggested Answer:</span>
                  {quizAnswer}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAnswer(true)}
                  className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded text-xs tracking-wide transition-all cursor-pointer flex items-center gap-2"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                  <span>REVEAL_MOCK_ANSWER</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleTriggerQuiz}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>NEXT_MOCK_SCENARIO</span>
            </button>
          </div>
        )}

        {interactionMode === 'stuck' && advice && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
              <div className="flex items-center gap-2">
                <Flame className="w-4.5 h-4.5 text-red-500" />
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-300">Stuck / Burnout Recovery Drill</h4>
              </div>
            </div>

            <div className="p-5 bg-red-950/20 border border-red-900/40 text-red-400/90 rounded-xl space-y-3 font-mono text-xs leading-relaxed animate-fadeIn">
              <span className="text-[9px] bg-red-950 border border-red-900 px-1.5 py-0.5 rounded text-red-400 uppercase font-bold">
                RECOVERY_MODE
              </span>
              <p className="text-zinc-200">
                {advice.text}
              </p>
            </div>
          </div>
        )}

        {/* Advisor motivational quote footnote */}
        <div className="bg-zinc-950/40 p-3.5 rounded-lg border border-zinc-850/80 text-[9px] font-mono text-zinc-500 leading-normal mt-6">
          "Automation is not a chore; it is the physical codification of human relief." // DEVOPS_MENTOR_LOG_STREAM
        </div>
      </div>

    </div>
  );
}
