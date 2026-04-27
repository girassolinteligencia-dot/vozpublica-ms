'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Fragmento } from '@/components/fragmento/Fragmento';

interface Atributo {
  id: string;
  nome: string;
}

interface Candidato {
  id: string;
  nome: string;
  cargo: string;
  cidade: string;
  foto_url?: string;
  campanha: {
    atributos: { atributo: Atributo }[];
  };
}

interface Etapa4Props {
  candidato: Candidato;
  evaluations: { atributoId: string; valor: number }[];
  onAttributeClick: (id: string, valor: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  parallax: { x: number; y: number };
}

export const Etapa4: React.FC<Etapa4Props> = ({ 
  candidato, 
  evaluations, 
  onAttributeClick, 
  onSubmit, 
  isSubmitting,
  parallax 
}) => {
  const totalAtributos = candidato.campanha.atributos.length;
  const progresso = (evaluations.length / totalAtributos) * 100;

  const getArcPosition = (index: number, total: number, startAngle: number, endAngle: number, radius: number) => {
    const angleRange = endAngle - startAngle;
    const angleStep = angleRange / (total - 1 || 1);
    const angle = (startAngle + angleStep * index) * (Math.PI / 180);
    return { x: Math.cos(angle) * radius, y: -Math.sin(angle) * radius };
  };

  return (
    <motion.div 
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Pulsante quando avalia */}
      <AnimatePresence>
        {evaluations.length > 0 && (
          <motion.div 
            key={evaluations.length}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 bg-[#d97757] rounded-full blur-[100px] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Energy Bar (Radial) */}
      <div className="absolute z-15 w-[140px] h-[140px] sm:w-[180px] sm:h-[180px]">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
          <circle
            cx="90"
            cy="90"
            r="85"
            fill="none"
            stroke="#1c1814"
            strokeWidth="2"
          />
          <motion.circle
            cx="90"
            cy="90"
            r="85"
            fill="none"
            stroke="#d97757"
            strokeWidth="4"
            strokeDasharray="534"
            animate={{ strokeDashoffset: 534 - (534 * progresso) / 100 }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Foto Central (Camada de Foco) */}
      <motion.div 
        className="relative z-20 w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] rounded-full border-2 border-[#d97757] overflow-hidden shadow-[0_0_50px_rgba(217,119,87,0.3)] bg-[#1c1814]"
        style={{ x: parallax.x * 2, y: parallax.y * 2 }} 
        animate={evaluations.length > 0 ? { scale: [1, 1.05, 1] } : {}}
      >
        {candidato.foto_url ? (
          <Image 
            src={candidato.foto_url} 
            alt={candidato.nome} 
            width={150}
            height={150}
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#d97757]/40 bg-[#1c1814]">
            <span className="text-[10px] font-bold uppercase tracking-widest">{candidato.nome.split(' ')[0]}</span>
          </div>
        )}
      </motion.div>

      {/* Halo de Foco */}
      <motion.div
        className="absolute z-10 w-[180px] h-[180px] sm:w-[210px] sm:h-[210px] rounded-full border border-[#d97757]/10 blur-xl"
        style={{ x: parallax.x * 4, y: parallax.y * 4 }}
        animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Fragmentos de Plasma (Orbitais) */}
      {candidato.campanha.atributos.map((attr, i) => {
        const item = attr.atributo;
        const isEvaluated = evaluations.some(e => e.atributoId === item.id);
        if (isEvaluated) return null;

        // Dynamic radius for better mobile fit
        // Use a smaller radius on very small screens to avoid horizontal overflow
        const orbitalRadius = typeof window !== 'undefined' && window.innerWidth < 360 ? 135 : 160;
        const pos = getArcPosition(i, totalAtributos, 120, 420, orbitalRadius);
        
        return (
          <motion.div 
            key={item.id}
            className="absolute z-30"
            style={{ left: `calc(50% + ${pos.x}px)`, top: `calc(50% + ${pos.y}px)` }}
            animate={{ x: parallax.x * 5, y: parallax.y * 5 }}
            exit={{ 
              scale: 0, 
              x: -pos.x, 
              y: -pos.y, 
              opacity: 0, 
              transition: { type: 'spring', stiffness: 200, damping: 20 } 
            }}
          >
            <Fragmento 
              id={item.id}
              label={item.nome} 
              type="positivo" 
              onClick={() => onAttributeClick(item.id, 1)} 
            />
          </motion.div>
        );
      })}

      {/* Overlay de Informação e CTA */}
      <div className="absolute bottom-safe left-0 w-full px-6 flex flex-col items-center gap-4 z-40 pb-8">
        <div className="text-center">
          <h2 className="text-base font-bold font-display uppercase tracking-[0.2em] text-[#d97757] line-clamp-1">{candidato.nome}</h2>
          <p className="text-[9px] text-[#7a6e64] font-body uppercase tracking-widest mt-1">
            {candidato.cargo} | {candidato.cidade}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 w-full max-w-[280px]">
          <button 
            onClick={onSubmit}
            disabled={evaluations.length === 0 || isSubmitting}
            className={`w-full py-4 rounded-full font-bold text-[9px] uppercase tracking-[0.4em] transition-all duration-700 ${
              evaluations.length > 0 
                ? 'bg-[#d97757] text-[#f5f0e8] shadow-xl shadow-[#d97757]/30 scale-100 hover:scale-105 active:scale-95' 
                : 'bg-[#1c1814] text-[#7a6e64] opacity-40 cursor-not-allowed border border-[#3d3128]'
            }`}
          >
            {isSubmitting ? 'Sincronizando...' : 'Confirmar Voto'}
          </button>
          
          <motion.p 
            key={evaluations.length}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 0.6, y: 0 }}
            className="text-[7px] text-[#7a6e64] uppercase tracking-widest text-center"
          >
            {evaluations.length === 0 ? 'Toque nos fragmentos ao redor' : `${evaluations.length} atributos vinculados`}
          </motion.p>
        </div>
      </div>

      {/* Grão de Fundo (Camada de Textura) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('/gi/noise.png')]" />
    </motion.div>
  );
};
