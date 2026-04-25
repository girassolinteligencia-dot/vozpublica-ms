'use client';

import React, { useId } from 'react';
import styles from '@/styles/fragmento.module.css';

interface FragmentoNucleoProps {
  color: string;
}

/**
 * Layer 1: Nucleus - Animated SVG plasma with feTurbulence.
 */
export const FragmentoNucleo: React.FC<FragmentoNucleoProps> = ({ color }) => {
  const filterId = useId();

  return (
    <div className={styles.nucleus}>
      <svg className={styles.plasmaFilter} viewBox="0 0 100 100">
        <defs>
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2">
              <animate 
                attributeName="baseFrequency" 
                values="0.3;0.8;0.3" 
                dur="4s" 
                repeatCount="indefinite" 
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="15" />
          </filter>
        </defs>
        <circle cx="50" cy="50" r="35" fill={color} filter={`url(#${filterId})`} />
      </svg>
    </div>
  );
};
