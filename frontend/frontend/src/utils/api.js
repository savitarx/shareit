//const BASE = 'http://localhost:8000';


const BASE = 'https://inserted-reed-alfred-amended.trycloudflare.com';

export const getToken = () => localStorage.getItem('shareit_token');
async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',   // ← add this
      'bypass-tunnel-reminder': 'true',        // ← add this for cloudflare
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

export const api = {
  // Register — body is JSON (User object)
  register: (username, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),

  // Verify register OTP — query params
  verifyRegisterOtp: (email, otp) =>
    request(`/auth/verify-register?email=${encodeURIComponent(email)}&otp=${otp}`, { method: 'POST' }),

  // Login — query params
  login: (username, password) =>
    request(`/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, { method: 'POST' }),

  // Verify login OTP — query params
  verifyLoginOtp: (username, otp) =>
    request(`/auth/verify-login?username=${encodeURIComponent(username)}&otp=${otp}`, { method: 'POST' }),

  // Resend OTP — query param
  resendOtp: (email) =>
    request(`/auth/resend-otp?email=${encodeURIComponent(email)}`, { method: 'POST' }),

  // Forgot password — query param
  forgotPassword: (email) =>
    request(`/auth/forgot-password?email=${encodeURIComponent(email)}`, { method: 'POST' }),

  // Reset password — query params
  resetPassword: (email, otp, newPassword) =>
    request(`/auth/reset-password?email=${encodeURIComponent(email)}&otp=${otp}&newPassword=${encodeURIComponent(newPassword)}`, { method: 'POST' }),

  // Room
  createRoom:  (name)     => request(`/rooms/create?name=${encodeURIComponent(name)}`, { method: 'POST' }),
  joinRoom:    (roomCode) => request(`/rooms/join?roomCode=${roomCode}`,               { method: 'POST' }),
  getMessages: (roomCode) => request(`/rooms/${roomCode}/messages`),
};