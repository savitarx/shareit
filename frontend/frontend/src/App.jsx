import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage      from './pages/LandingPage';
import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import RegisterOtpPage  from './pages/RegisterOtpPage';
import LoginOtpPage     from './pages/LoginOtpPage';
import ForgotPage       from './pages/ForgotPage';
import LobbyPage        from './pages/LobbyPage';
import ChatPage         from './pages/ChatPage';

function AppRoutes() {
  const { isAuthed, logout } = useAuth();

  // ✅ persist page in sessionStorage so refresh keeps you on same page
  const [page, setPage] = useState(() => {
    const saved = sessionStorage.getItem('shareit_page');
    if (saved) return saved;
    return isAuthed ? 'lobby' : 'landing';
  });

  // ✅ persist room in sessionStorage so refresh keeps you in the same room
  const [room, setRoom] = useState(() => {
    const saved = sessionStorage.getItem('shareit_room');
    return saved ? JSON.parse(saved) : null;
  });

  const [regData,   setRegData]   = useState(null);
  const [loginData, setLoginData] = useState(null);

  // ✅ wrap setPage to also save to sessionStorage
  const navigate = (p) => {
    sessionStorage.setItem('shareit_page', p);
    setPage(p);
  };

  // ✅ wrap setRoom to also save to sessionStorage
  const enterRoom = (r) => {
    sessionStorage.setItem('shareit_room', JSON.stringify(r));
    sessionStorage.setItem('shareit_page', 'chat');
    setRoom(r);
    setPage('chat');
  };

  const leaveRoom = () => {
    sessionStorage.removeItem('shareit_room');
    sessionStorage.setItem('shareit_page', 'lobby');
    setRoom(null);
    setPage('lobby');
  };

  const handleLogout = () => {
    logout();
    sessionStorage.clear();
    setRoom(null);
    setPage('landing');
  };

  // ✅ Landing always accessible
  if (page === 'landing') {
    return (
      <LandingPage
        onLogin={() => navigate('login')}
        onRegister={() => navigate('register')}
      />
    );
  }

  // ✅ Auth pages
  if (!isAuthed) {
    if (page === 'login')
      return (
        <LoginPage
          onOtpSent={(data) => { setLoginData(data); navigate('login-otp'); }}
          onGoRegister={() => navigate('register')}
          onForgot={() => navigate('forgot')}
        />
      );
    if (page === 'login-otp')
      return (
        <LoginOtpPage
          loginData={loginData}
          onBack={() => navigate('login')}
        />
      );
    if (page === 'register')
      return (
        <RegisterPage
          onOtpSent={(data) => { setRegData(data); navigate('register-otp'); }}
          onGoLogin={() => navigate('login')}
        />
      );
    if (page === 'register-otp')
      return (
        <RegisterOtpPage
          regData={regData}
          onSuccess={() => navigate('login')}
          onBack={() => navigate('register')}
        />
      );
    if (page === 'forgot')
      return <ForgotPage onBack={() => navigate('login')} />;

    // ✅ fallback — if authed state lost, go to login
    return (
      <LoginPage
        onOtpSent={(data) => { setLoginData(data); navigate('login-otp'); }}
        onGoRegister={() => navigate('register')}
        onForgot={() => navigate('forgot')}
      />
    );
  }

  // ✅ Authenticated pages
  if (page === 'chat' && room)
    return <ChatPage room={room} onLeave={leaveRoom} onLogout={handleLogout} />;

  return <LobbyPage onJoinRoom={enterRoom} onLogout={handleLogout} />;
}

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>;
}