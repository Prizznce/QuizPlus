import React, { useState, useRef, useEffect } from 'react';
import MagneticButton from './MagneticButton.jsx';

export default function StudentJoinStrip({ onJoinBattlezone }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const joinedCode = digits.join('');
    if (joinedCode.length !== 6) {
      setError('Please enter a valid 6-digit quiz code.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/room/${joinedCode}`);
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Room not found.');
      }
      
      if (onJoinBattlezone) {
        onJoinBattlezone(joinedCode);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDigitChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;
    
    const newDigits = [...digits];
    pastedData.split('').forEach((char, i) => {
      newDigits[i] = char;
    });
    setDigits(newDigits);
    
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <section className="student-join-strip">
      <div className="join-strip-content" style={{ flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ marginTop: '1rem', marginBottom: '2rem', color: '#111', fontSize: '1.85rem', fontWeight: 800, textAlign: 'center' }}>Enter Room Code</h3>
        <form onSubmit={handleVerifyCode} className="join-strip-form" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', background: 'transparent', width: '100%' }}>
          
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isLoading}
                style={{
                  width: '3.5rem',
                  height: '4.5rem',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  borderRadius: '12px',
                  border: '2px solid',
                  borderColor: digit ? 'var(--primary-color)' : '#cbd5e1',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: 'var(--primary-color)',
                  outline: 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: digit ? '0 0 15px rgba(124, 58, 237, 0.4)' : '0 4px 6px rgba(0,0,0,0.05)',
                  opacity: isLoading ? 0.7 : 1,
                  transform: digit ? 'scale(1.05)' : 'scale(1)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-color)';
                  e.target.style.boxShadow = '0 0 20px rgba(124, 58, 237, 0.6)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onBlur={(e) => {
                  if (!digit) {
                    e.target.style.borderColor = '#cbd5e1';
                    e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                    e.target.style.transform = 'scale(1)';
                  } else {
                    e.target.style.boxShadow = '0 0 15px rgba(124, 58, 237, 0.4)';
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
              />
            ))}
          </div>

          <MagneticButton type="submit" className="btn-join-massive" disabled={isLoading || digits.join('').length !== 6} style={{ 
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', 
            borderRadius: '12px', 
            color: '#fff', 
            fontWeight: 800,
            fontSize: '1.15rem',
            padding: '1rem',
            opacity: (isLoading || digits.join('').length !== 6) ? 0.7 : 1, 
            width: '100%', 
            maxWidth: '350px',
            boxShadow: '0 8px 25px rgba(124, 58, 237, 0.4)',
            transition: 'all 0.2s',
            transform: (isLoading || digits.join('').length !== 6) ? 'none' : 'scale(1.02)'
          }}>
            {isLoading ? 'VERIFYING...' : 'JOIN ROOM'}
          </MagneticButton>
        </form>
        {error && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 700, marginTop: '1.5rem', backgroundColor: 'rgba(254,226,226,0.9)', padding: '0.75rem 1rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', animation: 'shake 0.4s ease-in-out' }}><span>⚠️</span> {error}</div>}
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
      `}</style>
    </section>
  );
}
