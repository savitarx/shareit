import { useState, useEffect, useRef, useCallback } from 'react';
import ParticleCanvas from '../components/ParticleCanvas';
import { Avatar, SendIcon, LeaveIcon, CopyIcon, CheckIcon, Logo } from '../components/ui';
import { useStompChat } from '../hooks/useStompChat';
import { api } from '../utils/api.js';
import { useAuth } from '../context/AuthContext';

function LeaveModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass rounded-2xl p-7 w-72 text-center animate-fade-up">
        <div className="w-11 h-11 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
          <LeaveIcon />
        </div>
        <h3 className="text-[17px] font-semibold text-white mb-2">Leave room?</h3>
        <p className="text-sm text-white/45 mb-6 leading-relaxed">
          You'll lose access to the chat. Rejoin anytime with the room code.
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/12 text-sm text-white/60 hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}

function Bubble({ msg, isMine, isAdmin }) {
  const sender = msg.senderId ?? msg.sender ?? '?';
  const time   = msg.timestamp
    ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  return (
    <div className={`flex gap-2.5 items-end animate-msg-in ${isMine ? 'flex-row-reverse' : ''}`}>
      <Avatar name={sender} size={30} isAdmin={isAdmin} />
      <div className={`max-w-[65%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
        <div className={`text-[11px] text-white/30 mb-1 ${isMine ? 'text-right' : ''}`}>
          {isMine ? time : `${sender} · ${time}`}
        </div>
        <div className={`px-3.5 py-2 rounded-xl text-[13.5px] leading-relaxed ${
          isMine
            ? 'bg-gradient-to-br from-purple-600 to-purple-400 text-white rounded-br-sm'
            : 'bg-white/5 border border-white/10 text-white/85 rounded-bl-sm backdrop-blur-sm'
        }`}>
          {msg.content}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator({ user }) {
  if (!user) return <div className="h-6" />;
  return (
    <div className="h-6 flex items-center gap-1.5 px-4">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400/60"
            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </div>
      <span className="text-xs text-white/35">{user} is typing…</span>
      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-4px)}}`}</style>
    </div>
  );
}

function MemberRow({ name, isAdmin, isYou }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <Avatar name={name} size={28} isAdmin={isAdmin} />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] text-white/85 truncate">
          {name}
          {isYou && <span className="text-[10px] text-white/30 ml-1">(you)</span>}
        </div>
        <div className="text-[11px] text-white/35">{isAdmin ? 'Admin' : 'Member'}</div>
      </div>
      <div className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0" />
    </div>
  );
}

export default function ChatPage({ room, onLeave, onLogout }) {
  const { token, username } = useAuth();

  // ✅ normalize room code — handles both field names
  const roomCode  = room.code ?? room.roomCode ?? '';
  const adminName = room.adminId ?? room.createdBy ?? '';
  //const members   = room.members ? [...room.members] : [username];

  const { connected, messages, setMessages, typingUser,members,setMembers, sendMessage, sendTyping }
    = useStompChat(roomCode, token);

  const [input,     setInput]     = useState('');
  const [copied,    setCopied]    = useState(false);
  const [showLeave, setShowLeave] = useState(false);
  const msgsRef     = useRef(null);
  const typingTimer = useRef(null);

   useEffect(() => {
    if (room.members) {
      const initial = Array.isArray(room.members)
        ? room.members
        : Array.from(room.members);
      // ensure admin is always in list
      const withAdmin = initial.includes(adminName)
        ? initial
        : [adminName, ...initial];
      setMembers(withAdmin);
    } else {
      setMembers([adminName || username]);
    }
  }, [room]);

  useEffect(() => {
    if (!roomCode) return;
    fetch(`http://localhost:8000/rooms/${roomCode}/members`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : Array.from(data);
        const withAdmin = list.includes(adminName) ? list : [adminName, ...list];
        setMembers(withAdmin);
      })
      .catch(() => {});
  }, [roomCode]);

  // Load history on mount
  useEffect(() => {
    if (!roomCode) return;
    api.getMessages(roomCode).then(setMessages).catch(() => {});
  }, [roomCode]);

  // Auto scroll to bottom
  useEffect(() => {
    if (msgsRef.current)
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, typingUser]);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text || !connected) return;
    sendMessage(text);
    setInput('');
  }, [input, connected, sendMessage]);

  const handleTyping = (e) => {
    setInput(e.target.value);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(sendTyping, 400);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative h-screen flex flex-col overflow-hidden">
      <ParticleCanvas />
      {showLeave && (
        <LeaveModal
          onConfirm={() => { setShowLeave(false); onLeave(); }}
          onCancel={() => setShowLeave(false)}
        />
      )}

      <div className="relative z-10 flex h-full">

        {/* ── Sidebar ── */}
        <aside className="w-56 flex-shrink-0 flex flex-col glass-dark border-r border-white/7">

          {/* Logo */}
          <div className="flex items-center gap-2 px-4 py-3.5 border-b border-white/7">
            <Logo size={18} />
            <span className="text-[10px] font-medium text-white/40 tracking-widest uppercase">WeChat</span>
          </div>

          {/* Room info */}
          <div className="px-4 pt-4 pb-3 border-b border-white/7">
            <h2 className="text-[14px] font-semibold text-white truncate">{room.name}</h2>
            <p className="text-[11px] text-white/35 mt-0.5">by {adminName}</p>
            <div className="flex items-center gap-2 mt-3 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5">
              <span className="text-[10px] text-white/30 uppercase tracking-wide">Code</span>
              <span className="font-mono text-purple-200 text-[13px] tracking-widest flex-1">
                {roomCode}
              </span>
              <button onClick={copyCode} className="text-white/35 hover:text-purple-300 transition-colors">
                {copied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
          </div>

          {/* Members list */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-white/25 font-medium mb-2">
              Members · {members.length}
            </p>
            {members.map(m => (
              <MemberRow key={m} name={m}
                isAdmin={m === adminName}
                isYou={m === username} />
            ))}
          </div>

          {/* Leave button */}
          <div className="p-3 border-t border-white/7">
            <button onClick={() => setShowLeave(true)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-red-500/25 text-red-400 text-[13px] hover:bg-red-500/10 transition-colors">
              <LeaveIcon />
              Leave room
            </button>
          </div>
        </aside>

        {/* ── Chat main ── */}
        <main className="flex-1 flex flex-col min-w-0">

          {/* Header */}
          <div className="glass-dark border-b border-white/7 px-5 py-3.5 flex items-center gap-3 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-semibold text-white truncate">{room.name}</h3>
              <p className="text-[11px] text-white/35">{members.length} members</p>
            </div>
            {/* Live badge */}
            <div className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border ${
              connected
                ? 'border-teal-400/30 bg-teal-400/10 text-teal-200'
                : 'border-white/15 bg-white/5 text-white/35'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                connected ? 'bg-teal-400 animate-pulse-dot' : 'bg-white/30'
              }`} />
              {connected ? 'Live' : 'Connecting…'}
            </div>
            {/* User + sign out */}
            <div className="flex items-center gap-2">
              <Avatar name={username} size={28} isAdmin={username === adminName} />
              <button onClick={onLogout}
                className="text-[11px] text-white/25 hover:text-red-400 transition-colors">
                Sign out
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={msgsRef} className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 my-auto">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-sm text-white/50">No messages yet — say hello!</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <Bubble key={i} msg={msg}
                isMine={(msg.senderId ?? msg.sender) === username}
                isAdmin={(msg.senderId ?? msg.sender) === adminName} />
            ))}
          </div>

          {/* Typing indicator */}
          <TypingIndicator user={typingUser === username ? '' : typingUser} />

          {/* ✅ Fixed input area — transparent glass */}
          <div className="bg-white/3 backdrop-blur-md border-t border-white/7 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <input
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-[13.5px] text-white placeholder-white/20 outline-none focus:border-purple-400/40 focus:ring-2 focus:ring-purple-400/10 backdrop-blur-sm transition-all"
              placeholder={connected ? `Message ${room.name}…` : 'Connecting…'}
              value={input}
              onChange={handleTyping}
              onKeyDown={e => e.key === 'Enter' && send()}
              disabled={!connected}
            />
            <button onClick={send}
              disabled={!input.trim() || !connected}
              className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white hover:bg-purple-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 flex-shrink-0">
              <SendIcon />
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}