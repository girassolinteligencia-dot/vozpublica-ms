'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RadarChart } from '@/components/resultado/RadarChart';
import Image from 'next/image';
import { Fragmento } from '../fragmento/Fragmento';

interface ResultData {
  atributo: string;
  valor: number;
  total: number;
}

interface Etapa5Props {
  results: ResultData[];
  candidatoNome: string;
  onReset: () => void;
}

export const Etapa5: React.FC<Etapa5Props> = ({ results, candidatoNome, onReset }) => {
  const totalVozes = results.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <motion.div 
      className="relative w-full h-full flex flex-col items-center pt-20 px-6 overflow-y-auto pb-safe no-scrollbar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background Decorativo: Fragmentos Ambientais */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
        <Fragmento id="amb-1" label="" type="positivo" style={{ position: 'absolute', top: '15%', left: '10%', scale: 0.6 }} />
        <Fragmento id="amb-2" label="" type="perfil" style={{ position: 'absolute', bottom: '25%', right: '5%', scale: 0.5 }} />
      </div>

      {/* Selo Girassol de Transparência */}
      <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-[#c8933a]/10 rounded-full border border-[#c8933a]/20 mb-8">
        <Image src="/gi/logo-32.png" alt="GI" width={16} height={16} />
        <span className="text-[#c8933a] text-[7px] font-bold uppercase tracking-widest">Auditoria Pública MS-2026</span>
      </div>

      <div className="text-center mb-8 shrink-0">
        <h2 className="text-xl font-bold font-display uppercase tracking-tight text-[#f5f0e8]">Inteligência da Voz</h2>
        <p className="text-[9px] text-[#7a6e64] uppercase tracking-[0.3em] font-bold mt-2 leading-relaxed">
          Percepção coletiva: <br/>
          <span className="text-[#d97757]">{candidatoNome}</span>
        </p>
      </div>

      {/* Radar Chart com Núcleo de Plasma */}
      <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center shrink-0">
        {/* Fragmento de Núcleo (Atrás do gráfico) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 blur-2xl pointer-events-none scale-125">
          <Fragmento id="result-core" label="" type="positivo" />
        </div>
        
        <div className="relative z-10 w-full h-full bg-[#1c1814]/40 backdrop-blur-xl rounded-[2.5rem] border border-[#3d3128] p-6 shadow-xl flex items-center justify-center overflow-hidden">
          <RadarChart data={results} />
        </div>
      </div>

      {/* Estatísticas de Engajamento */}
      <motion.div 
        className="mt-8 w-full max-w-[280px] flex flex-col gap-4 shrink-0"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="flex justify-between items-end px-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-[7px] text-[#7a6e64] uppercase tracking-[0.4em] font-bold">Engajamento</span>
            <span className="text-lg font-bold font-display text-[#f5f0e8] tabular-nums">{totalVozes.toLocaleString()}</span>
          </div>
          <span className="text-[8px] text-[#d97757] font-bold uppercase tracking-widest pb-1">Vozes Ativas</span>
        </div>
        
        {/* Barra de Energia Visual */}
        <div className="h-1 w-full bg-[#1c1814] rounded-full overflow-hidden border border-[#3d3128]/50">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#d97757] via-[#c8933a] to-[#d97757] bg-[length:200%_100%]" 
            initial={{ width: 0 }} 
            animate={{ width: '100%', backgroundPosition: ['0% 0%', '100% 0%'] }} 
            transition={{ 
              width: { duration: 1.5, ease: 'circOut' },
              backgroundPosition: { duration: 4, repeat: Infinity, ease: 'linear' }
            }} 
          />
        </div>
      </motion.div>

      {/* CTA Final */}
      <div className="mt-auto pt-8 pb-12 w-full flex flex-col items-center gap-6">
        <motion.button 
          onClick={onReset} 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full max-w-[240px] py-4 rounded-full bg-[#1c1814] text-[#f5f0e8] border border-[#3d3128] font-bold text-[8px] uppercase tracking-[0.4em] transition-all shadow-lg"
        >
          Nova Manifestação
        </motion.button>

        {/* Rodapé de Créditos */}
        <div className="opacity-30">
          <p className="text-[6px] uppercase font-bold tracking-[0.5em] text-[#7a6e64]">
            Desenvolvido por Girassol Inteligência
          </p>
        </div>
      </div>
    </motion.div>
  );
};
