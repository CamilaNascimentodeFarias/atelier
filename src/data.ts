import { CanvasNode, CanvasConnection, WorldbuildingTheme } from "./types";

export interface ThemePreset {
  id: string;
  theme: WorldbuildingTheme;
  nodes: CanvasNode[];
  connections: CanvasConnection[];
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "asteca",
    theme: {
      name: "Atelier Imperial",
      culture: "Império Asteca",
      era: "c. 1400 - 1521 d.C.",
      description: "Pesquisa arqueológica da fiação asteca de algodão e fibras de agave (maguey), corantes naturais de cochonilha e padrões geométricos tridimensionais tecidos à mão."
    },
    nodes: [
      {
        id: "asteca-clima",
        type: "clima",
        title: "Clima",
        description: "Clima equatorial, úmido e quente de floresta tropical. Rege a necessidade de roupas leves e protetivas contra o sol e a umidade arbórea.",
        icon: "Cloud",
        x: 700,
        y: 350,
        borderStyle: "sage",
        statusTag: "Active",
        colors: ["#edf4ff", "#d1e4fb"]
      },
      {
        id: "asteca-materiais",
        type: "material",
        title: "Materias principais",
        description: "Algodão de fibra longa importado e lã rústica pura tosquiada de ovelhas montanhistas nativas.",
        icon: "Landscape",
        x: 1100,
        y: 280,
        borderStyle: "outline",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzEZBowTVRurTqHO5yNa2sg8WSWJhXSPumJbEsBxyDrAfCD2XPcsez5cXxeIJf9_JnZEfM-cj8SkyyvFmQeVNTq2ofE3gNTqlVBAlF1G-Bc-7GoHS-MRY5zaoL2JdgF5T1QdZwaOp1BKem4z5bZR88z6ArCeePcGa3xhoYdBruFvh2K5ig0Xo5rpQhcU6JXUCKdVtGgcSknhIaqGvFDzj7MN5W72Kk0JsuV0x57y2SCdcuScwgBOW3cifr9uvQIREd-xKreiWErG7Z"
      },
      {
        id: "asteca-tingimento",
        type: "tingimento",
        title: "Tingimento",
        description: "Utilização de pigmentos orgânicos extraídos de líquens dos desfiladeiros selvagens, cochonilha esmagada e minerais de ferro raros das fendas florestais.",
        icon: "Colorize",
        x: 1300,
        y: 500,
        borderStyle: "terracotta",
        colors: ["#845241", "#f8b7a2", "#331105"]
      },
      {
        id: "asteca-hierarquia",
        type: "hierarquia",
        title: "Hierarquia Social",
        description: "A sociedade asteca era dividida entre nobres (Pipiltin), guerreiros de elite com trajes ornamentados de onça/águia, e servos (Macehualtin) que vestiam fibras simples de agave maguey.",
        icon: "Groups",
        x: 950,
        y: 650,
        borderStyle: "outline",
        statusTag: "Sagrado"
      },
      {
        id: "asteca-padroes",
        type: "padrao",
        title: "Padrões",
        description: "Grafismos geométricos simétricos e tecedura jacquard asteca tribal sobre superfície de lã densamente tecida.",
        icon: "Grid",
        x: 600,
        y: 580,
        borderStyle: "outline",
        gridItems: true,
        image: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/tribal-aztec-seamless-pattern-on-the-wool-knitted-texture-julien.jpg"
      }
    ],
    connections: [
      { id: "asteca-c1", fromId: "asteca-clima", toId: "asteca-materiais" },
      { id: "asteca-c2", fromId: "asteca-materiais", toId: "asteca-tingimento" },
      { id: "asteca-c3", fromId: "asteca-tingimento", toId: "asteca-hierarquia" },
      { id: "asteca-c4", fromId: "asteca-hierarquia", toId: "asteca-padroes" },
      { id: "asteca-c5", fromId: "asteca-padroes", toId: "asteca-clima" }
    ]
  },
  {
    id: "viking",
    theme: {
      name: "Tear de Valhala",
      culture: "Clãs Nórdicos (Vikings)",
      era: "c. 793 - 1066 d.C.",
      description: "Estudo de tecidos grossos de lã (vadmal), fibras de linho enceradas, pigmentação com raiz de ruiva para tons de vermelho e trajes de batalha resilientes."
    },
    nodes: [
      {
        id: "viking-clima",
        type: "clima",
        title: "Clima Nórdico",
        description: "Invernos gélidos, ventos polares cortantes e fiordes úmidos. Exige roupas densas com múltiplas camadas protetoras e lã impermeabilizada com gordura animal.",
        icon: "Cloud",
        x: 700,
        y: 350,
        borderStyle: "sage",
        statusTag: "Gélido"
      },
      {
        id: "viking-materiais",
        type: "material",
        title: "Lã Vadmal",
        description: "Tecido de lã caseiro ultra-resistente fiado em fusos manuais, abençoado pelas fiandeiras dos clãs para proteção física e mágica.",
        icon: "Mountain",
        x: 1100,
        y: 280,
        borderStyle: "outline",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400&auto=format&fit=crop"
      },
      {
        id: "viking-tingimento",
        type: "tingimento",
        title: "Extração de Ruiva",
        description: "Tons de terracota avermelhados extraídos da raiz da planta Ruiva (Rubia tinctorum) misturada a lixívia natural para banhos de fixação ferventes.",
        icon: "Palette",
        x: 1300,
        y: 500,
        borderStyle: "terracotta",
        colors: ["#991b1b", "#ea580c", "#7c2d12"]
      },
      {
        id: "viking-hierarquia",
        type: "hierarquia",
        title: "Traje de Jarls e Karls",
        description: "Os Karls vestem túnicas Vadmal beges utilitárias. Os nobres Jarls desfilam capas ornamentadas com peles de lobo sob broches circulares de bronze.",
        icon: "Users",
        x: 950,
        y: 650,
        borderStyle: "outline",
        statusTag: "Hierárquico"
      },
      {
        id: "viking-padroes",
        type: "padrao",
        title: "Nós Entrelaçados",
        description: "Padrões geométricos rúnicos e ilustrações da serpente Jörmungandr estampadas nas orlas dos mantos com fios prateados.",
        icon: "Grid",
        x: 600,
        y: 580,
        borderStyle: "outline",
        image: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=400&auto=format&fit=crop"
      }
    ],
    connections: [
      { id: "viking-c1", fromId: "viking-clima", toId: "viking-materiais" },
      { id: "viking-c2", fromId: "viking-materiais", toId: "viking-tingimento" },
      { id: "viking-c3", fromId: "viking-tingimento", toId: "viking-hierarquia" },
      { id: "viking-c4", fromId: "viking-hierarquia", toId: "viking-padroes" }
    ]
  },
  {
    id: "cyberpunk",
    theme: {
      name: "Trama Neon 2099",
      culture: "Metrópole de Neo-Tóquio",
      era: "Ano 2099",
      description: "Smart textiles com infusão de fibra óptica e circuitos integrados que mudam de cor com impulsos neurais nas favelas de neon subterrâneas."
    },
    nodes: [
      {
        id: "cyber-clima",
        type: "clima",
        title: "Chuva Ácida de Neon",
        description: "Smog tóxico denso permanente e chuvas ácidas brilhantes. Vestimentas devem repelir partículas químicas e isolar descargas estáticas.",
        icon: "Cloud",
        x: 700,
        y: 350,
        borderStyle: "sage",
        statusTag: "Tóxico"
      },
      {
        id: "cyber-materiais",
        type: "material",
        title: "Carbono Tecido",
        description: "Malha flexível de nanotubos de carbono tecidos à vácuo, altamente leve, balística contra micropartículas e resfriada eletricamente.",
        icon: "Mountain",
        x: 1100,
        y: 280,
        borderStyle: "outline",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=400&auto=format&fit=crop"
      },
      {
        id: "cyber-tingimento",
        type: "tingimento",
        title: "Enzimas Fluorescentes",
        description: "Tingimento sintético ativo feito de polímeros que reagem ao calor da derme corporal, brilhando em tons cyan, magenta e ultravioleta.",
        icon: "Palette",
        x: 1300,
        y: 500,
        borderStyle: "terracotta",
        colors: ["#06b6d4", "#ec4899", "#a855f7"]
      },
      {
        id: "cyber-hierarquia",
        type: "hierarquia",
        title: "Corporativos vs. Runners",
        description: "Os executivos da megacorp vestem trajes anti-rastreamento ultra fit perfeitos. Os punks e runners vestem jaquetas camufladoras de remendos reflexivos.",
        icon: "Users",
        x: 950,
        y: 650,
        borderStyle: "outline",
        statusTag: "Subterrâneo"
      },
      {
        id: "cyber-padroes",
        type: "padrao",
        title: "Circuitos Geométricos",
        description: "Malhas de silício luminescente em padrões que imitam diagramas de circuitos de IA integrados à costura das golas.",
        icon: "Grid",
        x: 600,
        y: 580,
        borderStyle: "outline",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop"
      }
    ],
    connections: [
      { id: "cyber-c1", fromId: "cyber-clima", toId: "cyber-materiais" },
      { id: "cyber-c2", fromId: "cyber-materiais", toId: "cyber-tingimento" },
      { id: "cyber-c3", fromId: "cyber-tingimento", toId: "cyber-hierarquia" },
      { id: "cyber-c4", fromId: "cyber-hierarquia", toId: "cyber-padroes" }
    ]
  }
];
