'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Atributo {
  id: string;
  nome: string;
  tipo: 'positivo' | 'negativo';
}

interface Candidato {
  id: string;
  nome: string;
  cargo: string;
  cidade: string;
  foto_url?: string;
}

interface Etapa5Props {
  candidato: Candidato;
  evaluations: { atributoId: string; valor: number }[];
  onAttributeClick: (id: string, valor: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  parallax: { x: number; y: number };
  config?: any;
}

export const Etapa5: React.FC<Etapa5Props> = ({ 
  candidato, 
  evaluations, 
  onAttributeClick, 
  onSubmit, 
  isSubmitting,
  parallax,
  config
}) => {
  const atributosFixos: Atributo[] = [
    { id: 'pos1', nome: 'Ficha Limpa', tipo: 'positivo' },
    { id: 'pos2', nome: 'Experiência', tipo: 'positivo' },
    { id: 'pos3', nome: 'Propostas Claras', tipo: 'positivo' },
    { id: 'pos4', nome: 'Liderança', tipo: 'positivo' },
    { id: 'pos5', nome: 'Diálogo', tipo: 'positivo' },
    { id: 'pos6', nome: 'Inovação', tipo: 'positivo' },
    { id: 'pos7', nome: 'Transparência', tipo: 'positivo' },
    { id: 'pos8', nome: 'Compromisso Social', tipo: 'positivo' },
    { id: 'pos9', nome: 'Empatia', tipo: 'positivo' },
    { id: 'pos10', nome: 'Conhecimento Técnico', tipo: 'positivo' },
    { id: 'pos11', nome: 'Honestidade', tipo: 'positivo' },
    { id: 'pos12', nome: 'Foco em Resultados', tipo: 'positivo' },
    { id: 'pos13', nome: 'Visão de Futuro', tipo: 'positivo' },
    { id: 'pos14', nome: 'Sustentabilidade', tipo: 'positivo' },
    { id: 'pos15', nome: 'Ética Profissional', tipo: 'positivo' },
    { id: 'neg1', nome: 'Corrupção', tipo: 'negativo' },
    { id: 'neg2', nome: 'Promessas Vazias', tipo: 'negativo' },
    { id: 'neg3', nome: 'Inexperiência', tipo: 'negativo' },
    { id: 'neg4', nome: 'Radicalismo', tipo: 'negativo' },
    { id: 'neg5', nome: 'Falta de Ética', tipo: 'negativo' },
    { id: 'neg6', nome: 'Oportunismo', tipo: 'negativo' },
    { id: 'neg7', nome: 'Negligência', tipo: 'negativo' },
    { id: 'neg8', nome: 'Autoritarismo', tipo: 'negativo' },
    { id: 'neg9', nome: 'Incoerência', tipo: 'negativo' },
    { id: 'neg10', nome: 'Populismo', tipo: 'negativo' },
    { id: 'neg11', nome: 'Nepotismo', tipo: 'negativo' },
    { id: 'neg12', nome: 'Falta de Preparo', tipo: 'negativo' },
    { id: 'neg13', nome: 'Arrogância', tipo: 'negativo' },
    { id: 'neg14', nome: 'Desorganização', tipo: 'negativo' },
    { id: 'neg15', nome: 'Manipulação', tipo: 'negativo' },
  ];

  const atributosAtivos = config?.avaliacao_atributos_ativos || atributosFixos.map((a: any) => a.id);
  const atributosFiltrados = atributosFixos.filter(a => atributosAtivos.includes(a.id));

  // Show only first 5 positive and first 5 negative by default
  const positivos = atributosFiltrados.filter(a => a.tipo === 'positivo').slice(0, 5);
  const negativos = atributosFiltrados.filter(a => a.tipo === 'negativo').slice(0, 5);

  const totalVisivel = positivos.length + negativos.length;
  const progresso = (evaluations.length / totalVisivel) * 100;

  return (
    <motion.div 
      className="relative w-full h-full flex flex-col items-center overflow-y-auto overflow-x-hidden"
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Glow */}
      <AnimatePresence>
        {evaluations.length > 0 && (
          <motion.div 
            key={evaluations.length}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 bg-[#d97757] rounded-full blur-[120px] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-4 px-5 pt-6 pb-32">
        
        {/* Candidate Header — Compact */}
        <motion.div 
          className="flex items-center gap-4 w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Small Photo */}
          <motion.div 
            className="relative w-[64px] h-[64px] flex-shrink-0 rounded-full border-2 border-[#d97757] overflow-hidden shadow-[0_0_30px_rgba(217,119,87,0.3)] bg-[#1c1814]"
            style={{ x: parallax.x * 2, y: parallax.y * 2 }}
          >
            {candidato.foto_url ? (
              <Image src={candidato.foto_url} alt={candidato.nome} width={64} height={64} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#d97757]/40 bg-[#1c1814]">
                <span className="text-[10px] font-bold uppercase tracking-wider">{candidato.nome.split(' ')[0]}</span>
              </div>
            )}
          </motion.div>

          {/* Candidate Info */}
          <div className="flex flex-col min-w-0">
            <h2 className="text-base font-bold font-display uppercase tracking-[0.15em] text-[#f5f0e8] truncate">
              {candidato.nome}
            </h2>
            <p className="text-[10px] text-[#b0aea5] font-body uppercase tracking-[0.3em] mt-0.5 font-bold">
              {candidato.cargo} · {candidato.cidade}
            </p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-[#1c1814] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#d97757] to-[#c8933a] rounded-full"
            animate={{ width: `${progresso}%` }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
          />
        </div>
        <p className="text-[9px] text-[#7a6e64] uppercase tracking-[0.4em] font-bold self-end -mt-2">
          {evaluations.length} / {totalVisivel} selecionados
        </p>

        {/* Instruction */}
        <motion.p 
          className="text-[11px] text-[#b0aea5] text-center font-body leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Selecione as características que você associa a este candidato
        </motion.p>

        {/* Positive Attributes Section */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3a9a5c]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#3a9a5c] font-display">
              Qualidades
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {positivos.map((item, i) => {
              const isSelected = evaluations.some(e => e.atributoId === item.id);
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => onAttributeClick(item.id, 1)}
                  disabled={isSelected}
                  className={`
                    relative px-5 py-3.5 rounded-2xl text-[12px] font-bold uppercase tracking-[0.15em] font-display
                    transition-all duration-300 cursor-pointer select-none
                    ${isSelected 
                      ? 'bg-[#3a9a5c] text-[#f5f0e8] shadow-[0_0_20px_rgba(58,154,92,0.4)] scale-95 opacity-80' 
                      : 'bg-[#1c1814] text-[#b0aea5] border border-[#3d3128] hover:border-[#3a9a5c] hover:text-[#3a9a5c] hover:shadow-[0_0_15px_rgba(58,154,92,0.15)] active:scale-95'
                    }
                  `}
                >
                  {isSelected && (
                    <motion.span 
                      className="absolute top-1 right-1.5 text-[10px]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      ✓
                    </motion.span>
                  )}
                  {item.nome}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Negative Attributes Section */}
        <div className="w-full flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#c94444]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c94444] font-display">
              Pontos Negativos
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {negativos.map((item, i) => {
              const isSelected = evaluations.some(e => e.atributoId === item.id);
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  onClick={() => onAttributeClick(item.id, -1)}
                  disabled={isSelected}
                  className={`
                    relative px-5 py-3.5 rounded-2xl text-[12px] font-bold uppercase tracking-[0.15em] font-display
                    transition-all duration-300 cursor-pointer select-none
                    ${isSelected 
                      ? 'bg-[#c94444] text-[#f5f0e8] shadow-[0_0_20px_rgba(201,68,68,0.4)] scale-95 opacity-80' 
                      : 'bg-[#1c1814] text-[#b0aea5] border border-[#3d3128] hover:border-[#c94444] hover:text-[#c94444] hover:shadow-[0_0_15px_rgba(201,68,68,0.15)] active:scale-95'
                    }
                  `}
                >
                  {isSelected && (
                    <motion.span 
                      className="absolute top-1 right-1.5 text-[10px]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      ✓
                    </motion.span>
                  )}
                  {item.nome}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-gradient-to-t from-[#141413] via-[#141413]/95 to-transparent pt-8 pb-8 px-6 flex flex-col items-center gap-3">
        <button 
          onClick={onSubmit}
          disabled={evaluations.length === 0 || isSubmitting}
          className={`w-full max-w-md py-4 rounded-2xl font-bold text-sm uppercase tracking-[0.3em] transition-all duration-500 font-display ${
            evaluations.length > 0 
              ? 'bg-gradient-to-r from-[#d97757] to-[#c8933a] text-[#f5f0e8] shadow-[0_0_40px_rgba(217,119,87,0.35)] hover:shadow-[0_0_60px_rgba(217,119,87,0.5)] active:scale-[0.98]' 
              : 'bg-[#1c1814] text-[#7a6e64] opacity-40 border border-[#3d3128] cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Ecoando...' : 'Prosseguir'}
        </button>

        <motion.p className="text-[8px] text-[#7a6e64] uppercase tracking-widest font-bold">
          {evaluations.length === 0 ? 'Selecione ao menos uma característica' : `${evaluations.length} de ${totalVisivel} selecionados`}
        </motion.p>
      </div>
    </motion.div>
  );
};
