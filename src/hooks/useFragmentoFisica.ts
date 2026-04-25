import { useEffect } from 'react';
import gsap from 'gsap';

/**
 * Hook for generating asynchronous idle physics for plasma fragments.
 */
export const useFragmentoFisica = (targetRef: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    // Random amplitudes and durations for organic feel
    const amplitudeX = Math.random() * 15 + 5;
    const amplitudeY = Math.random() * 15 + 5;
    const durationX = Math.random() * 2 + 3;
    const durationY = Math.random() * 2 + 3;

    // X-axis oscillation
    gsap.to(element, {
      x: `+=${amplitudeX}`,
      duration: durationX,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });

    // Y-axis oscillation
    gsap.to(element, {
      y: `+=${amplitudeY}`,
      duration: durationY,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: Math.random() // De-sync fragments
    });

    return () => {
      if (element) gsap.killTweensOf(element);
    };
  }, [targetRef]);
};
