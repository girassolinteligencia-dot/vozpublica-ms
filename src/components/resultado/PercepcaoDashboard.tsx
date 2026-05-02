'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PercepcaoDashboardProps {
  data: {
    parana: {
      aprovacao: number;
      desaprovacao: number;
      expectativaVitoria: number;
      totalManifestacoes: number;
    };
    datafolha: {
      confianca: number;
      competencia: number;
    };
    segmentacao: {
      sexo: { masculino: number; feminino: number };
      faixaEtaria: { jovem: number; adulto: number; senior: number };
    };
    totalVozes: number;
  } | null;
}

export const PercepcaoDashboard: React.FC<PercepcaoDashboardProps> = ({ data }) => {
  if (!data) return null;

  const matrixData = [
    { x: data.datafolha.confianca, y: data.datafolha.competencia, name: 'Posicionamento Atual' }
  ];

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      
      {/* 1. Paraná Pesquisas - Aprovação & Vitória */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1c1814] border border-[#3d3128] rounded-3xl p-5 flex flex-col items-center gap-2"
        >
          <span className="text-[8px] uppercase tracking-widest text-[#7a6e64] font-bold">Aprovação de Imagem</span>
          <div className="text-2xl font-bold font-display text-[#a8c47a]">{data.parana.aprovacao.toFixed(1)}%</div>
          <div className="w-full h-1 bg-[#141413] rounded-full overflow-hidden mt-1">
            <div className="h-full bg-[#a8c47a]" style={{ width: `${data.parana.aprovacao}%` }} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1c1814] border border-[#3d3128] rounded-3xl p-5 flex flex-col items-center gap-2"
        >
          <span className="text-[8px] uppercase tracking-widest text-[#7a6e64] font-bold">Potencial de Vitória</span>
          <div className="text-2xl font-bold font-display text-[#c8933a]">{data.parana.expectativaVitoria.toFixed(1)}%</div>
          <div className="w-full h-1 bg-[#141413] rounded-full overflow-hidden mt-1">
            <div className="h-full bg-[#c8933a]" style={{ width: `${data.parana.expectativaVitoria}%` }} />
          </div>
        </motion.div>
      </div>

      {/* 2. Datafolha - Matriz Ética vs Gestão */}
      <div className="bg-[#1c1814] border border-[#3d3128] rounded-[2.5rem] p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#f5f0e8] font-bold">Matriz de Qualificação</span>
          <span className="text-[7px] uppercase tracking-widest text-[#7a6e64]">Metodologia Datafolha</span>
        </div>
        
        <div className="h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3d3128" opacity={0.5} />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Confiança" 
                domain={[0, 10]} 
                tick={{ fill: '#7a6e64', fontSize: 8 }} 
                label={{ value: 'ÉTICA / CONFIANÇA', position: 'bottom', fill: '#7a6e64', fontSize: 7, offset: 0 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Competência" 
                domain={[0, 10]} 
                tick={{ fill: '#7a6e64', fontSize: 8 }} 
                label={{ value: 'GESTÃO / COMPETÊNCIA', angle: -90, position: 'left', fill: '#7a6e64', fontSize: 7, offset: 0 }}
              />
              <ZAxis type="number" range={[100, 100]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1c1814', border: '1px solid #3d3128', borderRadius: '12px', fontSize: '10px' }} />
              <Scatter name="Candidato" data={matrixData} fill="#d97757" />
            </ScatterChart>
          </ResponsiveContainer>
          
          {/* Labels dos Quadrantes */}
          <div className="absolute top-2 right-2 text-[6px] text-[#a8c47a] opacity-30 font-bold uppercase">Liderança Ideal</div>
          <div className="absolute bottom-2 left-10 text-[6px] text-[#d97757] opacity-30 font-bold uppercase">Risco de Imagem</div>
        </div>
      </div>

      {/* 3. Ibope - Segmentação Socio-demográfica */}
      <div className="bg-[#1c1814] border border-[#3d3128] rounded-[2.5rem] p-6 flex flex-col gap-6">
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#f5f0e8] font-bold">Perfil da Manifestação</span>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold">
              <span className="text-[#b0aea5]">Gênero</span>
              <span className="text-[#f5f0e8]">Feminino {data.segmentacao.sexo.feminino} / {data.segmentacao.sexo.masculino} Masculino</span>
            </div>
            <div className="flex h-1.5 w-full bg-[#141413] rounded-full overflow-hidden">
              <div className="h-full bg-[#d97757]" style={{ width: `${(data.segmentacao.sexo.feminino / (data.segmentacao.sexo.feminino + data.segmentacao.sexo.masculino || 1)) * 100}%` }} />
              <div className="h-full bg-[#c8933a]" style={{ width: `${(data.segmentacao.sexo.masculino / (data.segmentacao.sexo.feminino + data.segmentacao.sexo.masculino || 1)) * 100}%` }} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold">
              <span className="text-[#b0aea5]">Faixa Etária</span>
              <span className="text-[#f5f0e8]">Distribuição</span>
            </div>
            <div className="flex gap-1 h-1.5 w-full">
              <div className="h-full bg-[#d97757] rounded-full" style={{ width: `${(data.segmentacao.faixaEtaria.jovem / data.totalVozes || 1) * 100}%` }} />
              <div className="h-full bg-[#c8933a] rounded-full" style={{ width: `${(data.segmentacao.faixaEtaria.adulto / data.totalVozes || 1) * 100}%` }} />
              <div className="h-full bg-[#a8c47a] rounded-full" style={{ width: `${(data.segmentacao.faixaEtaria.senior / data.totalVozes || 1) * 100}%` }} />
            </div>
            <div className="flex justify-between text-[6px] uppercase tracking-tighter opacity-40 font-bold">
              <span>Jovens</span>
              <span>Adultos</span>
              <span>Sêniores</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
