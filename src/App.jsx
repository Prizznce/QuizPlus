import React from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import ImpactMetrics from './components/ImpactMetrics.jsx';
import TestimonialsMarquee from './components/TestimonialsMarquee.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <ImpactMetrics />
      <TestimonialsMarquee />
      <Footer />
    </div>
  );
}
