import { useState } from 'react';
import ParticleCanvas from '../components/ParticleCanvas';
import { Spinner, ErrorBox, Field, AuthCard, LogoMark } from '../components/ui';
import { api } from '../utils/api';

export default function LoginPage({ onOtpSent, onGoRegister, onForgot }) {
  const [form,    setForm]    = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.username || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    try {
      await api.login(form.username, form.password);
      onOtpSent({ username: form.username });
    } catch (e) {
      setError(e.message || 'Invalid username or password.');
    } finally { setLoading(false); }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleCanvas />
      <div className="relative z-10 w-full max-w-sm px-4 flex flex-col items-center">
        <p className="text-[11px] tracking-[3px] uppercase text-white/25 mb-3">ShareIt</p>
        <AuthCard>
          <LogoMark />
          <h1 className="text-[22px] font-semibold text-white tracking-tight mb-1">Welcome back</h1>
          <p className="text-sm text-white/45 mb-6">Sign in to your WeChat account</p>

          <ErrorBox msg={error} />

          <Field label="Username">
            <input className="input-base" placeholder="Enter your username"
              value={form.username} onChange={set('username')}
              onKeyDown={e => e.key === 'Enter' && submit()} />
          </Field>
          <Field label="Password">
            <input className="input-base" type="password" placeholder="Enter your password"
              value={form.password} onChange={set('password')}
              onKeyDown={e => e.key === 'Enter' && submit()} />
          </Field>

          <div className="flex justify-end mb-2">
            <button onClick={onForgot}
              className="text-xs text-purple-200 hover:text-purple-400 transition-colors">
              Forgot password?
            </button>
          </div>

          <button className="btn-primary" onClick={submit} disabled={loading}>
            {loading && <Spinner />}
            {loading ? 'Sending OTP…' : 'Continue'}
          </button>

          <p className="text-center text-xs text-white/30 mt-5">
            Don't have an account?{' '}
            <span className="text-purple-200 cursor-pointer font-medium hover:text-purple-400 transition-colors"
              onClick={onGoRegister}>Create one</span>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}