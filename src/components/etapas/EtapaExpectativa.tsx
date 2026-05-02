'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface EtapaExpectativaProps {
  onSelect: (expectativa: boolean) => void;
  onBack: () => void;
}

export const EtapaExpectativa: React.FC<EtapaExpectativaProps> = ({ onSelect, onBack }) => {
  return (
    <motion.div 
      className="relative z-10 w-full h-full flex flex-col items-center px-6 gap-8 overflow-y-auto pt-24 pb-safe no-scrollbar"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center shrink-0">
        <h1 className="text-2xl font-bold font-display uppercase tracking-tight text-[#f5f0e8] drop-shadow-[0_0_15px_rgba(245,240,232,0.3)]">
          Poder de Vitória
        </h1>
        <p className="text-[10px] text-[#b0aea5] uppercase tracking-[0.4em] mt-2 font-bold max-w-[280px] mx-auto leading-relaxed">
          INDEPENDENTE DO SEU VOTO, VOCÊ ACREDITA QUE ESTE CANDIDATO TEM FORÇA PARA VENCER?
        </p>
      </div>

      <div className="w-full max-w-[340px] flex flex-col gap-4 mt-8">
        <motion.button 
          onClick={() => onSelect(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#1c1814]/50 border border-[#3d3128] rounded-[2rem] p-10 flex flex-col items-center gap-4 group transition-all hover:border-[#c8933a]/50 hover:bg-[#c8933a]/5"
        >
          <div className="w-20 h-20 rounded-full bg-[#141413] border border-[#3d3128] flex items-center justify-center group-hover:border-[#c8933a] transition-all">
            <span className="text-4xl">⚡</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5f0e8] group-hover:text-[#c8933a] transition-colors">Tem Força</span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-[#7a6e64] mt-1">Percepção de Protagonismo</span>
          </div>
        </motion.button>

        <motion.button 
          onClick={() => onSelect(false)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#1c1814]/50 border border-[#3d3128] rounded-[2rem] p-10 flex flex-col items-center gap-4 group transition-all hover:border-[#7a6e64]/50 hover:bg-[#7a6e64]/5"
        >
          <div className="w-20 h-20 rounded-full bg-[#141413] border border-[#3d3128] flex items-center justify-center group-hover:border-[#f5f0e8] transition-all opacity-40">
            <span className="text-4xl grayscale">☁️</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5f0e8] opacity-60 transition-colors group-hover:opacity-100">Sem Força</span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-[#7a6e64] mt-1">Percepção de Figurante</span>
          </div>
        </motion.button>
      </div>

      <div className="mt-auto pb-12 flex flex-col items-center gap-4 w-full">
        <button 
          onClick={onBack} 
          className="text-[9px] uppercase font-bold text-[#7a6e64] tracking-[0.3em] hover:text-[#f5f0e8] transition-colors"
        >
          ← Voltar à Aprovação
        </button>
      </div>
    </motion.div>
  );
};
