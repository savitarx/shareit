import { useState } from 'react';
import ParticleCanvas from '../components/ParticleCanvas';
import OtpInput from '../components/OtpInput';
import { Spinner, ErrorBox, AuthCard, LogoMark } from '../components/ui';
import { api } from '../utils/api';

export default function RegisterOtpPage({ regData, onSuccess, onBack }) {
  const [otp,     setOtp]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [resent,  setResent]  = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    if (otp.length < 6) { setError('Enter the complete 6-digit code.'); return; }
    setLoading(true); setError('');
    try {
      const response= await api.verifyRegisterOtp(regData.email, otp);
      console.log('Register OTP response ',response)
      setSuccess(true);
      setTimeout(onSuccess, 1800);
    } catch (e) {
      setError(e.message || 'Invalid or expired OTP.');
    } finally { setLoading(false); }
  };

  const resend = async () => {
    setError('');
    try {
      await api.resendOtp(regData.email);
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch (e) { setError(e.message || 'Failed to resend OTP.'); }
  };

  if (success) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticleCanvas />
        <div className="relative z-10 w-full max-w-sm px-4 flex flex-col items-center">
          <AuthCard>
            <div className="text-center">
              <LogoMark success />
              <h1 className="text-[22px] font-semibold text-white tracking-tight mb-2">You're in!</h1>
              <p className="text-sm text-white/45">Account created! Redirecting to sign in…</p>
            </div>
          </AuthCard>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleCanvas />
      <div className="relative z-10 w-full max-w-sm px-4 flex flex-col items-center">
        <p className="text-[11px] tracking-[3px] uppercase text-white/25 mb-3">ShareIt</p>
        <AuthCard>
          <LogoMark />
          <h1 className="text-[22px] font-semibold text-white tracking-tight mb-1">Verify your email</h1>
          <p className="text-sm text-white/45 mb-1">We sent a 6-digit code to</p>
          <p className="text-sm text-purple-200 font-medium mb-6">{regData.email}</p>

          <ErrorBox msg={error} />

          <OtpInput value={otp} onChange={setOtp} />

          <button className="btn-primary mt-5" onClick={submit} disabled={loading || otp.length < 6}>
            {loading && <Spinner />}
            {loading ? 'Verifying…' : 'Verify & create account'}
          </button>

          <div className="flex items-center justify-between mt-4">
            <button onClick={onBack}
              className="text-xs text-white/30 hover:text-white/60 transition-colors">
              ← Back
            </button>
            <button onClick={resend}
              className="text-xs text-purple-200 hover:text-purple-400 transition-colors">
              {resent ? '✓ Code sent!' : 'Resend code'}
            </button>
          </div>
        </AuthCard>
      </div>
    </div>
  );
}