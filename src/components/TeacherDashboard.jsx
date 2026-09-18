import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import MagneticButton from './MagneticButton.jsx';

export default function TeacherDashboard({ roomCode, hostId }) {
  const [players, setPlayers] = useState([]);
  const [isHostConnected, setIsHostConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Connect to the room as the host
    const socket = io('http://localhost:5000', {
      autoConnect: true
    });

    socket.emit('join_room', { roomCode, nickname: 'Teacher', hostId });

    socket.on('room_joined', (data) => {
      setIsHostConnected(true);
    });

    socket.on('lobby_update', (data) => {
      setPlayers(data.players || []);
    });

    socket.on('room_error', (data) => {
      setError(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomCode, hostId]);

  if (error) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fee2e2', color: '#b91c1c' }}>
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard" style={{ minHeight: '100vh', padding: '2rem', backgroundColor: '#f8fafc' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-gray)' }}>Join at <strong style={{ color: 'var(--primary-color)' }}>quizplus.app</strong></h2>
          <div style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '8px', color: '#111', lineHeight: 1 }}>{roomCode}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{players.length}</div>
          <div style={{ color: 'var(--text-gray)' }}>Players Waiting</div>
        </div>
      </header>
      
      <main>
        {players.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-gray)' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 300 }}>Waiting for students to join...</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {players.map((p, idx) => (
              <div key={p.socketId} style={{ 
                backgroundColor: '#fff', 
                padding: '1rem', 
                borderRadius: '12px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontWeight: 600,
                animation: 'slide-up 0.3s ease-out forwards'
              }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: `hsl(${(idx * 50) % 360}, 80%, 90%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  {p.avatar || '👤'}
                </div>
                {p.nickname}
              </div>
            ))}
          </div>
        )}
      </main>

      {players.length > 0 && (
        <footer style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', animation: 'slide-up 0.5s ease-out forwards' }}>
          <MagneticButton style={{ padding: '1.2rem 4rem', fontSize: '1.2rem', backgroundColor: 'var(--primary-color)', color: '#fff', borderRadius: '50px', boxShadow: '0 8px 30px rgba(124, 58, 237, 0.4)' }}>
            START QUIZ
          </MagneticButton>
        </footer>
      )}
      
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
