import React from 'react';

export default function TestimonialsMarquee() {
  const testimonials = [
    {
      img: 'https://i.pravatar.cc/150?img=32',
      quote: '"My students are more engaged than ever before."',
      author: 'Sarah J., High School Teacher',
    },
    {
      img: 'https://i.pravatar.cc/150?img=12',
      quote: '"The live polls instantly tell me if they understand the lecture."',
      author: 'Dr. Alan M., University Professor',
    },
    {
      img: 'https://i.pravatar.cc/150?img=5',
      quote: '"A game changer for corporate training sessions."',
      author: 'Jessica T., Corporate Trainer',
    },
    {
      img: 'https://i.pravatar.cc/150?img=68',
      quote: '"Quizzes are now the highlight of our weekly classes."',
      author: 'David K., Math Tutor',
    },
  ];

  // Repeat for seamless infinite scrolling loop
  const loopItems = [...testimonials, ...testimonials];

  return (
    <section className="testimonials-scroll">
      <div className="testimonials-track">
        {loopItems.map((item, index) => (
          <div key={index} className="testimonial-card">
            <img
              src={item.img}
              alt={item.author}
              className="testimonial-avatar"
              loading="lazy"
            />
            <div className="testimonial-content">
              <p className="testimonial-text">{item.quote}</p>
              <span className="testimonial-author">{item.author}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
