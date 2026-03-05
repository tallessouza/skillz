# Deep Explanation: Esqueleto de Aplicacao Electron

## Por que esconder a title bar?

Aplicacoes desktop modernas (VS Code, Linear, Figma) nao usam a title bar nativa do sistema operacional. Elas criam seu proprio header customizado para ter controle total sobre o layout. No Electron, isso e feito com `titleBarStyle`.

### Opcoes de titleBarStyle

- **`default`** — title bar nativa padrao do OS
- **`hidden`** — esconde tudo, inclusive os traffic lights (vermelho/amarelo/verde)
- **`hiddenInset`** — esconde a title bar mas mantem os traffic lights DENTRO da janela

O `hiddenInset` e o mais usado porque permite UI customizada sem perder os controles nativos do macOS que usuarios esperam.

## Traffic Lights

O nome "traffic lights" vem da analogia com semaforo: vermelho (fechar), amarelo (minimizar), verde (maximizar). A propriedade `trafficLightPosition` aceita `{ x, y }` em pixels, permitindo posicionar esses botoes exatamente onde o design precisa.

O instrutor usa `{ x: 20, y: 20 }` como margem para alinhar com a sidebar e o header.

## WebKit App Region — O mecanismo de drag

Quando voce remove a title bar nativa, a janela perde a capacidade de ser arrastada. O CSS `-webkit-app-region: drag` diz ao Electron: "esse elemento serve para arrastar a janela".

O problema: TUDO dentro desse elemento tambem vira draggable, incluindo textos e botoes. Por isso existe o `-webkit-app-region: no-drag` para "furar" o drag em elementos interativos.

### Por que usar plugin Tailwind ao inves de CSS direto?

O instrutor enfatiza que no ecossistema Tailwind, escrever CSS puro no arquivo de estilos nao e o padrao recomendado. A abordagem correta e criar utilities customizadas via `addUtilities` no plugin do Tailwind, resultando em classes como `region-drag` e `region-no-drag` que podem ser usadas diretamente no JSX.

## process.platform no renderer

O `process.platform` e uma variavel do Node.js que retorna o sistema operacional (`darwin` para macOS, `win32` para Windows, `linux`). No renderer do Electron (que roda como browser), essa variavel nao existe nativamente.

### Solucao simples vs solucao robusta

- **Simples (usada aqui):** `define` no vite.config — bom para uma ou duas variaveis
- **Robusta (vista em aulas futuras):** preload bridge — necessario quando voce precisa expor muitas variaveis ou APIs do backend para o frontend

O instrutor escolhe a abordagem simples porque e um caso isolado (apenas `process.platform`), mas avisa que para casos repetitivos o processo e outro.

## Overflow hidden em apps fullscreen

Em apps web normais, `overflow: hidden` no HTML e perigoso porque esconde conteudo. Em apps desktop Electron que sempre rodam em tela cheia, faz sentido porque:

1. A app ocupa 100% da viewport sempre
2. Cada secao (sidebar, conteudo, TOC) tem seu proprio scroll controlado
3. Evita barras de rolagem indesejadas no body

## Bibliotecas instaladas

- **CLSX** — classes condicionais (`clsx('base', { 'mt-4': isMacOS })`)
- **Phosphor React** — pacote de icones lineares com grande acervo
- **CMDK** — biblioteca para command palettes (Command+K), criada por Paco e Rauno Freiberg (Vercel). Padrao em apps como Linear, Vercel, Framer, Figma, Raycast

## Estrutura do layout

```
┌─────────────────────────────────────────┐
│ [●][●][●]  (traffic lights)             │
├──────────┬──────────────────────────────┤
│          │  Header (region-drag)        │
│ Sidebar  ├──────────────────────────────┤
│          │                              │
│          │  Main content                │
│          │  (placeholder inicial)       │
│          │                              │
│          ├──────────────────────────────┤
│          │  TOC (table of contents)     │
└──────────┴──────────────────────────────┘
```

A sidebar usa `clsx` para adicionar margem extra no macOS (por causa dos traffic lights). O header serve como area de drag. O main content usa `flex-1` para ocupar o espaco restante.