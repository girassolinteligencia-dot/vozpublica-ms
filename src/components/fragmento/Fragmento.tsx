'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FragmentoNucleo } from './FragmentoNucleo';
import { useFragmentoFisica } from '@/hooks/useFragmentoFisica';
import styles from '@/styles/fragmento.module.css';
import { TOKENS } from '@/lib/tokens';

interface FragmentoProps {
  label: string;
  type: 'positivo' | 'negativo' | 'perfil';
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * PULSOELEITORAL - Fragmento de Plasma (Core Component)
 * Implementation of all 5 visual layers and physics.
 */
export const Fragmento: React.FC<FragmentoProps> = ({ label, type, onClick, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useFragmentoFisica(containerRef as React.RefObject<HTMLDivElement>);

  const color = type === 'positivo' 
    ? TOKENS.COLORS.POSITIVE 
    : type === 'negativo' 
    ? TOKENS.COLORS.NEGATIVE 
    : TOKENS.COLORS.PROFILE;

  return (
    <motion.div
      ref={containerRef}
      className={styles.fragmentContainer}
      style={{ 
        width: TOKENS.SIZES.FRAGMENT_MOBILE, 
        height: TOKENS.SIZES.FRAGMENT_MOBILE,
        color,
        ...style 
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Layer 3: Field (Halo) */}
      <div className={styles.field} />

      {/* Layer 1: Nucleus */}
      <FragmentoNucleo color={color} />

      {/* Layer 2: Membrane */}
      <div className={styles.membrane} />

      {/* Layer 4: Satellites */}
      <div className={`${styles.satellite} ${styles.orbit1}`} />
      <div className={`${styles.satellite} ${styles.orbit2}`} />
      <div className={`${styles.satellite} ${styles.orbit3}`} />
      <div className={`${styles.satellite} ${styles.orbit4}`} />

      {/* Label */}
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium uppercase tracking-tighter text-text-muted">
        {label}
      </span>

      {/* Layer 5: Trail (Framer Motion component) */}
      {/* Managed via motion.div's layout/drag if used, but for now simple physics is enough */}
    </motion.div>
  );
};
