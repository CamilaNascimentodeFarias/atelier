import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  Settings, 
  HelpCircle, 
  Wand2, 
  Plus, 
  AlertCircle,
  Database,
  Grid,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';
import CardDetail from './components/CardDetail';
import { CanvasNode, CanvasConnection, WorldbuildingTheme } from './types';
import { THEME_PRESETS } from './data';

export default function App() {
  // Preset or custom state managers
  const [currentThemeId, setCurrentThemeId] = useState<string>('asteca');
  const [themeName, setThemeName] = useState<string>('Atelier Imperial');
  const [themeCulture, setThemeCulture] = useState<string>('Império Asteca');
  const [themeDescription, setThemeDescription] = useState<string>('Fiação asteca de algodão e fibras de agave (maguey), corantes de cochonilha e padrões.');

  // Canvas nodes and lines
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [connections, setConnections] = useState<CanvasConnection[]>([]);
  
  // Selection & UI details
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(0.85);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: -100, y: 50 });

  // Sewer Sewing connect link state
  const [linkMode, setLinkMode] = useState<boolean>(false);
  const [linkSourceId, setLinkSourceId] = useState<string | null>(null);

  // Search keyword filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Loading indicator states
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [enrichLoading, setEnrichLoading] = useState<boolean>(false);
  const [geminiStatus, setGeminiStatus] = useState<boolean | null>(null);

  // Load state from local storage or defaults
  useEffect(() => {
    const savedNodes = localStorage.getItem('oraculo_nodes');
    const savedConnections = localStorage.getItem('oraculo_connections');
    const savedThemeId = localStorage.getItem('oraculo_current_theme');
    const savedName = localStorage.getItem('oraculo_theme_name');
    const savedCulture = localStorage.getItem('oraculo_theme_culture');
    const savedDesc = localStorage.getItem('oraculo_theme_desc');

    if (savedNodes && savedConnections) {
      setNodes(JSON.parse(savedNodes));
      setConnections(JSON.parse(savedConnections));
      setCurrentThemeId(savedThemeId || 'asteca');
      setThemeName(savedName || 'Atelier Imperial');
      setThemeCulture(savedCulture || 'Império Asteca');
      setThemeDescription(savedDesc || '');
    } else {
      // Setup default (asteca preset)
      handleLoadThemePreset('asteca');
    }

    // Check backend connection
    checkBackendHealth();
  }, []);

  // Save changes to localStorage on any modification
  useEffect(() => {
    if (nodes.length > 0) {
      localStorage.setItem('oraculo_nodes', JSON.stringify(nodes));
      localStorage.setItem('oraculo_connections', JSON.stringify(connections));
      localStorage.setItem('oraculo_current_theme', currentThemeId);
      localStorage.setItem('oraculo_theme_name', themeName);
      localStorage.setItem('oraculo_theme_culture', themeCulture);
      localStorage.setItem('oraculo_theme_desc', themeDescription);
    }
  }, [nodes, connections, currentThemeId, themeName, themeCulture, themeDescription]);

  // Check health and configure gemini statuses
  const checkBackendHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setGeminiStatus(data.geminiConfigured);
    } catch {
      setGeminiStatus(false);
    }
  };

  // Preset configuration loading helper
  const handleLoadThemePreset = (presetId: string) => {
    const preset = THEME_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setNodes(preset.nodes);
      setConnections(preset.connections);
      setCurrentThemeId(preset.id);
      setThemeName(preset.theme.name);
      setThemeCulture(preset.theme.culture);
      setThemeDescription(preset.theme.description);
      setSelectedNodeId(null);
      setLinkMode(false);
      setLinkSourceId(null);
      
      // Center view onto appropriate coordinate segment
      setPanOffset({ x: window.innerWidth / 2 - 800 * 0.85, y: window.innerHeight / 2 - 450 * 0.85 });
      setScale(0.85);
    }
  };

  // Re-imagine Entire Canvas board using server-side Gemini AI
  const handleReimagineWithAi = async (userPrompt: string) => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/gemini/reimagine-canvas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: userPrompt,
          culture: userPrompt,
          era: 'Ficção Histórica'
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Falha ao processar requisição de fiação do modelo.');
      }

      const rawData = await response.json();
      
      // Reconstitute system nodes with distinct coordinates and unique IDs
      const prefix = `ai-${Date.now()}`;
      
      // Nodes positioning offsets to scatter them beautifully in circular / diamond shape
      const offsets = [
        { x: 700, y: 350 },  // Clima (Central Left)
        { x: 1100, y: 280 }, // Material (Top Right)
        { x: 1300, y: 500 }, // Tingimento (Far Right)
        { x: 950, y: 650 },  // Hierarquia (Center Bottom)
        { x: 600, y: 580 }   // Padrão (Left Bottom)
      ];

      const newNodes: CanvasNode[] = rawData.nodes.map((node: any, idx: number) => {
        const pos = offsets[idx] || { x: 800 + idx * 100, y: 400 + idx * 50 };
        return {
          id: `${prefix}-node-${idx}`,
          type: node.type,
          title: node.title,
          description: node.description,
          icon: node.icon || 'Sparkles',
          borderStyle: node.borderStyle || 'outline',
          statusTag: node.statusTag || undefined,
          colors: node.colors && node.colors.length > 0 ? node.colors : undefined,
          x: pos.x,
          y: pos.y
        };
      });

      // Build connection links
      const newConnections: CanvasConnection[] = rawData.connections.map((conn: any, idx: number) => {
        return {
          id: `${prefix}-conn-${idx}`,
          fromId: `${prefix}-node-${conn.fromIndex}`,
          toId: `${prefix}-node-${conn.toIndex}`
        };
      });

      setNodes(newNodes);
      setConnections(newConnections);
      setCurrentThemeId('custom');
      setThemeName(rawData.themeName || 'Fórmula Tecida por IA');
      setThemeCulture(userPrompt);
      setThemeDescription(`Sistema têxtil e encadeamento histórico tecidos pelo Oráculo Gemini a partir do prompt: "${userPrompt}"`);
      setSelectedNodeId(null);
      setLinkMode(false);
      setLinkSourceId(null);

      // Scroll canvas to focus on center
      setPanOffset({ x: window.innerWidth / 2 - 850 * 0.85, y: window.innerHeight / 2 - 450 * 0.85 });
      setScale(0.85);

    } catch (e: any) {
      alert(`Ocorreu um erro ao chamar o Oráculo Gemini: ${e.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Enrich single selected Node Card using server-side Gemini
  const handleEnrichNodeWithAi = async (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setEnrichLoading(true);
    try {
      const response = await fetch('/api/gemini/generate-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeDescription: `${themeCulture} (${themeName}) - ${themeDescription}`,
          nodeTitle: node.title,
          nodeType: node.type
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Não foi possível buscar a recomendação poética.');
      }

      const rawData = await response.json();

      const updatedNodes = nodes.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            title: rawData.title || n.title,
            description: rawData.description || n.description,
            icon: rawData.icon || n.icon,
            borderStyle: rawData.borderStyle || n.borderStyle,
            statusTag: rawData.statusTag || n.statusTag,
            colors: rawData.colors && rawData.colors.length > 0 ? rawData.colors : n.colors
          };
        }
        return n;
      });

      setNodes(updatedNodes);
      
      // Update inspection focus details card in real-time
      const newlyEnriched = updatedNodes.find(n => n.id === nodeId);
      if (newlyEnriched) {
        setSelectedNodeId(null); // Simple refresh
        setTimeout(() => setSelectedNodeId(nodeId), 50);
      }

    } catch (e: any) {
      alert(`Erro do Oráculo Têxtil: ${e.message}`);
    } finally {
      setEnrichLoading(false);
    }
  };

  // Start Sewing Link Mode (+ Nova Linha)
  const handleStartLinkMode = () => {
    setLinkMode(true);
    setLinkSourceId(null);
  };

  const handleSelectLinkNode = (nodeId: string) => {
    if (!linkSourceId) {
      // Choose first node
      setLinkSourceId(nodeId);
    } else {
      // Connect to second node if not duplicate
      if (linkSourceId === nodeId) {
        setLinkMode(false);
        setLinkSourceId(null);
        return;
      }

      const duplicate = connections.some(
        c => (c.fromId === linkSourceId && c.toId === nodeId) || (c.fromId === nodeId && c.toId === linkSourceId)
      );

      if (!duplicate) {
        const newConn: CanvasConnection = {
          id: `conn-${Date.now()}`,
          fromId: linkSourceId,
          toId: nodeId
        };
        setConnections([...connections, newConn]);
      }

      setLinkMode(false);
      setLinkSourceId(null);
    }
  };

  // Canvas Actions
  const handleAddNode = (type: any = 'custom') => {
    // Generate at staggered visible location in viewport center
    const x = Math.round(900 + (Math.random() * 100 - 50));
    const y = Math.round(450 + (Math.random() * 100 - 50));
    const prefix = `custom-${Date.now()}`;

    const titles: Record<string, string> = {
      clima: 'Clima Local',
      material: 'Novo Material',
      tingimento: 'Fórmula de Corante',
      hierarquia: 'Traje de Classe',
      padrao: 'Amostra de Trama',
      custom: 'Conceito Complementar'
    };

    const icons: Record<string, string> = {
      clima: 'Cloud',
      material: 'Mountain',
      tingimento: 'Palette',
      hierarquia: 'Users',
      padrao: 'Grid',
      custom: 'Scissors'
    };

    const newNode: CanvasNode = {
      id: prefix,
      type: type,
      title: titles[type] || 'Conceito Inédito',
      description: 'Dê dois cliques aqui ou selecione este card para redigir suas propriedades têxteis ou clicar em "Inspirar com IA".',
      icon: icons[type] || 'Scissors',
      borderStyle: type === 'clima' ? 'sage' : type === 'tingimento' ? 'terracotta' : 'outline',
      x,
      y
    };

    setNodes([...nodes, newNode]);
    setSelectedNodeId(prefix);
  };

  const handleAddImageNode = () => {
    const x = Math.round(800 + (Math.random() * 100 - 50));
    const y = Math.round(355 + (Math.random() * 100 - 50));
    const prefix = `image-${Date.now()}`;

    const newImgNode: CanvasNode = {
      id: prefix,
      type: 'padrao',
      title: 'Amostra Visual',
      description: 'Selecione e insira um link direto de imagem no formulário de edição lateral (como os fornecidos pelas sugestões).',
      icon: 'Grid',
      borderStyle: 'outline',
      gridItems: false,
      image: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/tribal-aztec-seamless-pattern-on-the-wool-knitted-texture-julien.jpg',
      x,
      y
    };

    setNodes([...nodes, newImgNode]);
    setSelectedNodeId(prefix);
  };

  const handleUpdateNode = (updatedNode: CanvasNode) => {
    setNodes(nodes.map(n => n.id === updatedNode.id ? updatedNode : n));
  };

  const handleDeleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    setConnections(connections.filter(c => c.fromId !== id && c.toId !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const handleDeleteConnection = (connId: string) => {
    setConnections(connections.filter(c => c.id !== connId));
  };

  const handleClearCanvas = () => {
    if (confirm('Deseja realmente apagar o canvas e criar um novo worldbuilding em branco?')) {
      setNodes([]);
      setConnections([]);
      setThemeCulture('Novo Atelier');
      setThemeName('Mundo Sem Título');
      setThemeDescription('Comece adicionando cards utilitários ou use a nossa fiação de IA no menu de reimaginação para tecer o destino.');
      setCurrentThemeId('custom');
      setSelectedNodeId(null);
      setLinkMode(false);
      setLinkSourceId(null);
    }
  };

  // Searching query highlighting trigger
  const filteredNodes = nodes.map(n => {
    if (!searchQuery.trim()) return { ...n, faded: false };
    
    const term = searchQuery.toLowerCase();
    const match = n.title.toLowerCase().includes(term) || 
                  n.description.toLowerCase().includes(term) ||
                  n.type.toLowerCase().includes(term);
    return { ...n, faded: !match };
  });

  const activeNode = nodes.find(n => n.id === selectedNodeId) || null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F5F0] text-[#1A1A1A] antialiased">
      {/* SHARABLE TOP HEADER BAR */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 md:px-12 h-16 bg-[#FDFCFB]/90 backdrop-blur-md border-b border-[#1A1A1A]/10 select-none shrink-0 shadow-none">
        <div className="flex items-center gap-2.5">
          {/* Decorative loom thread logo spacer */}
          <div className="w-4 h-4 rounded-full border border-dashed border-[#D4A373] animate-spin" style={{ animationDuration: '40s' }} />
          <span className="font-serif text-xl font-normal tracking-tight text-[#1A1A1A]">
            Oráculo Têxtil
          </span>
        </div>

        {/* Global center link - indicates we are on Archive mode */}
        <nav className="hidden md:flex items-center gap-12">
          <a className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#1A1A1A] border-b border-[#1A1A1A] pb-1 transition-colors font-bold" href="#">
            Archive // No. 42
          </a>
        </nav>

        {/* Action Widgets */}
        <div className="flex items-center gap-5">
          {/* Quick-query Search box */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Buscar conceito..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3.5 py-1.5 bg-[#F5F5F0] focus:bg-white text-[11px] font-sans border border-[#1A1A1A]/10 focus:border-[#1A1A1A]/40 rounded-none focus:outline-none w-48 transition-all text-[#1A1A1A] placeholder-[#1A1A1A]/40"
            />
            <Search className="w-3.5 h-3.5 text-[#1A1A1A]/40 absolute left-3 top-2" />
          </div>

          <div className="flex gap-2">
            {/* Health/AI Status marker widget */}
            <div 
              className="p-2 rounded-none cursor-help hover:bg-[#F5F5F0] flex items-center justify-center transition-colors"
              title={geminiStatus === true ? "IA Gemini: Conectada e Pronta!" : "IA Gemini: Offline. Configure GEMINI_API_KEY no menu Settings?"}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${geminiStatus === true ? 'bg-emerald-600 animate-pulse' : 'bg-rose-500'}`} />
            </div>

            <button 
              onClick={() => alert(`Inscrição: milacndf@gmail.com\nServidor: ${window.location.host}`)}
              className="p-1.5 hover:bg-[#F5F5F0] text-[#1A1A1A]/60 hover:text-[#1A1A1A] rounded-none transition-colors"
              title="Perfil do Atelier"
            >
              <User className="w-4 h-4" />
            </button>

            <button 
              onClick={() => {
                const prompt = confirm("Deseja redefinir as variáveis e limpar os dados locais salvos no browser?");
                if(prompt) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="p-1.5 hover:bg-[#F5F5F0] text-[#1A1A1A]/60 hover:text-[#1A1A1A] rounded-none transition-colors"
              title="Redefinir Dados Locais"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* LEFT DRAWER CONTROL SIDEBAR */}
      <Sidebar
        currentThemeId={currentThemeId}
        onSelectTheme={handleLoadThemePreset}
        themeCulture={themeCulture}
        themeName={themeName}
        themeDescription={themeDescription}
        nodes={nodes}
        connections={connections}
        onAddNode={handleAddNode}
        onAddImageNode={handleAddImageNode}
        onStartLinkMode={handleStartLinkMode}
        linkMode={linkMode}
        onDeleteConnection={handleDeleteConnection}
        onReimagineWithAi={handleReimagineWithAi}
        aiLoading={aiLoading}
        onClearCanvas={handleClearCanvas}
      />

      {/* CENTER INTERACTIVE COMPASS CANVAS */}
      <Canvas
        nodes={filteredNodes}
        connections={connections}
        selectedNodeId={selectedNodeId}
        onSelectNode={setSelectedNodeId}
        onUpdateNodeCoordinates={(id, x, y) => {
          setNodes(nodes.map(n => n.id === id ? { ...n, x, y } : n));
        }}
        scale={scale}
        onSetScale={setScale}
        panOffset={panOffset}
        onSetPanOffset={setPanOffset}
        linkMode={linkMode}
        linkSourceId={linkSourceId}
        onSelectLinkNode={handleSelectLinkNode}
      />

      {/* RIGHT DRAWER SIDEBAR DETAILS PANEL */}
      {selectedNodeId && (
        <CardDetail
          node={activeNode}
          onClose={() => setSelectedNodeId(null)}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          onEnrichNodeWithAi={handleEnrichNodeWithAi}
          enrichLoading={enrichLoading}
        />
      )}

      {/* DUST PARTICLES/THREADS TRANSITION ANIMATIONS LOADER SCREEN FOR IA */}
      {aiLoading && (
        <div className="fixed inset-0 z-50 bg-[#FDFCFB]/95 backdrop-blur-xs flex flex-col items-center justify-center select-none animate-fadeIn">
          {/* Animated weaver loom */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <span className="absolute w-24 h-24 border border-dashed border-[#D4A373] rounded-none animate-spin" style={{ animationDuration: '8s' }} />
            <span className="absolute w-16 h-16 border-2 border-[#1A1A1A]/10 rounded-none animate-ping" />
            <Sparkles className="w-6 h-6 text-[#1A1A1A] animate-bounce" />
          </div>

          <h3 className="font-serif text-3xl font-regular text-[#1A1A1A] mt-6 tracking-tight text-center">
            Tendo o Fio do Destino
          </h3>
          <p className="font-sans text-[11px] text-[#1A1A1A]/60 mt-3 max-w-sm text-center leading-relaxed font-light px-4">
            A IA Gemini está decifrando a cultura, consultando arquivos de fiação e modelando o canvas geológico do clima e corantes...
          </p>
          <div className="flex gap-1.5 mt-8 items-center">
            <span className="w-1.5 h-1.5 rounded-none bg-[#D4A373] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-none bg-[#1A1A1A] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-none bg-[#D4A373] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );
}
