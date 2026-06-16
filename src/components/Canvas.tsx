import React, { useState, useRef, useEffect } from 'react';
import { 
  Cloud, 
  Mountain, 
  Palette, 
  Users, 
  Grid, 
  Scissors, 
  Layers, 
  Wand2, 
  Sparkles,
  ZoomIn, 
  ZoomOut, 
  Maximize,
  HelpCircle,
  Plus,
  Trash2,
  MapPin,
  Move,
  Link2
} from 'lucide-react';
import { CanvasNode, CanvasConnection } from '../types';

interface CanvasProps {
  nodes: CanvasNode[];
  connections: CanvasConnection[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  onUpdateNodeCoordinates: (id: string, x: number, y: number) => void;
  scale: number;
  onSetScale: (scale: number) => void;
  panOffset: { x: number; y: number };
  onSetPanOffset: (offset: { x: number; y: number }) => void;
  linkMode: boolean;
  linkSourceId: string | null;
  onSelectLinkNode: (id: string) => void;
}

export const getIcon = (iconName: string, className = "w-5 h-5") => {
  switch (iconName?.toLowerCase()) {
    case 'cloud': return <Cloud className={className} />;
    case 'mountain':
    case 'landscape': return <Mountain className={className} />;
    case 'palette':
    case 'colorize': return <Palette className={className} />;
    case 'users':
    case 'groups': return <Users className={className} />;
    case 'grid':
    case 'grid_4x4': return <Grid className={className} />;
    case 'scissors': return <Scissors className={className} />;
    case 'layers': return <Layers className={className} />;
    case 'wand2':
    case 'auto_fix_high': return <Wand2 className={className} />;
    default: return <Sparkles className={className} />;
  }
};

export default function Canvas({
  nodes,
  connections,
  selectedNodeId,
  onSelectNode,
  onUpdateNodeCoordinates,
  scale,
  onSetScale,
  panOffset,
  onSetPanOffset,
  linkMode,
  linkSourceId,
  onSelectLinkNode,
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  // Dragging individual nodes state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragNodeInitialPos, setDragNodeInitialPos] = useState({ x: 0, y: 0 });

  // Handle canvas panning start
  const handleMouseDown = (e: React.MouseEvent) => {
    // ONLY pan if clicking directly on the canvas background or svg
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'path' || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // If panning canvas background
    if (isPanning) {
      onSetPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    // If dragging node
    if (draggingNodeId) {
      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;
      
      // Calculate new position
      const newX = Math.round(dragNodeInitialPos.x + dx);
      const newY = Math.round(dragNodeInitialPos.y + dy);

      // Bound within canvas bounds safely
      const boundedX = Math.max(50, Math.min(newX, 2800));
      const boundedY = Math.max(50, Math.min(newY, 2800));

      onUpdateNodeCoordinates(draggingNodeId, boundedX, boundedY);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  // Node Drag Handlers
  const handleNodeDragStart = (e: React.MouseEvent, node: CanvasNode) => {
    e.stopPropagation();
    
    // If we are in sew link mode, clicking card handles linking instead of dragging
    if (linkMode) {
      onSelectLinkNode(node.id);
      return;
    }

    // Select the card when clicked
    onSelectNode(node.id);

    // Save initial coordinates
    setDraggingNodeId(node.id);
    setDragInitialCoordinates(e, node);
  };

  const setDragInitialCoordinates = (e: React.MouseEvent, node: CanvasNode) => {
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragNodeInitialPos({ x: node.x, y: node.y });
  };

  // Find node ref coordinates for drawing SVG lines
  const getNodeCenter = (id: string) => {
    const node = nodes.find(n => n.id === id);
    if (!node) return { x: 0, y: 0 };
    // Node width is typically w-64 (256px) or w-72 (288px) plus card padding.
    const width = node.type === 'padrao' ? 288 : 256;
    const height = node.image ? 280 : 180; // approximate center heights
    return {
      x: node.x + width / 2,
      y: node.y + height / 3, // slightly above physical center to look nicely aligned
    };
  };

  // Zoom Helpers
  const handleZoomIn = () => {
    onSetScale(Math.min(scale + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    onSetScale(Math.max(scale - 0.1, 0.4));
  };

  const handleResetView = () => {
    onSetScale(0.85);
    // Center around nodes (approx coordinates)
    onSetPanOffset({ x: window.innerWidth / 2 - 800 * 0.85, y: window.innerHeight / 2 - 450 * 0.85 });
  };

  // Atmospheric effect of mouse movement
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleCanvasMouseMoveForParallax = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <main 
      id="canvas-wrapper" 
      className="relative flex-1 h-screen overflow-hidden cursor-grab active:cursor-grabbing bg-canvas-bg"
      onMouseMove={(e) => {
        handleMouseMove(e);
        handleCanvasMouseMoveForParallax(e);
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      ref={containerRef}
    >
      {/* Background Subtle grid patterns */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: 'radial-gradient(circle, #1A1A1A 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      />

      {/* DRAGGABLE & ZOOMABLE CANVAS OBJECT */}
      <div 
        id="canvas"
        className="absolute w-[3000px] h-[3000px] top-0 left-0 origin-none pointer-events-none"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        {/* SVG Connection threads */}
        <svg className="absolute inset-0 w-full h-full pointer-events-auto">
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="16"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#1A1A1A" opacity="0.3" />
            </marker>
          </defs>

          {connections.map((conn) => {
            const start = getNodeCenter(conn.fromId);
            const end = getNodeCenter(conn.toId);
            
            // Calculate a gorgeous curved path (Cubic Bezier S-curve)
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const cpx1 = start.x + dx * 0.4;
            const cpy1 = start.y;
            const cpx2 = start.x + dx * 0.6;
            const cpy2 = end.y;

            return (
              <g key={conn.id} className="group pointer-events-auto cursor-pointer">
                {/* Invisible wider stroke for easier hover selection */}
                <path
                  d={`M ${start.x} ${start.y} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${end.x} ${end.y}`}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="12"
                />
                
                {/* Interactive elegant connection path */}
                <path
                  d={`M ${start.x} ${start.y} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${end.x} ${end.y}`}
                  fill="none"
                  stroke="#1A1A1A"
                  strokeWidth="1.5"
                  className="thread-line-anim opacity-20 hover:opacity-100 transition-opacity"
                  title="Fio de Relacionamento"
                />
              </g>
            );
          })}
        </svg>

        {/* Node Cards on Canvas */}
        <div className="absolute inset-0 pointer-events-none">
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const widthClass = node.type === 'padrao' ? 'w-72' : 'w-64';
            
            // Custom border configurations from archetype edited with editorial chic style (thin borders with accent colors or black)
            let borderClass = 'border-l-4 border-[#1A1A1A]/30';
            let glowClass = '';
            
            if (node.borderStyle === 'sage') {
              borderClass = 'border-l-4 border-sage';
              glowClass = isSelected ? 'pulse-glow-sage' : '';
            } else if (node.borderStyle === 'terracotta') {
              borderClass = 'border-l-4 border-terracotta';
              glowClass = isSelected ? 'pulse-glow-terracotta' : '';
            } else if (isSelected) {
              glowClass = 'shadow-md ring-1 ring-[#1A1A1A]/40 bg-[#FDFCFB]/100';
            }

            // Calculate subtle local interactive offset (Prallax)
            const center = getNodeCenter(node.id);
            const parallaxStyle: React.CSSProperties = {
              top: `${node.y}px`,
              left: `${node.x}px`,
            };

            return (
              <div
                key={node.id}
                id={`node-${node.id}`}
                className={`node-card absolute p-6 bg-[#FDFCFB] rounded-none ${widthClass} ${borderClass} ${glowClass} select-none pointer-events-auto cursor-pointer transition-all duration-300 ${isSelected ? 'scale-102 z-30 ring-1 ring-[#1A1A1A]' : 'z-20'}`}
                style={parallaxStyle}
                onMouseDown={(e) => handleNodeDragStart(e, node)}
                title="Clique para selecionar e editar, Arraste para mover"
              >
                {/* Header Row */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-1.5 text-[#1A1A1A]/80">
                    <span 
                      className={`p-1 rounded-none ${node.borderStyle === 'sage' ? 'bg-sage/10 text-sage-dark' : node.borderStyle === 'terracotta' ? 'bg-terracotta/10 text-terracotta-dark' : 'bg-[#EFECE7] text-[#1A1A1A]'}`}
                    >
                      {getIcon(node.icon, "w-3.5 h-3.5")}
                    </span>
                    <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#1A1A1A]/50 font-bold">
                      {node.type}
                    </span>
                  </div>

                  {/* Badges / Active tag with sharp editorial style */}
                  {node.statusTag && (
                    <span className={`text-[8px] uppercase font-bold tracking-[0.2em] px-2 py-0.5 rounded-none ${node.borderStyle === 'sage' ? 'bg-sage/15 text-[#1A1A1A]' : 'bg-[#D4A373]/15 text-[#1A1A1A]'}`}>
                      {node.statusTag}
                    </span>
                  )}
                </div>

                {/* Card Title - high readability serif heading */}
                <h3 className="font-serif text-lg font-medium text-[#1A1A1A] mb-2.5 leading-snug">
                  {node.title}
                </h3>

                {/* Card Description */}
                <p className="font-sans text-[11px] text-[#1A1A1A]/70 line-clamp-4 leading-relaxed font-light mb-4 text-justify">
                  {node.description}
                </p>

                {/* Specific card overlays: Patterns or Grids */}
                {node.gridItems && (
                  <div className="grid grid-cols-4 gap-1 mb-4 max-w-full">
                    <div className="aspect-square bg-[#EFECE7] rounded-none border border-[#1A1A1A]/5 hover:bg-[#E3DFD9] transition-colors cursor-help" title="Quadra A1: Urdidura clássica" />
                    <div className="aspect-square bg-sage/20 rounded-none border border-sage/40 hover:bg-sage/40 transition-colors cursor-help" title="Quadra A2: Trama folha de líquen" />
                    <div className="aspect-square bg-[#EFECE7] rounded-none border border-[#1A1A1A]/5 hover:bg-[#E3DFD9] transition-colors cursor-help" title="Quadra B1: Arqueologia geométrica" />
                    <div className="aspect-square bg-[#D4A373]/25 rounded-none border border-[#D4A373]/50 hover:bg-[#D4A373]/40 transition-colors cursor-help" title="Quadra B2: Alquimia de argila" />
                  </div>
                )}

                {/* Colors block if available - sharp editorial blocks */}
                {node.colors && node.colors.length > 0 && (
                  <div className="flex gap-1.5 mb-3">
                    {node.colors.map((hex, i) => (
                      <div 
                        key={i} 
                        className="w-4 h-4 rounded-none border border-[#1A1A1A]/10 shadow-sm" 
                        style={{ backgroundColor: hex }} 
                        title={`Corante: ${hex}`}
                      />
                    ))}
                  </div>
                )}

                {/* Image display if configured */}
                {node.image && (
                  <div className="mt-3 overflow-hidden rounded-none border border-[#1A1A1A]/10 group-hover:border-[#1A1A1A]/20 transition-colors">
                    <img 
                      src={node.image} 
                      alt={node.title} 
                      className="w-full h-24 object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-[1.03] pointer-events-none"
                    />
                  </div>
                )}

                {/* Link stitching helper display */}
                {linkMode && linkSourceId && linkSourceId !== node.id && (
                  <div className="absolute inset-0 bg-[#1A1A1A]/5 backdrop-blur-[1px] flex items-center justify-center rounded-none animate-pulse">
                    <div className="bg-[#1A1A1A] text-white px-3 py-1.5 rounded-none text-[8px] tracking-[0.25em] uppercase font-bold flex items-center gap-1 shadow-md">
                      <Link2 className="w-3 h-3" />
                      Costurar Fio
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FLOATING CANVAS ZOOM CONTROLS (Frosted Glass Nav) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 p-2.5 glass-panel rounded-none shadow-sm z-40 transition-transform">
        {/* Zoom section */}
        <div className="flex items-center gap-1 px-3 border-r border-[#1A1A1A]/10 text-[#1A1A1A]">
          <button 
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-black/5 rounded-none hover:text-[#1A1A1A] transition-colors active:scale-95"
            title="Afastar Zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-sans text-[10px] tracking-wider uppercase w-12 text-center font-bold text-[#1A1A1A]/60">
            {Math.round(scale * 100)}%
          </span>
          <button 
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-black/5 rounded-none hover:text-[#1A1A1A] transition-colors active:scale-95"
            title="Aproximar Zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Layout action utilities */}
        <div className="flex items-center gap-1.5 px-1 text-[#1A1A1A]/50">
          <button 
            onClick={handleResetView}
            className="p-1.5 hover:bg-black/5 rounded-none hover:text-[#1A1A1A] transition-colors"
            title="Resetar e Centralizar Enquadramento"
          >
            <Maximize className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onSelectNode(null)}
            className="p-1.5 hover:bg-black/5 rounded-none hover:text-[#1A1A1A] transition-colors"
            title="Listar Camadas"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Help prompt icon */}
        <div className="pl-1">
          <button 
            className="bg-[#1A1A1A] text-[#FDFCFB] p-2.5 rounded-none hover:bg-[#D4A373] transition-all active:scale-90"
            title="Canvas Navegável: Clique e segure para arrastar o cenário. Use os círculos ou botões para modelar a história."
          >
            <Move className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CANVAS HELPER CHAT PROMPT BADGE */}
      {linkMode && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-[#FDFCFB] px-5 py-2.5 rounded-none font-sans text-[9px] tracking-[0.2em] font-bold uppercase shadow-md z-40 flex items-center gap-2 border border-white/10 animate-bounce">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373] animate-ping" />
          <span>Status de Costura: Escolha um card de destino</span>
        </div>
      )}
    </main>
  );
}
