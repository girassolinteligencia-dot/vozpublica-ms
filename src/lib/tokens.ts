/**
 * PULSOELEITORAL - Design Tokens
 * 
 * Based on the 'Pulso' design system specification.
 */

export const TOKENS = {
  COLORS: {
    BACKGROUND: '#05080f',
    SURFACE_1: '#0d1117',
    SURFACE_2: '#161b22',
    PRIMARY: '#3b82f6',
    POSITIVE: '#10b981',
    NEGATIVE: '#ef4444',
    PROFILE: '#6366f1',
    TEXT: '#f1f5f9',
    TEXT_MUTED: '#64748b',
    BORDER: '#1e293b',
  },
  FONTS: {
    DISPLAY: "'Sora', sans-serif",
    BODY: "'Inter', sans-serif",
  },
  SIZES: {
    FRAGMENT_MOBILE: 60,
    FRAGMENT_TABLET: 80,
    PHOTO_CENTER: 110,
    TOUCH_AREA: 44,
  },
  ANIMATION: {
    PLASMA_DURATION: 4000,
    TRAIL_DECAY_MS: 300,
  }
} as const;

export type Tokens = typeof TOKENS;
