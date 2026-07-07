import React, { useState } from 'react';
import { Terminal, Shield, Key, User, Lock, UserPlus, LogIn, AlertCircle, Sparkles } from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: (token: string, username: string) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      setError('Please input both operator identifier and access key.');
      return;
    }

    setLoading(true);
    const endpoint = isLogin ? '/api/login' : '/api/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: trimmedUser, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication sequence failed.');
      }

      if (isLogin) {
        // Logged in successfully
        onAuthSuccess(data.token, data.username);
      } else {
        // Registered successfully, switch to login and show success
        setIsLogin(true);
        setPassword('');
        setError('Registration successful! Enter key to initialize session.');
      }
    } catch (err: any) {
      setError(err.message || 'System fault during network authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center font-sans relative overflow-hidden selection:bg-emerald-500/30">
      {/* Background Matrix-like abstract grid aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(63,63,70,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(63,63,70,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.02),transparent_65%)] pointer-events-none" />

      <div className="w-full max-w-md p-6 relative z-10">
        {/* Terminal Header Info */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl mb-4 text-emerald-500 relative group overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Terminal className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold tracking-tight font-sans text-center text-zinc-100 flex items-center gap-2">
            <span>DEVOPS MENTOR</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-normal">v2.0</span>
          </h1>
          <p className="text-xs text-zinc-500 font-mono text-center mt-1">
            LOCAL_JSON_PERSISTENCE_MODE
          </p>
        </div>

        {/* Core Auth Card */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Header Bar */}
          <div className="bg-zinc-950/60 border-b border-zinc-850 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 tracking-wider">
              {isLogin ? 'SESSION_LOGIN' : 'CREATE_OPERATOR'}
            </span>
          </div>

          <div className="p-6">
            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 bg-zinc-950 border border-zinc-850 rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError(null);
                }}
                className={`py-1.5 text-xs font-mono rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isLogin
                    ? 'bg-zinc-900 text-emerald-400 border border-zinc-800 font-bold shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>LOGIN</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError(null);
                }}
                className={`py-1.5 text-xs font-mono rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  !isLogin
                    ? 'bg-zinc-900 text-emerald-400 border border-zinc-800 font-bold shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>REGISTER</span>
              </button>
            </div>

            {/* Error or Alert Display */}
            {error && (
              <div className={`p-3 border rounded-lg text-xs mb-5 font-mono flex items-start gap-2.5 ${
                error.includes('successful') 
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/5 border-red-500/20 text-red-400'
              }`}>
                {error.includes('successful') ? (
                  <Sparkles className="w-4 h-4 shrink-0 animate-bounce mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <div className="leading-relaxed">
                  <span className="font-bold">{error.includes('successful') ? '[OK] ' : '[FAULT] '}</span>
                  {error}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
                  operator_username$
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-600">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. anirudh"
                    disabled={loading}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-emerald-500/50 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-700 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
                  operator_key$
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-600">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-emerald-500/50 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-700 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-zinc-950 font-bold py-2.5 px-4 rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <span>EXECUTING_AUTHENTICATION...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>{isLogin ? 'ESTABLISH_SESSION' : 'PROVISION_OPERATOR'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Security / System Footer Note */}
        <p className="text-[10px] font-mono text-zinc-600 text-center mt-6 flex items-center justify-center gap-1.5">
          <Key className="w-3 h-3 text-zinc-700" />
          <span>LOCAL JSON BACKUP ACTIVE & PRIVACY SECURED</span>
        </p>
      </div>
    </div>
  );
}
