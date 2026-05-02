import { useState } from 'react';
import ParticleCanvas from '../components/ParticleCanvas';
import OtpInput from '../components/OtpInput';
import { Spinner, ErrorBox, AuthCard, LogoMark } from '../components/ui';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function LoginOtpPage({ loginData, onBack }) {
  const { login } = useAuth();
  const [otp,     setOtp]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [resent,  setResent]  = useState(false);

  const submit = async () => {
    if (otp.length < 6) { setError('Enter the complete 6-digit code.'); return; }
    setLoading(true); setError('');
    try {
      const token = await api.verifyLoginOtp(loginData.username, otp);
      login(token);
    } catch (e) {
      setError(e.message || 'Invalid or expired OTP.');
    } finally { setLoading(false); }
  };

  const resend = async () => {
    setError('');
    try {
      await api.resendOtp(loginData.username);
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch (e) { setError(e.message || 'Failed to resend OTP.'); }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleCanvas />
      <div className="relative z-10 w-full max-w-sm px-4 flex flex-col items-center">
        <p className="text-[11px] tracking-[3px] uppercase text-white/25 mb-3">ShareIt</p>
        <AuthCard>
          <LogoMark />
          <h1 className="text-[22px] font-semibold text-white tracking-tight mb-1">Check your email</h1>
          <p className="text-sm text-white/45 mb-1">We sent a 6-digit code to your</p>
          <p className="text-sm text-purple-200 font-medium mb-6">registered email address</p>

          <ErrorBox msg={error} />

          <OtpInput value={otp} onChange={setOtp} />

          <button className="btn-primary mt-5" onClick={submit} disabled={loading || otp.length < 6}>
            {loading && <Spinner />}
            {loading ? 'Verifying…' : 'Sign in'}
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