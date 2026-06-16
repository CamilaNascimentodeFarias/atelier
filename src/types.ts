export type NodeType = 'clima' | 'material' | 'tingimento' | 'hierarquia' | 'padrao' | 'custom' | 'editorial';

export interface CanvasNode {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  icon: string; // Lucide icon name, e.g., 'Cloud', 'Container', 'Scissors'
  x: number;
  y: number;
  borderStyle: 'sage' | 'terracotta' | 'outline' | 'none';
  statusTag?: string; // e.g. "Active"
  colors?: string[]; // hex swatches
  image?: string; // image url
  gridItems?: boolean; // show grid items
}

export interface CanvasConnection {
  id: string;
  fromId: string;
  toId: string;
}

export interface WorldbuildingTheme {
  name: string;
  culture: string;
  era: string;
  description: string;
}
