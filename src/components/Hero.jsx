import React, { useState } from 'react';
import MagneticButton from './MagneticButton.jsx';
import StudentJoinStrip from './StudentJoinStrip.jsx';

export default function Hero() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdRoomCode, setCreatedRoomCode] = useState(null);

  const handleTeacherSignup = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your school or work email to start.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/room/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hostId: email })
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create room. Please try again.');
      }
      
      setCreatedRoomCode(data.code);
    } catch (err) {
      console.error(err);
      setError('Server error. Could not connect to QuiZ+ backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="hero" id="teachers">
      <div className="mesh-gradient-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <div className="hero-left">
        <h1 className="hero-title">
          TURN ANY CLASS INTO AN <br />
          <span className="highlight">INTERACTIVE QUIZ.</span>
        </h1>
        <p className="hero-subtitle">
          Create engaging quizzes in seconds. Generate a link, ask students to open their phones, and connect instantly. Make learning fun and interactive for everyone.
        </p>

        <div className="signup-container">
          {createdRoomCode ? (
            <div className="success-room-ui" style={{ padding: '1rem 0' }}>
              <div className="teacher-badge" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                ROOM CREATED SUCCESSFULLY
              </div>
              <h3 style={{ marginTop: '1.25rem', marginBottom: '0.25rem', fontSize: '1.1rem', color: 'var(--text-gray)' }}>
                Your Live Room Code:
              </h3>
              <div className="massive-code" style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '6px', color: 'var(--primary-color)', lineHeight: 1 }}>
                {createdRoomCode}
              </div>
              <p style={{ color: 'var(--text-gray)', marginTop: '0.75rem', fontSize: '0.9rem' }}>
                Ask your students to enter this code to join.
              </p>
              <MagneticButton style={{ 
                marginTop: '1.5rem', 
                width: '100%', 
                padding: '0.9rem', 
                fontSize: '1.05rem', 
                backgroundColor: '#111',
                color: '#fff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                fontWeight: 600,
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
              }}>
                Launch Projector Dashboard
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </MagneticButton>
            </div>
          ) : (
            <>
              <div className="teacher-badge">✨ TEACHERS START HERE</div>
              <MagneticButton
                type="button"
                className="btn-google"
                onClick={() => alert('Signing in with Google Educational Account...')}
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google Logo"
                  className="google-icon"
                />
                Sign up with Google
              </MagneticButton>

              <div className="divider">
                <span>or using email</span>
              </div>

              <div className="email-signup">
                <label className="email-label">Enter email to create your first quiz for free:</label>
                <form onSubmit={handleTeacherSignup} className="email-form">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@yourschool.edu"
                    className="email-input"
                    required
                    disabled={isLoading}
                  />
                  <MagneticButton type="submit" className="btn-start" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
                    {isLoading ? 'Creating...' : 'Start for free'}
                  </MagneticButton>
                </form>
                {error && <div className="error-message" style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 600 }}>{error}</div>}
              </div>

              <p className="terms-text">By signing up you accept our terms of use and policies.</p>
            </>
          )}
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-image-wrapper">
          <img
            src="/classroom_wholesome.jpg"
            alt="Wholesome animated classroom with teacher asking a quiz question and students raising hands"
            className="hero-image"
          />
        </div>
        <StudentJoinStrip />
      </div>
    </main>
  );
}
