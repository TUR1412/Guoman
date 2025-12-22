import React, { useMemo } from 'react';
import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';

const Layer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: visible;
`;

const Particle = styled(motion.span)`
  position: absolute;
  left: var(--confetti-x, 50%);
  top: var(--confetti-y, 50%);
  width: var(--size);
  height: var(--size);
  border-radius: var(--radius);
  background: var(--color);
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.28));
`;

const mulberry32 = (seed) => {
  let t = Number(seed) || 0;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

const pick = (arr, rand) => arr[Math.floor(rand() * arr.length)] || arr[0];

function ConfettiBurst({
  seed = 1,
  count = 18,
  spread = 84,
  maxDistance = 120,
  originX = '50%',
  originY = '50%',
}) {
  const reducedMotion = useReducedMotion();

  const particles = useMemo(() => {
    const rand = mulberry32(seed);
    const colors = [
      'var(--primary-color)',
      'var(--secondary-color)',
      'var(--accent-color)',
      'rgba(var(--primary-rgb), 0.92)',
      'rgba(var(--secondary-rgb), 0.9)',
    ];

    return Array.from({ length: Math.max(6, Number(count) || 0) }, (_, idx) => {
      const angle = (rand() - 0.5) * 2 * Math.PI * (spread / 180) - Math.PI / 2;
      const distance = 56 + rand() * maxDistance;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance + rand() * 18;
      const size = 5 + rand() * 4;
      const radius = rand() > 0.4 ? 999 : 2 + rand() * 6;
      const rotate = (rand() - 0.5) * 920;
      const duration = 0.55 + rand() * 0.25;

      return {
        id: `${seed}-${idx}`,
        dx,
        dy,
        size,
        radius,
        rotate,
        duration,
        color: pick(colors, rand),
        delay: rand() * 0.05,
      };
    });
  }, [count, maxDistance, seed, spread]);

  if (reducedMotion) return null;

  return (
    <Layer
      data-testid="confetti-burst"
      aria-hidden="true"
      style={{ '--confetti-x': originX, '--confetti-y': originY }}
    >
      {particles.map((p) => (
        <Particle
          key={p.id}
          style={{
            '--size': `${p.size}px`,
            '--radius': `${p.radius}px`,
            '--color': p.color,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 0.9, rotate: p.rotate }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </Layer>
  );
}

export default ConfettiBurst;
