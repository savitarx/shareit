import { useState } from 'react';
import ParticleCanvas from '../components/ParticleCanvas';
import { Logo, Spinner, ErrorBox, Field } from '../components/ui';
import { api } from '../utils/api.js';
import { useAuth } from '../context/AuthContext';



export default function LobbyPage({ onJoinRoom ,onLogout}) {
  const { username } = useAuth();
  const [tab,      setTab]      = useState('join');
  const [roomCode, setRoomCode] = useState('');
  const [roomName, setRoomName] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleJoin = async () => {
    if (!roomCode.trim()) { setError('Enter a room code.'); return; }
    setLoading(true); setError('');
    try { onJoinRoom(await api.joinRoom(roomCode.trim())); }
    catch (e) { setError(e.message || 'Room not found.'); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!roomName.trim()) { setError('Enter a room name.'); return; }
    setLoading(true); setError('');
    try { onJoinRoom(await api.createRoom(roomName.trim())); }
    catch (e) { setError(e.message || 'Failed to create room.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <ParticleCanvas />

      {/* Topbar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Logo size={20} />
          <span className="text-xs font-medium text-white/60 tracking-widest uppercase">WeChat</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/30">
            <span className="text-sm text-white/50">
  Hi, <span className="text-white font-semibold ">{username}</span>
</span>
          </span>
          <button onClick={onLogout}
            className="text-xs text-white/60 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
            Sign out
          </button>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm px-4 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-600/15 border border-purple-400/25 flex items-center justify-center mb-5">
          <Logo size={32} />
        </div>
        <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Jump in</h1>
        <p className="text-sm text-white/40 mb-8 text-center">
          Join a room with a code or create your own
        </p>

        {/* Tabs */}
        <div className="glass rounded-xl p-1 flex w-full mb-5">
          {['join','create'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-purple-600 text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}>
              {t === 'join' ? '🔑 Join room' : '✨ Create room'}
            </button>
          ))}
        </div>

        <div className="glass rounded-2xl p-7 w-full animate-fade-up">
          <ErrorBox msg={error} />
          {tab === 'join' ? (
            <>
              <Field label="Room Code">
                <input className="input-base font-mono tracking-widest text-purple-200 text-base"
                  placeholder="Enter code e.g. 9581"
                  value={roomCode} onChange={e => setRoomCode(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleJoin()} />
              </Field>
              <button className="btn-primary mt-1" onClick={handleJoin} disabled={loading}>
                {loading && <Spinner />}
                {loading ? 'Joining…' : 'Join room'}
              </button>
            </>
          ) : (
            <>
              <Field label="Room Name">
                <input className="input-base" placeholder="e.g. Design Review"
                  value={roomName} onChange={e => setRoomName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()} />
              </Field>
              <button className="btn-primary mt-1" onClick={handleCreate} disabled={loading}>
                {loading && <Spinner />}
                {loading ? 'Creating…' : 'Create room'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}