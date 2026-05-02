import { useState } from 'react';
import ParticleCanvas from '../components/ParticleCanvas';
import OtpInput from '../components/OtpInput';
import { Spinner, ErrorBox, Field, AuthCard, LogoMark } from '../components/ui';
import { api } from '../utils/api';

export default function ForgotPage({ onBack }) {
  const [step,        setStep]        = useState('email'); // 'email'|'otp'|'reset'|'done'
  const [email,       setEmail]       = useState('');
  const [otp,         setOtp]         = useState('');
  const [password,    setPassword]    = useState('');
  const [confirm,     setConfirm]     = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [resent,      setResent]      = useState(false);

  const sendOtp = async () => {
    if (!email) { setError('Enter your email address.'); return; }
    setLoading(true); setError('');
    try {
      await api.forgotPassword(email);
      setStep('otp');
    } catch (e) { setError(e.message || 'Email not found.'); }
    finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (otp.length < 6) { setError('Enter the complete 6-digit code.'); return; }
    // Backend verifies otp at reset-password step so just move forward
    setStep('reset');
  };

  const resetPassword = async () => {
    if (!password || !confirm) { setError('Please fill in both fields.'); return; }
    if (password !== confirm)  { setError('Passwords do not match.'); return; }
    if (password.length < 6)   { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    try {
      await api.resetPassword(email, otp, password);
      setStep('done');
    } catch (e) { setError(e.message || 'Failed to reset. Check your code and try again.'); }
    finally { setLoading(false); }
  };

  const resend = async () => {
    setError('');
    try {
      await api.resendOtp(email);
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch (e) { setError(e.message || 'Failed to resend.'); }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleCanvas />
      <div className="relative z-10 w-full max-w-sm px-4 flex flex-col items-center">
        <p className="text-[11px] tracking-[3px] uppercase text-white/25 mb-3">ShareIt</p>
        <AuthCard>

          {step === 'email' && (
            <>
              <LogoMark />
              <h1 className="text-[22px] font-semibold text-white tracking-tight mb-1">Forgot password?</h1>
              <p className="text-sm text-white/45 mb-6">Enter your email and we'll send a reset code</p>
              <ErrorBox msg={error} />
              <Field label="Email">
                <input className="input-base" type="email" placeholder="Your email address"
                  value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendOtp()} />
              </Field>
              <button className="btn-primary mt-2" onClick={sendOtp} disabled={loading}>
                {loading && <Spinner />}
                {loading ? 'Sending…' : 'Send reset code'}
              </button>
              <button onClick={onBack}
                className="w-full text-center text-xs text-white/30 hover:text-white/60 transition-colors mt-4">
                ← Back to sign in
              </button>
            </>
          )}

          {step === 'otp' && (
            <>
              <LogoMark />
              <h1 className="text-[22px] font-semibold text-white tracking-tight mb-1">Enter reset code</h1>
              <p className="text-sm text-white/45 mb-1">We sent a code to</p>
              <p className="text-sm text-purple-200 font-medium mb-6">{email}</p>
              <ErrorBox msg={error} />
              <OtpInput value={otp} onChange={setOtp} />
              <button className="btn-primary mt-5" onClick={verifyOtp} disabled={otp.length < 6}>
                Next →
              </button>
              <div className="flex items-center justify-between mt-4">
                <button onClick={() => setStep('email')}
                  className="text-xs text-white/30 hover:text-white/60 transition-colors">
                  ← Back
                </button>
                <button onClick={resend}
                  className="text-xs text-purple-200 hover:text-purple-400 transition-colors">
                  {resent ? '✓ Sent!' : 'Resend code'}
                </button>
              </div>
            </>
          )}

          {step === 'reset' && (
            <>
              <LogoMark />
              <h1 className="text-[22px] font-semibold text-white tracking-tight mb-1">New password</h1>
              <p className="text-sm text-white/45 mb-6">Choose a strong new password</p>
              <ErrorBox msg={error} />
              <Field label="New Password">
                <input className="input-base" type="password" placeholder="Create new password"
                  value={password} onChange={e => setPassword(e.target.value)} />
              </Field>
              <Field label="Confirm Password">
                <input className="input-base" type="password" placeholder="Repeat new password"
                  value={confirm} onChange={e => setConfirm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && resetPassword()} />
              </Field>
              <button className="btn-primary mt-2" onClick={resetPassword} disabled={loading}>
                {loading && <Spinner />}
                {loading ? 'Resetting…' : 'Reset password'}
              </button>
            </>
          )}

          {step === 'done' && (
            <div className="text-center">
              <LogoMark success />
              <h1 className="text-[22px] font-semibold text-white tracking-tight mb-2">Password reset!</h1>
              <p className="text-sm text-white/45 mb-7">
                You can now sign in with your new password.
              </p>
              <button className="btn-primary" onClick={onBack}>Back to sign in</button>
            </div>
          )}

        </AuthCard>
      </div>
    </div>
  );
}