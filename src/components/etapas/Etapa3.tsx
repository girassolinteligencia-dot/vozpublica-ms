'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Fragmento } from '../fragmento/Fragmento';

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

interface Etapa3Props {
  cargo: string;
  cidade: string;
  candidatos: Candidato[];
  onSelect: (candidato: Candidato) => void;
  onBack: () => void;
}

export const Etapa3: React.FC<Etapa3Props> = ({ cargo, cidade, candidatos, onSelect, onBack }) => {
  return (
    <>
      {/* Background Decorativo: Micro-fragmentos */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] right-[10%]">
          <Fragmento id="e3-bg-1" label="" type="positivo" style={{ width: '150px', height: '150px', filter: 'blur(30px)' }} />
        </div>
        <div className="absolute bottom-[10%] left-[5%]">
          <Fragmento id="e3-bg-2" label="" type="perfil" style={{ width: '180px', height: '180px', filter: 'blur(40px)' }} />
        </div>
      </div>

      <motion.div 
        className="relative z-10 w-full h-full flex flex-col items-center pt-24 px-6 gap-6 overflow-y-auto pb-safe no-scrollbar"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center w-full shrink-0">
          <span className="text-[8px] font-bold text-[#d97757] uppercase tracking-[0.4em] mb-2 block">Seleção de</span>
          <h1 className="text-3xl font-bold font-display uppercase tracking-tight text-[#f5f0e8]">{cargo}</h1>
          <p className="text-[9px] text-[#7a6e64] uppercase tracking-widest mt-2 font-bold leading-relaxed px-4">
            Candidatos em <span className="text-[#c8933a]">{cidade}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-[360px] pb-6">
          {candidatos.map((cand) => (
            <motion.button 
              key={cand.id}
              onClick={() => onSelect(cand)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden bg-[#1c1814]/80 backdrop-blur-xl border border-[#3d3128] rounded-[2rem] p-4 flex flex-col items-center gap-4 transition-all group"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-[#141413] border-2 border-[#3d3128] group-hover:border-[#d97757] overflow-hidden flex items-center justify-center transition-all shadow-xl">
                  {cand.foto_url ? (
                    <Image 
                      src={cand.foto_url} 
                      alt={cand.nome} 
                      width={80}
                      height={80}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                    />
                  ) : (
                    <span className="text-[8px] font-bold text-[#d97757]/40 uppercase tracking-widest">SF</span>
                  )}
                </div>
              </div>

              <div className="text-center w-full">
                <p className="text-[10px] font-bold uppercase tracking-widest leading-tight text-[#f5f0e8] group-hover:text-[#d97757] transition-colors line-clamp-2 min-h-[2.5em] flex items-center justify-center">
                  {cand.nome}
                </p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#141413] text-[6px] font-bold uppercase text-[#7a6e64] tracking-widest border border-[#3d3128]">
                    VOZ-26
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {candidatos.length === 0 && (
          <div className="text-center py-10">
            <p className="text-[#7a6e64] text-[10px] uppercase font-bold tracking-widest">Nenhum candidato encontrado.</p>
          </div>
        )}

        <div className="mt-auto pb-8">
          <button 
            onClick={onBack} 
            className="px-6 py-3 rounded-full bg-[#1c1814]/50 border border-[#3d3128] text-[8px] uppercase font-bold text-[#7a6e64] tracking-[0.2em] hover:text-[#f5f0e8] transition-colors"
          >
            ← Alterar Cargo
          </button>
        </div>
      </motion.div>
    </>
  );
};
