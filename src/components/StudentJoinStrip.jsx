import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import MagneticButton from './MagneticButton.jsx';

// Initialize socket globally so it doesn't reconnect on re-renders
const socket = io('http://localhost:5000', {
  autoConnect: false // Connect only when they submit
});

export default function StudentJoinStrip() {
  const [code, setCode] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [joinedData, setJoinedData] = useState(null);

  useEffect(() => {
    // Setup socket listeners
    socket.on('room_error', (data) => {
      setIsConnecting(false);
      setError(data.message);
    });

    socket.on('room_joined', (data) => {
      setIsConnecting(false);
      setIsJoined(true);
      setJoinedData(data);
    });

    return () => {
      socket.off('room_error');
      socket.off('room_joined');
    };
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!code.trim() || code.length < 6) {
      setError('Please enter a valid 6-digit quiz code.');
      return;
    }
    
    setIsConnecting(true);
    setError(null);
    
    // Connect socket if not already connected
    if (!socket.connected) {
      socket.connect();
    }
    
    // Attempt to join the room
    socket.emit('join_room', { roomCode: code.trim(), nickname: '' });
  };

  if (isJoined) {
    return (
      <section className="student-join-strip">
        <div className="join-strip-content">
          <div className="join-strip-form" style={{ justifyContent: 'center', backgroundColor: '#dcfce7', borderColor: '#bbf7d0', padding: '1rem' }}>
            <span style={{ color: '#166534', fontWeight: 700, fontSize: '1.1rem' }}>
              Connected as {joinedData?.nickname} to Room {joinedData?.roomCode}! 🚀 Waiting for teacher...
            </span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="student-join-strip">
      <div className="join-strip-content" style={{ flexDirection: 'column', alignItems: 'center' }}>
        <form onSubmit={handleJoin} className="join-strip-form">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit room code"
            className="join-strip-input"
            maxLength={6}
            disabled={isConnecting}
          />
          <MagneticButton type="submit" className="btn-join-massive" disabled={isConnecting} style={{ opacity: isConnecting ? 0.7 : 1 }}>
            {isConnecting ? 'JOINING...' : 'JOIN'}
          </MagneticButton>
        </form>
        {error && <div style={{ color: '#ef4444', fontWeight: 700, marginTop: '0.75rem', backgroundColor: 'rgba(255,255,255,0.9)', padding: '0.25rem 0.75rem', borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>{error}</div>}
      </div>
    </section>
  );
}
