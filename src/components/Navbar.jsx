import React, { useState, useEffect } from 'react';
import MagneticButton from './MagneticButton.jsx';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      if (newTheme) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      }
      return newTheme;
    });
  };

  return (
    <header className="navbar">
      <div className="nav-left">
        <a href="#" className="logo">QuiZ+</a>
      </div>

      <div className="nav-right">
        <nav className="nav-links">
          <a href="#teachers">For Teachers</a>
          <a href="#impact">Platform Impact</a>
        </nav>
        <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle dark mode" style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', marginRight: '1rem', marginLeft: '1rem' }}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <a href="#login" className="login-link">Log In</a>
        <MagneticButton className="btn-signup">Sign Up</MagneticButton>
      </div>
    </header>
  );
}
