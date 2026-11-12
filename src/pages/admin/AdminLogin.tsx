// JEY VID VISION - Private Owner Admin Login
// Supabase Authentication with secondary PIN verification gate

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, KeyRound, Lock, AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isPinVerified, loginWithPassword, verifyPin, loading } = useAuth();

  const [step, setStep] = useState<'password' | 'pin'>(isAuthenticated ? 'pin' : 'password');
  const [email, setEmail] = useState('jeywarsi73@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated and PIN verified, redirect to dashboard
  if (isAuthenticated && isPinVerified) {
    navigate('/admin/dashboard');
    return null;
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await loginWithPassword(email, password);
    setSubmitting(false);

    if (res.success) {
      setStep('pin');
    } else {
      setError(res.error || 'Authentication failed');
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await verifyPin(pin);
    setSubmitting(false);

    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.error || 'Invalid Security PIN');
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      {/* Background Ambient Glow */}
      <div className="absolute w-96 h-96 rounded-full bg-[#F00018]/10 blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#121212] border border-neutral-800/80 rounded-2xl p-8 shadow-2xl">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <img 
            src="/logo.png" 
            alt="JEY VID VISION" 
            className="h-14 w-auto object-contain mb-3"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/aistudio/Jey_Vid_Vision_Cinematic_Logo_c6a37e17.png';
            }}
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 mb-1">
            <Shield className="w-3.5 h-3.5 text-[#F00018]" />
            <span>Private Owner Administration</span>
          </div>
          <p className="text-xs text-neutral-500">Authorized personnel only</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start gap-2.5 text-xs text-red-200 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-[#F00018] shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Owner Email & Password Form */}
        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Owner Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jeywarsi73@gmail.com"
                className="w-full px-3.5 py-2.5 text-xs bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#F00018]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-300">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-neutral-400 hover:text-white text-[11px] flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 text-xs bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#F00018] pr-10"
                />
                <Lock className="absolute right-3.5 top-3 w-3.5 h-3.5 text-neutral-500 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F00018] hover:bg-[#d00015] text-white text-xs font-bold tracking-wide transition-all shadow-lg shadow-red-950/50 disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Continue to Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-neutral-500">
                Default Owner email: <strong className="text-neutral-300">jeywarsi73@gmail.com</strong>
              </span>
            </div>
          </form>
        )}

        {/* Step 2: 2FA Security PIN Verification */}
        {step === 'pin' && (
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="text-center p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 mb-4">
              <KeyRound className="w-6 h-6 text-[#F00018] mx-auto mb-1" />
              <p className="text-xs font-semibold text-neutral-200">Owner Security PIN</p>
              <p className="text-[11px] text-neutral-500">Enter your 4-digit security PIN (Default: 1234)</p>
            </div>

            <div>
              <input
                type="password"
                maxLength={6}
                required
                autoFocus
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="1 2 3 4"
                className="w-full px-4 py-3 text-center text-lg tracking-[0.5em] font-mono bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#F00018]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F00018] hover:bg-[#d00015] text-white text-xs font-bold tracking-wide transition-all shadow-lg shadow-red-950/50"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify PIN & Access Dashboard</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setStep('password'); setError(null); }}
              className="w-full text-center text-xs text-neutral-500 hover:text-neutral-300 pt-2"
            >
              ← Back to Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
