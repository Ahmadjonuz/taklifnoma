'use client';

import { memo, useEffect, useState, type CSSProperties } from 'react';

// Stable positions avoid hydration mismatches and keep each opening predictable.
const particles = Array.from({ length: 40 }, (_, index) => ({
  left: 2 + ((index * 37) % 96),
  drift: ((index * 61) % 150) - 75,
  size: 12 + ((index * 7) % 13),
  delay: ((index * 17) % 31) / 100,
  duration: .48 + ((index * 13) % 17) / 100,
  rotation: ((index * 43) % 120) - 60,
  spin: (index % 2 ? 1 : -1) * (240 + ((index * 29) % 300)),
  golden: index % 3 === 0,
}));

function OpeningPetals({ durationSeconds = 14 }: { durationSeconds?: number }) {
  const [visible, setVisible] = useState(true);
  const duration = Math.min(30, Math.max(5, durationSeconds));

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => { if (motion.matches) setVisible(false); };
    const onVisibilityChange = () => { if (document.hidden) setVisible(false); };
    onMotionChange();
    const timer = window.setTimeout(() => setVisible(false), duration * 1000);
    motion.addEventListener('change', onMotionChange);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.clearTimeout(timer);
      motion.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [duration]);

  if (!visible) return null;

  return <div className="opening-petals" aria-hidden="true">
    {particles.map((particle, index) => <span
      key={index}
      className={`falling-petal ${particle.golden ? 'golden' : 'ivory'}`}
      style={{
        left: `${particle.left}%`,
        '--petal-size': `${particle.golden ? 5 + index % 4 : particle.size}px`,
        '--petal-drift': `${particle.drift}px`,
        '--petal-delay': `${particle.delay * duration}s`,
        '--petal-duration': `${particle.duration * duration}s`,
        '--petal-rotation': `${particle.rotation}deg`,
        '--petal-spin': `${particle.spin}deg`,
      } as CSSProperties}
    ><i /></span>)}
  </div>;
}

export default memo(OpeningPetals);
