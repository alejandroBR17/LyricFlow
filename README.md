# 🎙️ LyricFlow — Formatador de Letras para Projeção & Louvor

[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript 5.8](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite 6](https://img.shields.io/badge/Vite-6.2-646cff.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Testes-100%25%20Vitest-yellow.svg?style=flat-square&logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/Licen%C3%A7a-MIT-emerald.svg?style=flat-square)](LICENSE)

> **LyricFlow** é uma aplicação web de alta performance desenvolvida em React e TypeScript, projetada para higienizar e padronizar letras de músicas para projeção em telões de igrejas, eventos e apresentações (**Holyrics, ProPresenter, OpenLP, PowerPoint**).

---

## 🎯 O Problema que o Projeto Resolve

Equipes de mídia e operadores de projeção frequentemente copiam letras de sites populares de cifras (como Cifra Club, Letras.mus.br e SongSelect). Essas letras chegam com uma série de ruídos que quebram a estética e legibilidade do telão:

- ❌ Cifras embutidas entre colchetes e parênteses: `[Am]`, `(C#m7)`, `[G/B]`, `(F#m7(b5))`, `[C7M]`
- ❌ Linhas isoladas de progressão harmônica: `G    D/F#    Em7    C9`
- ❌ Anotações de repetição da banda: `(2x)`, `[3x]`, `(bis)`, `(2 vezes)`
- ❌ Cabeçalhos de seção técnica: `[Verso 1]`, `[Refrão]`, `(Ponte)`, `[Intro]`
- ❌ Metadados desnecessários e emojis: `Tom: G`, `BPM: 68`, `🎵`, `🔴`, `━━━━━━━━━━━━`
- ❌ Estrofes gigantes com muitas linhas que não cabem no enquadramento do projetor

O **LyricFlow** processa o texto instantaneamente, eliminando ruídos em milissegundos, colocando o título em caixa alta e dividindo os versos na regra padrão do mercado: **blocos de 2 linhas por slide**.

---

## ✨ Funcionalidades Principais

| Funcionalidade | Detalhes Técnicos |
|---|---|
| **Processamento em Tempo Real** | Higienização reativa instantânea (client-side, latência zero) à medida que o usuário cola ou digita. |
| **Simulador de Telão 16:9 ("Ver Telão")** | Visualizador interativo que reproduz a proporção real de projeção widescreen, com navegação por setas do teclado e barra de progresso. |
| **Motor Robusto de Remoção de Cifras** | Reconhece cifras e acordes com notações brasileiras e internacionais (`7M`, `m7`, `dim`, `aug`, `sus4`, `b5`, baixos invertidos `/F#`). |
| **Divisão Inteligente de Slides** | Garante 2 linhas por slide por padrão (configurável para 3 ou 4 linhas no menu de regras). |
| **Histórico Local Persistente** | Salva as últimas 20 letras copiadas diretamente no `localStorage` do navegador, sem necessidade de login. |
| **Ergonomia Mobile-First** | Alternância de abas por gesto de arrastar (swipe), botões flutuantes para uso com o polegar e feedback tátil sutil via Web Haptics API. |
| **Tema Escuro & Claro Sincronizado** | Paleta de cores com contraste adequado para ambientes escuros de cabines de som e multimídia. |

---

## 🏛️ Arquitetura do Software

```
src/
├── components/
│   ├── Header.tsx              # Barra superior: identidade visual LyricFlow, histórico e tema
│   ├── InputPane.tsx           # Painel de entrada com botões rápidos (Exemplo, Colar, Limpar)
│   ├── OutputPane.tsx          # Painel de saída com estatísticas e gatilho do simulador 16:9
│   ├── SlidePreviewModal.tsx   # Simulador interativo de projeção widescreen 16:9
│   └── HistoryModal.tsx        # Modal de histórico local com gerenciamento e métricas
├── hooks/
│   └── useLyricsHistory.ts     # Custom hook desacoplado para persistência em localStorage
├── lib/
│   ├── cleaner.ts              # Algoritmo determinístico de higienização via RegEx
│   ├── sampleLyrics.ts         # Música de exemplo realista para demonstração rápida
│   ├── utils.ts                # Utilitários de haptics e estilo
│   └── __tests__/
│       └── cleaner.test.ts     # Suíte de testes unitários automatizados (Vitest)
├── types/
│   └── index.ts                # Definições estritas de tipagem em TypeScript
├── App.tsx                     # Orquestrador de estado e layout responsivo
└── main.tsx                    # Ponto de entrada React 19
```

---

## 🔬 Pipeline do Motor de Higienização (`src/lib/cleaner.ts`)

A esteira de limpeza executa estágios ordenados e puros:
1. **Normalização Gráfica e Emojis:** Remoção de separadores (`━━━`), emojis decorativos e símbolos não textuais.
2. **Eliminação de Cifras e Acordes:** Identificação de notas fundamentais (`[A-G][b#]?`) e qualidades harmônicas (`maj`, `min`, `dim`, `aug`, `sus`, `7M`, `b5`), limpando tanto acordes entre colchetes quanto linhas exclusivas de cifra.
3. **Remoção de Seções e Repetições:** Expurgo de marcadores como `[Refrão]`, `(Ponte)`, `(2x)`, `(bis)`.
4. **Preservação de Estrofes:** Agrupamento semântico que garante que nenhuma linha da música seja perdida.
5. **Divisão de Slides (Chunking):** Particionamento em blocos com limite configurável de linhas (padrão: 2 linhas por slide).
6. **Padronização de Título:** Conversão do título para caixa alta e separação por quebra dupla de linha.

---

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** versão 18 ou superior
- **npm** instalado

### Passo a passo

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/lyricflow.git

# 2. Entrar no diretório
cd lyricflow

# 3. Instalar as dependências
npm install

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

Abra `http://localhost:3000` no seu navegador.

---

## 🧪 Testes Automatizados

O projeto conta com testes unitários cobrindo todos os casos de borda utilizando o **Vitest**:

```bash
npm test
```

Cenários cobertos pelos testes:
- Limpeza de caracteres vazios e espaços redundantes
- Remoção de emojis e caracteres decorativos
- Limpeza de cabeçalhos de seção (`[Refrão]`, `(Ponte)`, etc.)
- Expurgo de marcações de repetição (`(2x)`, `[3x]`, `(bis)`)
- Remoção de cifras isoladas e inline (`G D/F#`, `[G]`)
- Título em caixa alta por padrão
- Divisão estrita em blocos de até 2 linhas por slide
- Processamento completo da música de exemplo brasileira
- Preservação de todas as estrofes sem descarte acidental
- Cálculo preciso de estatísticas de palavras, caracteres e slides

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).
