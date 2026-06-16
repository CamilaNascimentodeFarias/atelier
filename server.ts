import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    })
  : null;

// Endpoint 1: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!apiKey });
});

// Endpoint 2: Single Node Generator / Enricher with Gemini API
app.post("/api/gemini/generate-node", async (req, res) => {
  if (!ai) {
    return res.status(503).json({
      error: "O serviço de Inteligência Artificial não está configurado. Configure a variável de ambiente GEMINI_API_KEY no menu Settings > Secrets."
    });
  }

  const { context, nodeTitle, nodeType, themeDescription } = req.body;

  const prompt = `
    Você é o Oráculo Têxtil, um místico de worldbuilding que entende a história de vestuários, fibras, clima e corantes de povos reais e ficcionais.
    Com base no tema ou contexto de mundo: "${themeDescription || 'Geral/Livre'}" 
    e na ideia inicial do card: "${nodeTitle || ''}" (tipo: ${nodeType || 'custom'}),
    crie um elemento conceitual para o canvas têxtil.
    
    Retorne as informações no formato JSON especificado.
    Importante:
    - O campo "title" deve ser curto e poético (ex: "Seda da Neblina", "Púrpura de Tiro", "Hierarquia Imperial", "Tear do Vento").
    - O campo "description" deve ter entre 2 e 4 frases explicativas evocativas de ficção histórica ou fantasia. Escreva em Português (Brasil).
    - O campo "icon" deve ser o nome de um ícone do Lucide React aplicável (ex: 'Cloud', 'Mountain', 'Droplet', 'Users', 'Grid', 'Scissors', 'Wind', 'Palette', 'Flame').
    - O campo "borderStyle" deve ser uma das três opções estilísticas do tema: 'sage' (para clima/natureza), 'terracotta' (para tingimento/arte) ou 'outline' (para estruturas sociais/materiais).
    - O campo "colors" (opcional) deve conter um array de 1 a 3 cores em código hexadecimal representando a paleta relacionada ao material ou corante.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é um gerador criativo de dados estruturados para worldbuilding de fantasia e história têxtil. Responda em Português.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "description", "icon", "borderStyle"],
          properties: {
            title: { type: Type.STRING, description: "Título poético do elemento têxtil" },
            description: { type: Type.STRING, description: "Explicação em prosa mística e evocativa" },
            icon: { type: Type.STRING, description: "Nome válido de ícone Lucide React (ex: Cloud, Mountain, Palette, Users, Grid, Scroll, Sparkles)" },
            borderStyle: { type: Type.STRING, enum: ["sage", "terracotta", "outline"], description: "Estilo visual de borda" },
            colors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Códigos hexadecimais de cores associadas ao item"
            },
            statusTag: { type: Type.STRING, description: "Tag curta como 'Active', 'Arqueológico', 'Proibido' etc." }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Sem resposta do modelo Gemini.");
    }

    const data = JSON.parse(text.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Erro na chamada Gemini:", error);
    res.status(500).json({ error: error.message || "Falha ao gerar o card com Inteligência Artificial." });
  }
});

// Endpoint 3: Complete Canvas Re-imagination
app.post("/api/gemini/reimagine-canvas", async (req, res) => {
  if (!ai) {
    return res.status(503).json({
      error: "O serviço de Inteligência Artificial não está configurado. Configure a variável de ambiente GEMINI_API_KEY no menu Settings > Secrets."
    });
  }

  const { theme, culture, era } = req.body;

  const prompt = `
    Crie um sistema têxtil completo de worldbuilding para o seguinte tema/cultura:
    Cultura: ${culture || 'Desconhecida/Mística'}
    Era/Estilo: ${era || 'Livre/Fantasia'}
    Conceito de Mundo: "${theme || 'Tear cósmico e fios de luz'}"

    Você deve retornar exatamente 5 nodes/cards que se conectam entre si para pintar o retrato da tecelagem dessa cultura.
    Estes cards representam:
    1. Clima (Tipo: "clima"): Como o ambiente determina o uso de roupas. Ex: "Frio Glacial", "Monções Tropicais".
    2. Material Principal (Tipo: "material"): Qual fibra é colhida localmente (animal, mineral ou fantástica). Ex: "Linho do Papiro", "Lã de Ovelha Rochosa".
    3. Tingimento (Tipo: "tingimento"): Técnicas de extração de cores da flora/fauna ou alquimia. Ex: "Líquen dos Despenhadeiros", "Púrpura Imperial".
    4. Hierarquia Social (Tipo: "hierarquia"): Quem veste o quê na alta e baixa sociedade. Ex: "Tecidos da Realeza", "Túnicas de Plebeus".
    5. Padrão Estético (Tipo: "padrao"): Desenhos e tramas típicos (geométricos, espirituais, heráldicos). Ex: "Runas Trançadas", "Mosaicos Florais".

    Além dos cards, retorne de 4 a 6 conexões (relationships) entre os índices dos cards (de 0 a 4) representando os fios invisíveis de influência. Exemplo de conexão: de Clima (0) para Material (1) indicando "O frio estimula o isolamento da fibra".

    Escreva tudo em Português do Brasil com excelente floreado histórico e literário.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é um místico de worldbuilding histórico e de fantasia. Crie sistemas de tecelagem, corantes, vestuários e clima com riqueza de detalhes e coerência sistêmica. Escreva em Português.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["nodes", "connections"],
          properties: {
            themeName: { type: Type.STRING, description: "Nome curto gerado para o tema (Ex: Tear do Nilo, Clã das Estepes)" },
            nodes: {
              type: Type.ARRAY,
              description: "Exatamente 5 cards que compõem o sistema",
              items: {
                type: Type.OBJECT,
                required: ["type", "title", "description", "icon", "borderStyle"],
                properties: {
                  type: { type: Type.STRING, enum: ["clima", "material", "tingimento", "hierarquia", "padrao"], description: "Tipo do card têxtil" },
                  title: { type: Type.STRING, description: "Título do card" },
                  description: { type: Type.STRING, description: "Descrição poética e descritiva em português" },
                  icon: { type: Type.STRING, description: "Clássico ícone Lucide: Cloud, Mountain, Paintbrush, Palette, Users, Grid, Scissors" },
                  borderStyle: { type: Type.STRING, enum: ["sage", "terracotta", "outline"], description: "Estilo estético da borda" },
                  statusTag: { type: Type.STRING, description: "Tag de status (opcional, ex: 'Active', 'Sagrado', 'Cotidiano')" },
                  colors: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Array de 1 a 3 cores hexadecimais aplicáveis"
                  }
                }
              }
            },
            connections: {
              type: Type.ARRAY,
              description: "Teias de conexões entre os cards, baseadas em índices de 0 a 4",
              items: {
                type: Type.OBJECT,
                required: ["fromIndex", "toIndex"],
                properties: {
                  fromIndex: { type: Type.INTEGER, description: "Índice de 0 a 4 da origem" },
                  toIndex: { type: Type.INTEGER, description: "Índice de 0 a 4 do destino" }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Sem resposta do modelo Gemini em lote.");
    }

    const data = JSON.parse(text.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Erro na reimaginacao de canvas com Gemini:", error);
    res.status(500).json({ error: error.message || "Falha ao reimaginar o canvas com IA." });
  }
});

// Configure Vite or serve production bundle
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development server using Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production server serves bundled client files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Oráculo Têxtil] Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer();
