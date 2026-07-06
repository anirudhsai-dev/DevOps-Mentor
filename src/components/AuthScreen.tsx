/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Terminal, Lock, User, Cpu, ShieldAlert, KeyRound, Check, ArrowRight } from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: (token: string, username: string) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanUsername = username.trim();
    if (!cleanUsername) {
      setError('Username cannot be empty.');
      return;
    }

    if (!password) {
      setError('Password cannot be empty.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Login flow
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cleanUsername, password }),
        });

        const data = await response.json();

        if (response.ok) {
          onAuthSuccess(data.token, data.username);
        } else {
          setError(data.error || 'Authentication failed. Please verify credentials.');
        }
      } else {
        // Register flow
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cleanUsername, password }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMsg('Account created successfully! Switching to login...');
          setTimeout(() => {
            setIsLogin(true);
            setPassword('');
            setConfirmPassword('');
            setSuccessMsg(null);
          }, 1500);
        } else {
          setError(data.error || 'Registration failed. Username may already be taken.');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('Could not connect to authentication server. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center font-sans selection:bg-emerald-500/30 relative overflow-hidden px-4">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(63,63,70,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(63,63,70,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Outer ambient glow circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(16,185,129,0.03),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(16,185,129,0.03),transparent_70%)] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        
        {/* Logo/Brand Box */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 shadow-md">
            <Cpu className="w-5 h-5 text-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400">SYS_AUTH_SHIELD</span>
          </div>
          <h1 className="text-2xl font-black font-mono tracking-tight text-zinc-100 mt-2">
            DEVOPS MENTOR
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            SECURE ACCELERATED STUDY SHELL
          </p>
        </div>

        {/* Authenticator Card */}
        <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-400" />
          
          <div className="flex justify-between items-center border-b border-zinc-800/80 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-mono font-bold uppercase text-zinc-300">
                {isLogin ? '$ sudo_session_init.sh' : '$ useradd_operator.sh'}
              </span>
            </div>
            <div className="text-[10px] font-mono text-zinc-500">
              V1.4.2_SECURE
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase text-zinc-400 tracking-wider block">
                Operator Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-4 h-4 text-zinc-500" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. cloud_engineer"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 font-mono focus:outline-none focus:border-emerald-500/80 transition-colors"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase text-zinc-400 tracking-wider block">
                Session Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-4 h-4 text-zinc-500" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 font-mono focus:outline-none focus:border-emerald-500/80 transition-colors"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
              </div>
            </div>

            {/* Confirm Password Input (only on register) */}
            {!isLogin && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-[10px] font-mono font-bold uppercase text-zinc-400 tracking-wider block">
                  Verify Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <KeyRound className="w-4 h-4 text-zinc-500" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 font-mono focus:outline-none focus:border-emerald-500/80 transition-colors"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            {/* Error Message display */}
            {error && (
              <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-xs font-mono text-red-400 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message display */}
            {successMsg && (
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-xs font-mono text-emerald-400 flex items-start gap-2.5">
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Action Buttons */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 active:translate-y-[1px] disabled:opacity-50 text-zinc-950 font-mono font-bold text-xs rounded-lg tracking-wider uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
            >
              <span>{loading ? 'PROCESSING_SECURE_AUTH...' : (isLogin ? 'ESTABLISH_SESSION' : 'REGISTER_OPERATOR')}</span>
              {!loading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>

          </form>

          {/* Selector toggle footer */}
          <div className="mt-5 pt-4 border-t border-zinc-850/60 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccessMsg(null);
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-xs font-mono text-zinc-400 hover:text-emerald-400 cursor-pointer transition-colors"
            >
              {isLogin ? "No session configuration? [ Create Operator ]" : "Already registered? [ Establish Session ]"}
            </button>
          </div>

        </div>

        {/* Console footnote */}
        <div className="text-center font-mono text-[10px] text-zinc-600 select-none">
          SECURE CREDENTIAL MANAGEMENT PORTAL // PERSISTED_DB
        </div>

      </div>
    </div>
  );
}
