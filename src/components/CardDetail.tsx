import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Save, 
  Wand2, 
  Image, 
  Palette, 
} from 'lucide-react';
import { CanvasNode } from '../types';

interface CardDetailProps {
  node: CanvasNode | null;
  onClose: () => void;
  onUpdateNode: (updatedNode: CanvasNode) => void;
  onDeleteNode: (id: string) => void;
  onEnrichNodeWithAi: (id: string) => Promise<void>;
  enrichLoading: boolean;
}

export default function CardDetail({
  node,
  onClose,
  onUpdateNode,
  onDeleteNode,
  onEnrichNodeWithAi,
  enrichLoading,
}: CardDetailProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusTag, setStatusTag] = useState('');
  const [image, setImage] = useState('');
  const [borderStyle, setBorderStyle] = useState<'sage' | 'terracotta' | 'outline' | 'none'>('outline');
  const [colorsText, setColorsText] = useState(''); // Comma-separated hex values
  const [gridItems, setGridItems] = useState(false);

  // Sync state with selected node change
  useEffect(() => {
    if (node) {
      setTitle(node.title || '');
      setDescription(node.description || '');
      setStatusTag(node.statusTag || '');
      setImage(node.image || '');
      setBorderStyle(node.borderStyle || 'outline');
      setColorsText(node.colors ? node.colors.join(', ') : '');
      setGridItems(!!node.gridItems);
    }
  }, [node]);

  if (!node) return null;

  const handleSave = () => {
    // Parse colors
    const colors = colorsText
      .split(',')
      .map(c => c.trim())
      .filter(c => c.startsWith('#') || c.length >= 3); // Basic validation

    const updatedNode: CanvasNode = {
      ...node,
      title,
      description,
      statusTag: statusTag || undefined,
      image: image || undefined,
      borderStyle,
      colors: colors.length > 0 ? colors : undefined,
      gridItems,
    };

    onUpdateNode(updatedNode);
  };

  // Predefined image suggestions helper for the user
  const presetImages = [
    { name: "La Lã Rústica do Atelier", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzEZBowTVRurTqHO5yNa2sg8WSWJhXSPumJbEsBxyDrAfCD2XPcsez5cXxeIJf9_JnZEfM-cj8SkyyvFmQeVNTq2ofE3gNTqlVBAlF1G-Bc-7GoHS-MRY5zaoL2JdgF5T1QdZwaOp1BKem4z5bZR88z6ArCeePcGa3xhoYdBruFvh2K5ig0Xo5rpQhcU6JXUCKdVtGgcSknhIaqGvFDzj7MN5W72Kk0JsuV0x57y2SCdcuScwgBOW3cifr9uvQIREd-xKreiWErG7Z" },
    { name: "Padrão Asteca Julien", url: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/tribal-aztec-seamless-pattern-on-the-wool-knitted-texture-julien.jpg" },
    { name: "Viking Linho", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400&auto=format&fit=crop" },
    { name: "Micro-fio de Chip de Silício", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop" }
  ];

  return (
    <div className="w-80 h-screen bg-[#FDFCFB] border-l border-[#1A1A1A]/10 flex flex-col pt-24 pb-6 px-6 z-40 fixed right-0 top-0 overflow-y-auto select-none shadow-none">
      {/* Drawer Title */}
      <div className="flex justify-between items-center mb-6 border-b border-[#1A1A1A]/5 pb-3">
        <h3 className="font-serif text-lg font-regular text-[#1A1A1A] flex items-center gap-2">
          <span>Card de Conhecimento</span>
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 text-[#1A1A1A]/40 hover:text-[#1A1A1A] hover:bg-[#F5F5F0] rounded-none transition-colors cursor-pointer"
          title="Fechar Inspeção"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Inputs */}
      <div className="space-y-4 flex-1">
        {/* Title */}
        <div>
          <label className="block font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/40 mb-1.5">
            Nome do Elemento
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="Ex: Clima, Fio Dourado..."
            className="w-full text-xs font-serif font-semibold text-[#1A1A1A] p-2 border border-[#1A1A1A]/10 bg-white rounded-none focus:outline-none focus:border-[#1A1A1A]/50"
          />
        </div>

        {/* Description */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/40">
              Inscrição / Descrição Narrativa
            </label>
            <button
              onClick={() => onEnrichNodeWithAi(node.id)}
              disabled={enrichLoading}
              className="text-[9px] uppercase tracking-wide text-[#D4A373] hover:text-[#1A1A1A] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
              title="Solicitar que Gemini reescreva e enriqueça poética e historicamente este card"
            >
              <Wand2 className={`w-3 h-3 ${enrichLoading ? 'animate-spin' : ''}`} />
              <span>{enrichLoading ? 'Escrevendo...' : 'Inspirar with IA'}</span>
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder="Adicione ritos, contextos ecológicos ou receitas de fiação do seu mundo..."
            className="w-full h-28 text-xs font-sans font-light leading-relaxed p-2.5 border border-[#1A1A1A]/10 bg-white rounded-none focus:outline-none focus:border-[#1A1A1A]/50 text-[#1A1A1A]/85 text-justify resize-none"
          />
        </div>

        {/* Status tag */}
        <div>
          <label className="block font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/40 mb-1.5">
            Etiqueta Curta (Status)
          </label>
          <input
            type="text"
            value={statusTag}
            onChange={(e) => {
              setStatusTag(e.target.value);
            }}
            placeholder="Ex: Active, Sagrado, Alquímico"
            className="w-full text-xs font-sans p-2 border border-[#1A1A1A]/10 bg-white rounded-none focus:outline-none focus:border-[#1A1A1A]/50 text-[#1A1A1A]"
          />
        </div>

        {/* Border Style */}
        <div>
          <label className="block font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/40 mb-1.5">
            Aparência Estética de Borda
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['sage', 'terracotta', 'outline'] as const).map((style) => (
              <button
                key={style}
                onClick={() => {
                  setBorderStyle(style);
                }}
                className={`py-1.5 rounded-none text-[9px] uppercase tracking-wider font-bold text-center border transition-all ${borderStyle === style ? 'bg-[#1A1A1A] text-[#FDFCFB] border-[#1A1A1A]' : 'bg-[#F5F5F0]/50 hover:bg-[#EFECE7] text-[#1A1A1A]/60 border-[#1A1A1A]/5'}`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Colors Comma List */}
        <div>
          <label className="block font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/40 mb-1.5 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-[#1A1A1A]/40" />
            <span>Paleta de Cores (Hex separados por vírgula)</span>
          </label>
          <input
            type="text"
            value={colorsText}
            onChange={(e) => {
              setColorsText(e.target.value);
            }}
            placeholder="#e0f2f1, #009688, #00796b"
            className="w-full text-xs font-sans p-2 border border-[#1A1A1A]/10 bg-white rounded-none focus:outline-none focus:border-[#1A1A1A]/50 text-[#1A1A1A]"
          />
          {colorsText && (
            <div className="flex gap-1.5 mt-2">
              {colorsText.split(',').map((c, i) => {
                const clean = c.trim();
                if (!clean.startsWith('#')) return null;
                return (
                  <div 
                    key={i} 
                    className="w-4 h-4 rounded-none border border-[#1A1A1A]/15 shadow-sm shrink-0" 
                    style={{ backgroundColor: clean }} 
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Dynamic Image Link */}
        <div>
          <label className="block font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/40 mb-1.5 flex items-center gap-1">
            <Image className="w-3.5 h-3.5 text-[#1A1A1A]/40" />
            <span>Link Direto de Imagem (URL)</span>
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
            }}
            placeholder="Cole o endereço de uma imagem da internet"
            className="w-full text-xs font-sans p-2 border border-[#1A1A1A]/10 bg-white rounded-none focus:outline-none focus:border-[#1A1A1A]/50 text-[#1A1A1A] truncate"
          />
          {image && (
            <div className="mt-2.5 h-16 w-full rounded-none overflow-hidden border border-[#1A1A1A]/10">
              <img 
                src={image} 
                alt="Miniatura inserida" 
                className="w-full h-full object-cover grayscale opacity-90"
                onError={() => console.log("Erro ao carregar pré-visualização")} 
              />
            </div>
          )}

          {/* Quick Preset URLs */}
          <div className="mt-3">
            <span className="text-[9px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest block mb-1.5">Sugestões de Pesquisa</span>
            <div className="space-y-1">
              {presetImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setImage(img.url);
                  }}
                  className="w-full text-left text-[9px] text-[#1A1A1A]/80 truncate bg-[#F5F5F0]/60 hover:bg-[#EFECE7] px-2 py-1.5 border border-[#1A1A1A]/5 hover:border-[#1A1A1A]/20 transition-all rounded-none block"
                >
                  📥 {img.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pattern Grid checkbox */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="checkbox-grid"
            checked={gridItems}
            onChange={(e) => {
              setGridItems(e.target.checked);
            }}
            className="w-4 h-4 text-[#1A1A1A] rounded-none border-[#1A1A1A]/20 focus:ring-[#1A1A1A] focus:ring-1"
          />
          <label htmlFor="checkbox-grid" className="font-sans text-[11px] font-semibold text-[#1A1A1A]/80 block cursor-pointer">
            Exibir Grade de Padrão
          </label>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="mt-8 border-t border-[#1A1A1A]/10 pt-4 flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 py-3 bg-[#1A1A1A] text-[#FDFCFB] rounded-none text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#D4A373] transition-colors flex items-center justify-center gap-1.5 shadow-none cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Salvar Card</span>
        </button>

        <button
          onClick={() => onDeleteNode(node.id)}
          className="p-3 border border-red-200 text-red-500 hover:bg-red-50 rounded-none transition-colors cursor-pointer"
          title="Remover Card Complementar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Save indicators */}
      <span className="text-[9px] text-[#1A1A1A]/40 block text-center mt-3 select-none">
        Clique no card para arrastar no canvas. Suas edições persistem localmente.
      </span>
    </div>
  );
}
