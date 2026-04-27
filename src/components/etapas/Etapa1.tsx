'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { Fragmento } from '../fragmento/Fragmento';

interface Etapa1Props {
  userData: {
    nome: string;
    cidade: string;
    perfil: string[];
  };
  setUserData: React.Dispatch<React.SetStateAction<{ nome: string; cidade: string; perfil: string[] }>>;
  onNext: () => void;
  cidades: string[];
  perfis: string[];
}

export const Etapa1: React.FC<Etapa1Props> = ({ userData, setUserData, onNext, cidades, perfis }) => {
  const isComplete = userData.nome && userData.cidade && userData.perfil.length > 0;

  const togglePerfil = (p: string) => {
    if (userData.perfil.includes(p)) {
      setUserData({ ...userData, perfil: userData.perfil.filter(item => item !== p) });
    } else if (userData.perfil.length < 3) {
      setUserData({ ...userData, perfil: [...userData.perfil, p] });
    }
  };

  return (
    <motion.div 
      className="relative z-10 w-full h-full flex flex-col items-center px-6 gap-8 overflow-y-auto pt-24 pb-safe no-scrollbar"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="text-center shrink-0">
        <h1 className="text-3xl md:text-4xl font-bold font-display uppercase tracking-tight text-[#f5f0e8]">Identificação</h1>
        <p className="text-[9px] text-[#7a6e64] uppercase tracking-[0.4em] mt-2 font-bold">Prepare sua Voz</p>
      </div>

      <div className="w-full max-w-[340px] flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[9px] uppercase font-bold text-[#d97757] tracking-widest ml-1">Como deseja ser chamado?</label>
          <input 
            type="text" 
            value={userData.nome}
            onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
            className="w-full bg-[#1c1814] border border-[#3d3128] rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#d97757]/50 transition-all placeholder:text-[#7a6e64]/30 text-[#f5f0e8]"
            placeholder="Seu nome ou apelido"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[9px] uppercase font-bold text-[#d97757] tracking-widest ml-1">Sua Localidade (MS)</label>
          <div className="relative">
            <select 
              value={userData.cidade}
              onChange={(e) => setUserData({ ...userData, cidade: e.target.value })}
              title="Selecione sua cidade"
              className="w-full bg-[#1c1814] border border-[#3d3128] rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#d97757]/50 transition-all appearance-none text-[#f5f0e8] cursor-pointer"
            >
              <option value="" className="bg-[#141413]">Selecione sua cidade...</option>
              {cidades.map(c => <option key={c} value={c} className="bg-[#141413]">{c}</option>)}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#d97757]">
              ↓
            </div>
          </div>
        </div>

        <div className="relative">
          <p className="text-[9px] uppercase font-bold text-[#d97757] tracking-widest mb-6 text-center">Seu Perfil de Eleitor</p>
          
          {/* Fragment Cloud - Optimized for Mobile Viewport */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-10 min-h-[140px] px-2">
            {perfis.map(p => {
              const isSelected = userData.perfil.includes(p);
              return (
                <div key={p} className="relative">
                  <Fragmento 
                    id={`perfil-${p}`}
                    label={p}
                    type="perfil"
                    onClick={() => togglePerfil(p)}
                    style={{ 
                      width: isSelected ? '64px' : '56px', 
                      height: isSelected ? '64px' : '56px',
                      opacity: isSelected ? 1 : 0.5,
                      filter: isSelected ? 'none' : 'grayscale(100%) brightness(0.7)',
                      transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  />
                  {isSelected && (
                    <motion.div 
                      layoutId="perfil-indicator"
                      className="absolute -top-1 -right-1 w-3 h-3 bg-[#d97757] rounded-full shadow-[0_0_10px_#d97757] z-50"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[8px] text-center text-[#7a6e64] uppercase mt-6 opacity-70 tracking-widest font-bold">Até 3 características (Toque p/ vincular)</p>
        </div>
      </div>

      <div className="mt-auto pb-8">
        <button 
          onClick={() => onNext()}
          disabled={!isComplete}
          className={`relative z-50 px-12 py-5 rounded-full font-bold text-[10px] uppercase tracking-[0.4em] transition-all duration-700 ${
            isComplete
              ? 'bg-[#d97757] text-[#f5f0e8] shadow-[0_0_50px_rgba(217,119,87,0.4)] scale-100 hover:scale-105 active:scale-95 cursor-pointer opacity-100' 
              : 'bg-[#1c1814] text-[#7a6e64] opacity-20 scale-95 cursor-not-allowed border border-[#3d3128]'
          }`}
        >
          Iniciar Experiência
        </button>
      </div>
    </motion.div>
  );
};
