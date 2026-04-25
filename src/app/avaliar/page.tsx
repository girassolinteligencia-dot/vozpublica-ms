'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fragmento } from '@/components/fragmento/Fragmento';
import { useGiroscopio } from '@/hooks/useGiroscopio';
import { RadarChart } from '@/components/resultado/RadarChart';

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

interface ResultData {
  atributo: string;
  valor: number;
  total: number;
}

export default function AvaliarPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [userData, setUserData] = useState({
    nome: '',
    cidade: '',
    bairro: '',
    perfil: [] as string[]
  });

  const [cargo, setCargo] = useState('');
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [candidato, setCandidato] = useState<Candidato | null>(null);

  const [evaluations, setEvaluations] = useState<{ atributoId: string; valor: number }[]>([]);
  const [results, setResults] = useState<ResultData[]>([]);
  const [honeypotValue, setHoneypotValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const startTimeRef = useRef<number>(0);
  
  const parallax = useGiroscopio();

  const cidades = ['Campo Grande', 'Dourados', 'Três Lagoas'];
  const perfis = ['Conservador', 'Liberal', 'Progressista', 'Moderado', 'Independente'];

  const fetchCandidatos = async (cargoStr: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/candidatos?campanha=ms-2026&cidade=${userData.cidade}`);
      const data = await res.json();
      setCandidatos(data.filter((c: Candidato) => c.cargo === cargoStr));
      setStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startEvaluation = (cand: Candidato) => {
    startTimeRef.current = Date.now();
    setCandidato(cand);
    setStep(4);
  };

  const handleAttributeClick = (atributoId: string, valor: number) => {
    if (evaluations.find(e => e.atributoId === atributoId)) return;
    setEvaluations(prev => [...prev, { atributoId, valor }]);
  };

  const submitEvaluation = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const res = await fetch('/api/avaliar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidatoId: candidato?.id,
          avaliacoes: evaluations,
          fingerprint: 'fp_' + Math.random().toString(36).substr(2, 9),
          startTime: startTimeRef.current,
          endTime: Date.now(),
          honeypot: !!honeypotValue
        })
      });

      if (res.ok) {
        const resResults = await fetch(`/api/resultados/${candidato?.id}`);
        const dataResults = await resResults.json();
        setResults(dataResults);
        setStep(5);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getArcPosition = (index: number, total: number, startAngle: number, endAngle: number, radius: number) => {
    const angleRange = endAngle - startAngle;
    const angleStep = angleRange / (total - 1 || 1);
    const angle = (startAngle + angleStep * index) * (Math.PI / 180);
    return { x: Math.cos(angle) * radius, y: -Math.sin(angle) * radius };
  };

  if (loading) return (
    <div className="w-full h-[100svh] bg-background flex items-center justify-center text-primary font-display uppercase tracking-widest animate-pulse">
      Sincronizando Pulso...
    </div>
  );

  return (
    <main className="relative w-full h-[100svh] overflow-hidden bg-background text-text flex flex-col items-center">
      {/* Honeypot Field */}
      <div className="opacity-0 absolute pointer-events-none -z-50">
        <input 
          type="text" 
          value={honeypotValue} 
          onChange={(e) => setHoneypotValue(e.target.value)} 
          tabIndex={-1} 
          autoComplete="off" 
        />
      </div>

      {/* Background Parallax */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          transform: `translate(${parallax.x * 20}px, ${parallax.y * 20}px) scale(1.1)`,
          background: 'radial-gradient(circle at 50% 50%, #3b82f6 0%, transparent 70%)',
        }}
      />

      <AnimatePresence mode="wait">
        {/* STEP 1: IDENTIFICATION */}
        {step === 1 && (
          <motion.div 
            key="step1"
            className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8 gap-8 overflow-y-auto pt-20 pb-20 no-scrollbar"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold font-display uppercase tracking-widest text-primary">Identificação</h1>
              <p className="text-[10px] text-text-muted uppercase tracking-[0.4em] mt-2">Personalize sua experiência de pulso</p>
            </div>

            <div className="w-full max-w-[320px] flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[9px] uppercase font-bold text-primary tracking-widest ml-2">Como deseja ser chamado?</label>
                <input 
                  type="text" 
                  value={userData.nome}
                  onChange={(e) => setUserData({...userData, nome: e.target.value})}
                  className="w-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/30"
                  placeholder="Seu nome ou apelido"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] uppercase font-bold text-primary tracking-widest ml-2">Sua Localidade (MS)</label>
                <select 
                  value={userData.cidade}
                  onChange={(e) => setUserData({...userData, cidade: e.target.value})}
                  className="w-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:border-primary/50 transition-all appearance-none text-text"
                >
                  <option value="" className="bg-background">Selecione sua cidade...</option>
                  {cidades.map(c => <option key={c} value={c} className="bg-background">{c}</option>)}
                </select>
              </div>

              <div className="mt-4">
                <p className="text-[9px] uppercase font-bold text-primary tracking-widest mb-6 ml-2 text-center">Seu Perfil de Eleitor</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {perfis.map(p => (
                    <motion.button 
                      key={p}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        const isSelected = userData.perfil.includes(p);
                        if (isSelected) {
                          setUserData({...userData, perfil: userData.perfil.filter(item => item !== p)});
                        } else if (userData.perfil.length < 3) {
                          setUserData({...userData, perfil: [...userData.perfil, p]});
                        }
                      }}
                      className={`relative px-5 py-3 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all overflow-hidden ${
                        userData.perfil.includes(p) 
                          ? 'bg-primary text-white shadow-lg shadow-primary/30 border-primary' 
                          : 'bg-white/[0.05] border border-white/5 text-text-muted hover:border-white/20'
                      }`}
                    >
                      {p}
                    </motion.button>
                  ))}
                </div>
                <p className="text-[8px] text-center text-text-muted uppercase mt-4 opacity-50 tracking-widest">Selecione até 3 características</p>
              </div>
            </div>

            <button 
              onClick={() => userData.nome && userData.cidade && userData.perfil.length > 0 && setStep(2)}
              disabled={!userData.nome || !userData.cidade || userData.perfil.length === 0}
              className={`mt-6 px-14 py-5 rounded-full font-bold text-[10px] uppercase tracking-[0.4em] transition-all duration-500 ${
                userData.nome && userData.cidade && userData.perfil.length > 0
                  ? 'bg-primary text-white shadow-[0_0_40px_rgba(59,130,246,0.3)] scale-100 hover:scale-105' 
                  : 'bg-white/5 text-text-muted opacity-30 scale-95 cursor-not-allowed'
              }`}
            >
              Iniciar Experiência
            </button>
          </motion.div>
        )}

        {/* STEP 2: ESFERA */}
        {step === 2 && (
          <motion.div 
            key="step2"
            className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 gap-10"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          >
            <div className="text-center">
              <span className="text-[9px] font-bold text-primary uppercase tracking-[0.4em] mb-2 block">Selecione a</span>
              <h1 className="text-3xl font-bold font-display uppercase tracking-widest text-text">Esfera</h1>
              <p className="text-[10px] text-text-muted uppercase tracking-widest mt-2">Escolha o cargo para avaliar em {userData.cidade}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 w-full max-w-[300px]">
              {[
                { label: 'Presidente', icon: '🇧🇷' },
                { label: 'Governador', icon: '🏛️' },
                { label: 'Senador', icon: '⚖️' },
                { label: 'Deputado Federal', icon: '🤝' },
                { label: 'Deputado Estadual', icon: '📝' },
                { label: 'Prefeito', icon: '🏙️' },
                { label: 'Vereador', icon: '🏠' }
              ].map((cargoItem) => (
                <motion.button 
                  key={cargoItem.label}
                  whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setCargo(cargoItem.label); fetchCandidatos(cargoItem.label); }}
                  className="w-full bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-3xl py-5 px-6 text-[11px] uppercase font-bold tracking-[0.2em] text-left flex justify-between items-center transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm group-hover:bg-primary/20 transition-colors">
                      {cargoItem.icon}
                    </span>
                    {cargoItem.label}
                  </div>
                  <span className="text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">→</span>
                </motion.button>
              ))}
            </div>
            
            <button onClick={() => setStep(1)} className="text-[9px] uppercase font-bold text-text-muted tracking-[0.3em] hover:text-text">← Voltar para Identificação</button>
          </motion.div>
        )}

        {/* STEP 3: CANDIDATO */}
        {step === 3 && (
          <motion.div 
            key="step3"
            className="relative z-10 w-full h-full flex flex-col items-center pt-20 px-6 gap-8 overflow-y-auto pb-20 no-scrollbar"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="text-center w-full">
              <span className="text-[9px] font-bold text-primary uppercase tracking-[0.4em] mb-2 block">Seleção de</span>
              <h1 className="text-3xl font-bold font-display uppercase tracking-widest text-text">{cargo}</h1>
              <p className="text-[10px] text-text-muted uppercase tracking-widest mt-2">Candidatos em {userData.cidade}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-[360px]">
              {candidatos.map(cand => (
                <motion.button 
                  key={cand.id}
                  onClick={() => startEvaluation(cand)}
                  whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-5 flex flex-col items-center gap-4 transition-all group"
                >
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/10 blur-2xl rounded-full group-hover:bg-primary/20 transition-all" />
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-surface-2 border-2 border-white/10 group-hover:border-primary/50 overflow-hidden flex items-center justify-center transition-all">
                       <span className="text-[10px] font-bold text-primary/30 uppercase">Foto</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-bold uppercase tracking-widest leading-tight">{cand.nome}</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-[7px] font-bold uppercase text-text-muted tracking-tighter">PULSO-26</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <button onClick={() => setStep(2)} className="mt-4 px-6 py-3 rounded-full bg-white/5 border border-white/5 text-[9px] uppercase font-bold text-text-muted tracking-[0.2em] hover:text-text transition-colors">← Alterar Cargo</button>
          </motion.div>
        )}

        {/* STEP 4: ATRIBUIÇÃO */}
        {step === 4 && candidato && (
          <motion.div 
            key="step4"
            className="relative w-full h-full flex items-center justify-center"
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.div 
              className="relative z-20 w-[110px] h-[110px] rounded-full border-2 border-primary overflow-hidden shadow-2xl shadow-primary/30"
              style={{ x: parallax.x * 8, y: parallax.y * 8 }}
              animate={evaluations.length > 0 ? { scale: [1, 1.1, 1] } : {}}
            >
              <div className="w-full h-full bg-surface-2 flex items-center justify-center text-primary/40">
                <span className="text-[10px] font-bold uppercase tracking-widest">{candidato.nome.split(' ')[0]}</span>
              </div>
            </motion.div>

            {candidato.campanha.atributos.map((attr: { atributo: Atributo }, i: number) => {
              const item = attr.atributo;
              const isEvaluated = evaluations.some(e => e.atributoId === item.id);
              if (isEvaluated) return null;
              const pos = getArcPosition(i, candidato.campanha.atributos.length, 120, 240, 140);
              return (
                <motion.div 
                  key={item.id}
                  className="absolute z-30"
                  style={{ left: `calc(50% + ${pos.x}px)`, top: `calc(50% + ${pos.y}px)` }}
                  animate={{ x: parallax.x * 20, y: parallax.y * 20 }}
                  exit={{ scale: 0, x: -pos.x, y: -pos.y, opacity: 0, transition: { type: 'spring', stiffness: 180, damping: 18 } }}
                >
                  <Fragmento label={item.nome} type="positivo" onClick={() => handleAttributeClick(item.id, 1)} />
                </motion.div>
              );
            })}

            <div className="absolute bottom-10 left-0 w-full px-6 flex flex-col items-center gap-4 z-40">
              <div className="text-center">
                <h2 className="text-sm font-bold font-display uppercase tracking-[0.2em] text-primary">{candidato.nome}</h2>
                <p className="text-[10px] text-text-muted font-body uppercase tracking-wider">{candidato.cargo} | {candidato.cidade}</p>
              </div>
              <button 
                onClick={submitEvaluation}
                disabled={evaluations.length === 0 || isSubmitting}
                className={`px-10 py-4 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] transition-all duration-500 ${
                  evaluations.length > 0 ? 'bg-primary text-white shadow-xl shadow-primary/40' : 'bg-surface-2 text-text-muted opacity-50'
                }`}
              >
                {isSubmitting ? 'Validando...' : 'Confirmar Pulso'}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 5: RESULTADO */}
        {step === 5 && (
          <motion.div 
            key="step5"
            className="relative w-full h-full flex flex-col items-center justify-center px-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold font-display uppercase tracking-widest text-primary">Pulso Consolidado</h2>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Percepção coletiva de {candidato?.nome}</p>
            </div>
            <RadarChart data={results} />
            <div className="mt-10 w-full max-w-[300px] flex flex-col gap-4">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                <span className="text-text-muted">Engajamento Total</span>
                <span className="text-primary">{results.reduce((acc, curr) => acc + curr.total, 0)} Pulsos</span>
              </div>
              <div className="h-1 w-full bg-surface-2 rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.5, ease: 'circOut' }} />
              </div>
            </div>
            <button onClick={() => window.location.reload()} className="absolute bottom-10 px-10 py-4 rounded-full bg-surface-2 text-text font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-surface-1">Nova Avaliação</button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
