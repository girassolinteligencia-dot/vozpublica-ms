'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Atributo {
  id: string;
  nome: string;
  descricao: string | null;
  polaridade: number;
}

interface Parametro {
  id?: string;
  chave: string;
  valor: any;
  grupo: string;
  descricao: string | null;
}

export default function ParametrosAdmin() {
  const [activeTab, setActiveTab] = useState<'atributos' | 'sistema'>('sistema');

  // Atributos State
  const [atributos, setAtributos] = useState<Atributo[]>([]);
  const [editingAtributo, setEditingAtributo] = useState<Partial<Atributo> | null>(null);

  // Parametros State
  const [parametros, setParametros] = useState<Parametro[]>([]);
  const [editingParam, setEditingParam] = useState<Partial<Parametro> | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resAttr, resParam] = await Promise.all([
        fetch('/api/admin/atributos'),
        fetch('/api/admin/configuracoes')
      ]);
      const dataAttr = await resAttr.json();
      const dataParam = await resParam.json();
      setAtributos(dataAttr);
      setParametros(dataParam);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveAtributo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAtributo?.nome) return;
    try {
      const res = await fetch('/api/admin/atributos', {
        method: editingAtributo.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAtributo)
      });
      if (res.ok) {
        setEditingAtributo(null);
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveParametro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParam?.chave) return;
    try {
      // Formata valor como string parseável ou mantém string
      let formattedValor = editingParam.valor;
      try {
        if (typeof editingParam.valor === 'string') {
          // Tenta parsear caso seja array ou objeto JSON (ex: '["Esquerda", "Direita"]')
          formattedValor = JSON.parse(editingParam.valor);
        }
      } catch (e) {
        // Se falhar o parse, mantém como string pura
        formattedValor = editingParam.valor;
      }

      const payload = {
        ...editingParam,
        valor: formattedValor
      };

      const res = await fetch('/api/admin/configuracoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setEditingParam(null);
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-display uppercase tracking-widest text-text">Parâmetros do Sistema</h2>
          <p className="text-[10px] text-text-muted uppercase mt-3 tracking-widest leading-relaxed">
            Gestão de Atributos, Ano Eleitoral e Configurações Globais
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab('sistema')}
          className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'sistema' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-white'}`}
        >
          Parâmetros Globais
        </button>
        <button
          onClick={() => setActiveTab('atributos')}
          className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'atributos' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-white'}`}
        >
          Matriz de Atributos
        </button>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === 'sistema' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-end">
              <button 
                onClick={() => setEditingParam({ chave: '', valor: '', grupo: 'geral', descricao: '' })}
                className="px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all"
              >
                + Novo Parâmetro
              </button>
            </div>
            <div className="bg-surface-1 border border-border rounded-[2.5rem] overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-surface-2/30">
                    <th className="px-8 py-6 text-[10px] uppercase font-bold text-text-muted tracking-widest">Chave / Identificador</th>
                    <th className="px-8 py-6 text-[10px] uppercase font-bold text-text-muted tracking-widest">Valor</th>
                    <th className="px-8 py-6 text-[10px] uppercase font-bold text-text-muted tracking-widest">Grupo</th>
                    <th className="px-8 py-6 text-[10px] uppercase font-bold text-text-muted tracking-widest">Descrição</th>
                    <th className="px-8 py-6 text-[10px] uppercase font-bold text-text-muted tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {parametros.map(p => (
                    <tr key={p.id || p.chave} className="border-b border-border/30 hover:bg-white/[0.01] transition-colors">
                      <td className="px-8 py-5 text-xs font-bold text-text">{p.chave}</td>
                      <td className="px-8 py-5 text-[10px] font-mono text-primary max-w-[200px] truncate">
                        {typeof p.valor === 'object' ? JSON.stringify(p.valor) : String(p.valor)}
                      </td>
                      <td className="px-8 py-5 text-[10px] uppercase font-medium text-text-muted">{p.grupo}</td>
                      <td className="px-8 py-5 text-[10px] text-text-muted truncate max-w-[200px]">{p.descricao || '-'}</td>
                      <td className="px-8 py-5 text-right">
                        <button onClick={() => setEditingParam({ ...p, valor: typeof p.valor === 'object' ? JSON.stringify(p.valor) : p.valor })} className="text-[10px] font-bold text-primary hover:text-white uppercase tracking-widest">Editar</button>
                      </td>
                    </tr>
                  ))}
                  {parametros.length === 0 && !loading && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-text-muted text-[10px] uppercase tracking-widest">Nenhum parâmetro encontrado</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'atributos' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center bg-primary/10 border border-primary/20 p-6 rounded-3xl">
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Matriz de Virtudes e Defeitos</p>
                <p className="text-[10px] text-text-muted mt-2">Estes atributos são utilizados na avaliação dos candidatos pelos usuários.</p>
              </div>
              <button 
                onClick={() => setEditingAtributo({ nome: '', polaridade: 1 })}
                className="px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all"
              >
                + Novo Atributo
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {atributos.map((at) => (
                  <motion.div 
                    key={at.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-surface-1 border border-border rounded-3xl p-6 hover:border-primary/50 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${at.polaridade === 1 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {at.polaridade === 1 ? 'Positivo' : 'Negativo'}
                      </div>
                      <button onClick={() => setEditingAtributo(at)} className="text-text-muted hover:text-white transition-colors text-[10px] uppercase tracking-widest font-bold">
                        Editar
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-bold font-display uppercase tracking-wider mb-2">{at.nome}</h3>
                    <p className="text-xs text-text-muted leading-relaxed mb-4">{at.descricao || 'Sem descrição.'}</p>
                    
                    <div className="h-1 w-full bg-dark rounded-full overflow-hidden">
                      <div className={`h-full ${at.polaridade === 1 ? 'bg-green-500' : 'bg-red-500'} opacity-30`} style={{ width: '100%' }} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Modal Parametros */}
      <AnimatePresence>
        {editingParam && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingParam(null)}
              className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-surface-1 border border-border rounded-[2.5rem] p-8 shadow-2xl"
            >
              <h2 className="text-xl font-bold font-display uppercase tracking-widest mb-8 text-text">
                {editingParam.id ? 'Editar Parâmetro' : 'Novo Parâmetro'}
              </h2>
              <form onSubmit={handleSaveParametro} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase font-bold text-primary tracking-widest ml-1">Chave (Ex: opcoes_vertente)</label>
                  <input 
                    type="text" 
                    value={editingParam.chave}
                    onChange={(e) => setEditingParam({...editingParam, chave: e.target.value})}
                    disabled={!!editingParam.id}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-primary disabled:opacity-50"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase font-bold text-primary tracking-widest ml-1">Valor (Texto, Número ou Array JSON)</label>
                  <textarea 
                    value={editingParam.valor || ''}
                    onChange={(e) => setEditingParam({...editingParam, valor: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-primary h-24 resize-none font-mono"
                    required
                    placeholder={'Ex: ["Esquerda", "Centro", "Direita"]'}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase font-bold text-primary tracking-widest ml-1">Grupo</label>
                    <input 
                      type="text" 
                      value={editingParam.grupo || ''}
                      onChange={(e) => setEditingParam({...editingParam, grupo: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase font-bold text-primary tracking-widest ml-1">Descrição</label>
                    <input 
                      type="text" 
                      value={editingParam.descricao || ''}
                      onChange={(e) => setEditingParam({...editingParam, descricao: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <button type="submit" className="flex-1 py-4 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:brightness-110">
                    Salvar
                  </button>
                  <button type="button" onClick={() => setEditingParam(null)} className="px-8 py-4 bg-transparent border border-border text-text-muted rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Atributos */}
      <AnimatePresence>
        {editingAtributo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingAtributo(null)}
              className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-surface-1 border border-border rounded-[2.5rem] p-8 shadow-2xl"
            >
              <h2 className="text-xl font-bold font-display uppercase tracking-widest mb-8 text-text">
                {editingAtributo.id ? 'Editar Atributo' : 'Novo Atributo'}
              </h2>
              <form onSubmit={handleSaveAtributo} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase font-bold text-primary tracking-widest ml-1">Nome do Atributo</label>
                  <input 
                    type="text" 
                    value={editingAtributo.nome}
                    onChange={(e) => setEditingAtributo({...editingAtributo, nome: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase font-bold text-primary tracking-widest ml-1">Descrição</label>
                  <textarea 
                    value={editingAtributo.descricao || ''}
                    onChange={(e) => setEditingAtributo({...editingAtributo, descricao: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-primary h-24 resize-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase font-bold text-primary tracking-widest ml-1">Polaridade</label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <button 
                      type="button"
                      onClick={() => setEditingAtributo({...editingAtributo, polaridade: 1})}
                      className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${editingAtributo.polaridade === 1 ? 'bg-green-500 text-white' : 'bg-transparent text-text-muted border border-border'}`}
                    >
                      Positivo
                    </button>
                    <button 
                      type="button"
                      onClick={() => setEditingAtributo({...editingAtributo, polaridade: -1})}
                      className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${editingAtributo.polaridade === -1 ? 'bg-red-500 text-white' : 'bg-transparent text-text-muted border border-border'}`}
                    >
                      Negativo
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <button type="submit" className="flex-1 py-4 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:brightness-110">
                    Salvar
                  </button>
                  <button type="button" onClick={() => setEditingAtributo(null)} className="px-8 py-4 bg-transparent border border-border text-text-muted rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
