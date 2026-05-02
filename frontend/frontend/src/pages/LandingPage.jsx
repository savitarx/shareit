import ParticleCanvas from '../components/ParticleCanvas';
import { Logo } from '../components/ui';

export default function LandingPage({ onLogin, onRegister }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <ParticleCanvas />

      {/* Top nav */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <Logo size={22} />
          <span className="text-[13px] font-medium text-white/60 tracking-widest uppercase">WeChat</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onLogin}
            className="text-sm text-white/50 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
            Sign in
          </button>
          <button onClick={onRegister}
            className="text-sm font-medium text-white bg-purple-600 hover:bg-purple-400 transition-colors px-4 py-2 rounded-lg">
            Get started
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative z-10 text-center px-6 max-w-xl">
        <div className="w-20 h-20 rounded-3xl bg-purple-600/15 border border-purple-400/25 flex items-center justify-center mx-auto mb-8">
          <Logo size={40} />
        </div>

        <h1 className="text-5xl font-semibold text-white tracking-tight mb-4 leading-tight">
          Chat with your <span className="text-purple-400">Friends</span>
        </h1>
        <p className="text-base text-white/45 mb-10 leading-relaxed">
          Create a room, share the code, and start chatting instantly.
          No setup, no hassle.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button onClick={onRegister}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-400 text-white text-sm font-medium transition-all hover:-translate-y-0.5 active:scale-95">
            Create an account
          </button>
          <button onClick={onLogin}
            className="px-6 py-3 rounded-xl border border-white/15 hover:bg-white/5 text-white/70 hover:text-white text-sm font-medium transition-all">
            Sign in
          </button>
        </div>

        {/* Features row */}
        <div className="flex items-center justify-center gap-8 mt-12">
          {[
            { emoji: '⚡', label: 'Real-time chat' },
            { emoji: '🔑', label: 'Join with a code' },
            { emoji: '👑', label: 'Admin controls' },
          ].map(f => (
            <div key={f.label} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{f.emoji}</span>
              <span className="text-xs text-white/35">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}