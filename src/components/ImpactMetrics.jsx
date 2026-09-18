import React, { useEffect, useRef, useState } from 'react';

const CountUp = ({ end, decimals = 0, suffix = '', prefix = '', duration = 1500, isVisible }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setValue(0);
      return;
    }

    let startTime = null;
    let animationFrameId;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      // ease-out cubic
      const easeOut = 1 - Math.pow(1 - percentage, 3);
      
      setValue(easeOut * end);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, end, duration]);

  return <>{prefix}{value.toFixed(decimals)}{suffix}</>;
};

export default function ImpactMetrics() {
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [isChartsVisible, setIsChartsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const statsRef = useRef(null);
  const chartsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const retentionData = [
    { time: 'After 24 Hours', passive: 52, active: 94 },
    { time: 'After 7 Days', passive: 34, active: 86 },
    { time: 'After 30 Days', passive: 21, active: 78 },
  ];

  useEffect(() => {
    const statsObserver = new IntersectionObserver(
      ([entry]) => setIsStatsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    const chartsObserver = new IntersectionObserver(
      ([entry]) => setIsChartsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (statsRef.current) statsObserver.observe(statsRef.current);
    if (chartsRef.current) chartsObserver.observe(chartsRef.current);

    return () => {
      if (statsRef.current) statsObserver.unobserve(statsRef.current);
      if (chartsRef.current) chartsObserver.unobserve(chartsRef.current);
    };
  }, []);

  return (
    <section className="impact-section" id="impact">
      <div 
        className="massive-bg-text"
        style={{ transform: `translateX(${scrollY * 0.3 - 600}px)` }}
      >
        INTERACTIVE QUIZ ENGINE
      </div>
      <div 
        className="massive-bg-text offset"
        style={{ transform: `translateX(${scrollY * -0.25}px)` }}
      >
        DATA DRIVEN INSIGHTS
      </div>

      <div className="section-header">
        <div className="section-badge">PROVEN IMPACT</div>
      </div>
      <h2 className="section-heading">Why Active Quizzing Outperforms Traditional Lectures</h2>
      <p className="section-subheading">
        Data collected from over 1,200 classrooms shows measurable improvements in retention, attention, and test scores when students participate directly from their phones.
      </p>

      {/* Stat Counter Grid */}
      <div className="stats-overview-grid" ref={statsRef}>
        <div className="stat-card" style={{ opacity: isStatsVisible ? 1 : 0, transform: isStatsVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s' }}>
          <div className="stat-number">
            <CountUp end={3.4} decimals={1} suffix="x" isVisible={isStatsVisible} duration={1200} />
          </div>
          <div className="stat-title">Long-term Retention</div>
          <p className="stat-desc">
            Students retain material 3.4x longer through immediate active recall compared to passive listening.
          </p>
        </div>
        <div className="stat-card" style={{ opacity: isStatsVisible ? 1 : 0, transform: isStatsVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s' }}>
          <div className="stat-number">
            <CountUp end={92} suffix="%" isVisible={isStatsVisible} duration={1200} />
          </div>
          <div className="stat-title">Total Class Participation</div>
          <p className="stat-desc">
            Even shy students participate when answering anonymously and interactively on their mobile devices.
          </p>
        </div>
        <div className="stat-card" style={{ opacity: isStatsVisible ? 1 : 0, transform: isStatsVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease-out 0.5s, transform 0.6s ease-out 0.5s' }}>
          <div className="stat-number">
            <CountUp end={60} prefix="&lt;" suffix="s" isVisible={isStatsVisible} duration={1200} />
          </div>
          <div className="stat-title">Real-time Feedback</div>
          <p className="stat-desc">
            Teachers immediately identify learning gaps during the class, not two weeks later on exam day.
          </p>
        </div>
      </div>

      {/* Comparative Chart Dashboard */}
      <div className="chart-dashboard" ref={chartsRef}>
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Knowledge Retention Over Time</h3>
              <p className="chart-subtitle">Standard lecture vs. QuiZ+ interactive sessions</p>
            </div>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot traditional"></span> Passive Lecture
              </span>
              <span className="legend-item">
                <span className="legend-dot quizplus"></span> QuiZ+ Active Recall
              </span>
            </div>
          </div>

          <div className="bar-chart-group">
            {retentionData.map((row, idx) => (
              <div key={idx} className="chart-row">
                <div className="row-label">{row.time}</div>
                <div className="bars-container">
                  <div className="bar-wrapper">
                    <div className="bar passive" style={{ width: isChartsVisible ? `${row.passive}%` : '0%', transition: 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)' }}>
                      <span className="bar-val">{row.passive}%</span>
                    </div>
                  </div>
                  <div className="bar-wrapper">
                    <div className="bar active" style={{ width: isChartsVisible ? `${row.active}%` : '0%', transition: 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.3s' }}>
                      <span className="bar-val">{row.active}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card metrics-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Classroom Engagement Metrics</h3>
              <p className="chart-subtitle">Measured student attentiveness during 50-minute sessions</p>
            </div>
          </div>

          <div className="metric-progress-list">
            <div className="progress-item">
              <div className="progress-info">
                <span className="progress-label">Students answering every question</span>
                <span className="progress-percent">94%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: isChartsVisible ? '94%' : '0%', transition: 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.5s' }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-info">
                <span className="progress-label">Instant concept comprehension</span>
                <span className="progress-percent">88%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: isChartsVisible ? '88%' : '0%', transition: 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.7s' }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-info">
                <span className="progress-label">Students reporting higher interest</span>
                <span className="progress-percent">91%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: isChartsVisible ? '91%' : '0%', transition: 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.9s' }}></div>
              </div>
            </div>

            <div className="benchmark-pill">
              <span className="pill-badge">Insight</span>
              <span>Interactive live questions increase student focus by <strong>+67%</strong> over traditional slide presentations.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
