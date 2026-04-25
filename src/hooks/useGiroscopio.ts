'use client';

import { useEffect, useState, useCallback } from 'react';

interface ParallaxState {
  x: number;
  y: number;
}

/**
 * Hook for gyroscope/parallax movement with Lerp smoothing.
 */
export const useGiroscopio = (lerpFactor: number = 0.06) => {
  const [offset, setOffset] = useState<ParallaxState>({ x: 0, y: 0 });
  const [target, setTarget] = useState<ParallaxState>({ x: 0, y: 0 });

  const handleDeviceOrientation = useCallback((e: DeviceOrientationEvent) => {
    const { beta, gamma } = e; // beta: front-to-back, gamma: left-to-right
    if (beta !== null && gamma !== null) {
      // Normalize values (typical range -30 to 30)
      const x = Math.max(-1, Math.min(1, gamma / 30));
      const y = Math.max(-1, Math.min(1, (beta - 45) / 30)); // 45deg as neutral tilt
      setTarget({ x, y });
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setTarget({ x, y });
  }, []);

  useEffect(() => {
    // Fallback to mouse move if device orientation is not available
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    } else {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Animation loop for Lerp
    let animationFrameId: number;
    const animate = () => {
      setOffset(prev => ({
        x: prev.x + (target.x - prev.x) * lerpFactor,
        y: prev.y + (target.y - prev.y) * lerpFactor,
      }));
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [handleDeviceOrientation, handleMouseMove, target, lerpFactor]);

  return offset;
};
