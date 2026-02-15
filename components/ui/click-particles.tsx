"use client";

import * as React from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  opacity: number;
}

export function ClickParticles() {
  const [particles, setParticles] = React.useState<Particle[]>([]);
  const particleIdRef = React.useRef(0);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newParticles: Particle[] = [];
      const particleCount = 12;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
        newParticles.push({
          id: particleIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          angle,
          speed: 2 + Math.random() * 3,
          size: 3 + Math.random() * 4,
          opacity: 1,
        });
      }

      setParticles((prev) => [...prev, ...newParticles]);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Animate particles
  React.useEffect(() => {
    if (particles.length === 0) return;

    const animationFrame = requestAnimationFrame(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + Math.cos(p.angle) * p.speed,
            y: p.y + Math.sin(p.angle) * p.speed,
            opacity: p.opacity - 0.04,
            speed: p.speed * 0.95,
          }))
          .filter((p) => p.opacity > 0)
      );
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [particles]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 6px 2px rgba(255, 255, 255, 0.5)",
          }}
        />
      ))}
    </div>
  );
}
