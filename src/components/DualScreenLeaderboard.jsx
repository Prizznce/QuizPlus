import React from 'react';

export default function DualScreenLeaderboard() {
  const pollData = [
    { name: 'Britney', votes: 1, max: 1, correct: false, color: '#A9C4F5' },
    { name: 'Beyonce', votes: 1, max: 1, correct: true, color: '#F48BAF' },
    { name: 'Celine\nDion', votes: 1, max: 1, correct: false, color: '#F2C1B8' },
    { name: 'Ariana\nGrande', votes: 0, max: 1, correct: false, color: '#E2E8F0' },
    { name: 'Kelly\nRowland', votes: 0, max: 1, correct: false, color: '#E2E8F0' },
  ];

  const perks = [
    {
      icon: '🔥',
      title: 'Streak Multipliers',
      desc: 'Rewards consecutive correct answers with point multipliers to keep top students fully challenged.',
    },
    {
      icon: '🚀',
      title: 'Biggest Climber Spotlights',
      desc: 'Highlights students making big jumps on each question, proving that anyone can climb to victory.',
    },
    {
      icon: '🔒',
      title: 'Zero-Embarrassment Privacy',
      desc: 'Every student receives their personal rank and encouraging targets on their phone without being called out.',
    },
  ];

  return (
    <div className="dual-screen-showcase-section" id="how-it-works">
      <div className="showcase-header">
        <div className="showcase-badge">⚡ SYNCHRONIZED DUAL-SCREEN EXPERIENCE</div>
        <h3 className="showcase-heading">
          Live Rankings on the Big Screen. Private Rank on Every Student's Phone.
        </h3>
        <p className="showcase-subheading">
          After every question, the whole classroom comes alive. The projector displays the top contenders to spark friendly competition, while every student receives their exact rank, point gains, and personal motivation on their own screen.
        </p>
      </div>

      {/* Horizontal Side-by-Side Boards Container */}
      <div className="horizontal-boards-row">
        {/* Board 1: Classroom Projector */}
        <div className="board-column projector-board">
          <div className="board-top-bar">
            <div className="board-tab-title">
              <span className="board-icon">📺</span>
              <strong>Classroom Projector View</strong>
            </div>
            <div className="board-live-pill">
              <span className="live-dot"></span> LIVE STANDINGS
            </div>
          </div>

          <div className="board-inner trivia-board">
            <h2 className="trivia-question">Whose 2013 world tour was called 'The Mrs Carter Show'?</h2>
            
            <div className="poll-chart-container">
              <div className="poll-chart">
                {pollData.map((item, idx) => (
                  <div key={idx} className="poll-bar-col">
                    <div className="poll-icon">
                      {item.correct ? <span style={{color: '#4ADE80'}}>✔</span> : <span style={{color: '#F87171'}}>✖</span>}
                    </div>
                    <div className="poll-bar-wrapper">
                      <div 
                        className="poll-bar" 
                        style={{ 
                          height: item.votes > 0 ? '100%' : '0%', 
                          backgroundColor: item.color,
                          borderTop: item.votes === 0 ? 'none' : ''
                        }}
                      >
                        {item.votes > 0 && <span className="poll-vote-count">{item.votes}</span>}
                      </div>
                    </div>
                    <div className="poll-label" style={{ fontWeight: item.correct ? '700' : '400' }}>
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
              <div className="poll-baseline"></div>
            </div>

            <div className="board-footer-note">
              <span>🎉 1 student got the correct answer!</span>
            </div>
          </div>
        </div>

        {/* Board 2: Individual Student's Phone Screen */}
        <div className="board-column student-phone-board">
          <div className="board-top-bar dark">
            <div className="board-tab-title">
              <span className="board-icon">📱</span>
              <strong>Student's Personal Phone Screen</strong>
            </div>
            <div className="student-status-pill">✓ CONNECTED</div>
          </div>

          <div className="phone-inner">
            <div className="phone-result-banner">
              <span className="banner-icon">🎯</span>
              <div>
                <strong>CORRECT ANSWER!</strong>
                <span>+390 pts (Speed bonus awarded)</span>
              </div>
            </div>

            <div className="personal-rank-display">
              <span className="rank-label">YOUR INDIVIDUAL RANK</span>
              <div className="rank-big-number">
                #6 <span className="rank-out-of">of 28 students</span>
              </div>
              <div className="rank-gain-badge">
                ▲ Climbed 3 spots this question!
              </div>
            </div>

            <div className="personal-stats-grid">
              <div className="p-stat-box">
                <span className="p-stat-val">🔥 2</span>
                <span className="p-stat-lbl">Current Streak</span>
              </div>
              <div className="p-stat-box">
                <span className="p-stat-val">2,910</span>
                <span className="p-stat-lbl">Total Score</span>
              </div>
              <div className="p-stat-box">
                <span className="p-stat-val">94%</span>
                <span className="p-stat-lbl">Accuracy</span>
              </div>
            </div>

            <div className="personal-motivation-card">
              <span className="cheer-emoji">🚀</span>
              <p>
                "Outstanding rebound! You're only <strong>80 pts</strong> away from catching #5 Chloe T. — keep it up!"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Perks Grid Below Both Boards */}
      <div className="showcase-perks-row">
        {perks.map((perk, idx) => (
          <div key={idx} className="showcase-perk-card">
            <div className="perk-badge-icon">{perk.icon}</div>
            <h4>{perk.title}</h4>
            <p>{perk.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
