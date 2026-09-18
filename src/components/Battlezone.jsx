import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function Battlezone({ roomCode, nickname, avatar }) {
  const [error, setError] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    // Connect to the room
    const socket = io('http://localhost:5000', {
      autoConnect: true
    });

    socket.emit('join_room', { roomCode, nickname, avatar });

    socket.on('room_joined', () => {
      setIsJoined(true);
    });

    socket.on('lobby_update', (data) => {
      setPlayerCount(data.players?.length || 0);
    });

    socket.on('room_error', (data) => {
      setError(data.message);
    });

    socket.on('host_disconnected', () => {
      // Just visually warn them, but keep them in the lobby
      console.warn("Host disconnected, waiting for host to return...");
    });

    return () => {
      socket.disconnect();
    };
  }, [roomCode, nickname, avatar]);

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fee2e2', color: '#b91c1c' }}>
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="battlezone" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <header style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary-color)' }}>QuiZ+</h1>
        <div style={{ fontWeight: 600, color: 'var(--text-gray)' }}>Room: {roomCode}</div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        {!isJoined ? (
          <h2 style={{ color: 'var(--text-gray)' }}>Connecting to Battlezone...</h2>
        ) : (
          <div style={{ animation: 'slide-up 0.5s ease-out forwards' }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              backgroundColor: 'var(--primary-color)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '4rem', 
              margin: '0 auto 1.5rem',
              boxShadow: '0 10px 30px rgba(124, 58, 237, 0.3)'
            }}>
              {avatar}
            </div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>You're in, {nickname}!</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-gray)', marginBottom: '2rem' }}>
              Waiting for the teacher to start the quiz...
            </p>
            
            <div style={{ display: 'inline-block', backgroundColor: '#fff', padding: '1rem 2rem', borderRadius: '50px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', fontWeight: 600 }}>
              {playerCount} players waiting
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
