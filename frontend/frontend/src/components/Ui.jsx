

export const Logo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="8 8 56 56" fill="none">
    <rect width="72" height="72" rx="20" fill="#0D0A2A"/>
    <polygon points="36,10 58,22 58,50 36,62 14,50 14,22"
      stroke="#534AB7" strokeWidth="1.2" fill="#534AB7" opacity="0.15"/>
    <line x1="36" y1="10" x2="36" y2="62" stroke="#7F77DD" strokeWidth="1" opacity="0.3"/>
    <line x1="14" y1="22" x2="58" y2="50" stroke="#7F77DD" strokeWidth="1" opacity="0.3"/>
    <line x1="58" y1="22" x2="14" y2="50" stroke="#7F77DD" strokeWidth="1" opacity="0.3"/>
    <circle cx="36" cy="10" r="6" fill="#5DCAA5"/>
    <circle cx="58" cy="22" r="6" fill="#7F77DD"/>
    <circle cx="58" cy="50" r="6" fill="#AFA9EC"/>
    <circle cx="36" cy="62" r="6" fill="#5DCAA5"/>
    <circle cx="14" cy="50" r="6" fill="#7F77DD"/>
    <circle cx="14" cy="22" r="6" fill="#AFA9EC"/>
    <circle cx="36" cy="36" r="9" fill="#534AB7"/>
    <circle cx="36" cy="36" r="5.5" fill="white" opacity="0.9"/>
  </svg>
);
export const CrownIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#EF9F27">
    <path d="M3 17l3-8 4 5 2-9 2 9 4-5 3 8H3z" />
    <rect x="3" y="18" width="18" height="2" rx="1" fill="#EF9F27" />
  </svg>
);

export const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
  </svg>
);

export const LeaveIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="#5DCAA5" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export function Spinner({ size = 14 }) {
  return (
    <div style={{
      width: size,
      height: size,
      border: '2px solid rgba(255,255,255,0.25)',
      borderTop: '2px solid #fff',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      display: 'inline-block',
      flexShrink: 0,
    }} />
  );
}

export function ErrorBox({ msg }) {
  if (!msg) return null;
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-red-400 mb-4 animate-fade-up">
      {msg}
    </div>
  );
}



// const ANIMALS = [
//   '🐶','🐱','🐼','🐸','🐵','🦊','🐰','🐯','🐻','🐨',
//   '🐷','🐮','🐹','🐔','🦁','🐙','🐧','🦉','🦄','🐢'
// ];

// function getAnimal(name = '') {
//   return ANIMALS[(name.charCodeAt(0) || 0) % ANIMALS.length];
// }

// export function Avatar({ name = '', size = 32, isAdmin = false }) {
//   return (
//     <div className="relative flex-shrink-0">
      
//       <div
//         style={{
//           width: size,
//           height: size,
//           fontSize: size * 0.55
//         }}
//         className="rounded-full flex items-center justify-center bg-white/10"
//       >
//         {getAnimal(name)}
//       </div>

//       {isAdmin && (
//         <div className="absolute -top-2 left-1/2 -translate-x-1/2">
//           <CrownIcon size={13} />
//         </div>
//       )}
//     </div>
//   );
// }

export function Avatar({ name = '', size = 32, isAdmin = false }) {
  // DiceBear adventurer-neutral gives cute animal faces
  // seed is the username so same user always gets same avatar
  const src = `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  return (
    <div className="relative flex-shrink-0">
      <div
        style={{ width: size, height: size }}
        className="rounded-full overflow-hidden bg-white/10 flex items-center justify-center"
      >
        <img
          src={src}
          alt={name}
          style={{ width: size, height: size }}
          className="rounded-full object-cover"
          onError={(e) => {
            // fallback to initials if API fails
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* fallback initials */}
        <div
          style={{ width: size, height: size, fontSize: size * 0.35, display: 'none' }}
          className="rounded-full bg-purple-600/40 text-white font-medium items-center justify-center"
        >
          {name.slice(0, 2).toUpperCase()}
        </div>
      </div>

      {isAdmin && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <CrownIcon size={13} />
        </div>
      )}
    </div>
  );
}




export function Field({ label, children }) {
  return (
    <div className="mb-3.5">
      <label className="block text-[11px] uppercase tracking-wider text-white/40 font-medium mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export function AuthCard({ children }) {
  return (
    <div className="glass rounded-2xl p-8 w-full animate-fade-up">
      {children}
    </div>
  );
}

export function LogoMark({ success = false }) {
  return (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
      success
        ? 'bg-teal-400/15 border border-teal-400/30'
        : 'bg-purple-600/15 border border-purple-400/30'
    }`}>
      {success
        ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="#5DCAA5" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        : <Logo size={26} />
      }
    </div>
  );
}