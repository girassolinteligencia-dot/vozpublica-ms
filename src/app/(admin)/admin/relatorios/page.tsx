'use client';

import React, { useEffect, useState } from 'react';
import { RankingBarChart } from '@/components/admin/charts/RankingBarChart';
import { CargoGroupedChart } from '@/components/admin/charts/CargoGroupedChart';
import { TemaDonutChart } from '@/components/admin/charts/TemaDonutChart';
import { TrendAreaChart } from '@/components/admin/charts/TrendAreaChart';
import { PolarizationScatterChart } from '@/components/admin/charts/PolarizationScatterChart';
import { motion } from 'framer-motion';

export default function AdminRelatoriosPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dias, setDias] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/relatorios?dias=${dias}`);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dias]);

  if (loading) return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4 text-primary font-display uppercase tracking-widest animate-pulse">
      Processando Inteligência Analítica...
    </div>
  );

  if (!data) return <div>Erro ao carregar dados.</div>;

  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-display uppercase tracking-widest text-text">Hub de Inteligência</h2>
          <p className="text-[10px] text-text-muted uppercase mt-3 tracking-[0.2em]">Cruzamento de variáveis e tendências</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setDias(d)}
              className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${dias === d ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
            >
              {d} Dias
            </button>
          ))}
        </div>
      </header>

      {/* Grid de Relatórios */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* 1. Ranking Líquido */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-10"
        >
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Ranking: Score Líquido por Candidato</h3>
            <p className="text-[9px] text-text-muted uppercase tracking-widest opacity-60">Cruzamento: Candidato × Sentimento</p>
          </div>
          <RankingBarChart data={data.ranking} />
        </motion.div>

        {/* 2. Tendência de Sentimento */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-10"
        >
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Tendência de Sentimento — {dias} dias</h3>
            <p className="text-[9px] text-text-muted uppercase tracking-widest opacity-60">Cruzamento: Candidato × Tempo</p>
          </div>
          <TrendAreaChart data={data.tendencia} />
        </motion.div>

        {/* 3. Sentimento por Cargo */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-10"
        >
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Sentimento por Cargo Disputado</h3>
            <p className="text-[9px] text-text-muted uppercase tracking-widest opacity-60">Cruzamento: Cargo × Sentimento</p>
          </div>
          <CargoGroupedChart data={data.cargoSentimento} />
        </motion.div>

        {/* 4. Temas Mais Associados */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-10"
        >
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Principais Temas e Pautas</h3>
            <p className="text-[9px] text-text-muted uppercase tracking-widest opacity-60">Frequência de Atributos Selecionados</p>
          </div>
          <TemaDonutChart data={data.temas} />
        </motion.div>

        {/* 5. Polarização vs Visibilidade */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-10"
        >
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Polarização vs. Visibilidade dos Candidatos</h3>
            <p className="text-[9px] text-text-muted uppercase tracking-widest opacity-60">Cruzamento: Volume (X) × Intensidade de Sentimento (Y)</p>
          </div>
          <PolarizationScatterChart data={data.polarizacao} />
        </motion.div>

      </div>
    </div>
  );
}
