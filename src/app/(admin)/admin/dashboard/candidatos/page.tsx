'use client';

import React, { useEffect, useState } from 'react';
interface Candidato {
  id: string;
  nome: string;
  partido: string | null;
  numero: string | null;
  cargo: string;
  cidade: string;
  campanha?: {
    nome: string;
  };
}

export default function ManageCandidatos() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCand, setNewCand] = useState({
    nome: '',
    cargo: 'Governador',
    cidade: 'Campo Grande',
    partido: '',
    numero: '',
    campanha_id: 'camp-1' // Mock for now
  });

  useEffect(() => {
    fetch('/api/admin/candidatos')
      .then(res => res.json())
      .then(data => {
        setCandidatos(data);
        setLoading(false);
      });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/candidatos', {
      method: 'POST',
      body: JSON.stringify(newCand)
    });
    if (res.ok) {
      const data = await res.json();
      setCandidatos([...candidatos, data]);
      setShowModal(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-display uppercase tracking-widest text-text">Gestão de Candidatos</h2>
          <p className="text-[10px] text-text-muted uppercase mt-3 tracking-widest leading-relaxed">Adicione e edite candidatos das campanhas ativas</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          + Novo Candidato
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-surface-1 border border-border rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-surface-2/30">
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-text-muted tracking-widest">Nome</th>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-text-muted tracking-widest">Partido</th>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-text-muted tracking-widest">Número</th>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-text-muted tracking-widest">Cargo</th>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-text-muted tracking-widest">Ações</th>
            </tr>
          </thead>
          <tbody>
            {candidatos.map(cand => (
              <tr key={cand.id} className="border-b border-border/30 hover:bg-white/[0.01] transition-colors group">
                <td className="px-8 py-6 text-xs font-bold text-text">{cand.nome}</td>
                <td className="px-8 py-6 text-[10px] font-bold text-[#d97757]">{cand.partido || '-'}</td>
                <td className="px-8 py-6 text-[10px] font-mono text-text-muted">{cand.numero || '-'}</td>
                <td className="px-8 py-6 text-[10px] uppercase font-medium text-text-muted">{cand.cargo}</td>
                <td className="px-8 py-6">
                   <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-[9px] uppercase font-bold text-primary">Editar</button>
                      <button className="text-[9px] uppercase font-bold text-negative">Excluir</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="p-20 text-center text-text-muted animate-pulse font-display uppercase tracking-widest text-[10px]">Sincronizando Candidatos...</div>}
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden flex flex-col gap-4">
        {candidatos.map(cand => (
          <div key={cand.id} className="bg-surface-1 border border-border rounded-3xl p-6 flex flex-col gap-4">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-xs font-bold uppercase tracking-widest">{cand.nome}</p>
                   <p className="text-[8px] text-text-muted uppercase tracking-[0.2em] mt-1">{cand.cargo} • {cand.cidade}</p>
                </div>
                <span className="bg-primary/10 text-primary text-[10px] font-mono px-3 py-1 rounded-full font-bold">
                   {cand.numero || '--'}
                </span>
             </div>
             <div className="flex justify-between items-center pt-4 border-t border-border/50">
                <span className="text-[10px] font-bold text-[#d97757] uppercase tracking-widest">{cand.partido || 'Sem Partido'}</span>
                <div className="flex gap-4">
                   <button className="text-[9px] uppercase font-bold text-primary">Editar</button>
                   <button className="text-[9px] uppercase font-bold text-negative">Excluir</button>
                </div>
             </div>
          </div>
        ))}
        {loading && <div className="py-12 text-center text-text-muted animate-pulse uppercase tracking-widest text-[8px]">Carregando...</div>}
      </div>

      {/* Premium Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-dark/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="w-full max-w-[440px] bg-dark-mid border border-white/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col gap-8 shadow-3xl animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <h3 className="text-xl font-bold uppercase tracking-[0.3em] text-primary font-display">Novo Candidato</h3>
              <p className="text-[9px] text-text-muted uppercase mt-3 tracking-widest">Preencha as informações oficiais</p>
            </div>
            
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[8px] uppercase font-bold text-text-muted tracking-widest ml-4">Nome Completo</label>
                <input 
                  className="bg-white/5 border border-white/5 focus:border-primary/50 outline-none rounded-2xl px-6 py-4 text-xs text-white transition-all" 
                  placeholder="Ex: João da Silva"
                  value={newCand.nome}
                  onChange={e => setNewCand({...newCand, nome: e.target.value})}
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-[8px] uppercase font-bold text-text-muted tracking-widest ml-4">Sigla Partido</label>
                  <input 
                    className="bg-white/5 border border-white/5 focus:border-primary/50 outline-none rounded-2xl px-6 py-4 text-xs text-white transition-all uppercase" 
                    placeholder="Ex: PL"
                    value={newCand.partido}
                    onChange={e => setNewCand({...newCand, partido: e.target.value})}
                  />
                </div>
                <div className="w-28 flex flex-col gap-2">
                  <label className="text-[8px] uppercase font-bold text-text-muted tracking-widest ml-4">Número</label>
                  <input 
                    className="bg-white/5 border border-white/5 focus:border-primary/50 outline-none rounded-2xl px-6 py-4 text-xs text-white transition-all font-mono" 
                    placeholder="00"
                    value={newCand.numero}
                    onChange={e => setNewCand({...newCand, numero: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <button type="submit" className="w-full bg-primary text-white py-5 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
                Finalizar Cadastro
              </button>
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="w-full text-text-muted py-2 font-bold text-[9px] uppercase tracking-widest hover:text-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
