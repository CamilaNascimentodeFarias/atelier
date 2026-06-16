import React, { useState } from 'react';
import { 
  FolderOpen, 
  Plus, 
  Image, 
  HelpCircle, 
  Settings, 
  Wand2, 
  Link2, 
  Sparkles, 
  ChevronRight, 
  Trash2, 
  Undo,
  BookOpen
} from 'lucide-react';
import { THEME_PRESETS } from '../data';
import { CanvasNode, CanvasConnection } from '../types';

interface SidebarProps {
  currentThemeId: string;
  onSelectTheme: (themeId: string) => void;
  themeDescription: string;
  themeName: string;
  themeCulture: string;
  nodes: CanvasNode[];
  connections: CanvasConnection[];
  onAddNode: (type: 'clima' | 'material' | 'tingimento' | 'hierarquia' | 'padrao' | 'custom') => void;
  onAddImageNode: () => void;
  onStartLinkMode: () => void;
  linkMode: boolean;
  onDeleteConnection: (id: string) => void;
  onReimagineWithAi: (userPrompt: string) => Promise<void>;
  aiLoading: boolean;
  onClearCanvas: () => void;
}

export default function Sidebar({
  currentThemeId,
  onSelectTheme,
  themeDescription,
  themeName,
  themeCulture,
  nodes,
  connections,
  onAddNode,
  onAddImageNode,
  onStartLinkMode,
  linkMode,
  onDeleteConnection,
  onReimagineWithAi,
  aiLoading,
  onClearCanvas
}: SidebarProps) {
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    await onReimagineWithAi(aiPrompt);
    setShowAiModal(false);
    setAiPrompt('');
  };

  return (
    <aside className="w-72 h-screen bg-[#FDFCFB] border-r border-[#1A1A1A]/10 flex flex-col pt-24 pb-6 px-6 z-40 fixed left-0 top-0 overflow-y-auto shrink-0 select-none shadow-none">
      {/* Atelier Title / Subline */}
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-regular text-[#1A1A1A] tracking-tight flex items-center gap-2">
          Atelier /
        </h2>
        <p className="font-sans text-[11px] font-bold tracking-[0.3em] uppercase text-[#1A1A1A]/40 mt-1">
          Tela de Narrativa
        </p>

        {/* Culture Description Details box */}
        <div className="mt-4 p-4 bg-[#F5F5F0] rounded-none border border-[#1A1A1A]/5">
          <p className="font-serif text-base italic text-[#D4A373] leading-tight">
            {themeCulture}
          </p>
          <span className="font-sans text-[9px] tracking-wider uppercase font-bold text-[#1A1A1A]/40 block mt-1">
            {themeName}
          </span>
          <p className="font-sans text-xs text-[#1A1A1A]/70 mt-3 leading-relaxed font-light text-justify">
            {themeDescription}
          </p>
        </div>
      </div>

      {/* Preset Theme Selection switcher */}
      <div className="mb-6">
        <label className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#1A1A1A]/50 font-bold block mb-2.5">
          Tema do Worldbuilding
        </label>
        <div className="grid grid-cols-1 gap-1">
          {THEME_PRESETS.map((p) => {
            const isSelected = currentThemeId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectTheme(p.id)}
                className={`w-full flex items-center justify-between text-left px-3.5 py-2 rounded-none text-[11px] font-semibold transition-all ${isSelected ? 'bg-[#1A1A1A] text-[#FDFCFB]' : 'bg-[#FDFCFB] hover:bg-[#F5F5F0] text-[#1A1A1A] border border-[#1A1A1A]/10'}`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 opacity-60" />
                  <span>{p.theme.culture}</span>
                </div>
                <span className="text-[10px] opacity-60">
                  {isSelected ? '✓' : ''}
                </span>
              </button>
            );
          })}
          <button
            onClick={onClearCanvas}
            className={`w-full text-center px-3 py-2.5 rounded-none text-[9px] uppercase tracking-[0.15em] font-bold border border-dashed border-red-300 text-red-600 hover:bg-red-50/30 transition-colors mt-2`}
          >
            Limpar e Criar do Zero
          </button>
        </div>
      </div>

      {/* Action triggers */}
      <div className="space-y-2 mb-6">
        <label className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#1A1A1A]/50 font-bold block mb-2">
          Ações de Costura
        </label>

        {/* Start link mode */}
        <button
          onClick={onStartLinkMode}
          className={`w-full flex items-center justify-center gap-2 p-3 rounded-none font-sans text-[10px] font-bold uppercase tracking-[0.15em] transition-all shadow-none ${linkMode ? 'bg-[#D4A373] text-white animate-pulse' : 'bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white'}`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>{linkMode ? 'Selecione Cards...' : '+ Nova Linha'}</span>
        </button>

        {/* Add photo node */}
        <button
          onClick={onAddImageNode}
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-none bg-[#F5F5F0] hover:bg-[#EFECE7] text-[#1A1A1A] border border-[#1A1A1A]/10 font-sans text-[10px] font-bold uppercase tracking-[0.15em] transition-all shadow-none"
        >
          <Image className="w-3.5 h-3.5 text-[#1A1A1A]/70" />
          <span>Adicionar Imagem</span>
        </button>

        {/* Generate / Reimagine with Gemini helper */}
        <button
          onClick={() => setShowAiModal(true)}
          disabled={aiLoading}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-none bg-white hover:bg-[#F5F5F0] text-[#1A1A1A] border border-[#1A1A1A] font-sans text-[10px] font-bold uppercase tracking-[0.15em] transition-all cursor-pointer disabled:opacity-50"
        >
          <Wand2 className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
          <span>{aiLoading ? 'Tecendo...' : 'Re-imaginar com IA'}</span>
        </button>
      </div>

      {/* Connections lists for deletion */}
      <div className="flex-1 min-h-[140px] mb-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-2.5">
          <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#1A1A1A]/50 font-bold">
            Fios Conectados ({connections.length})
          </span>
        </div>

        {connections.length === 0 ? (
          <p className="font-sans text-[11px] text-[#1A1A1A]/40 italic">
            Nenhum fio conectando as ideias ainda. Use "+ Nova Linha".
          </p>
        ) : (
          <div className="space-y-1">
            {connections.map((c) => {
              const fromNode = nodes.find(n => n.id === c.fromId);
              const toNode = nodes.find(n => n.id === c.toId);
              if (!fromNode || !toNode) return null;
              return (
                <div 
                  key={c.id} 
                  className="flex items-center justify-between p-2 bg-[#F5F5F0]/50 hover:bg-[#EFECE7] rounded-none border-b border-[#1A1A1A]/5 text-[#1A1A1A] text-[11px]"
                >
                  <span className="truncate max-w-[190px]">
                    {fromNode.title} → {toNode.title}
                  </span>
                  <button 
                    onClick={() => onDeleteConnection(c.id)}
                    className="text-[#1A1A1A]/40 hover:text-red-600 p-0.5 shrink-0 transition-colors"
                    title="Excluir Conexão"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer navigation links */}
      <div className="mt-auto border-t border-[#1A1A1A]/10 pt-4 space-y-2">
        <button
          onClick={() => setShowHelp(true)}
          className="w-full flex items-center gap-3 p-2 rounded-none hover:bg-[#F5F5F0] text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors font-sans text-[10px] font-bold uppercase tracking-[0.1em]"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Instruções Têxteis</span>
        </button>
        <div className="text-[10px] text-[#1A1A1A]/40 text-center select-none pt-3 font-mono border-t border-[#1A1A1A]/5">
          Oráculo Têxtil v1.2 — Issue No. 42
        </div>
      </div>

      {/* REIMAGINE WITH GEMINI MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 bg-[#1A1A1A]/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#FDFCFB] rounded-none shadow-xl max-w-md w-full p-8 border border-[#1A1A1A]/10 animate-scaleUp">
            <div className="flex items-center gap-2.5 mb-4">
              <Sparkles className="w-5 h-5 text-[#D4A373]" />
              <h3 className="font-serif text-2xl font-medium text-[#1A1A1A]">
                Re-imaginar com IA
              </h3>
            </div>
            
            <p className="font-sans text-xs text-[#1A1A1A]/60 mb-5 leading-relaxed">
              Descreva um povo real, uma época medieval, fantasia ou ficção científica espacial. O Gemini irá gerar <strong>5 novos cards perfeitamente interligados</strong> (Clima, Material, Tingimento, Hierarquia e Padrão) em segundos!
            </p>

            <form onSubmit={handleAiSubmit} className="space-y-5">
              <div>
                <label className="block font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/50 mb-1.5">
                  Estilo, Povo ou Cultura Desejada
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ex: 'Império Romano na era de Júlio César', 'Povo élfico que colhe fios das árvores pratas', 'Estação espacial cyberpunk subterrânea'"
                  className="w-full h-24 p-3 border border-[#1A1A1A]/15 bg-white rounded-none text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] focus:border-[#1A1A1A] resize-none text-[#1A1A1A]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="px-4 py-2.5 text-[10px] uppercase tracking-[0.1em] font-bold text-[#1A1A1A]/60 hover:bg-[#F5F5F0] rounded-none transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-[10px] uppercase tracking-[0.15em] font-bold bg-[#1A1A1A] text-[#FDFCFB] rounded-none hover:bg-[#D4A373] transition-all flex items-center gap-1.5"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Tecelagem de IA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HELP INSTRUCTIONS MODAL */}
      {showHelp && (
        <div className="fixed inset-0 bg-[#1A1A1A]/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#FDFCFB] rounded-none shadow-xl max-w-lg w-full p-8 border border-[#1A1A1A]/10 overflow-y-auto max-h-[85vh]">
            <h3 className="font-serif text-2xl font-medium text-[#1A1A1A] mb-4 border-b border-[#1A1A1A]/10 pb-3">
              Oráculo Têxtil — Guia de Introdução
            </h3>
            
            <div className="space-y-4 font-sans text-xs text-[#1A1A1A]/70 leading-relaxed">
              <p>
                Bem-vindo ao <strong>Oráculo Têxtil</strong>, uma ferramenta inovadora para designers, costureiros de RPG e entusiastas de história criarem teias conceituais sobre estética e confecção de vestuário.
              </p>
              
              <div>
                <h4 className="font-sans text-[10px] uppercase tracking-wider font-bold text-[#D4A373] mb-1">1. Navegando no Grande Tear</h4>
                <p>
                  O canvas é infinito! Clique e arraste o fundo em qualquer direção. Use a barra flutuante abaixo para regular o <strong>Zoom</strong> e reenquadrar o Atelier.
                </p>
              </div>

              <div>
                <h4 className="font-sans text-[10px] uppercase tracking-wider font-bold text-[#D4A373] mb-1">2. Editando as Farpas (Cards)</h4>
                <p>
                  Cada card representa uma fibra de conhecimento. Clique no card para ver seus detalhes à direita. Você pode alterar o título, descrição, adicionar paleta de cores ou colar o link de uma imagem de referência.
                </p>
              </div>

              <div>
                <h4 className="font-sans text-[10px] uppercase tracking-wider font-bold text-[#D4A373] mb-1">3. Conectando Fios (Relações)</h4>
                <p>
                  Para amarrar duas ideias, clique no botão <strong>+ Nova Linha</strong>. O cursor entrará em modo costura. Clique no card de partida e, em seguida, no card de chegada. Um lindo fio curvo unirá as duas mentes!
                </p>
              </div>

              <div>
                <h4 className="font-sans text-[10px] uppercase tracking-wider font-bold text-[#D4A373] mb-1">4. Magia de Fiação por IA (Gemini)</h4>
                <p>
                  Caso esteja sem criatividade, clique no botão de <strong>Re-imaginar com IA</strong> ou envie um prompt para criar do absoluto nada um mundo têxtil completo.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-5 mt-5 border-t border-[#1A1A1A]/10">
              <button
                onClick={() => setShowHelp(false)}
                className="px-5 py-2.5 text-[10px] uppercase tracking-[0.15em] font-bold bg-[#1A1A1A] text-[#FDFCFB] rounded-none hover:bg-[#D4A373] transition-colors"
              >
                Concluir Leitura
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
