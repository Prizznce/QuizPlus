import React, { useState } from 'react';
import MagneticButton from './MagneticButton.jsx';

const adjectives = ['Cosmic', 'Quantum', 'Neon', 'Turbo', 'Cyber', 'Galactic', 'Hyper', 'Sonic', 'Astral', 'Atomic'];
const nouns = ['Panda', 'Ninja', 'Rider', 'Wizard', 'Ghost', 'Dragon', 'Phoenix', 'Ranger', 'Knight', 'Comet'];

const generateRandomName = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj} ${noun}`;
};

export default function ProfileSetupView({ roomCode, onComplete }) {
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('👽');
  const [error, setError] = useState(null);

  const avatars = ['👽', '👻', '🤖', '🐶', '🐱', '🦊', '🐯', '🐸'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Please enter a nickname.');
      return;
    }
    onComplete(nickname.trim(), avatar);
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 1000,
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'rgba(230, 225, 245, 0.4)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '3.5rem 3rem',
        borderRadius: '28px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '520px',
        animation: 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        <h3 style={{ 
          marginBottom: '2.5rem', 
          color: '#111', 
          fontSize: '2.2rem', 
          fontWeight: 900, 
          textAlign: 'center', 
          letterSpacing: '-0.5px' 
        }}>
          Set your profile
        </h3>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '1.25rem', 
          marginBottom: '2.5rem', 
          justifyContent: 'center' 
        }}>
          {avatars.map((a) => (
            <button 
              key={a}
              type="button"
              onClick={() => setAvatar(a)}
              style={{ 
                fontSize: '2.5rem', 
                background: avatar === a ? 'var(--primary-color)' : '#f8fafc', 
                border: 'none',
                borderRadius: '22px',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                margin: '0 auto',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: avatar === a ? 'scale(1.05)' : 'scale(1)',
                boxShadow: avatar === a ? '0 8px 20px rgba(59, 40, 182, 0.3)' : 'none',
                opacity: avatar === a ? 1 : 0.8
              }}
              onMouseOver={(e) => { if (avatar !== a) e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseOut={(e) => { if (avatar !== a) e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {a}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
          <div style={{ display: 'flex', position: 'relative' }}>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname"
              maxLength={20}
              autoFocus
              style={{ 
                flex: 1, 
                borderRadius: '999px', 
                border: '2px solid var(--primary-color)', 
                padding: '1.2rem 1.5rem', 
                fontSize: '1.1rem', 
                fontWeight: 600, 
                outline: 'none', 
                paddingRight: '180px', // Space for button and dice
                color: '#111',
                boxShadow: '0 4px 15px rgba(59, 40, 182, 0.05)',
                transition: 'border-color 0.2s'
              }}
            />
            
            <button 
              type="button"
              onClick={() => setNickname(generateRandomName())}
              title="Generate Random Name"
              style={{
                position: 'absolute',
                right: '135px', // Sit just to the left of the ENTER button
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                zIndex: 2
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
              onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
            >
              🎲
            </button>

            <MagneticButton type="submit" style={{ 
              position: 'absolute', 
              right: '8px', 
              top: '8px', 
              bottom: '8px', 
              background: 'linear-gradient(135deg, #5b4be0, #7c3aed)', 
              borderRadius: '999px', 
              padding: '0 2rem', 
              color: '#fff', 
              fontWeight: 800, 
              fontSize: '1.05rem',
              border: 'none', 
              cursor: 'pointer', 
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}>
              ENTER
            </MagneticButton>
          </div>
          
          {error && (
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              color: '#ef4444', fontWeight: 700, marginTop: '0.5rem', 
              backgroundColor: 'rgba(254,226,226,0.9)', padding: '0.75rem 1rem', 
              borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
              animation: 'shake 0.4s ease-in-out' 
            }}>
              <span>⚠️</span> {error}
            </div>
          )}
        </form>
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
      `}</style>
    </div>
  );
}
