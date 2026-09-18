import React, { useRef, useState } from 'react';

export default function MagneticButton({ children, className, onClick, type = "button", style = {} }) {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = buttonRef.current.getBoundingClientRect();
    
    // Calculate distance from center of the button
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate pull (adjust multiplier for stronger/weaker effect)
    const pullX = (clientX - centerX) * 0.3;
    const pullY = (clientY - centerY) * 0.3;

    setPosition({ x: pullX, y: pullY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={buttonRef}
      className={className}
      onClick={onClick}
      type={type}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 && position.y === 0 ? 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
      }}
    >
      <span 
        style={{
          display: 'inline-block',
          transform: `translate(${position.x * 0.3}px, ${position.y * 0.3}px)`,
          transition: position.x === 0 && position.y === 0 ? 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
        }}
      >
        {children}
      </span>
    </button>
  );
}
