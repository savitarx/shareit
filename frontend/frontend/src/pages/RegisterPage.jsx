import { useState } from 'react';
import ParticleCanvas from '../components/ParticleCanvas';
import { Spinner, ErrorBox, Field, AuthCard, LogoMark } from '../components/ui';
import { api } from '../utils/api';

const FIELDS = [
   { key: 'fullname', label: 'Fullname',        type: 'text',     ph: 'Enter your fullname' },
  { key: 'username', label: 'Username',        type: 'text',     ph: 'Choose a username' },
  { key: 'email',    label: 'Email',            type: 'email',    ph: 'Your email address' },
  { key: 'password', label: 'Password',         type: 'password', ph: 'Create a password' },
  { key: 'confirm',  label: 'Confirm Password', type: 'password', ph: 'Repeat your password' },
];

export default function RegisterPage({ onOtpSent, onGoLogin }) {
  const [form,    setForm]    = useState({ username:'', email:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    const { username, email, password, confirm } = form;
    if (!username || !email || !password || !confirm) { setError('Please fill in all fields.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    try {
      // Register the user first — backend stores them pending OTP verification
      await api.register(username, email, password);
      onOtpSent({ username, email, password });
    } catch (e) {
      setError(e.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleCanvas />
      <div className="relative z-10 w-full max-w-sm px-4 py-8 flex flex-col items-center">
        <p className="text-[11px] tracking-[3px] uppercase text-white/25 mb-3">ShareIt</p>
        <AuthCard>
          <LogoMark />
          <h1 className="text-[22px] font-semibold text-white tracking-tight mb-1">Create account</h1>
          <p className="text-sm text-white/45 mb-6">Join WeChat and start chatting</p>

          <ErrorBox msg={error} />

          {FIELDS.map(f => (
            <Field key={f.key} label={f.label}>
              <input className="input-base" type={f.type} placeholder={f.ph}
                value={form[f.key]} onChange={set(f.key)}
                onKeyDown={e => e.key === 'Enter' && submit()} />
            </Field>
          ))}

          <button className="btn-primary mt-2" onClick={submit} disabled={loading}>
            {loading && <Spinner />}
            {loading ? 'Sending OTP…' : 'Continue'}
          </button>

          <p className="text-center text-xs text-white/30 mt-5">
            Already have an account?{' '}
            <span className="text-purple-200 cursor-pointer font-medium hover:text-purple-400 transition-colors"
              onClick={onGoLogin}>Sign in</span>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}