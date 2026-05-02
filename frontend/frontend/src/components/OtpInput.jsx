import { useRef } from 'react';

export default function OtpInput({ value = '', onChange }) {
  const inputs = useRef([]);
  const arr = Array.from({ length: 6 }, (_, i) => value[i] || '');

  const handleChange = (i, e) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    const next = arr.map((v, idx) => (idx === i ? digit : v)).join('');
    onChange(next);
    if (digit && i < 5) {
      inputs.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      if (arr[i]) {
        // Clear current box
        const next = arr.map((v, idx) => (idx === i ? '' : v)).join('');
        onChange(next);
      } else if (i > 0) {
        // Move to previous box and clear it
        inputs.current[i - 1]?.focus();
        const next = arr.map((v, idx) => (idx === i - 1 ? '' : v)).join('');
        onChange(next);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] || '').join('');
    onChange(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputs.current[focusIdx]?.focus();
  };

  const handleFocus = (i) => {
    // On focus select the content so typing replaces it
    inputs.current[i]?.select();
  };

  return (
    <div className="flex gap-2 justify-center my-2">
      {arr.map((digit, i) => (
        <input
          key={i}
          ref={el => inputs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(i)}
          style={{ caretColor: 'transparent' }}
          className="w-11 h-12 text-center text-lg font-mono font-semibold text-white rounded-xl border border-white/15 bg-white/10 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
        />
      ))}
    </div>
  );
}