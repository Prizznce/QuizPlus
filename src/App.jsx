import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import ImpactMetrics from './components/ImpactMetrics.jsx';
import TestimonialsMarquee from './components/TestimonialsMarquee.jsx';
import Footer from './components/Footer.jsx';
import TeacherDashboard from './components/TeacherDashboard.jsx';
import Battlezone from './components/Battlezone.jsx';
import ProfileSetupView from './components/ProfileSetupView.jsx';

export default function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [pendingRoomCode, setPendingRoomCode] = useState(null);

  if (dashboardData) {
    return <TeacherDashboard roomCode={dashboardData.roomCode} hostId={dashboardData.hostId} />;
  }

  if (studentData) {
    return <Battlezone roomCode={studentData.roomCode} nickname={studentData.nickname} avatar={studentData.avatar} />;
  }

  return (
    <div className="app">
      <Navbar />
      <Hero 
        onLaunchDashboard={(roomCode, hostId) => setDashboardData({ roomCode, hostId })}
        onJoinBattlezone={(roomCode) => setPendingRoomCode(roomCode)}
      />
      <ImpactMetrics />
      <TestimonialsMarquee />
      <Footer />

      {pendingRoomCode && (
        <ProfileSetupView 
          roomCode={pendingRoomCode} 
          onComplete={(nickname, avatar) => {
            setPendingRoomCode(null);
            setStudentData({ roomCode: pendingRoomCode, nickname, avatar });
          }} 
        />
      )}
    </div>
  );
}
